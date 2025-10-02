import React, { useState } from 'react';
import '../styles/NetworkAnalysis.css';

function NetworkAnalysis({ api }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const analyzeNetwork = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.analyzeNetwork();
      if (response.success) {
        setAnalysis(response.data);
      } else {
        setError(response.message || 'Erro ao analisar rede');
      }
    } catch (err) {
      setError(err.message || 'Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  const getSignalColor = (rssi) => {
    if (rssi >= -50) return '#00ff88';
    if (rssi >= -60) return '#00cc66';
    if (rssi >= -70) return '#ffaa00';
    return '#ff4444';
  };

  const getSecurityColor = (level) => {
    if (level === 'BOM') return '#00ff88';
    if (level === 'MÉDIO') return '#ffaa00';
    if (level === 'ALTO' || level === 'CRÍTICO') return '#ff4444';
    return '#888';
  };

  return (
    <div className="network-analysis">
      <div className="analysis-header">
        <h2>📊 Análise Completa de Rede</h2>
        <button
          className="btn-analyze"
          onClick={analyzeNetwork}
          disabled={loading}
        >
          {loading ? '⏳ Analisando...' : '🔍 Analisar Rede Atual'}
        </button>
      </div>

      {error && (
        <div className="analysis-error">
          <span>❌</span> {error}
        </div>
      )}

      {analysis && (
        <div className="analysis-results">
          {/* Informações de Conexão */}
          <div className="analysis-card">
            <div className="card-header">
              <h3>🔌 Conexão</h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">SSID:</span>
                  <span className="info-value">{analysis.connection?.ssid || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">IP:</span>
                  <span className="info-value">{analysis.connection?.ipAddress || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">MAC:</span>
                  <span className="info-value">{analysis.connection?.macAddress || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">BSSID:</span>
                  <span className="info-value">{analysis.connection?.bssid || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Canal:</span>
                  <span className="info-value">{analysis.connection?.channel || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sinal (RSSI):</span>
                  <span
                    className="info-value"
                    style={{ color: getSignalColor(analysis.connection?.rssi) }}
                  >
                    {analysis.connection?.rssi || 'N/A'} dBm
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Qualidade:</span>
                  <span
                    className="info-value"
                    style={{ color: getSignalColor(analysis.connection?.rssi) }}
                  >
                    {analysis.connection?.signalQuality?.level || 'N/A'}
                    {analysis.connection?.signalQuality?.percentage &&
                      ` (${analysis.connection.signalQuality.percentage}%)`
                    }
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Taxa TX:</span>
                  <span className="info-value">{analysis.connection?.txRate || 'N/A'} Mbps</span>
                </div>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="analysis-card">
            <div className="card-header">
              <h3>🔒 Segurança</h3>
              <span
                className="security-badge"
                style={{ backgroundColor: getSecurityColor(analysis.security?.level) }}
              >
                Score: {analysis.security?.score || 0}/100
              </span>
            </div>
            <div className="card-body">
              <div className="info-item">
                <span className="info-label">Protocolo:</span>
                <span className="info-value">{analysis.security?.protocol || 'N/A'}</span>
              </div>

              {analysis.security?.vulnerabilities && analysis.security.vulnerabilities.length > 0 && (
                <div className="vulnerabilities-section">
                  <h4>⚠️ Vulnerabilidades Detectadas:</h4>
                  {analysis.security.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className="vulnerability-item">
                      <span className={`vuln-level vuln-${vuln.level.toLowerCase()}`}>
                        {vuln.level}
                      </span>
                      <div>
                        <strong>{vuln.type}</strong>
                        <p>{vuln.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {analysis.security?.recommendations && analysis.security.recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h4>💡 Recomendações:</h4>
                  <ul>
                    {analysis.security.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Performance */}
          <div className="analysis-card">
            <div className="card-header">
              <h3>⚡ Performance</h3>
              <span className="performance-badge">
                {analysis.performance?.quality?.rating || 'N/A'}
              </span>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Latência Média:</span>
                  <span className="info-value">
                    {analysis.performance?.latency?.toFixed(2) || 'N/A'} ms
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Jitter:</span>
                  <span className="info-value">
                    {analysis.performance?.jitter?.toFixed(2) || 'N/A'} ms
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Perda de Pacotes:</span>
                  <span className="info-value">
                    {analysis.performance?.packetLoss?.toFixed(2) || 'N/A'}%
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Banda Atual:</span>
                  <span className="info-value">
                    {analysis.performance?.estimatedBandwidth?.current || 'N/A'} Mbps
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Banda Máxima:</span>
                  <span className="info-value">
                    {analysis.performance?.estimatedBandwidth?.max || 'N/A'} Mbps
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Score Qualidade:</span>
                  <span className="info-value">
                    {analysis.performance?.quality?.score || 'N/A'}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dispositivos */}
          {analysis.devices && (
            <div className="analysis-card">
              <div className="card-header">
                <h3>📱 Dispositivos Conectados</h3>
                <span className="device-count">
                  {analysis.devices.count || 0} dispositivo(s)
                </span>
              </div>
              <div className="card-body">
                {analysis.devices.devices && analysis.devices.devices.length > 0 ? (
                  <div className="devices-list">
                    {analysis.devices.devices.slice(0, 10).map((device, idx) => (
                      <div key={idx} className="device-item">
                        <span className="device-icon">📱</span>
                        <div className="device-info">
                          <div className="device-ip">{device.ip}</div>
                          <div className="device-mac">{device.mac}</div>
                          <div className="device-vendor">{device.vendor}</div>
                        </div>
                      </div>
                    ))}
                    {analysis.devices.count > 10 && (
                      <div className="device-more">
                        + {analysis.devices.count - 10} dispositivos adicionais
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Nenhum dispositivo detectado</p>
                )}
              </div>
            </div>
          )}

          {/* Gateway e DNS */}
          <div className="analysis-card">
            <div className="card-header">
              <h3>🌐 Rede</h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Gateway IP:</span>
                  <span className="info-value">{analysis.gateway?.ip || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gateway Status:</span>
                  <span className="info-value">
                    {analysis.gateway?.reachable ? '✅ Acessível' : '❌ Inacessível'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Latência Gateway:</span>
                  <span className="info-value">
                    {analysis.gateway?.latency?.toFixed(2) || 'N/A'} ms
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Servidores DNS:</span>
                  <span className="info-value">
                    {analysis.dns?.count || 0} servidor(es)
                  </span>
                </div>
              </div>
              {analysis.dns?.servers && analysis.dns.servers.length > 0 && (
                <div className="dns-servers">
                  <h4>DNS:</h4>
                  <ul>
                    {analysis.dns.servers.map((server, idx) => (
                      <li key={idx}>{server}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="analysis-timestamp">
            Análise realizada em: {new Date(analysis.timestamp).toLocaleString('pt-BR')}
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkAnalysis;
