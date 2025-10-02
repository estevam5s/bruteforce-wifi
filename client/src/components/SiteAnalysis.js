import React, { useState } from 'react';
import '../styles/SiteAnalysis.css';

const SiteAnalysis = () => {
  const [url, setUrl] = useState('estevamsouza.com.br');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [crawling, setCrawling] = useState(false);
  const [crawlResults, setCrawlResults] = useState(null);

  const analyzeSite = async () => {
    if (!url) return;

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/site/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing site:', error);
      alert('Erro ao analisar o site');
    } finally {
      setLoading(false);
    }
  };

  const crawlSite = async () => {
    if (!url) return;

    setCrawling(true);
    setCrawlResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/site/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, maxPages: 5 }),
      });

      const data = await response.json();
      setCrawlResults(data);
    } catch (error) {
      console.error('Error crawling site:', error);
      alert('Erro ao fazer crawling do site');
    } finally {
      setCrawling(false);
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#f59e0b';
    if (status >= 400 && status < 500) return '#ef4444';
    if (status >= 500) return '#dc2626';
    return '#6b7280';
  };

  const getRatingColor = (rating) => {
    const colors = {
      'Excellent': '#10b981',
      'Good': '#22c55e',
      'Fair': '#f59e0b',
      'Poor': '#ef4444'
    };
    return colors[rating] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="site-analysis">
      <div className="analysis-header">
        <h2>🔍 Análise Avançada de Sites</h2>
        <p>Análise completa de saúde, performance, SEO, segurança e web scraping</p>
      </div>

      <div className="url-input-section">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Digite a URL (ex: estevamsouza.com.br)"
            className="url-input"
            onKeyPress={(e) => e.key === 'Enter' && analyzeSite()}
          />
          <button
            onClick={analyzeSite}
            disabled={loading || !url}
            className="analyze-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analisando...
              </>
            ) : (
              <>
                <span>🚀</span>
                Analisar Site
              </>
            )}
          </button>
          <button
            onClick={crawlSite}
            disabled={crawling || !url}
            className="crawl-button"
          >
            {crawling ? (
              <>
                <span className="spinner"></span>
                Crawling...
              </>
            ) : (
              <>
                <span>🕷️</span>
                Crawl Site
              </>
            )}
          </button>
        </div>
      </div>

      {results && (
        <div className="results-container">
          <div className="tabs-navigation">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              ⚡ Performance
            </button>
            <button
              className={`tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Segurança
            </button>
            <button
              className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
              onClick={() => setActiveTab('seo')}
            >
              📈 SEO
            </button>
            <button
              className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              📦 Recursos
            </button>
            <button
              className={`tab ${activeTab === 'source' ? 'active' : ''}`}
              onClick={() => setActiveTab('source')}
            >
              💻 Código Fonte
            </button>
          </div>

          <div className="tab-content">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && results.analysis && (
              <div className="overview-tab">
                <div className="cards-grid">
                  {/* Health Status Card */}
                  {results.analysis.health && (
                    <div className="info-card health-card">
                      <div className="card-header">
                        <h3>🏥 Status de Saúde</h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: results.analysis.health.healthy
                              ? '#10b98120'
                              : '#ef444420',
                            color: results.analysis.health.healthy
                              ? '#10b981'
                              : '#ef4444',
                          }}
                        >
                          {results.analysis.health.healthy ? '✓ Saudável' : '✗ Com Problemas'}
                        </span>
                      </div>
                      <div className="card-content">
                        <div className="info-row">
                          <span className="label">HTTP Status:</span>
                          <span
                            className="value"
                            style={{ color: getStatusColor(results.analysis.health.status) }}
                          >
                            {results.analysis.health.status} - {results.analysis.health.statusText}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Última Verificação:</span>
                          <span className="value">{formatDate(results.analysis.health.timestamp)}</span>
                        </div>
                        {results.analysis.health.error && (
                          <div className="error-message">
                            ⚠️ Erro: {results.analysis.health.error}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Performance Card */}
                  {results.analysis.performance && (
                    <div className="info-card performance-card">
                      <div className="card-header">
                        <h3>⚡ Performance</h3>
                        <span
                          className="rating-badge"
                          style={{
                            backgroundColor: getRatingColor(results.analysis.performance.rating) + '20',
                            color: getRatingColor(results.analysis.performance.rating),
                          }}
                        >
                          {results.analysis.performance.rating}
                        </span>
                      </div>
                      <div className="card-content">
                        <div className="metric-display">
                          <div className="metric-value">{results.analysis.performance.responseTime}ms</div>
                          <div className="metric-label">Tempo de Resposta</div>
                        </div>
                        <div className="info-row">
                          <span className="label">Tamanho do Conteúdo:</span>
                          <span className="value">{results.analysis.performance.contentLengthMB} MB</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DNS/IP Card */}
                  {results.analysis.dns && !results.analysis.dns.error && (
                    <div className="info-card dns-card">
                      <div className="card-header">
                        <h3>🌐 Informações DNS</h3>
                      </div>
                      <div className="card-content">
                        <div className="info-row">
                          <span className="label">Hostname:</span>
                          <span className="value">{results.analysis.dns.hostname}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Endereços IPv4:</span>
                          <div className="ip-list">
                            {results.analysis.dns.ipv4.map((ip, index) => (
                              <span key={index} className="ip-badge">
                                {ip}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SSL Certificate Card */}
                  {results.analysis.ssl && (
                    <div className="info-card ssl-card">
                      <div className="card-header">
                        <h3>🔐 Certificado SSL</h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: results.analysis.ssl.valid ? '#10b98120' : '#ef444420',
                            color: results.analysis.ssl.valid ? '#10b981' : '#ef4444',
                          }}
                        >
                          {results.analysis.ssl.valid ? '✓ Válido' : '✗ Inválido'}
                        </span>
                      </div>
                      <div className="card-content">
                        {results.analysis.ssl.valid ? (
                          <>
                            <div className="info-row">
                              <span className="label">Emissor:</span>
                              <span className="value small">
                                {results.analysis.ssl.issuer?.O || 'N/A'}
                              </span>
                            </div>
                            <div className="info-row">
                              <span className="label">Válido até:</span>
                              <span className="value">{results.analysis.ssl.validTo}</span>
                            </div>
                            <div className="info-row">
                              <span className="label">Dias até expirar:</span>
                              <span
                                className="value"
                                style={{
                                  color:
                                    results.analysis.ssl.daysUntilExpiry > 30
                                      ? '#10b981'
                                      : '#ef4444',
                                }}
                              >
                                {results.analysis.ssl.daysUntilExpiry} dias
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="error-message">
                            {results.analysis.ssl.error || results.analysis.ssl.reason || 'Certificado inválido'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && results.analysis && (
              <div className="performance-tab">
                <div className="performance-details">
                  {results.analysis.performance && (
                    <div className="info-card">
                      <h3>⚡ Métricas de Performance</h3>
                      <div className="metrics-grid">
                        <div className="metric-box">
                          <div className="metric-icon">⏱️</div>
                          <div className="metric-info">
                            <div className="metric-value">{results.analysis.performance.responseTime}ms</div>
                            <div className="metric-label">Tempo de Resposta</div>
                          </div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-icon">📦</div>
                          <div className="metric-info">
                            <div className="metric-value">{results.analysis.performance.contentLengthMB}MB</div>
                            <div className="metric-label">Tamanho da Página</div>
                          </div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-icon">⭐</div>
                          <div className="metric-info">
                            <div
                              className="metric-value"
                              style={{ color: getRatingColor(results.analysis.performance.rating) }}
                            >
                              {results.analysis.performance.rating}
                            </div>
                            <div className="metric-label">Classificação</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {results.analysis.headers && (
                    <div className="info-card">
                      <h3>📡 Informações do Servidor</h3>
                      <div className="headers-list">
                        <div className="info-row">
                          <span className="label">Servidor:</span>
                          <span className="value">{results.analysis.headers.server}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Powered By:</span>
                          <span className="value">{results.analysis.headers.poweredBy}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Content-Type:</span>
                          <span className="value">{results.analysis.headers.contentType}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Encoding:</span>
                          <span className="value">{results.analysis.headers.contentEncoding}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Cache Control:</span>
                          <span className="value">{results.analysis.headers.cacheControl}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Total de Headers:</span>
                          <span className="value">{results.analysis.headers.allHeaders}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && results.analysis.security && (
              <div className="security-tab">
                <div className="info-card">
                  <div className="card-header">
                    <h3>🔒 Análise de Segurança</h3>
                    <div className="security-score">
                      <div
                        className="score-circle"
                        style={{
                          background: `conic-gradient(#10b981 ${results.analysis.security.percentage}%, #1f2937 0)`,
                        }}
                      >
                        <div className="score-inner">
                          <span className="score-value">{results.analysis.security.percentage}%</span>
                        </div>
                      </div>
                      <div className="score-info">
                        <div>
                          {results.analysis.security.score} de {results.analysis.security.maxScore} headers de segurança
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="security-headers">
                    {Object.entries(results.analysis.security.headers).map(([key, value]) => (
                      <div key={key} className="security-header-row">
                        <div className="header-name">
                          <span className={value ? 'check-icon present' : 'check-icon missing'}>
                            {value ? '✓' : '✗'}
                          </span>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="header-value">{value || 'Não configurado'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === 'seo' && results.analysis && (
              <div className="seo-tab">
                {results.analysis.metadata && (
                  <>
                    <div className="info-card">
                      <h3>📈 Análise SEO</h3>
                      <div className="seo-checks">
                        {results.analysis.seo && (
                          <>
                            <div className={`seo-check ${results.analysis.seo.hasTitle ? 'pass' : 'fail'}`}>
                              <span className="check-icon">{results.analysis.seo.hasTitle ? '✓' : '✗'}</span>
                              <span>Título presente ({results.analysis.seo.titleLength} caracteres)</span>
                            </div>
                            <div className={`seo-check ${results.analysis.seo.hasDescription ? 'pass' : 'fail'}`}>
                              <span className="check-icon">{results.analysis.seo.hasDescription ? '✓' : '✗'}</span>
                              <span>Meta descrição presente ({results.analysis.seo.descriptionLength} caracteres)</span>
                            </div>
                            <div className={`seo-check ${results.analysis.seo.hasCanonical ? 'pass' : 'fail'}`}>
                              <span className="check-icon">{results.analysis.seo.hasCanonical ? '✓' : '✗'}</span>
                              <span>URL Canônica definida</span>
                            </div>
                            <div className={`seo-check ${results.analysis.seo.hasOgTags ? 'pass' : 'fail'}`}>
                              <span className="check-icon">{results.analysis.seo.hasOgTags ? '✓' : '✗'}</span>
                              <span>Open Graph tags presentes</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="info-card">
                      <h3>📝 Metadados</h3>
                      <div className="metadata-list">
                        <div className="metadata-item">
                          <span className="metadata-label">Título:</span>
                          <span className="metadata-value">{results.analysis.metadata.title || 'N/A'}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Descrição:</span>
                          <span className="metadata-value">{results.analysis.metadata.description || 'N/A'}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Keywords:</span>
                          <span className="metadata-value">{results.analysis.metadata.keywords || 'N/A'}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Idioma:</span>
                          <span className="metadata-value">{results.analysis.metadata.language || 'N/A'}</span>
                        </div>
                        {results.analysis.metadata.canonical && (
                          <div className="metadata-item">
                            <span className="metadata-label">URL Canônica:</span>
                            <span className="metadata-value small">{results.analysis.metadata.canonical}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {Object.keys(results.analysis.metadata.ogTags).length > 0 && (
                      <div className="info-card">
                        <h3>🌐 Open Graph Tags</h3>
                        <div className="metadata-list">
                          {Object.entries(results.analysis.metadata.ogTags).map(([key, value]) => (
                            <div key={key} className="metadata-item">
                              <span className="metadata-label">{key}:</span>
                              <span className="metadata-value small">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && results.analysis.resources && (
              <div className="resources-tab">
                <div className="resources-summary">
                  <div className="resource-stat">
                    <div className="stat-icon">🔗</div>
                    <div className="stat-value">{results.analysis.resources.totalLinks}</div>
                    <div className="stat-label">Total de Links</div>
                  </div>
                  <div className="resource-stat">
                    <div className="stat-icon">📄</div>
                    <div className="stat-value">{results.analysis.resources.internalLinksCount}</div>
                    <div className="stat-label">Links Internos</div>
                  </div>
                  <div className="resource-stat">
                    <div className="stat-icon">🌍</div>
                    <div className="stat-value">{results.analysis.resources.externalLinksCount}</div>
                    <div className="stat-label">Links Externos</div>
                  </div>
                  <div className="resource-stat">
                    <div className="stat-icon">🖼️</div>
                    <div className="stat-value">{results.analysis.resources.images.length}</div>
                    <div className="stat-label">Imagens</div>
                  </div>
                  <div className="resource-stat">
                    <div className="stat-icon">📜</div>
                    <div className="stat-value">{results.analysis.resources.scripts.length}</div>
                    <div className="stat-label">Scripts</div>
                  </div>
                  <div className="resource-stat">
                    <div className="stat-icon">🎨</div>
                    <div className="stat-value">{results.analysis.resources.stylesheets.length}</div>
                    <div className="stat-label">Stylesheets</div>
                  </div>
                </div>

                <div className="resources-details">
                  {results.analysis.resources.internalLinks.length > 0 && (
                    <div className="info-card">
                      <h3>📄 Links Internos (Top {results.analysis.resources.internalLinks.length})</h3>
                      <div className="resource-list">
                        {results.analysis.resources.internalLinks.map((link, index) => (
                          <div key={index} className="resource-item">
                            <span className="resource-icon">🔗</span>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="resource-link">
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.analysis.resources.externalLinks.length > 0 && (
                    <div className="info-card">
                      <h3>🌍 Links Externos (Top {results.analysis.resources.externalLinks.length})</h3>
                      <div className="resource-list">
                        {results.analysis.resources.externalLinks.map((link, index) => (
                          <div key={index} className="resource-item">
                            <span className="resource-icon">🔗</span>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="resource-link">
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SOURCE CODE TAB */}
            {activeTab === 'source' && results.analysis.sourcePreview && (
              <div className="source-tab">
                <div className="info-card">
                  <h3>💻 Preview do Código Fonte (primeiros 1000 caracteres)</h3>
                  <pre className="source-code">{results.analysis.sourcePreview}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CRAWL RESULTS */}
      {crawlResults && (
        <div className="crawl-results">
          <div className="info-card">
            <h3>🕷️ Resultados do Crawling</h3>
            <p className="crawl-summary">
              Total de páginas visitadas: <strong>{crawlResults.totalPagesVisited}</strong>
              <br />
              Timestamp: {formatDate(crawlResults.timestamp)}
            </p>
            <div className="crawl-pages">
              {crawlResults.crawlResults.map((page, index) => (
                <div key={index} className="crawl-page-item">
                  <div className="crawl-page-header">
                    <span
                      className="crawl-status"
                      style={{ color: getStatusColor(page.status) }}
                    >
                      {page.status}
                    </span>
                    <span className="crawl-time">{page.responseTime}ms</span>
                  </div>
                  <div className="crawl-page-url">{page.url}</div>
                  {page.title && <div className="crawl-page-title">📄 {page.title}</div>}
                  {page.error && <div className="crawl-page-error">❌ {page.error}</div>}
                  {page.links && page.links.length > 0 && (
                    <div className="crawl-page-links">
                      🔗 {page.links.length} links internos encontrados
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteAnalysis;
