import React, { useState } from 'react';
import '../styles/DDoSResilience.css';

const DDoSResilience = () => {
  const [url, setUrl] = useState('estevamsouza.com.br');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const analyzeResilience = async () => {
    if (!url) return;

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/ddos/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing DDoS resilience:', error);
      alert('Erro ao analisar resiliência DDoS');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    const colors = {
      'good': '#10b981',
      'warning': '#f59e0b',
      'critical': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="ddos-resilience">
      <div className="resilience-header">
        <div className="header-icon">🛡️</div>
        <div className="header-text">
          <h2>Análise de Resiliência DDoS</h2>
          <p>Verificação defensiva de proteções contra ataques DDoS</p>
        </div>
      </div>

      <div className="disclaimer-banner">
        <span className="warning-icon">⚠️</span>
        <div className="disclaimer-text">
          <strong>Ferramenta Educacional e Defensiva</strong>
          <p>
            Esta ferramenta realiza APENAS análise defensiva, detectando proteções existentes.
            NÃO executa ataques DDoS reais. Uso limitado a sites autorizados para fins educacionais.
          </p>
        </div>
      </div>

      <div className="url-input-section">
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Digite a URL (ex: estevamsouza.com.br)"
              className="url-input"
              onKeyPress={(e) => e.key === 'Enter' && analyzeResilience()}
            />
            <span className="input-icon">🌐</span>
          </div>
          <button
            onClick={analyzeResilience}
            disabled={loading || !url}
            className="analyze-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analisando Proteções...
              </>
            ) : (
              <>
                <span className="button-icon">🔍</span>
                Analisar Resiliência
              </>
            )}
          </button>
        </div>
      </div>

      {results && results.analysis && (
        <div className="results-container">
          {/* Score Card Principal */}
          <div className="main-score-card">
            <div className="score-display">
              <div
                className="score-circle-large"
                style={{
                  background: `conic-gradient(${results.analysis.resilienceScore.color} ${results.analysis.resilienceScore.percentage}%, #1f2937 0)`,
                }}
              >
                <div className="score-inner-large">
                  <div className="score-value-large">{results.analysis.resilienceScore.score}</div>
                  <div className="score-max">/{results.analysis.resilienceScore.maxScore}</div>
                </div>
              </div>
              <div className="score-info-large">
                <h3
                  className="score-rating"
                  style={{ color: results.analysis.resilienceScore.color }}
                >
                  {results.analysis.resilienceScore.rating}
                </h3>
                <p className="score-percentage">{results.analysis.resilienceScore.percentage}% Resiliente</p>
                <p className="score-recommendation">{results.analysis.resilienceScore.recommendation}</p>
                <div className="analyzed-url">
                  <span className="url-label">Analisado:</span>
                  <span className="url-value">{results.url}</span>
                </div>
                <div className="timestamp">
                  <span className="timestamp-icon">🕐</span>
                  {formatDate(results.timestamp)}
                </div>
              </div>
            </div>
          </div>

          {/* Score Factors */}
          <div className="score-factors-card">
            <h3>📊 Fatores de Pontuação</h3>
            <div className="factors-list">
              {results.analysis.resilienceScore.factors.map((factor, index) => (
                <div key={index} className="factor-item">
                  <div className="factor-info">
                    <span
                      className="factor-status-dot"
                      style={{ backgroundColor: getStatusColor(factor.status) }}
                    ></span>
                    <span className="factor-name">{factor.factor}</span>
                  </div>
                  <div className="factor-points" style={{ color: getStatusColor(factor.status) }}>
                    +{factor.points} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="tabs-navigation">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📋 Visão Geral
            </button>
            <button
              className={`tab ${activeTab === 'protection' ? 'active' : ''}`}
              onClick={() => setActiveTab('protection')}
            >
              🛡️ Proteções DDoS
            </button>
            <button
              className={`tab ${activeTab === 'ratelimit' ? 'active' : ''}`}
              onClick={() => setActiveTab('ratelimit')}
            >
              ⏱️ Rate Limiting
            </button>
            <button
              className={`tab ${activeTab === 'loadtest' ? 'active' : ''}`}
              onClick={() => setActiveTab('loadtest')}
            >
              📊 Teste de Carga
            </button>
            <button
              className={`tab ${activeTab === 'dns' ? 'active' : ''}`}
              onClick={() => setActiveTab('dns')}
            >
              🌐 DNS/CDN
            </button>
            <button
              className={`tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Segurança
            </button>
          </div>

          <div className="tab-content">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="cards-grid">
                  {/* Basic Info Card */}
                  {results.analysis.basicInfo && (
                    <div className="info-card">
                      <div className="card-header">
                        <h3>📡 Informações Básicas</h3>
                      </div>
                      <div className="card-content">
                        <div className="info-row">
                          <span className="label">Status HTTP:</span>
                          <span className="value">{results.analysis.basicInfo.statusCode}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Tempo de Resposta:</span>
                          <span className="value">{results.analysis.basicInfo.responseTime}ms</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Servidor:</span>
                          <span className="value">{results.analysis.basicInfo.server}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Content-Type:</span>
                          <span className="value small">{results.analysis.basicInfo.contentType}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Protection Summary */}
                  {results.analysis.protection && (
                    <div className="info-card">
                      <div className="card-header">
                        <h3>🛡️ Proteções Detectadas</h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: results.analysis.protection.hasProtection
                              ? '#10b98120'
                              : '#ef444420',
                            color: results.analysis.protection.hasProtection ? '#10b981' : '#ef4444',
                          }}
                        >
                          {results.analysis.protection.hasProtection
                            ? '✓ Protegido'
                            : '✗ Sem Proteção'}
                        </span>
                      </div>
                      <div className="card-content">
                        <div className="protection-summary">
                          <div className="protection-count">
                            {results.analysis.protection.detectedServices.length}
                          </div>
                          <div className="protection-label">
                            Serviço(s) de Proteção Detectado(s)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rate Limiting Summary */}
                  {results.analysis.rateLimiting && (
                    <div className="info-card">
                      <div className="card-header">
                        <h3>⏱️ Rate Limiting</h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: results.analysis.rateLimiting.hasRateLimiting
                              ? '#10b98120'
                              : '#f59e0b20',
                            color: results.analysis.rateLimiting.hasRateLimiting
                              ? '#10b981'
                              : '#f59e0b',
                          }}
                        >
                          {results.analysis.rateLimiting.hasRateLimiting ? '✓ Ativo' : '⚠ Inativo'}
                        </span>
                      </div>
                      <div className="card-content">
                        <div className="info-row">
                          <span className="label">Requisições Testadas:</span>
                          <span className="value">{results.analysis.rateLimiting.totalRequests}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Bloqueadas:</span>
                          <span className="value" style={{ color: '#ef4444' }}>
                            {results.analysis.rateLimiting.blockedRequests}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Taxa de Bloqueio:</span>
                          <span className="value">
                            {results.analysis.rateLimiting.blockRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Load Test Summary */}
                  {results.analysis.loadTest && (
                    <div className="info-card">
                      <div className="card-header">
                        <h3>📊 Capacidade de Carga</h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: results.analysis.loadTest.canHandleConcurrent
                              ? '#10b98120'
                              : '#f59e0b20',
                            color: results.analysis.loadTest.canHandleConcurrent
                              ? '#10b981'
                              : '#f59e0b',
                          }}
                        >
                          {results.analysis.loadTest.canHandleConcurrent ? '✓ Boa' : '⚠ Limitada'}
                        </span>
                      </div>
                      <div className="card-content">
                        <div className="info-row">
                          <span className="label">Requisições Concorrentes:</span>
                          <span className="value">{results.analysis.loadTest.concurrentRequests}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Taxa de Sucesso:</span>
                          <span className="value" style={{ color: '#10b981' }}>
                            {results.analysis.loadTest.successRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Tempo Médio:</span>
                          <span className="value">{results.analysis.loadTest.averageResponseTime}ms</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROTECTION TAB */}
            {activeTab === 'protection' && results.analysis.protection && (
              <div className="protection-tab">
                <div className="info-card">
                  <h3>🛡️ Serviços de Proteção DDoS Detectados</h3>
                  {results.analysis.protection.detectedServices.length > 0 ? (
                    <div className="services-list">
                      {results.analysis.protection.detectedServices.map((service, index) => (
                        <div key={index} className="service-item">
                          <div className="service-header">
                            <div className="service-name">
                              <span className="service-icon">✓</span>
                              {service.name}
                            </div>
                            <span className="confidence-badge" style={{
                              backgroundColor: service.confidence === 'High' ? '#10b98120' : '#f59e0b20',
                              color: service.confidence === 'High' ? '#10b981' : '#f59e0b'
                            }}>
                              {service.confidence} Confidence
                            </span>
                          </div>
                          <div className="service-details">
                            <div className="service-type">{service.type}</div>
                            <div className="service-evidence">📋 {service.evidence}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-services">
                      <div className="warning-message">
                        <span className="warning-icon">⚠️</span>
                        <div>
                          <strong>Nenhum serviço de proteção DDoS detectado</strong>
                          <p>Recomenda-se implementar proteções como Cloudflare, AWS Shield, ou Akamai</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="info-card">
                  <h3>🔍 Verificações de Proteção</h3>
                  <div className="protection-checks">
                    {Object.entries(results.analysis.protection.protections)
                      .filter(([key]) => key !== 'other')
                      .map(([key, value]) => (
                        <div key={key} className={`protection-check ${value ? 'active' : 'inactive'}`}>
                          <span className="check-icon">{value ? '✓' : '✗'}</span>
                          <span className="check-name">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* RATE LIMITING TAB */}
            {activeTab === 'ratelimit' && results.analysis.rateLimiting && (
              <div className="ratelimit-tab">
                <div className="info-card">
                  <h3>⏱️ Resultados do Teste de Rate Limiting</h3>
                  <div className="ratelimit-summary">
                    <div className="summary-stat">
                      <div className="stat-value">{results.analysis.rateLimiting.totalRequests}</div>
                      <div className="stat-label">Total de Requisições</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-value" style={{ color: '#10b981' }}>
                        {results.analysis.rateLimiting.successfulRequests}
                      </div>
                      <div className="stat-label">Bem-sucedidas</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-value" style={{ color: '#ef4444' }}>
                        {results.analysis.rateLimiting.blockedRequests}
                      </div>
                      <div className="stat-label">Bloqueadas</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-value">{results.analysis.rateLimiting.averageResponseTime}ms</div>
                      <div className="stat-label">Tempo Médio</div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>📊 Detalhes das Requisições (primeiras 10)</h3>
                  <div className="requests-table">
                    <div className="table-header">
                      <div className="table-cell">#</div>
                      <div className="table-cell">Status</div>
                      <div className="table-cell">Tempo</div>
                      <div className="table-cell">Resultado</div>
                    </div>
                    {results.analysis.rateLimiting.results.map((result, index) => (
                      <div key={index} className="table-row">
                        <div className="table-cell">{result.requestNumber}</div>
                        <div className="table-cell">
                          <span className="status-code">{result.statusCode || 'N/A'}</span>
                        </div>
                        <div className="table-cell">{result.responseTime}ms</div>
                        <div className="table-cell">
                          {result.blocked ? (
                            <span className="result-badge blocked">Bloqueado</span>
                          ) : result.success ? (
                            <span className="result-badge success">Sucesso</span>
                          ) : (
                            <span className="result-badge error">Erro</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LOAD TEST TAB */}
            {activeTab === 'loadtest' && results.analysis.loadTest && (
              <div className="loadtest-tab">
                <div className="info-card">
                  <h3>📊 Teste de Carga Concorrente</h3>
                  <div className="loadtest-results">
                    <div className="loadtest-stat-large">
                      <div className="stat-icon">⚡</div>
                      <div className="stat-content">
                        <div className="stat-value-large">
                          {results.analysis.loadTest.successRate.toFixed(1)}%
                        </div>
                        <div className="stat-label-large">Taxa de Sucesso</div>
                      </div>
                    </div>

                    <div className="loadtest-details">
                      <div className="detail-item">
                        <span className="detail-label">Requisições Concorrentes:</span>
                        <span className="detail-value">{results.analysis.loadTest.concurrentRequests}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Bem-sucedidas:</span>
                        <span className="detail-value" style={{ color: '#10b981' }}>
                          {results.analysis.loadTest.successful}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Falharam:</span>
                        <span className="detail-value" style={{ color: '#ef4444' }}>
                          {results.analysis.loadTest.failed}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Tempo Total:</span>
                        <span className="detail-value">{results.analysis.loadTest.totalTime}ms</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Tempo Médio de Resposta:</span>
                        <span className="detail-value">
                          {results.analysis.loadTest.averageResponseTime}ms
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Pode Lidar com Carga Concorrente:</span>
                        <span
                          className="detail-value"
                          style={{
                            color: results.analysis.loadTest.canHandleConcurrent ? '#10b981' : '#f59e0b',
                          }}
                        >
                          {results.analysis.loadTest.canHandleConcurrent ? 'Sim ✓' : 'Limitado ⚠'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>💡 Interpretação dos Resultados</h3>
                  <div className="interpretation">
                    {results.analysis.loadTest.successRate >= 90 ? (
                      <div className="interpretation-item good">
                        <span className="interp-icon">✓</span>
                        <div>
                          <strong>Excelente capacidade de carga</strong>
                          <p>
                            O site respondeu com sucesso a {results.analysis.loadTest.successful} de{' '}
                            {results.analysis.loadTest.concurrentRequests} requisições simultâneas, demonstrando
                            boa capacidade de lidar com tráfego concorrente.
                          </p>
                        </div>
                      </div>
                    ) : results.analysis.loadTest.successRate >= 70 ? (
                      <div className="interpretation-item warning">
                        <span className="interp-icon">⚠</span>
                        <div>
                          <strong>Capacidade moderada</strong>
                          <p>
                            O site teve alguma dificuldade com requisições simultâneas. Considere otimizações de
                            performance ou implementar CDN/cache.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="interpretation-item critical">
                        <span className="interp-icon">✗</span>
                        <div>
                          <strong>Capacidade limitada</strong>
                          <p>
                            O site teve dificuldade significativa em lidar com carga concorrente. Recomenda-se
                            urgentemente implementar proteções DDoS e otimizações de infraestrutura.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DNS/CDN TAB */}
            {activeTab === 'dns' && results.analysis.dns && (
              <div className="dns-tab">
                <div className="info-card">
                  <h3>🌐 Informações DNS</h3>
                  <div className="dns-info">
                    <div className="info-row">
                      <span className="label">Hostname:</span>
                      <span className="value">{results.hostname}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Número de IPs:</span>
                      <span className="value">{results.analysis.dns.ipCount}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Usando CDN:</span>
                      <span
                        className="value"
                        style={{ color: results.analysis.dns.likelyUsingCDN ? '#10b981' : '#f59e0b' }}
                      >
                        {results.analysis.dns.likelyUsingCDN ? 'Sim ✓' : 'Não ✗'}
                      </span>
                    </div>
                  </div>

                  {results.analysis.dns.ipAddresses && results.analysis.dns.ipAddresses.length > 0 && (
                    <div className="ip-addresses">
                      <h4>Endereços IP:</h4>
                      <div className="ip-list">
                        {results.analysis.dns.ipAddresses.map((ip, index) => (
                          <span key={index} className="ip-badge">
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.analysis.dns.cdnDetected && results.analysis.dns.cdnDetected.length > 0 && (
                    <div className="cdn-detected">
                      <h4>CDN Detectado via IP:</h4>
                      <div className="cdn-list">
                        {results.analysis.dns.cdnDetected.map((cdn, index) => (
                          <div key={index} className="cdn-item">
                            <span className="cdn-name">{cdn.cdn.toUpperCase()}</span>
                            <span className="cdn-ip">{cdn.ip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.analysis.dns.nameservers && results.analysis.dns.nameservers.length > 0 && (
                    <div className="nameservers">
                      <h4>Nameservers:</h4>
                      <div className="ns-list">
                        {results.analysis.dns.nameservers.map((ns, index) => (
                          <span key={index} className="ns-badge">
                            {ns}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && results.analysis.securityHeaders && (
              <div className="security-tab">
                <div className="info-card">
                  <div className="card-header">
                    <h3>🔒 Security Headers</h3>
                    <div className="security-score">
                      <div
                        className="score-circle"
                        style={{
                          background: `conic-gradient(#10b981 ${results.analysis.securityHeaders.percentage}%, #1f2937 0)`,
                        }}
                      >
                        <div className="score-inner">
                          <span className="score-value">{results.analysis.securityHeaders.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="security-headers-list">
                    {Object.entries(results.analysis.securityHeaders.headers).map(([header, value]) => (
                      <div key={header} className="security-header-row">
                        <div className="header-name">
                          <span className={value ? 'check-icon present' : 'check-icon missing'}>
                            {value ? '✓' : '✗'}
                          </span>
                          {header}
                        </div>
                        <div className="header-value">{value || 'Não configurado'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="security-summary">
                    <p>
                      {results.analysis.securityHeaders.score} de {results.analysis.securityHeaders.maxScore}{' '}
                      security headers configurados
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DDoSResilience;
