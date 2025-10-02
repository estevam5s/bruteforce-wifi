import React, { useState, useEffect } from 'react';
import '../styles/AttackMonitor.css';

function AttackMonitor({ api }) {
  const [monitoring, setMonitoring] = useState(false);
  const [detection, setDetection] = useState(null);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    let interval;
    if (autoRefresh && monitoring) {
      interval = setInterval(() => {
        detectAttacks();
      }, 10000); // Atualizar a cada 10 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, monitoring]);

  const detectAttacks = async () => {
    setMonitoring(true);
    setError(null);

    try {
      const response = await api.detectAttacks();
      if (response.success) {
        setDetection(response.data);
      } else {
        setError(response.message || 'Erro ao detectar ataques');
      }
    } catch (err) {
      setError(err.message || 'Erro ao conectar com servidor');
    } finally {
      if (!autoRefresh) {
        setMonitoring(false);
      }
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      detectAttacks();
    }
  };

  const getStatusColor = (status) => {
    if (status === 'SEGURO') return '#00ff88';
    if (status === 'AMEAÇA DETECTADA') return '#ff4444';
    return '#888';
  };

  const getSeverityColor = (severity) => {
    if (severity === 'ALTO') return '#ff4444';
    if (severity === 'MÉDIO') return '#ffaa00';
    if (severity === 'BAIXO') return '#ffcc00';
    return '#888';
  };

  return (
    <div className="attack-monitor">
      <div className="monitor-header">
        <h2>🛡️ Monitor de Ataques</h2>
        <div className="monitor-controls">
          <button
            className={`btn-auto-refresh ${autoRefresh ? 'active' : ''}`}
            onClick={toggleAutoRefresh}
          >
            {autoRefresh ? '⏸️ Pausar Monitoramento' : '▶️ Monitoramento Auto'}
          </button>
          <button
            className="btn-scan"
            onClick={detectAttacks}
            disabled={monitoring && !autoRefresh}
          >
            {monitoring && !autoRefresh ? '⏳ Escaneando...' : '🔍 Escanear Agora'}
          </button>
        </div>
      </div>

      {error && (
        <div className="monitor-error">
          <span>❌</span> {error}
        </div>
      )}

      {detection && (
        <div className="monitor-results">
          {/* Status de Segurança */}
          <div className="security-status-card">
            <div
              className="status-indicator"
              style={{ borderColor: getStatusColor(detection.status) }}
            >
              <div className="status-icon">
                {detection.status === 'SEGURO' ? '✅' : '⚠️'}
              </div>
              <h3
                className="status-text"
                style={{ color: getStatusColor(detection.status) }}
              >
                {detection.status}
              </h3>
              <div className="status-details">
                <span className="attacks-count">
                  {detection.attacksDetected} ataque(s) detectado(s)
                </span>
                <span className="last-check">
                  Última verificação: {new Date(detection.lastCheck).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>

            {autoRefresh && (
              <div className="auto-refresh-indicator">
                <span className="pulse-dot"></span>
                Monitoramento ativo
              </div>
            )}
          </div>

          {/* Ataques Detectados */}
          {detection.attacks && detection.attacks.length > 0 ? (
            <div className="attacks-card">
              <div className="card-header">
                <h3>⚠️ Ameaças Detectadas</h3>
                <span className="threat-count">{detection.attacks.length}</span>
              </div>
              <div className="card-body">
                <div className="attacks-list">
                  {detection.attacks.map((attack, index) => (
                    <div key={index} className="attack-item">
                      <div className="attack-header">
                        <span
                          className="attack-severity"
                          style={{ backgroundColor: getSeverityColor(attack.severity) }}
                        >
                          {attack.severity}
                        </span>
                        <h4>{attack.type}</h4>
                        <span className="attack-time">
                          {new Date(attack.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                      <p className="attack-description">{attack.description}</p>

                      {/* Ações Recomendadas */}
                      <div className="attack-actions">
                        <h5>Ações Recomendadas:</h5>
                        <ul>
                          {attack.type.includes('DDoS') && (
                            <>
                              <li>Verificar aplicações suspeitas abertas</li>
                              <li>Verificar dispositivos conectados</li>
                              <li>Considerar reiniciar roteador</li>
                              <li>Contatar provedor de internet se persistir</li>
                            </>
                          )}
                          {attack.type.includes('negação de serviço') && (
                            <>
                              <li>Verificar qualidade da conexão WiFi</li>
                              <li>Trocar canal WiFi se interferência</li>
                              <li>Verificar por malware nos dispositivos</li>
                              <li>Atualizar firmware do roteador</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-attacks">
              <div className="success-icon">✅</div>
              <h3>Nenhuma ameaça detectada</h3>
              <p>Sua rede está operando normalmente</p>
            </div>
          )}

          {/* Métricas de Monitoramento */}
          {detection.metrics && (
            <div className="metrics-card">
              <div className="card-header">
                <h3>📊 Métricas de Monitoramento</h3>
              </div>
              <div className="card-body">
                <div className="checks-list">
                  {detection.metrics.checks && detection.metrics.checks.map((check, index) => (
                    <div key={index} className="check-item">
                      <span className={`check-status ${check.status.toLowerCase()}`}>
                        {check.status === 'OK' ? '✓' : check.status === 'WARNING' ? '⚠' : '✕'}
                      </span>
                      <div className="check-info">
                        <span className="check-type">{check.type}</span>
                        {check.connections && (
                          <span className="check-detail">
                            Conexões: {check.connections}
                          </span>
                        )}
                        {check.packetLoss !== undefined && (
                          <span className="check-detail">
                            Perda de pacotes: {check.packetLoss}%
                          </span>
                        )}
                      </div>
                      <span className={`check-badge ${check.status.toLowerCase()}`}>
                        {check.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tipos de Ataques - Guia Educacional */}
          <div className="attack-guide-card">
            <div className="card-header">
              <h3>📚 Guia de Ataques Comuns</h3>
            </div>
            <div className="card-body">
              <div className="guide-grid">
                <div className="guide-item">
                  <h4>🌊 DDoS (Distributed Denial of Service)</h4>
                  <p>
                    Ataque que sobrecarrega a rede com tráfego excessivo, tornando-a
                    inacessível para usuários legítimos.
                  </p>
                  <div className="guide-indicators">
                    <strong>Indicadores:</strong>
                    <ul>
                      <li>Grande número de conexões simultâneas</li>
                      <li>Lentidão extrema na navegação</li>
                      <li>Impossibilidade de acessar sites</li>
                    </ul>
                  </div>
                </div>

                <div className="guide-item">
                  <h4>🎭 ARP Spoofing</h4>
                  <p>
                    Ataque que intercepta comunicações redirecionando tráfego através
                    de um dispositivo malicioso.
                  </p>
                  <div className="guide-indicators">
                    <strong>Indicadores:</strong>
                    <ul>
                      <li>Mudanças no endereço MAC do gateway</li>
                      <li>Certificados SSL inválidos</li>
                      <li>Redirecionamentos suspeitos</li>
                    </ul>
                  </div>
                </div>

                <div className="guide-item">
                  <h4>📡 Deauth Attack</h4>
                  <p>
                    Ataque que força desconexão de dispositivos da rede WiFi
                    repetidamente.
                  </p>
                  <div className="guide-indicators">
                    <strong>Indicadores:</strong>
                    <ul>
                      <li>Desconexões frequentes e inexplicáveis</li>
                      <li>Dificuldade em manter conexão WiFi</li>
                      <li>Alta perda de pacotes</li>
                    </ul>
                  </div>
                </div>

                <div className="guide-item">
                  <h4>🔍 Man-in-the-Middle (MITM)</h4>
                  <p>
                    Interceptação de comunicações entre dois pontos sem que as
                    partes percebam.
                  </p>
                  <div className="guide-indicators">
                    <strong>Indicadores:</strong>
                    <ul>
                      <li>Avisos de certificado SSL</li>
                      <li>Páginas carregando de forma diferente</li>
                      <li>Login em sites sem HTTPS</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dicas de Proteção */}
          <div className="protection-tips-card">
            <div className="card-header">
              <h3>🛡️ Dicas de Proteção</h3>
            </div>
            <div className="card-body">
              <div className="tips-grid">
                <div className="tip-item">
                  <span className="tip-number">1</span>
                  <div>
                    <strong>Use VPN</strong>
                    <p>Criptografa todo tráfego da rede</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-number">2</span>
                  <div>
                    <strong>Firewall Ativo</strong>
                    <p>Bloqueia conexões não autorizadas</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-number">3</span>
                  <div>
                    <strong>WPA3</strong>
                    <p>Use criptografia mais recente</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-number">4</span>
                  <div>
                    <strong>Monitore Dispositivos</strong>
                    <p>Conheça todos conectados à rede</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-number">5</span>
                  <div>
                    <strong>Atualizações</strong>
                    <p>Mantenha firmware atualizado</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-number">6</span>
                  <div>
                    <strong>IDS/IPS</strong>
                    <p>Sistema de detecção de intrusão</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttackMonitor;
