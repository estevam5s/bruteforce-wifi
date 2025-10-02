const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const { URL } = require('url');
const dns = require('dns').promises;

// Função para fazer requisição HTTP/HTTPS com timeout
const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'DDoS-Resilience-Analyzer/1.0 (Educational-Purpose)',
        ...options.headers
      },
      timeout: options.timeout || 10000,
      rejectUnauthorized: false
    };

    const startTime = Date.now();

    const req = protocol.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
        if (data.length > 1024 * 1024) { // 1MB max
          req.destroy();
        }
      });

      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime: endTime - startTime,
          success: true
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout',
        responseTime: Date.now() - startTime
      });
    });

    req.end();
  });
};

// Detectar CDN e proteção DDoS
const detectCDNAndProtection = (headers, body, hostname) => {
  const protections = {
    cloudflare: false,
    awsCloudFront: false,
    akamai: false,
    fastly: false,
    imperva: false,
    cloudflareWAF: false,
    sucuri: false,
    other: []
  };

  const detectedServices = [];

  // Cloudflare
  if (headers['cf-ray'] || headers['cf-cache-status'] || headers['server']?.toLowerCase().includes('cloudflare')) {
    protections.cloudflare = true;
    detectedServices.push({
      name: 'Cloudflare',
      type: 'CDN + DDoS Protection',
      confidence: 'High',
      evidence: 'CF-Ray header detected'
    });
  }

  // AWS CloudFront
  if (headers['x-amz-cf-id'] || headers['via']?.includes('CloudFront')) {
    protections.awsCloudFront = true;
    detectedServices.push({
      name: 'AWS CloudFront',
      type: 'CDN + AWS Shield',
      confidence: 'High',
      evidence: 'CloudFront headers detected'
    });
  }

  // Akamai
  if (headers['x-akamai-transformed'] || headers['akamai-origin-hop']) {
    protections.akamai = true;
    detectedServices.push({
      name: 'Akamai',
      type: 'CDN + DDoS Protection',
      confidence: 'High',
      evidence: 'Akamai headers detected'
    });
  }

  // Fastly
  if (headers['fastly-io-info'] || headers['x-fastly-request-id']) {
    protections.fastly = true;
    detectedServices.push({
      name: 'Fastly',
      type: 'CDN',
      confidence: 'High',
      evidence: 'Fastly headers detected'
    });
  }

  // Imperva/Incapsula
  if (headers['x-cdn']?.includes('Incapsula') || headers['x-iinfo']) {
    protections.imperva = true;
    detectedServices.push({
      name: 'Imperva Incapsula',
      type: 'WAF + DDoS Protection',
      confidence: 'High',
      evidence: 'Incapsula headers detected'
    });
  }

  // Sucuri
  if (headers['x-sucuri-id'] || headers['x-sucuri-cache']) {
    protections.sucuri = true;
    detectedServices.push({
      name: 'Sucuri',
      type: 'WAF + DDoS Protection',
      confidence: 'High',
      evidence: 'Sucuri headers detected'
    });
  }

  // Verificar no corpo da página
  if (body) {
    if (body.includes('cloudflare') || body.includes('cf-ray')) {
      if (!protections.cloudflare) {
        protections.cloudflare = true;
        detectedServices.push({
          name: 'Cloudflare',
          type: 'CDN + DDoS Protection',
          confidence: 'Medium',
          evidence: 'Cloudflare references in page body'
        });
      }
    }
  }

  // Verificar WAF genérico
  const wafHeaders = ['x-waf', 'x-firewall', 'x-protected-by'];
  wafHeaders.forEach(header => {
    if (headers[header]) {
      protections.other.push({
        name: headers[header],
        type: 'WAF',
        confidence: 'Medium',
        evidence: `${header} header detected`
      });
    }
  });

  return {
    protections,
    detectedServices: [...detectedServices, ...protections.other],
    hasProtection: detectedServices.length > 0 || protections.other.length > 0
  };
};

// Teste de Rate Limiting
const testRateLimiting = async (url) => {
  const results = [];
  const requestCount = 20; // Número controlado de requisições
  const delay = 50; // 50ms entre requisições

  for (let i = 0; i < requestCount; i++) {
    const result = await makeRequest(url, { timeout: 5000 });
    results.push({
      requestNumber: i + 1,
      statusCode: result.statusCode,
      responseTime: result.responseTime,
      success: result.success,
      blocked: result.statusCode === 429 || result.statusCode === 403
    });

    // Pequeno delay entre requisições
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  const blockedRequests = results.filter(r => r.blocked).length;
  const successfulRequests = results.filter(r => r.success && !r.blocked).length;
  const avgResponseTime = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests || 0;

  return {
    totalRequests: requestCount,
    successfulRequests,
    blockedRequests,
    blockRate: (blockedRequests / requestCount) * 100,
    averageResponseTime: Math.round(avgResponseTime),
    hasRateLimiting: blockedRequests > 0,
    results: results.slice(0, 10) // Retornar apenas primeiros 10
  };
};

// Teste de Carga Controlada (Load Test)
const performLoadTest = async (url) => {
  const concurrentRequests = 10; // Número controlado
  const promises = [];

  const startTime = Date.now();

  for (let i = 0; i < concurrentRequests; i++) {
    promises.push(makeRequest(url, { timeout: 15000 }));
  }

  const results = await Promise.all(promises);
  const endTime = Date.now();

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgResponseTime = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.responseTime, 0) / successful || 0;

  return {
    concurrentRequests,
    successful,
    failed,
    totalTime: endTime - startTime,
    averageResponseTime: Math.round(avgResponseTime),
    successRate: (successful / concurrentRequests) * 100,
    canHandleConcurrent: successful >= concurrentRequests * 0.8 // 80% taxa de sucesso
  };
};

