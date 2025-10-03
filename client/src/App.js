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
import PentestingMode from './components/PentestingMode';
import NetworkMapping from './components/NetworkMapping';
import PortScanner from './components/PortScanner';
import PacketAnalyzer from './components/PacketAnalyzer';
import SiteAnalysis from './components/SiteAnalysis';
import DDoSResilience from './components/DDoSResilience';
import WebBruteforce from './components/WebBruteforce';
import StressTest from './components/StressTest';
import CyberLab from './components/CyberLab';
import NetworkMap from './components/NetworkMap';
import TrafficMonitor from './components/TrafficMonitor';
import BrowsingHistory from './components/BrowsingHistory';
import NetworkAlerts from './components/NetworkAlerts';
import AccessControl from './components/AccessControl';
import SiteBlocker from './components/SiteBlocker';
import FirewallManager from './components/FirewallManager';
import VulnerabilityScanner2 from './components/VulnerabilityScanner';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [pentestMode, setPentestMode] = useState(false);

  useEffect(() => {
    // Conectar ao WebSocket
    connectWebSocket((message) => {
      const newLog = {
        timestamp: new Date().toLocaleTimeString(),
        ...message
      };

      setLogs(prev => [...prev, newLog]);

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

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      category: 'Principal',
      description: 'Visão geral do sistema'
    },
    {
      id: 'analysis',
      label: 'Análise de Rede',
      icon: '🔍',
      category: 'Análise',
      description: 'Análise completa da rede WiFi'
    },
    {
      id: 'vulnerabilities',
      label: 'Vulnerabilidades',
      icon: '🛡️',
      category: 'Segurança',
      description: 'Scanner de vulnerabilidades'
    },
    {
      id: 'speed',
      label: 'Teste de Velocidade',
      icon: '🚀',
      category: 'Performance',
      description: 'Medição de velocidade'
    },
    {
      id: 'attacks',
      label: 'Monitor de Ataques',
      icon: '⚠️',
      category: 'Segurança',
      description: 'Detecção de ameaças'
    },
    {
      id: 'bruteforce',
      label: 'Bruteforce WiFi',
      icon: '🔓',
      category: 'Testes',
      description: 'Teste de força bruta WiFi'
    },
    {
      id: 'webbruteforce',
      label: 'Bruteforce Web Login',
      icon: '🔑',
      category: 'Testes',
      description: 'Teste de força bruta em logins web'
    },
    {
      id: 'stresstest',
      label: 'Teste de Estresse DDoS',
      icon: '💥',
      category: 'Testes',
      description: 'Teste de disponibilidade sob carga'
    },
    {
      id: 'cyberlab',
      label: 'Laboratório Docker',
      icon: '🧪',
      category: 'Avançado',
      description: 'Ambiente prático com containers'
    },
    {
      id: 'pentesting',
      label: 'Modo Pentesting',
      icon: '🎯',
      category: 'Avançado',
      description: 'Testes de penetração'
    },
    {
      id: 'mapping',
      label: 'Mapeamento de Rede',
      icon: '🗺️',
      category: 'Avançado',
      description: 'Topologia e dispositivos'
    },
    {
      id: 'ports',
      label: 'Scanner de Portas',
      icon: '🔌',
      category: 'Avançado',
      description: 'Análise de portas abertas'
    },
    {
      id: 'packets',
      label: 'Análise de Pacotes',
      icon: '📡',
      category: 'Avançado',
      description: 'Captura e análise de tráfego'
    },
    {
      id: 'siteanalysis',
      label: 'Análise de Sites',
      icon: '🔍',
      category: 'Avançado',
      description: 'Web scraping e análise completa'
    },
    {
      id: 'ddos',
      label: 'Resiliência DDoS',
      icon: '🛡️',
      category: 'Avançado',
      description: 'Análise de proteções DDoS'
    },
    {
      id: 'networkmap',
      label: 'Mapa da Rede',
      icon: '🗺️',
      category: 'Gerenciamento',
      description: 'Dispositivos conectados'
    },
    {
      id: 'traffic',
      label: 'Monitor de Tráfego',
      icon: '📊',
      category: 'Gerenciamento',
      description: 'Consumo de dados por dispositivo'
    },
    {
      id: 'browsinghistory',
      label: 'Histórico de Navegação',
      icon: '🌐',
      category: 'Gerenciamento',
      description: 'Sites visitados por dispositivo'
    },
    {
      id: 'networkalerts',
      label: 'Alertas de Rede',
      icon: '🔔',
      category: 'Gerenciamento',
      description: 'Notificações e regras'
    },
    {
      id: 'accesscontrol',
      label: 'Controle de Acesso',
      icon: '🔐',
      category: 'Gerenciamento',
      description: 'Gerenciar dispositivos permitidos'
    },
    {
      id: 'siteblocker',
      label: 'Bloqueio de Sites',
      icon: '🚫',
      category: 'Gerenciamento',
      description: 'Controle parental e bloqueios'
    },
    {
      id: 'firewall',
      label: 'Firewall',
      icon: '🛡️',
      category: 'Gerenciamento',
      description: 'Regras de firewall'
    },
    {
      id: 'vulnscanner',
      label: 'Scanner de Vulnerabilidades',
      icon: '🔍',
      category: 'Gerenciamento',
      description: 'Escaneamento com Nmap'
    },
    {
      id: 'docs',
      label: 'Documentação',
      icon: '📚',
      category: 'Ajuda',
      description: 'Guias e documentação'
    }
  ];

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className={`App theme-dark ${pentestMode ? 'pentest-mode' : ''}`}>
      {/* Header com efeito glassmorphism */}
      <header className="app-header">
        <div className="header-content">
          <button
            className="hamburger-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="header-title">
            <div className="logo-container">
              <div className="logo-icon">🔐</div>
              <div>
                <h1>WiFi Security Testing Tool</h1>
                <p className="header-subtitle">Ferramenta Profissional de Análise de Segurança</p>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button
              className={`mode-toggle ${pentestMode ? 'active' : ''}`}
              onClick={() => setPentestMode(!pentestMode)}
              title="Modo Pentesting"
            >
              {pentestMode ? '🎯 Pentest ON' : '🎯 Pentest OFF'}
            </button>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>

        {pentestMode && (
          <div className="pentest-banner">
            <span className="warning-icon">⚠️</span>
            MODO PENTESTING ATIVO - USE APENAS EM REDES AUTORIZADAS
            <span className="warning-icon">⚠️</span>
          </div>
        )}
      </header>

      {/* Menu Lateral Hamburguer */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-sidebar" onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <div className="sidebar-content">
          {categories.map(category => (
            <div key={category} className="menu-category">
              <h3>{category}</h3>
              <div className="menu-items">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <button
                      key={item.id}
                      className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMenuOpen(false);
                      }}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <div className="menu-text">
                        <span className="menu-label">{item.label}</span>
                        <span className="menu-description">{item.description}</span>
                      </div>
                      {activeTab === item.id && <span className="active-indicator">●</span>}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="version-info">
            <span>v1.0.0 Professional</span>
            <span className="education-badge">🎓 Educacional</span>
          </div>
        </div>
      </div>

      {/* Overlay do Menu */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-home" onClick={() => setActiveTab('dashboard')}>Home</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">
          {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
        </span>
      </div>

      {/* Conteúdo Principal */}
      <div className="app-content">
        <div className="content-wrapper">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="tab-content fade-in">
              <ChartsDashboard api={api} />
            </div>
          )}

          {/* Bruteforce WiFi */}
          {activeTab === 'bruteforce' && (
            <div className="tab-content fade-in">
              <div className="section-header">
                <h2>🔓 Bruteforce WiFi</h2>
                <p>Teste de força bruta em redes WiFi (apenas uso educacional)</p>
              </div>
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

          {/* Bruteforce Web Login */}
          {activeTab === 'webbruteforce' && (
            <div className="tab-content fade-in">
              <WebBruteforce />
            </div>
          )}

          {/* Teste de Estresse DDoS */}
          {activeTab === 'stresstest' && (
            <div className="tab-content fade-in">
              <StressTest />
            </div>
          )}

          {/* Laboratório Docker */}
          {activeTab === 'cyberlab' && (
            <div className="tab-content fade-in">
              <CyberLab />
            </div>
          )}

          {/* Análise de Rede */}
          {activeTab === 'analysis' && (
            <div className="tab-content fade-in">
              <NetworkAnalysis api={api} />
            </div>
          )}

          {/* Scanner de Vulnerabilidades */}
          {activeTab === 'vulnerabilities' && (
            <div className="tab-content fade-in">
              <VulnerabilityScanner api={api} />
            </div>
          )}

          {/* Teste de Velocidade */}
          {activeTab === 'speed' && (
            <div className="tab-content fade-in">
              <SpeedTest api={api} />
            </div>
          )}

          {/* Monitor de Ataques */}
          {activeTab === 'attacks' && (
            <div className="tab-content fade-in">
              <AttackMonitor api={api} />
            </div>
          )}

          {/* Modo Pentesting */}
          {activeTab === 'pentesting' && (
            <div className="tab-content fade-in">
              <PentestingMode api={api} pentestMode={pentestMode} />
            </div>
          )}

          {/* Mapeamento de Rede */}
          {activeTab === 'mapping' && (
            <div className="tab-content fade-in">
              <NetworkMapping api={api} />
            </div>
          )}

          {/* Scanner de Portas */}
          {activeTab === 'ports' && (
            <div className="tab-content fade-in">
              <PortScanner api={api} />
            </div>
          )}

          {/* Análise de Pacotes */}
          {activeTab === 'packets' && (
            <div className="tab-content fade-in">
              <PacketAnalyzer api={api} />
            </div>
          )}

          {/* Análise de Sites */}
          {activeTab === 'siteanalysis' && (
            <div className="tab-content fade-in">
              <SiteAnalysis />
            </div>
          )}

          {/* Resiliência DDoS */}
          {activeTab === 'ddos' && (
            <div className="tab-content fade-in">
              <DDoSResilience />
            </div>
          )}

          {/* Mapa da Rede */}
          {activeTab === 'networkmap' && (
            <div className="tab-content fade-in">
              <NetworkMap />
            </div>
          )}

          {/* Monitor de Tráfego */}
          {activeTab === 'traffic' && (
            <div className="tab-content fade-in">
              <TrafficMonitor />
            </div>
          )}

          {/* Histórico de Navegação */}
          {activeTab === 'browsinghistory' && (
            <div className="tab-content fade-in">
              <BrowsingHistory />
            </div>
          )}

          {/* Alertas de Rede */}
          {activeTab === 'networkalerts' && (
            <div className="tab-content fade-in">
              <NetworkAlerts />
            </div>
          )}

          {/* Controle de Acesso */}
          {activeTab === 'accesscontrol' && (
            <div className="tab-content fade-in">
              <AccessControl />
            </div>
          )}

          {/* Bloqueio de Sites */}
          {activeTab === 'siteblocker' && (
            <div className="tab-content fade-in">
              <SiteBlocker />
            </div>
          )}

          {/* Firewall */}
          {activeTab === 'firewall' && (
            <div className="tab-content fade-in">
              <FirewallManager />
            </div>
          )}

          {/* Scanner de Vulnerabilidades */}
          {activeTab === 'vulnscanner' && (
            <div className="tab-content fade-in">
              <VulnerabilityScanner2 />
            </div>
          )}

          {/* Documentação */}
          {activeTab === 'docs' && (
            <div className="tab-content fade-in">
              <DocumentGenerator api={api} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>Desenvolvido para fins educacionais e testes de segurança autorizados</p>
          <div className="footer-links">
            <span>v1.0.0 - Professional IT Tool</span>
            <span>•</span>
            <span>© 2025 WiFi Security Testing Tool</span>
          </div>
        </div>
      </footer>

      {/* Particles Background Effect */}
      <div className="particles-background"></div>
    </div>
  );
}

export default App;
