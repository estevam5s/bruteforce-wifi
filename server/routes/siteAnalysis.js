const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const { URL } = require('url');
const tls = require('tls');
const crypto = require('crypto');

// Função para fazer requisição HTTP/HTTPS
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
        'User-Agent': 'Advanced-Site-Analyzer/1.0',
        ...options.headers
      },
      timeout: 10000,
      rejectUnauthorized: false
    };

    const startTime = Date.now();

    const req = protocol.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
        // Limitar tamanho para evitar sobrecarga
        if (data.length > 5 * 1024 * 1024) { // 5MB max
          req.destroy();
          reject(new Error('Response too large'));
        }
      });

      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime: endTime - startTime
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

// Função para verificar SSL
const checkSSL = (hostname) => {
  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port: 443,
      rejectUnauthorized: false
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();

      if (socket.authorized) {
        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysUntilExpiry = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));

        resolve({
          valid: true,
          issuer: cert.issuer,
          subject: cert.subject,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          daysUntilExpiry,
          fingerprint: cert.fingerprint,
          serialNumber: cert.serialNumber
        });
      } else {
        resolve({
          valid: false,
          reason: socket.authorizationError
        });
      }

      socket.end();
    });

    socket.on('error', (error) => {
      resolve({
        valid: false,
        error: error.message
      });
    });

    socket.setTimeout(5000, () => {
      socket.destroy();
      resolve({
        valid: false,
        error: 'SSL check timeout'
      });
    });
  });
};

// Função para extrair meta tags e informações SEO
const extractMetadata = (html) => {
  const metadata = {
    title: '',
    description: '',
    keywords: '',
    ogTags: {},
    twitterTags: {},
    canonical: '',
    robots: '',
    language: ''
  };

  try {
    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) metadata.title = titleMatch[1].trim();

    // Meta tags
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let metaMatch;

    while ((metaMatch = metaRegex.exec(html)) !== null) {
      const metaTag = metaMatch[1];

      // Name/Content
      const nameMatch = metaTag.match(/name=["']([^"']+)["']/i);
      const contentMatch = metaTag.match(/content=["']([^"']+)["']/i);

      if (nameMatch && contentMatch) {
        const name = nameMatch[1].toLowerCase();
        const content = contentMatch[1];

        if (name === 'description') metadata.description = content;
        if (name === 'keywords') metadata.keywords = content;
        if (name === 'robots') metadata.robots = content;
      }

      // Property (Open Graph)
      const propertyMatch = metaTag.match(/property=["']([^"']+)["']/i);
      if (propertyMatch && contentMatch) {
        const property = propertyMatch[1];
        if (property.startsWith('og:')) {
          metadata.ogTags[property] = contentMatch[1];
        }
        if (property.startsWith('twitter:')) {
          metadata.twitterTags[property] = contentMatch[1];
        }
      }
    }

    // Canonical
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (canonicalMatch) metadata.canonical = canonicalMatch[1];

    // Language
    const langMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
    if (langMatch) metadata.language = langMatch[1];

  } catch (error) {
    console.error('Error extracting metadata:', error);
  }

  return metadata;
};

// Função para extrair links e recursos
const extractResources = (html, baseUrl) => {
  const resources = {
    internalLinks: new Set(),
    externalLinks: new Set(),
    images: [],
    scripts: [],
    stylesheets: [],
    totalLinks: 0
  };

  try {
    const parsedBase = new URL(baseUrl);

    // Links
    const linkRegex = /<a\s+[^>]*href=["']([^"']+)["']/gi;
    let linkMatch;

    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const href = linkMatch[1];
      resources.totalLinks++;

      try {
        const absoluteUrl = new URL(href, baseUrl);
        if (absoluteUrl.hostname === parsedBase.hostname) {
          resources.internalLinks.add(absoluteUrl.href);
        } else {
          resources.externalLinks.add(absoluteUrl.href);
        }
      } catch (e) {
        // Ignorar URLs inválidas
      }
    }

    // Imagens
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi;
    let imgMatch;

    while ((imgMatch = imgRegex.exec(html)) !== null) {
      resources.images.push(imgMatch[1]);
    }

    // Scripts
    const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
    let scriptMatch;

    while ((scriptMatch = scriptRegex.exec(html)) !== null) {
      resources.scripts.push(scriptMatch[1]);
    }

    // Stylesheets
    const cssRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi;
    let cssMatch;

    while ((cssMatch = cssRegex.exec(html)) !== null) {
      resources.stylesheets.push(cssMatch[1]);
    }

  } catch (error) {
    console.error('Error extracting resources:', error);
  }

  return {
    internalLinks: Array.from(resources.internalLinks).slice(0, 50),
    externalLinks: Array.from(resources.externalLinks).slice(0, 50),
    images: resources.images.slice(0, 30),
    scripts: resources.scripts.slice(0, 20),
    stylesheets: resources.stylesheets.slice(0, 20),
    totalLinks: resources.totalLinks,
    internalLinksCount: resources.internalLinks.size,
    externalLinksCount: resources.externalLinks.size
  };
};

