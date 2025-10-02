import React, { useState, useEffect } from 'react';
import NetworkScanner from './components/NetworkScanner';
import WordlistManager from './components/WordlistManager';
import BruteforcePanel from './components/BruteforcePanel';
import LogViewer from './components/LogViewer';
import { connectWebSocket, disconnectWebSocket } from './services/websocket';
import './App.css';

function App() {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedWordlist, setSelectedWordlist] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Conectar ao WebSocket
    connectWebSocket((message) => {
      const newLog = {
        timestamp: new Date().toLocaleTimeString(),
        ...message
      };

      setLogs(prev => [...prev, newLog]);

      // Atualizar status baseado no tipo de mensagem
      if (message.type === 'start') {
        setIsRunning(true);
      } else if (['success', 'finished', 'stopped'].includes(message.type)) {
        setIsRunning(false);
      }

      if (message.type === 'progress') {
        setStatus(message.data);
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🔐 WiFi Security Testing Tool</h1>
        <p className="warning">⚠️ APENAS PARA TESTE EM REDES PRÓPRIAS - USO EDUCACIONAL</p>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <NetworkScanner
            selectedNetwork={selectedNetwork}
            onSelectNetwork={setSelectedNetwork}
            disabled={isRunning}
          />

          <WordlistManager
            selectedWordlist={selectedWordlist}
            onSelectWordlist={setSelectedWordlist}
            disabled={isRunning}
          />
        </div>

        <div className="right-panel">
          <BruteforcePanel
            selectedNetwork={selectedNetwork}
            selectedWordlist={selectedWordlist}
            isRunning={isRunning}
            status={status}
          />

          <LogViewer
            logs={logs}
            onClear={handleClearLogs}
          />
        </div>
      </div>

      <footer className="app-footer">
        <p>Desenvolvido para fins educacionais e testes de segurança autorizados</p>
      </footer>
    </div>
  );
}

export default App;
