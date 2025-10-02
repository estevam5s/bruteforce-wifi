import React from 'react';
import { startBruteforce, stopBruteforce } from '../services/api';
import './BruteforcePanel.css';

function BruteforcePanel({ selectedNetwork, selectedWordlist, isRunning, status }) {
  const handleStart = async () => {
    if (!selectedNetwork) {
      alert('Selecione uma rede WiFi');
      return;
    }

    if (!selectedWordlist) {
      alert('Selecione uma wordlist');
      return;
    }

    try {
      await startBruteforce(selectedNetwork.ssid, selectedWordlist.path);
    } catch (err) {
      alert('Erro ao iniciar: ' + err.message);
    }
  };

  const handleStop = async () => {
    try {
      await stopBruteforce();
    } catch (err) {
      alert('Erro ao parar: ' + err.message);
    }
  };

  const canStart = selectedNetwork && selectedWordlist && !isRunning;

  return (
    <div className="card bruteforce-panel">
      <h2>⚡ Painel de Controle</h2>

      <div className="selected-info">
        <div className="info-item">
          <label>Rede Selecionada:</label>
          <span className={selectedNetwork ? 'selected' : 'not-selected'}>
            {selectedNetwork ? selectedNetwork.ssid : 'Nenhuma'}
          </span>
        </div>

        <div className="info-item">
          <label>Wordlist Selecionada:</label>
          <span className={selectedWordlist ? 'selected' : 'not-selected'}>
            {selectedWordlist ? `${selectedWordlist.name} (${selectedWordlist.passwordCount} senhas)` : 'Nenhuma'}
          </span>
        </div>
      </div>

      {status && (
        <div className="progress-info">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${status.percentage}%` }}
            >
              {status.percentage}%
            </div>
          </div>

          <div className="progress-details">
            <div className="detail-item">
              <span className="detail-label">Progresso:</span>
              <span className="detail-value">{status.attemptCount} / {status.totalPasswords}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Senha Atual:</span>
              <span className="detail-value current-password">{status.currentPassword}</span>
            </div>
          </div>
        </div>
      )}

      <div className="control-buttons">
        {!isRunning ? (
          <button
            className="btn btn-primary btn-large"
            onClick={handleStart}
            disabled={!canStart}
          >
            🚀 Iniciar Teste
          </button>
        ) : (
          <button
            className="btn btn-danger btn-large"
            onClick={handleStop}
          >
            ⏹️ Parar Teste
          </button>
        )}
      </div>

      {isRunning && (
        <div className="running-indicator">
          <span className="pulse"></span>
          Teste em execução...
        </div>
      )}
    </div>
  );
}

export default BruteforcePanel;
