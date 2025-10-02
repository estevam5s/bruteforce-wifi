const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configurações de segurança
const MAX_CONCURRENT_REQUESTS = 50; // Máximo de requisições simultâneas
const MAX_TOTAL_REQUESTS = 1000; // Máximo total de requisições
const MIN_DURATION = 10; // Mínimo 10 segundos
const MAX_DURATION = 120; // Máximo 120 segundos (2 minutos)

// Variável global para controlar testes ativos
let activeTests = new Map();

// Função para fazer uma requisição HTTP/HTTPS
const makeRequest = (url, timeout = 10000) => {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const requestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Educational-Stress-Test-Tool/1.0',
          'Accept': '*/*',
          'Connection': 'close'
        },
        timeout,
        rejectUnauthorized: false
      };

      const startTime = Date.now();

      const req = protocol.request(requestOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
          // Limitar tamanho
          if (data.length > 100 * 1024) { // 100KB max
            req.destroy();
          }
        });

        res.on('end', () => {
          const endTime = Date.now();
          resolve({
            success: true,
            statusCode: res.statusCode,
            responseTime: endTime - startTime,
            contentLength: data.length,
            timestamp: new Date().toISOString()
          });
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          errorCode: error.code,
          responseTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Request timeout',
          errorCode: 'TIMEOUT',
          responseTime: timeout,
          timestamp: new Date().toISOString()
        });
      });

      req.end();
    } catch (error) {
      resolve({
        success: false,
        error: error.message,
        errorCode: 'PARSE_ERROR',
        responseTime: 0,
        timestamp: new Date().toISOString()
      });
    }
  });
};

// Executar onda de requisições
const executeWave = async (url, concurrent, wss, testId) => {
  const promises = [];
  const waveStartTime = Date.now();

  for (let i = 0; i < concurrent; i++) {
    promises.push(makeRequest(url, 10000));
  }

  const results = await Promise.all(promises);
  const waveEndTime = Date.now();

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgResponseTime = results
    .filter(r => r.success && r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / (successful || 1);

  const waveData = {
    successful,
    failed,
    total: concurrent,
    avgResponseTime: Math.round(avgResponseTime),
    duration: waveEndTime - waveStartTime,
    timestamp: new Date().toISOString(),
    errors: results.filter(r => !r.success).map(r => ({
      error: r.error,
      code: r.errorCode
    }))
  };

  // Broadcast wave results
  broadcastToTest(wss, testId, {
    type: 'stresstest_wave',
    data: waveData
  });

  return waveData;
};

// Broadcast para clientes do teste específico
const broadcastToTest = (wss, testId, message) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN
        client.send(JSON.stringify({
          ...message,
          testId
        }));
      }
    });
  }
};

