import React, { useEffect, useRef } from 'react';
import './LogViewer.css';

function LogViewer({ logs, onClear }) {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'start': return '🚀';
      case 'progress': return '🔄';
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'stopped': return '⏹️';
      case 'finished': return '🏁';
      default: return 'ℹ️';
    }
  };

  const getLogClass = (type) => {
    switch (type) {
      case 'success': return 'log-success';
      case 'failed': return 'log-failed';
      case 'start': return 'log-info';
      case 'stopped': return 'log-warning';
      case 'finished': return 'log-warning';
      default: return '';
    }
  };

  const formatLogMessage = (log) => {
    switch (log.type) {
      case 'start':
        return `Iniciando teste na rede "${log.data.ssid}" com ${log.data.totalPasswords} senhas`;

      case 'progress':
        return `Testando senha: ${log.data.currentPassword} (${log.data.attemptCount}/${log.data.totalPasswords})`;

      case 'success':
        return `🎉 SENHA ENCONTRADA! Rede: ${log.data.ssid} | Senha: ${log.data.password}`;

      case 'failed':
        return `Falha com senha: ${log.data.password}`;

      case 'stopped':
        return log.data.message;

      case 'finished':
        return log.data.message;

      default:
        return JSON.stringify(log.data);
    }
  };

  return (
    <div className="card log-viewer">
      <div className="log-header">
        <h2>📋 Logs em Tempo Real</h2>
        <button className="btn btn-secondary btn-small" onClick={onClear}>
          🗑️ Limpar
        </button>
      </div>

      <div className="logs-container">
        {logs.length === 0 ? (
          <p className="no-logs">Nenhum log ainda. Inicie um teste para ver os logs.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-entry ${getLogClass(log.type)}`}>
              <span className="log-timestamp">{log.timestamp}</span>
              <span className="log-icon">{getLogIcon(log.type)}</span>
              <span className="log-message">{formatLogMessage(log)}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}

export default LogViewer;
