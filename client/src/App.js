import React, { useState, useEffect } from 'react';
import NetworkScanner from './components/NetworkScanner';
import WordlistManager from './components/WordlistManager';
import BruteforcePanel from './components/BruteforcePanel';
import LogViewer from './components/LogViewer';
import NetworkAnalysis from './components/NetworkAnalysis';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import SpeedTest from './components/SpeedTest';
import AttackMonitor from './components/AttackMonitor';
import ChartsDashboard from './components/ChartsDashboard';
import DocumentGenerator from './components/DocumentGenerator';
import { connectWebSocket, disconnectWebSocket } from './services/websocket';
import * as api from './services/api';
import './App.css';

function App() {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedWordlist, setSelectedWordlist] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'bruteforce', label: '🔓 Bruteforce WiFi', icon: '🔓' },
    { id: 'analysis', label: '📊 Análise de Rede', icon: '📊' },
    { id: 'vulnerabilities', label: '🔍 Vulnerabilidades', icon: '🔍' },
    { id: 'speed', label: '🚀 Teste de Velocidade', icon: '🚀' },
    { id: 'attacks', label: '🛡️ Monitor de Ataques', icon: '🛡️' },
    { id: 'docs', label: '📚 Documentação', icon: '📚' }
  ];

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🔐 WiFi Security Testing Tool</h1>
            <p className="header-subtitle">Ferramenta Profissional de Análise de Segurança WiFi</p>
          </div>
          <div className="header-warning">
            <span className="warning-badge">⚠️ APENAS USO EDUCACIONAL</span>
          </div>
        </div>
      </header>

      <nav className="app-navigation">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="app-content">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <ChartsDashboard api={api} />
          </div>
        )}

        {/* Bruteforce WiFi (Original) */}
        {activeTab === 'bruteforce' && (
          <div className="tab-content">
            <div className="bruteforce-layout">
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
          </div>
        )}

        {/* Análise de Rede */}
        {activeTab === 'analysis' && (
          <div className="tab-content">
            <NetworkAnalysis api={api} />
          </div>
        )}

        {/* Scanner de Vulnerabilidades */}
        {activeTab === 'vulnerabilities' && (
          <div className="tab-content">
            <VulnerabilityScanner api={api} />
          </div>
        )}

        {/* Teste de Velocidade */}
        {activeTab === 'speed' && (
          <div className="tab-content">
            <SpeedTest api={api} />
          </div>
        )}

        {/* Monitor de Ataques */}
        {activeTab === 'attacks' && (
          <div className="tab-content">
            <AttackMonitor api={api} />
          </div>
        )}

        {/* Documentação */}
        {activeTab === 'docs' && (
          <div className="tab-content">
            <DocumentGenerator api={api} />
          </div>
        )}
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Desenvolvido para fins educacionais e testes de segurança autorizados</p>
          <p className="footer-version">v2.0.0 - Professional IT Tool</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
