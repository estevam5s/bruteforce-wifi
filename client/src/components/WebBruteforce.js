import React, { useState, useEffect } from 'react';
import { connectWebSocket } from '../services/websocket';
import '../styles/WebBruteforce.css';

const WebBruteforce = () => {
  const [targetUrl, setTargetUrl] = useState('https://www.estevamsouza.com.br/admin/dashboard');
  const [usernameField, setUsernameField] = useState('username');
  const [passwordField, setPasswordField] = useState('password');
  const [usernameWordlists, setUsernameWordlists] = useState([]);
  const [passwordWordlists, setPasswordWordlists] = useState([]);
  const [selectedUsernameWordlist, setSelectedUsernameWordlist] = useState(null);
  const [selectedPasswordWordlist, setSelectedPasswordWordlist] = useState(null);
  const [delay, setDelay] = useState(1000);
  const [maxAttempts, setMaxAttempts] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(null);
  const [foundCredentials, setFoundCredentials] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    loadWordlists();

    // Conectar ao WebSocket para receber logs
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
      case 'webbruteforce_start':
        setIsRunning(true);
        setFoundCredentials(null);
        setProgress({
          current: 0,
          total: message.data.totalCombinations,
          percentage: 0
        });
        break;

      case 'webbruteforce_progress':
        setProgress({
          current: message.data.attempt,
          total: message.data.total,
          percentage: message.data.percentage,
          currentUsername: message.data.username,
          currentPassword: message.data.password
        });
        break;

      case 'webbruteforce_success':
        setIsRunning(false);
        setFoundCredentials(message.data);
        break;

      case 'webbruteforce_finished':
      case 'webbruteforce_limit':
        setIsRunning(false);
        break;

      default:
        break;
    }
  };

  const loadWordlists = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/webbruteforce/wordlists');
      const data = await response.json();

      const usernames = data.wordlists.filter(w => w.type === 'usernames');
      const passwords = data.wordlists.filter(w => w.type === 'passwords');

      setUsernameWordlists(usernames);
      setPasswordWordlists(passwords);

      if (usernames.length > 0) setSelectedUsernameWordlist(usernames[0].name);
      if (passwords.length > 0) setSelectedPasswordWordlist(passwords[0].name);
    } catch (error) {
      console.error('Error loading wordlists:', error);
    }
  };

  const testForm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/webbruteforce/test-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          usernameField,
          passwordField
        })
      });

      const data = await response.json();

      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        type: 'test',
        data: {
          message: 'Teste de formulário concluído',
          statusCode: data.test.statusCode,
          responseTime: data.test.responseTime
        }
      }]);

      alert(`Teste concluído!\nStatus: ${data.test.statusCode}\nTempo: ${data.test.responseTime}ms`);
    } catch (error) {
      alert('Erro ao testar formulário: ' + error.message);
    }
  };

  const startBruteforce = async () => {
    if (!agreedToTerms) {
      alert('Você deve concordar com os termos de uso antes de continuar!');
      return;
    }

    if (!selectedUsernameWordlist || !selectedPasswordWordlist) {
      alert('Selecione as wordlists de usuários e senhas!');
      return;
    }

    setLogs([]);
    setFoundCredentials(null);

    try {
      const response = await fetch('http://localhost:5000/api/webbruteforce/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          usernameWordlist: selectedUsernameWordlist,
          passwordWordlist: selectedPasswordWordlist,
          usernameField,
          passwordField,
          delay,
          maxAttempts
        })
      });

      const data = await response.json();

      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        data: {
          message: `Ataque iniciado: ${data.totalCombinations} combinações`,
          estimatedTime: data.estimatedTime
        }
      }]);
    } catch (error) {
      alert('Erro ao iniciar ataque: ' + error.message);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const uploadWordlist = async (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const content = await file.text();

      try {
        const response = await fetch('http://localhost:5000/api/webbruteforce/wordlists/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            content,
            type
          })
        });

        const data = await response.json();

        if (data.success) {
          alert(`Wordlist "${file.name}" carregada com sucesso! (${data.wordlist.size} entradas)`);
          loadWordlists();
        }
      } catch (error) {
        alert('Erro ao fazer upload: ' + error.message);
      }
    };

    input.click();
  };

  return (
    <div className="web-bruteforce">
      {/* WARNING BANNER */}
      <div className="critical-warning-banner">
        <div className="warning-icon-large">⚠️</div>
        <div className="warning-content">
          <h2>🚨 AVISO LEGAL CRÍTICO - FERRAMENTA EDUCACIONAL 🚨</h2>
          <div className="warning-text">
            <p><strong>ATENÇÃO:</strong> Esta ferramenta é destinada EXCLUSIVAMENTE para fins educacionais e testes de segurança em sistemas PRÓPRIOS ou com AUTORIZAÇÃO EXPLÍCITA por escrito.</p>
            <ul>
              <li>❌ É ILEGAL usar esta ferramenta contra sites/sistemas sem autorização</li>
              <li>❌ Você pode ser processado criminalmente por uso indevido</li>
              <li>❌ Violação da Lei Carolina Dieckmann (Lei 12.737/2012) e Lei Geral de Proteção de Dados (LGPD)</li>
              <li>✅ Use APENAS em ambientes de teste próprios ou com permissão documentada</li>
              <li>✅ Responsabilidade total do usuário pelo uso desta ferramenta</li>
            </ul>
            <p className="warning-highlight">
              O desenvolvedor NÃO se responsabiliza por uso indevido. Ao usar esta ferramenta, você assume TOTAL responsabilidade legal.
            </p>
          </div>
          <div className="agreement-section">
            <label className="agreement-checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span>
                Li e concordo com os termos. Declaro que tenho autorização para testar o sistema alvo
                e assumo total responsabilidade pelo uso desta ferramenta.
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="bruteforce-header">
        <div className="header-icon">🔓</div>
        <div className="header-text">
          <h2>Teste de Força Bruta em Login Web</h2>
          <p>Ferramenta educacional para teste de segurança em formulários de autenticação</p>
        </div>
      </div>

      <div className="bruteforce-container">
        {/* Configuration Panel */}
        <div className="config-panel">
          <div className="config-section">
            <h3>🎯 Configuração do Alvo</h3>
            <div className="form-group">
              <label>URL do Formulário de Login:</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://exemplo.com/login"
                className="input-field"
                disabled={isRunning}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Campo de Usuário:</label>
                <input
                  type="text"
                  value={usernameField}
                  onChange={(e) => setUsernameField(e.target.value)}
                  placeholder="username"
                  className="input-field"
                  disabled={isRunning}
                />
              </div>

              <div className="form-group">
                <label>Campo de Senha:</label>
                <input
                  type="text"
                  value={passwordField}
                  onChange={(e) => setPasswordField(e.target.value)}
                  placeholder="password"
                  className="input-field"
                  disabled={isRunning}
                />
              </div>
            </div>

            <button
              onClick={testForm}
              disabled={isRunning || !targetUrl}
              className="test-button"
            >
              🧪 Testar Formulário
            </button>
          </div>

          <div className="config-section">
            <h3>📚 Wordlists</h3>

            <div className="wordlist-group">
              <div className="wordlist-header">
                <label>Wordlist de Usuários:</label>
                <button
                  onClick={() => uploadWordlist('usernames')}
                  className="upload-btn"
                  disabled={isRunning}
                >
                  📤 Upload
                </button>
              </div>
              <select
                value={selectedUsernameWordlist || ''}
                onChange={(e) => setSelectedUsernameWordlist(e.target.value)}
                className="select-field"
                disabled={isRunning}
              >
                <option value="">Selecione uma wordlist</option>
                {usernameWordlists.map(wl => (
                  <option key={wl.name} value={wl.name}>
                    {wl.name} ({wl.size} usuários)
                  </option>
                ))}
              </select>
            </div>

            <div className="wordlist-group">
              <div className="wordlist-header">
                <label>Wordlist de Senhas:</label>
                <button
                  onClick={() => uploadWordlist('passwords')}
                  className="upload-btn"
                  disabled={isRunning}
                >
                  📤 Upload
                </button>
              </div>
              <select
                value={selectedPasswordWordlist || ''}
                onChange={(e) => setSelectedPasswordWordlist(e.target.value)}
                className="select-field"
                disabled={isRunning}
              >
                <option value="">Selecione uma wordlist</option>
                {passwordWordlists.map(wl => (
                  <option key={wl.name} value={wl.name}>
                    {wl.name} ({wl.size} senhas)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="config-section">
            <h3>⚙️ Configurações Avançadas</h3>

            <div className="form-group">
              <label>Delay entre tentativas (ms):</label>
              <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                min="100"
                max="5000"
                step="100"
                className="input-field"
                disabled={isRunning}
              />
              <small>Recomendado: 1000ms (1 segundo) para não sobrecarregar o servidor</small>
            </div>

            <div className="form-group">
              <label>Máximo de tentativas:</label>
              <input
                type="number"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                min="1"
                max="1000"
                className="input-field"
                disabled={isRunning}
              />
              <small>Limite de segurança para evitar ataques prolongados</small>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={startBruteforce}
              disabled={isRunning || !agreedToTerms || !selectedUsernameWordlist || !selectedPasswordWordlist}
              className="start-button"
            >
              {isRunning ? (
                <>
                  <span className="spinner"></span>
                  Executando...
                </>
              ) : (
                <>
                  🚀 Iniciar Teste
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress and Results Panel */}
        <div className="results-panel">
          {/* Progress */}
          {progress && (
            <div className="progress-section">
              <h3>📊 Progresso</h3>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress.percentage}%` }}
                >
                  <span className="progress-text">{progress.percentage}%</span>
                </div>
              </div>
              <div className="progress-info">
                <div className="progress-stat">
                  <span className="stat-label">Tentativas:</span>
                  <span className="stat-value">{progress.current} / {progress.total}</span>
                </div>
                {progress.currentUsername && (
                  <div className="current-attempt">
                    <div className="attempt-row">
                      <span className="attempt-label">Testando:</span>
                      <span className="attempt-value">
                        {progress.currentUsername} : {progress.currentPassword}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Found Credentials */}
          {foundCredentials && (
            <div className="success-panel">
              <div className="success-icon">🎉</div>
              <h3>✅ CREDENCIAIS ENCONTRADAS!</h3>
              <div className="credentials-display">
                <div className="credential-item">
                  <span className="cred-label">Usuário:</span>
                  <span className="cred-value">{foundCredentials.username}</span>
                </div>
                <div className="credential-item">
                  <span className="cred-label">Senha:</span>
                  <span className="cred-value">{foundCredentials.password}</span>
                </div>
                <div className="credential-item">
                  <span className="cred-label">Tentativa:</span>
                  <span className="cred-value">#{foundCredentials.attempt}</span>
                </div>
                <div className="credential-item">
                  <span className="cred-label">Status:</span>
                  <span className="cred-value">{foundCredentials.statusCode}</span>
                </div>
                {foundCredentials.reason && (
                  <div className="credential-item">
                    <span className="cred-label">Motivo:</span>
                    <span className="cred-value small">{foundCredentials.reason}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Logs */}
          <div className="logs-section">
            <div className="logs-header">
              <h3>📝 Logs de Execução</h3>
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
                        {log.data.username && (
                          <div className="log-attempt">
                            Tentativa #{log.data.attempt}: {log.data.username} : {log.data.password}
                            {log.data.success !== undefined && (
                              <span className={log.data.success ? 'log-success' : 'log-fail'}>
                                {log.data.success ? ' ✅ SUCESSO' : ' ❌ FALHOU'}
                              </span>
                            )}
                            {log.data.reason && (
                              <div className="log-reason">{log.data.reason}</div>
                            )}
                          </div>
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

export default WebBruteforce;
