const express = require('express');
const router = express.Router();
const networkAnalyzer = require('../utils/networkAnalyzer');

/**
 * GET /api/network/analyze
 * Analisa completamente a rede WiFi atual
 */
router.get('/analyze', async (req, res) => {
  try {
    // Primeiro obtém informações da conexão atual
    const connection = await networkAnalyzer.getConnectionDetails();

    const analysis = await networkAnalyzer.analyzeNetwork(connection.ssid);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Erro ao analisar rede:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/network/vulnerabilities
 * Escaneia vulnerabilidades da rede atual
 */
router.get('/vulnerabilities', async (req, res) => {
  try {
    const security = await networkAnalyzer.analyzeSecurityLevel();

    res.json({
      success: true,
      data: security
    });
  } catch (error) {
    console.error('Erro ao escanear vulnerabilidades:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/network/speed-test
 * Realiza teste de velocidade da rede
 */
router.get('/speed-test', async (req, res) => {
  try {
    const speedTest = await networkAnalyzer.speedTest();

    res.json({
      success: true,
      data: speedTest
    });
  } catch (error) {
    console.error('Erro ao realizar teste de velocidade:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/network/status
 * Obtém status atual da rede
 */
router.get('/status', async (req, res) => {
  try {
    const connection = await networkAnalyzer.getConnectionDetails();
    const performance = await networkAnalyzer.getPerformanceMetrics();
    const gateway = await networkAnalyzer.getGatewayInfo();

    res.json({
      success: true,
      data: {
        connection,
        performance,
        gateway,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao obter status da rede:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/network/attack-detection
 * Detecta possíveis ataques na rede
 */
router.get('/attack-detection', async (req, res) => {
  try {
    const attackDetection = await networkAnalyzer.detectAttacks();

    res.json({
      success: true,
      data: attackDetection
    });
  } catch (error) {
    console.error('Erro ao detectar ataques:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/network/devices
 * Lista dispositivos conectados na rede
 */
router.get('/devices', async (req, res) => {
  try {
    const devices = await networkAnalyzer.scanConnectedDevices();

    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    console.error('Erro ao listar dispositivos:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/network/performance
 * Obtém métricas de performance da rede
 */
router.get('/performance', async (req, res) => {
  try {
    const performance = await networkAnalyzer.getPerformanceMetrics();

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    console.error('Erro ao obter performance:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/network/pentest
 * Realiza testes de penetração educacionais
 */
router.post('/pentest', async (req, res) => {
  try {
    const { ssid, tests } = req.body;

    if (!ssid) {
      return res.status(400).json({
        success: false,
        message: 'SSID é obrigatório'
      });
    }

    // Análise completa para fins educacionais
    const results = {
      timestamp: new Date().toISOString(),
      ssid,
      tests: {
        security: await networkAnalyzer.analyzeSecurityLevel(),
        vulnerabilities: [],
        recommendations: []
      }
    };

    // Testes educacionais de segurança
    const security = results.tests.security;

    // Verificar configurações comuns de segurança
    if (security.protocol.toLowerCase().includes('wps')) {
      results.tests.vulnerabilities.push({
        type: 'WPS Habilitado',
        severity: 'ALTO',
        description: 'WPS pode ser explorado através de ataques de força bruta',
        cve: 'N/A',
        recommendation: 'Desabilitar WPS no roteador'
      });
    }

    // Verificar broadcast do SSID
    results.tests.recommendations.push({
      type: 'SSID Broadcasting',
      description: 'Considere ocultar o SSID para segurança adicional',
      impact: 'BAIXO'
    });

    // Verificar força do sinal (pode indicar alcance excessivo)
    const connection = await networkAnalyzer.getConnectionDetails();
    if (connection.rssi > -40) {
      results.tests.recommendations.push({
        type: 'Potência do Sinal',
        description: 'Sinal muito forte pode expor a rede desnecessariamente',
        impact: 'BAIXO'
      });
    }

    res.json({
      success: true,
      data: results,
      disclaimer: 'APENAS PARA FINS EDUCACIONAIS - Use apenas em redes próprias'
    });
  } catch (error) {
    console.error('Erro ao realizar pentest:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