// Função para análise de segurança
const analyzeSecurityHeaders = (headers) => {
  const securityHeaders = {
    strictTransportSecurity: headers['strict-transport-security'] || null,
    contentSecurityPolicy: headers['content-security-policy'] || null,
    xFrameOptions: headers['x-frame-options'] || null,
    xContentTypeOptions: headers['x-content-type-options'] || null,
    xXssProtection: headers['x-xss-protection'] || null,
    referrerPolicy: headers['referrer-policy'] || null
  };

  const score = Object.values(securityHeaders).filter(v => v !== null).length;
  const maxScore = Object.keys(securityHeaders).length;

  return {
    headers: securityHeaders,
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100)
  };
};

// Rota principal de análise
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
      new URL(targetUrl); // Validar
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const parsedUrl = new URL(targetUrl);
    const results = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      analysis: {}
    };

    // 1. Health Check e Performance
    try {
      const response = await makeRequest(targetUrl);

      results.analysis.health = {
        status: response.statusCode,
        statusText: response.statusCode === 200 ? 'Healthy' : 'Issues Detected',
        healthy: response.statusCode >= 200 && response.statusCode < 400,
        responseTime: response.responseTime,
        timestamp: new Date().toISOString()
      };

      results.analysis.performance = {
        responseTime: response.responseTime,
        contentLength: response.body.length,
        contentLengthMB: (response.body.length / (1024 * 1024)).toFixed(2),
        rating: response.responseTime < 500 ? 'Excellent' :
                response.responseTime < 1000 ? 'Good' :
                response.responseTime < 2000 ? 'Fair' : 'Poor'
      };

      // 2. Headers Analysis
      results.analysis.headers = {
        server: response.headers.server || 'Unknown',
        poweredBy: response.headers['x-powered-by'] || 'Unknown',
        contentType: response.headers['content-type'] || 'Unknown',
        contentEncoding: response.headers['content-encoding'] || 'None',
        cacheControl: response.headers['cache-control'] || 'None',
        allHeaders: Object.keys(response.headers).length
      };

      // 3. Security Analysis
      results.analysis.security = analyzeSecurityHeaders(response.headers);

      // 4. Metadata e SEO
      if (response.headers['content-type']?.includes('text/html')) {
        results.analysis.metadata = extractMetadata(response.body);
        results.analysis.seo = {
          hasTitle: !!results.analysis.metadata.title,
          hasDescription: !!results.analysis.metadata.description,
          hasCanonical: !!results.analysis.metadata.canonical,
          hasOgTags: Object.keys(results.analysis.metadata.ogTags).length > 0,
          titleLength: results.analysis.metadata.title.length,
          descriptionLength: results.analysis.metadata.description.length
        };

        // 5. Resources Extraction
        results.analysis.resources = extractResources(response.body, targetUrl);

        // 6. Source Code Preview (primeiros 1000 chars)
        results.analysis.sourcePreview = response.body.substring(0, 1000);
      }

    } catch (error) {
      results.analysis.health = {
        status: 0,
        statusText: 'Unreachable',
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }

    // 7. SSL Certificate Check (apenas para HTTPS)
    if (parsedUrl.protocol === 'https:') {
      try {
        results.analysis.ssl = await checkSSL(parsedUrl.hostname);
      } catch (error) {
        results.analysis.ssl = {
          valid: false,
          error: error.message
        };
      }
    }

    // 8. DNS/IP Information
    const dns = require('dns').promises;
    try {
      const addresses = await dns.resolve4(parsedUrl.hostname);
      results.analysis.dns = {
        ipv4: addresses,
        hostname: parsedUrl.hostname
      };
    } catch (error) {
      results.analysis.dns = {
        error: error.message
      };
    }

    res.json(results);

  } catch (error) {
    console.error('Site analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: error.message
    });
  }
});

// Rota para crawling avançado (múltiplas páginas)
router.post('/crawl', async (req, res) => {
  try {
    const { url, maxPages = 5 } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

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
    const visited = new Set();
    const toVisit = [targetUrl];
    const results = [];
    const maxPagesToVisit = Math.min(maxPages, 10); // Limitar a 10 páginas

    while (toVisit.length > 0 && visited.size < maxPagesToVisit) {
      const currentUrl = toVisit.shift();

      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      try {
        const response = await makeRequest(currentUrl);

        const pageResult = {
          url: currentUrl,
          status: response.statusCode,
          responseTime: response.responseTime,
          title: '',
          links: []
        };

        if (response.headers['content-type']?.includes('text/html')) {
          const metadata = extractMetadata(response.body);
          pageResult.title = metadata.title;

          const resources = extractResources(response.body, currentUrl);
          pageResult.links = resources.internalLinks;

          // Adicionar novos links para visitar
          resources.internalLinks.forEach(link => {
            const linkUrl = new URL(link);
            if (linkUrl.hostname === parsedUrl.hostname && !visited.has(link) && toVisit.length < maxPagesToVisit) {
              toVisit.push(link);
            }
          });
        }

        results.push(pageResult);
      } catch (error) {
        results.push({
          url: currentUrl,
          error: error.message
        });
      }

      // Pequeno delay para não sobrecarregar o servidor
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.json({
      crawlResults: results,
      totalPagesVisited: visited.size,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Crawl error:', error);
    res.status(500).json({
      error: 'Crawl failed',
      details: error.message
    });
  }
});

module.exports = router;
