import React, { useState, useEffect } from 'react';
import { connectWebSocket } from '../services/websocket';
import '../styles/StressTest.css';

const StressTest = () => {
  const [targetUrl, setTargetUrl] = useState('https://www.estevamsouza.com.br');
  const [duration, setDuration] = useState(30);
  const [requestsPerSecond, setRequestsPerSecond] = useState(10);
  const [concurrentRequests, setConcurrentRequests] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [testId, setTestId] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(null);
  const [summary, setSummary] = useState(null);
  const [waveStats, setWaveStats] = useState([]);

  useEffect(() => {
    const ws = connectWebSocket((message) => {
      handleWebSocketMessage(message);
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleWebSocketMessage = (message) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      ...message
    };

    setLogs(prev => [...prev, newLog]);

    switch (message.type) {
      case 'stresstest_start':
        setIsRunning(true);
        setSummary(null);
        setWaveStats([]);
        setProgress({
          wave: 0,
          requestsSent: 0,
          totalRequests: message.data.totalRequests,
          percentage: 0
        });
        break;

      case 'stresstest_progress':
        setProgress(message.data);
        break;

      case 'stresstest_wave':
        setWaveStats(prev => [...prev, message.data]);
        break;

      case 'stresstest_finished':
        setIsRunning(false);
        setSummary(message.data);
        break;

      case 'stresstest_stopped':
        setIsRunning(false);
        break;

      case 'stresstest_error':
        setIsRunning(false);
        break;

      default:
        break;
    }
  };

  const startStressTest = async () => {
    if (!agreedToTerms) {
      alert('Você deve concordar com os termos de uso antes de continuar!');
      return;
    }

    setLogs([]);
    setWaveStats([]);
    setSummary(null);

    try {
      const response = await fetch('http://localhost:5000/api/stresstest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          duration,
          requestsPerSecond,
          concurrentRequests
        })
      });

      const data = await response.json();

      if (data.error) {
        alert('Erro: ' + data.error);
        return;
      }

      setTestId(data.testId);
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        data: {
          message: `Teste iniciado - ${data.config.totalRequests} requisições em ${data.config.duration}s`
        }
      }]);
    } catch (error) {
      alert('Erro ao iniciar teste: ' + error.message);
    }
  };

  const stopStressTest = async () => {
    if (!testId) return;

    try {
      await fetch(`http://localhost:5000/api/stresstest/stop/${testId}`, {
        method: 'POST'
      });
    } catch (error) {
      alert('Erro ao parar teste: ' + error.message);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setWaveStats([]);
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 90) return '#10b981';
    if (rate >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="stress-test">
      {/* CRITICAL WARNING BANNER */}
      <div className="critical-warning-banner stress">
        <div className="warning-icon-large">⚠️</div>
        <div className="warning-content">
          <h2>🚨 AVISO LEGAL EXTREMAMENTE CRÍTICO - TESTE DE ESTRESSE 🚨</h2>
          <div className="warning-text">
            <p><strong>ATENÇÃO MÁXIMA:</strong> Esta ferramenta simula um ataque DDoS controlado. O uso indevido pode causar crimes graves!</p>
            <ul>
              <li>❌ <strong>É CRIME FEDERAL</strong> usar contra sites sem autorização (Lei 12.737/2012)</li>
              <li>❌ Pode causar <strong>PRISÃO de 1 a 3 ANOS</strong> e multas pesadas</li>
              <li>❌ <strong>CRIME INAFIANÇÁVEL</strong> se causar prejuízos</li>
              <li>❌ Violação de Artigo 154-A do Código Penal Brasileiro</li>
              <li>❌ <strong>Responsabilidade civil e criminal</strong> por danos causados</li>
              <li>✅ Use APENAS em sites PRÓPRIOS ou com AUTORIZAÇÃO ESCRITA</li>
              <li>✅ Esta ferramenta tem limites de segurança (max 50 req simultâneas, 2 min duração)</li>
            </ul>
            <div className="warning-highlight">
              ⚖️ <strong>DISCLAIMER LEGAL:</strong> O desenvolvedor NÃO se responsabiliza pelo uso indevido.
              Ao usar esta ferramenta você assume <strong>TOTAL E INTEGRAL RESPONSABILIDADE CRIMINAL E CIVIL</strong>.
              Você declara ser o proprietário do site alvo ou possuir autorização expressa e documentada.
            </div>
          </div>
          <div className="agreement-section">
            <label className="agreement-checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span>
                <strong>DECLARO CIÊNCIA LEGAL:</strong> Li e compreendi completamente os avisos acima.
                Declaro que sou o proprietário legítimo do site alvo OU possuo autorização expressa por escrito
                do proprietário. Assumo total responsabilidade criminal e civil pelo uso desta ferramenta e
                isento completamente o desenvolvedor de qualquer responsabilidade.
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="test-header">
        <div className="header-icon">💥</div>
        <div className="header-text">
          <h2>Teste de Estresse / Carga (Stress Test)</h2>
          <p>Teste controlado de disponibilidade sob carga - Ferramenta Educacional</p>
        </div>
      </div>

      <div className="stress-container">
        {/* Configuration Panel */}
        <div className="config-panel">
          <div className="config-section">
            <h3>🎯 Configuração do Teste</h3>

            <div className="form-group">
              <label>URL do Site Alvo:</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://exemplo.com"
                className="input-field"
                disabled={isRunning}
              />
              <small>Digite a URL completa do SEU site que deseja testar</small>
            </div>

            <div className="form-group">
              <label>Duração do Teste (segundos):</label>
              <input
                type="range"
                min="10"
                max="120"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="slider"
                disabled={isRunning}
              />
              <div className="slider-value">{duration} segundos</div>
              <small>Mínimo: 10s | Máximo: 120s (2 minutos)</small>
            </div>

            <div className="form-group">
              <label>Requisições por Segundo:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={requestsPerSecond}
                onChange={(e) => setRequestsPerSecond(Number(e.target.value))}
                className="slider"
                disabled={isRunning}
              />
              <div className="slider-value">{requestsPerSecond} req/s</div>
              <small>Controla a intensidade do teste (máximo: 20 req/s)</small>
            </div>

            <div className="form-group">
              <label>Requisições Concorrentes:</label>
              <input
                type="range"
                min="5"
                max="50"
                value={concurrentRequests}
                onChange={(e) => setConcurrentRequests(Number(e.target.value))}
                className="slider"
                disabled={isRunning}
              />
              <div className="slider-value">{concurrentRequests} simultâneas</div>
              <small>Requisições enviadas simultaneamente (máximo: 50)</small>
            </div>

            <div className="test-summary">
              <h4>📊 Resumo do Teste:</h4>
              <div className="summary-item">
                <span className="summary-label">Total de Requisições:</span>
                <span className="summary-value">{duration * requestsPerSecond}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Duração Estimada:</span>
                <span className="summary-value">{duration} segundos</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Carga Estimada:</span>
                <span className="summary-value">
                  {((duration * requestsPerSecond * 50) / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            {!isRunning ? (
              <button
                onClick={startStressTest}
                disabled={!agreedToTerms || !targetUrl}
                className="start-button stress"
              >
                <span className="button-icon">🚀</span>
                Iniciar Teste de Estresse
              </button>
            ) : (
              <button
                onClick={stopStressTest}
                className="stop-button"
              >
                <span className="button-icon">⏹️</span>
                Parar Teste
              </button>
            )}
          </div>

          {isRunning && (
            <div className="running-indicator">
              <div className="pulse-dot"></div>
              <span>Teste em execução...</span>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          {/* Progress */}
          {progress && (
            <div className="progress-section">
              <h3>📊 Progresso do Teste</h3>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill stress"
                  style={{ width: `${progress.percentage}%` }}
                >
                  <span className="progress-text">{progress.percentage}%</span>
                </div>
              </div>
              <div className="progress-stats">
                <div className="stat-box">
                  <div className="stat-value">{progress.wave}</div>
                  <div className="stat-label">Onda Atual</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{progress.requestsSent}</div>
                  <div className="stat-label">Requisições Enviadas</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{progress.elapsed || 0}s</div>
                  <div className="stat-label">Tempo Decorrido</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{progress.remaining || 0}s</div>
                  <div className="stat-label">Tempo Restante</div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div className="summary-section">
              <div className="summary-header">
                <h3>✅ Teste Concluído</h3>
              </div>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon">📨</div>
                  <div className="card-value">{summary.totalRequests}</div>
                  <div className="card-label">Total de Requisições</div>
                </div>
                <div className="summary-card">
                  <div className="card-icon">✅</div>
                  <div className="card-value" style={{ color: '#10b981' }}>
                    {summary.successful}
                  </div>
                  <div className="card-label">Bem-sucedidas</div>
                </div>
                <div className="summary-card">
                  <div className="card-icon">❌</div>
                  <div className="card-value" style={{ color: '#ef4444' }}>
                    {summary.failed}
                  </div>
                  <div className="card-label">Falharam</div>
                </div>
                <div className="summary-card">
                  <div className="card-icon">📊</div>
                  <div
                    className="card-value"
                    style={{ color: getSuccessRateColor(summary.successRate) }}
                  >
                    {summary.successRate}%
                  </div>
                  <div className="card-label">Taxa de Sucesso</div>
                </div>
                <div className="summary-card">
                  <div className="card-icon">⏱️</div>
                  <div className="card-value">{summary.avgResponseTime}ms</div>
                  <div className="card-label">Tempo Médio</div>
                </div>
                <div className="summary-card">
                  <div className="card-icon">🚀</div>
                  <div className="card-value">{summary.actualRPS}</div>
                  <div className="card-label">Req/s Reais</div>
                </div>
              </div>

              <div className="conclusion-box">
                <h4>📝 Conclusão:</h4>
                <p>{summary.conclusion}</p>
                {parseFloat(summary.successRate) >= 90 ? (
                  <div className="conclusion-verdict success">
                    <span className="verdict-icon">✅</span>
                    <strong>SEU SITE ESTÁ BEM PROTEGIDO E DISPONÍVEL!</strong>
                  </div>
                ) : parseFloat(summary.successRate) >= 70 ? (
                  <div className="conclusion-verdict warning">
                    <span className="verdict-icon">⚠️</span>
                    <strong>SEU SITE TEM PROTEÇÕES MODERADAS</strong>
                  </div>
                ) : (
                  <div className="conclusion-verdict critical">
                    <span className="verdict-icon">❌</span>
                    <strong>SEU SITE PRECISA DE PROTEÇÕES ADICIONAIS!</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wave Statistics */}
          {waveStats.length > 0 && (
            <div className="waves-section">
              <div className="waves-header">
                <h3>🌊 Estatísticas por Onda (últimas 10)</h3>
              </div>
              <div className="waves-table">
                <div className="table-header">
                  <div className="table-cell">Onda</div>
                  <div className="table-cell">Sucesso</div>
                  <div className="table-cell">Falha</div>
                  <div className="table-cell">Tempo Médio</div>
                  <div className="table-cell">Taxa</div>
                </div>
                {waveStats.slice(-10).reverse().map((wave, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell">#{waveStats.length - index}</div>
                    <div className="table-cell" style={{ color: '#10b981' }}>
                      {wave.successful}
                    </div>
                    <div className="table-cell" style={{ color: '#ef4444' }}>
                      {wave.failed}
                    </div>
                    <div className="table-cell">{wave.avgResponseTime}ms</div>
                    <div className="table-cell">
                      {((wave.successful / wave.total) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs */}
          <div className="logs-section">
            <div className="logs-header">
              <h3>📝 Logs do Teste</h3>
              <button onClick={clearLogs} className="clear-button">
                🗑️ Limpar
              </button>
            </div>
            <div className="logs-container">
              {logs.length === 0 ? (
                <div className="no-logs">Nenhum log ainda. Inicie um teste para ver os resultados.</div>
              ) : (
                logs.slice().reverse().map((log, index) => (
                  <div key={index} className={`log-entry log-${log.type}`}>
                    <span className="log-timestamp">[{log.timestamp}]</span>
                    <span className="log-type">{log.type}</span>
                    {log.data && (
                      <div className="log-data">
                        {log.data.message && <div className="log-message">{log.data.message}</div>}
                        {log.data.conclusion && (
                          <div className="log-conclusion">{log.data.conclusion}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressTest;