// Análise de DNS para detectar proteções
const analyzeDNS = async (hostname) => {
  try {
    const addresses = await dns.resolve4(hostname);
    const txtRecords = await dns.resolveTxt(hostname).catch(() => []);
    const nsRecords = await dns.resolveNs(hostname).catch(() => []);

    // Verificar se IPs pertencem a CDNs conhecidas
    const cdnRanges = {
      cloudflare: ['104.16.', '104.17.', '104.18.', '104.19.', '104.20.', '104.21.', '104.22.', '104.23.', '104.24.', '104.25.', '104.26.', '104.27.', '104.28.', '104.29.', '104.30.', '104.31.', '172.64.', '172.65.', '172.66.', '172.67.'],
      cloudfront: ['13.', '54.', '99.', '205.251.'],
      akamai: ['23.', '104.']
    };

    const detectedCDN = [];
    addresses.forEach(ip => {
      for (const [cdn, ranges] of Object.entries(cdnRanges)) {
        if (ranges.some(range => ip.startsWith(range))) {
          detectedCDN.push({ cdn, ip });
        }
      }
    });

    return {
      ipAddresses: addresses,
      ipCount: addresses.length,
      txtRecords: txtRecords.flat(),
      nameservers: nsRecords,
      cdnDetected: detectedCDN,
      multipleIPs: addresses.length > 1,
      likelyUsingCDN: addresses.length > 2 || detectedCDN.length > 0
    };
  } catch (error) {
    return {
      error: error.message,
      ipAddresses: []
    };
  }
};

// Verificar headers de segurança
const analyzeSecurityHeaders = (headers) => {
  const securityHeaders = {
    'X-Frame-Options': headers['x-frame-options'],
    'X-Content-Type-Options': headers['x-content-type-options'],
    'X-XSS-Protection': headers['x-xss-protection'],
    'Strict-Transport-Security': headers['strict-transport-security'],
    'Content-Security-Policy': headers['content-security-policy'],
    'Referrer-Policy': headers['referrer-policy'],
    'Permissions-Policy': headers['permissions-policy']
  };

  const presentHeaders = Object.entries(securityHeaders).filter(([_, value]) => value).length;
  const totalHeaders = Object.keys(securityHeaders).length;

  return {
    headers: securityHeaders,
    score: presentHeaders,
    maxScore: totalHeaders,
    percentage: Math.round((presentHeaders / totalHeaders) * 100),
    isWellProtected: presentHeaders >= 5
  };
};

// Calcular Score de Resiliência
const calculateResilienceScore = (protectionData, rateLimitData, loadTestData, dnsData, securityHeaders) => {
  let score = 0;
  let maxScore = 100;
  const factors = [];

  // Proteção DDoS detectada (30 pontos)
  if (protectionData.hasProtection) {
    score += 30;
    factors.push({ factor: 'DDoS Protection Detected', points: 30, status: 'good' });
  } else {
    factors.push({ factor: 'No DDoS Protection Detected', points: 0, status: 'critical' });
  }

  // Rate Limiting (20 pontos)
  if (rateLimitData.hasRateLimiting) {
    score += 20;
    factors.push({ factor: 'Rate Limiting Active', points: 20, status: 'good' });
  } else {
    factors.push({ factor: 'No Rate Limiting', points: 0, status: 'warning' });
  }

  // Capacidade de carga concorrente (20 pontos)
  if (loadTestData.canHandleConcurrent) {
    score += 20;
    factors.push({ factor: 'Good Concurrent Request Handling', points: 20, status: 'good' });
  } else {
    const partialPoints = Math.round((loadTestData.successRate / 100) * 20);
    score += partialPoints;
    factors.push({ factor: 'Limited Concurrent Handling', points: partialPoints, status: 'warning' });
  }

  // CDN/Múltiplos IPs (15 pontos)
  if (dnsData.likelyUsingCDN) {
    score += 15;
    factors.push({ factor: 'CDN/Multiple IPs Detected', points: 15, status: 'good' });
  } else {
    factors.push({ factor: 'No CDN Detected', points: 0, status: 'warning' });
  }

  // Security Headers (15 pontos)
  const headerPoints = Math.round((securityHeaders.percentage / 100) * 15);
  score += headerPoints;
  factors.push({
    factor: 'Security Headers',
    points: headerPoints,
    status: headerPoints >= 10 ? 'good' : 'warning'
  });

  // Classificação
  let rating, recommendation, color;
  if (score >= 80) {
    rating = 'Excelente';
    recommendation = 'Seu site tem proteções robustas contra DDoS';
    color = '#10b981';
  } else if (score >= 60) {
    rating = 'Bom';
    recommendation = 'Proteções adequadas, mas há espaço para melhorias';
    color = '#22c55e';
  } else if (score >= 40) {
    rating = 'Regular';
    recommendation = 'Proteções básicas presentes, considere adicionar mais camadas';
    color = '#f59e0b';
  } else if (score >= 20) {
    rating = 'Fraco';
    recommendation = 'Proteções insuficientes, site vulnerável a ataques DDoS';
    color = '#ef4444';
  } else {
    rating = 'Crítico';
    recommendation = 'Sem proteções adequadas, URGENTE implementar medidas de segurança';
    color = '#dc2626';
  }

  return {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    rating,
    recommendation,
    color,
    factors
  };
};