// Iniciar teste de estresse
router.post('/start', async (req, res) => {
  try {
    const {
      targetUrl,
      duration = 30,
      requestsPerSecond = 10,
      concurrentRequests = 10
    } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ error: 'Target URL is required' });
    }

    // Validar URL
    try {
      new URL(targetUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Validar parâmetros de segurança
    const safeDuration = Math.min(Math.max(duration, MIN_DURATION), MAX_DURATION);
    const safeConcurrent = Math.min(concurrentRequests, MAX_CONCURRENT_REQUESTS);
    const safeRPS = Math.min(requestsPerSecond, 20); // Máximo 20 req/s

    const totalRequests = Math.min(safeDuration * safeRPS, MAX_TOTAL_REQUESTS);
    const interval = 1000 / safeRPS; // Intervalo entre ondas em ms

    const testId = Date.now().toString();

    // Verificar se já existe teste ativo para essa URL
    const existingTest = Array.from(activeTests.values()).find(t => t.targetUrl === targetUrl);
    if (existingTest) {
      return res.status(409).json({
        error: 'There is already an active test for this URL',
        testId: existingTest.testId
      });
    }

    // Registrar teste ativo
    activeTests.set(testId, {
      testId,
      targetUrl,
      startTime: Date.now(),
      duration: safeDuration,
      status: 'running'
    });

    res.json({
      message: 'Stress test started',
      testId,
      config: {
        targetUrl,
        duration: safeDuration,
        requestsPerSecond: safeRPS,
        concurrentRequests: safeConcurrent,
        totalRequests,
        estimatedWaves: Math.ceil(totalRequests / safeConcurrent)
      }
    });

    // Executar teste em background
    const wss = req.app.get('wss');

    broadcastToTest(wss, testId, {
      type: 'stresstest_start',
      data: {
        targetUrl,
        duration: safeDuration,
        requestsPerSecond: safeRPS,
        concurrentRequests: safeConcurrent,
        totalRequests,
        timestamp: new Date().toISOString()
      }
    });

    let requestsSent = 0;
    let waveNumber = 0;
    const startTime = Date.now();
    const endTime = startTime + (safeDuration * 1000);

    const allWaveResults = [];

    const executeTest = async () => {
      while (Date.now() < endTime && requestsSent < totalRequests) {
        const testData = activeTests.get(testId);

        // Verificar se teste foi parado
        if (!testData || testData.status === 'stopped') {
          break;
        }

        waveNumber++;
        const requestsThisWave = Math.min(safeConcurrent, totalRequests - requestsSent);

        broadcastToTest(wss, testId, {
          type: 'stresstest_progress',
          data: {
            wave: waveNumber,
            requestsSent,
            totalRequests,
            percentage: Math.round((requestsSent / totalRequests) * 100),
            elapsed: Math.round((Date.now() - startTime) / 1000),
            remaining: Math.round((endTime - Date.now()) / 1000)
          }
        });

        const waveResult = await executeWave(targetUrl, requestsThisWave, wss, testId);
        allWaveResults.push(waveResult);

        requestsSent += requestsThisWave;

        // Aguardar intervalo entre ondas
        if (requestsSent < totalRequests && Date.now() < endTime) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      }

      // Calcular estatísticas finais
      const totalSuccessful = allWaveResults.reduce((sum, w) => sum + w.successful, 0);
      const totalFailed = allWaveResults.reduce((sum, w) => sum + w.failed, 0);
      const avgResponseTime = allWaveResults
        .reduce((sum, w) => sum + (w.avgResponseTime * w.successful), 0) / (totalSuccessful || 1);

      const finalDuration = (Date.now() - startTime) / 1000;
      const actualRPS = requestsSent / finalDuration;

      const summary = {
        totalRequests: requestsSent,
        totalWaves: waveNumber,
        successful: totalSuccessful,
        failed: totalFailed,
        successRate: ((totalSuccessful / requestsSent) * 100).toFixed(2),
        avgResponseTime: Math.round(avgResponseTime),
        duration: finalDuration.toFixed(2),
        actualRPS: actualRPS.toFixed(2),
        timestamp: new Date().toISOString()
      };

      broadcastToTest(wss, testId, {
        type: 'stresstest_finished',
        data: {
          ...summary,
          conclusion: totalSuccessful >= requestsSent * 0.9
            ? 'Site manteve-se disponível e responsivo durante o teste'
            : totalSuccessful >= requestsSent * 0.7
            ? 'Site teve degradação de performance mas manteve-se parcialmente disponível'
            : 'Site teve dificuldades significativas durante o teste'
        }
      });

      // Remover teste ativo
      activeTests.delete(testId);
    };

    executeTest().catch(error => {
      console.error('Erro no teste de estresse:', error);
      broadcastToTest(wss, testId, {
        type: 'stresstest_error',
        data: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      });
      activeTests.delete(testId);
    });

  } catch (error) {
    console.error('Erro ao iniciar teste de estresse:', error);
    res.status(500).json({
      error: 'Failed to start stress test',
      details: error.message
    });
  }
});

// Parar teste ativo
router.post('/stop/:testId', (req, res) => {
  try {
    const { testId } = req.params;
    const test = activeTests.get(testId);

    if (!test) {
      return res.status(404).json({ error: 'Test not found or already finished' });
    }

    test.status = 'stopped';
    activeTests.set(testId, test);

    const wss = req.app.get('wss');
    broadcastToTest(wss, testId, {
      type: 'stresstest_stopped',
      data: {
        message: 'Test stopped by user',
        timestamp: new Date().toISOString()
      }
    });

    res.json({
      message: 'Test stopped successfully',
      testId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to stop test',
      details: error.message
    });
  }
});

// Listar testes ativos
router.get('/active', (req, res) => {
  const tests = Array.from(activeTests.values()).map(test => ({
    testId: test.testId,
    targetUrl: test.targetUrl,
    status: test.status,
    elapsed: Math.round((Date.now() - test.startTime) / 1000),
    duration: test.duration
  }));

  res.json({ activeTests: tests, count: tests.length });
});

// Informações sobre a ferramenta
router.get('/info', (req, res) => {
  res.json({
    name: 'Educational Stress Test Tool',
    version: '1.0.0',
    purpose: 'Educational tool to test website availability under load',
    disclaimer: 'This tool is for EDUCATIONAL purposes only. Use ONLY on your own websites or with explicit authorization.',
    limitations: {
      maxConcurrentRequests: MAX_CONCURRENT_REQUESTS,
      maxTotalRequests: MAX_TOTAL_REQUESTS,
      minDuration: MIN_DURATION,
      maxDuration: MAX_DURATION,
      maxRequestsPerSecond: 20
    },
    warning: 'Unauthorized stress testing may be illegal and is considered a DDoS attack. You are responsible for all consequences of using this tool.'
  });
});

module.exports = router;