// Rota principal de análise de resiliência DDoS
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validar e normalizar URL
    let targetUrl;
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        targetUrl = 'https://' + url;
      } else {
        targetUrl = url;
      }
      new URL(targetUrl);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const parsedUrl = new URL(targetUrl);
    const results = {
      url: targetUrl,
      hostname: parsedUrl.hostname,
      timestamp: new Date().toISOString(),
      analysis: {}
    };

    console.log(`🔍 Iniciando análise de resiliência DDoS para: ${targetUrl}`);

    // 1. Requisição inicial para obter headers e detectar proteções
    console.log('📡 Fazendo requisição inicial...');
    const initialResponse = await makeRequest(targetUrl);

    if (!initialResponse.success) {
      return res.status(200).json({
        ...results,
        error: 'Unable to reach target URL',
        details: initialResponse.error
      });
    }

    // 2. Detectar CDN e proteção DDoS
    console.log('🛡️ Detectando proteções DDoS e CDN...');
    const protectionDetection = detectCDNAndProtection(
      initialResponse.headers,
      initialResponse.body,
      parsedUrl.hostname
    );
    results.analysis.protection = protectionDetection;

    // 3. Análise DNS
    console.log('🌐 Analisando DNS...');
    const dnsAnalysis = await analyzeDNS(parsedUrl.hostname);
    results.analysis.dns = dnsAnalysis;

    // 4. Análise de Security Headers
    console.log('🔒 Analisando security headers...');
    const securityHeaders = analyzeSecurityHeaders(initialResponse.headers);
    results.analysis.securityHeaders = securityHeaders;

    // 5. Teste de Rate Limiting (controlado)
    console.log('⏱️ Testando rate limiting...');
    const rateLimitTest = await testRateLimiting(targetUrl);
    results.analysis.rateLimiting = rateLimitTest;

    // 6. Teste de Carga Concorrente (controlado)
    console.log('📊 Testando capacidade de carga...');
    const loadTest = await performLoadTest(targetUrl);
    results.analysis.loadTest = loadTest;

    // 7. Calcular Score de Resiliência
    console.log('🎯 Calculando score de resiliência...');
    const resilienceScore = calculateResilienceScore(
      protectionDetection,
      rateLimitTest,
      loadTest,
      dnsAnalysis,
      securityHeaders
    );
    results.analysis.resilienceScore = resilienceScore;

    // 8. Informações básicas de resposta
    results.analysis.basicInfo = {
      statusCode: initialResponse.statusCode,
      responseTime: initialResponse.responseTime,
      server: initialResponse.headers.server || 'Unknown',
      contentType: initialResponse.headers['content-type'] || 'Unknown'
    };

    console.log(`✅ Análise concluída. Score: ${resilienceScore.score}/${resilienceScore.maxScore}`);

    res.json(results);

  } catch (error) {
    console.error('❌ Erro na análise de resiliência DDoS:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: error.message
    });
  }
});

// Rota de informações sobre a ferramenta
router.get('/info', (req, res) => {
  res.json({
    name: 'DDoS Resilience Analyzer',
    version: '1.0.0',
    purpose: 'Educational tool to analyze website resilience against DDoS attacks',
    disclaimer: 'This tool performs DEFENSIVE analysis only. It does NOT perform actual DDoS attacks.',
    features: [
      'DDoS Protection Detection (Cloudflare, AWS Shield, Akamai, etc.)',
      'CDN Detection',
      'Rate Limiting Testing',
      'Controlled Load Testing',
      'DNS Analysis',
      'Security Headers Analysis',
      'Resilience Score Calculation'
    ],
    testing: {
      rateLimitRequests: 20,
      loadTestConcurrent: 10,
      requestDelay: '50ms',
      note: 'All tests use controlled, minimal load to avoid impacting the target'
    }
  });
});

module.exports = router;
