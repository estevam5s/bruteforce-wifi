import React, { useState, useEffect } from 'react';
import { connectWebSocket } from '../services/websocket';
import LaboratoryView from './LaboratoryView';
import TerminalEmulator from './TerminalEmulator';
import ContainerSetupModal from './ContainerSetupModal';
import '../styles/CyberLabImproved.css';
import '../styles/CyberLab.css';

const CyberLab = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [pullProgress, setPullProgress] = useState({});
  const [terminalOutput, setTerminalOutput] = useState({});
  const [terminalInput, setTerminalInput] = useState('');
  const [containerStats, setContainerStats] = useState({});
  const [logs, setLogs] = useState({});
  const [activeView, setActiveView] = useState('laboratories'); // catalog, mycontainers, terminal, laboratories, learning
  const [dockerStatus, setDockerStatus] = useState({ available: null, checking: true });

  // Novos estados para laboratórios
  const [laboratories, setLaboratories] = useState([]);
  const [selectedLaboratory, setSelectedLaboratory] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const userId = 'user_default'; // Em produção, obter do sistema de autenticação

  // Estados para setup de container
  const [showContainerSetup, setShowContainerSetup] = useState(false);
  const [setupLaboratory, setSetupLaboratory] = useState(null);
  const [labContainer, setLabContainer] = useState(null);

  useEffect(() => {
    checkDockerStatus();
    loadTemplates();
    loadContainers();
    loadLaboratories();
    loadUserStats();

    const ws = connectWebSocket((message) => {
      handleWebSocketMessage(message);
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const checkDockerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cyberlab/status');
      const data = await response.json();
      setDockerStatus({ ...data, checking: false });
    } catch (error) {
      setDockerStatus({
        available: false,
        checking: false,
        error: 'Não foi possível conectar ao servidor',
        hint: 'Verifique se o servidor está rodando'
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeView === 'mycontainers' && containers.length > 0) {
        loadContainers();
        containers.forEach(c => {
          if (c.status === 'running') {
            loadContainerStats(c.id);
          }
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [activeView, containers]);

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'image_pull_progress':
        setPullProgress(prev => ({
          ...prev,
          [message.data.pullId]: message.data
        }));
        break;

      case 'image_pull_complete':
        setPullProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[message.data.pullId];
          return newProgress;
        });
        // Auto-criar container após pull
        if (message.data.containerName && message.data.templateId) {
          createContainer(message.data.templateId, message.data.containerName);
        }
        break;

      case 'image_pull_error':
        alert('Erro ao baixar imagem: ' + message.data.error);
        setPullProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[message.data.pullId];
          return newProgress;
        });
        break;

      case 'container_removed':
        loadContainers();
        break;

      default:
        break;
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cyberlab/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
      setCategories(['all', ...(data.categories || [])]);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
      setCategories(['all']);
    }
  };

  const loadLaboratories = async () => {
    try {
      console.log('🔍 Carregando laboratórios...');
      const response = await fetch('http://localhost:5000/api/cyberlab/laboratories');
      const data = await response.json();
      console.log('📚 Laboratórios recebidos:', data);
      if (data.success) {
        setLaboratories(data.laboratories || []);
        console.log('✅ Laboratórios definidos:', data.laboratories.length);
      }
    } catch (error) {
      console.error('❌ Error loading laboratories:', error);
      setLaboratories([]);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cyberlab/stats/${userId}`);
      const data = await response.json();
      if (data.success) {
        setUserStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const openLaboratory = async (labId) => {
    try {
      // Carregar dados do laboratório
      const labResponse = await fetch(`http://localhost:5000/api/cyberlab/laboratories/${labId}`);
      const labData = await labResponse.json();

      if (!labData.success) {
        throw new Error('Laboratório não encontrado');
      }

      const laboratory = labData.laboratory;

      // Verificar se já existe um container para este laboratório
      const containersResponse = await fetch('http://localhost:5000/api/cyberlab/containers');
      const containersData = await containersResponse.json();

      // Procurar container existente para este lab
      const existingContainer = containersData.containers?.find(c =>
        c.name.includes(`cyberlab-${labId}`) && c.status === 'running'
      );

      if (existingContainer) {
        // Container já existe e está rodando - ir direto para o aprendizado
        console.log('✅ Container existente encontrado:', existingContainer);
        setLabContainer(existingContainer);
        setSelectedContainer(existingContainer);
        setSelectedLaboratory(laboratory);
        setActiveView('learning');
      } else {
        // Precisa configurar o container
        console.log('🔧 Container não encontrado, abrindo modal de setup');
        setSetupLaboratory(laboratory);
        setShowContainerSetup(true);
      }
    } catch (error) {
      console.error('Error loading laboratory:', error);
      alert('Erro ao carregar laboratório: ' + error.message);
    }
  };

  const handleContainerReady = (container) => {
    console.log('✅ Container pronto:', container);
    setLabContainer(container);
    setSelectedContainer(container);
    setSelectedLaboratory(setupLaboratory);
    setShowContainerSetup(false);
    setActiveView('learning');
  };

  const handleCloseContainerSetup = () => {
    setShowContainerSetup(false);
    setSetupLaboratory(null);
  };

  const closeLaboratory = () => {
    setSelectedLaboratory(null);
    setActiveView('laboratories');
  };

  const loadContainers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cyberlab/containers');
      const data = await response.json();
      setContainers(data.containers || []);
    } catch (error) {
      console.error('Error loading containers:', error);
      setContainers([]);
    }
  };

  const createContainer = async (templateId, customName = null) => {
    try {
      const response = await fetch('http://localhost:5000/api/cyberlab/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          containerName: customName
        })
      });

      const data = await response.json();

      if (data.action === 'pull') {
        // Iniciar pull da imagem
        pullImage(data.image, data.name, templateId);
      } else if (data.success) {
        alert(`Container "${data.container.name}" criado com sucesso!`);
        loadContainers();
        setActiveView('mycontainers');
      }
    } catch (error) {
      alert('Erro ao criar container: ' + error.message);
    }
  };

  const pullImage = async (image, containerName, templateId) => {
    try {
      await fetch('http://localhost:5000/api/cyberlab/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, containerName, templateId })
      });
    } catch (error) {
      alert('Erro ao iniciar download: ' + error.message);
    }
  };

  const removeContainer = async (containerId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Tem certeza que deseja remover este container?')) return;

    try {
      await fetch(`http://localhost:5000/api/cyberlab/remove/${containerId}`, {
        method: 'DELETE'
      });
      loadContainers();
      if (selectedContainer?.id === containerId) {
        setSelectedContainer(null);
      }
    } catch (error) {
      alert('Erro ao remover container: ' + error.message);
    }
  };

  const loadContainerLogs = async (containerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cyberlab/logs/${containerId}`);
      const data = await response.json();
      setLogs(prev => ({ ...prev, [containerId]: data.logs }));
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const loadContainerStats = async (containerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cyberlab/stats/${containerId}`);
      const data = await response.json();
      if (data.success) {
        setContainerStats(prev => ({ ...prev, [containerId]: data.stats }));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const executeCommand = async (containerId, command) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cyberlab/exec/${containerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });

      const data = await response.json();

      setTerminalOutput(prev => ({
        ...prev,
        [containerId]: (prev[containerId] || '') + `$ ${command}\n${data.output}\n`
      }));
    } catch (error) {
      setTerminalOutput(prev => ({
        ...prev,
        [containerId]: (prev[containerId] || '') + `Error: ${error.message}\n`
      }));
    }
  };

  const handleTerminalSubmit = (e, containerId) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    executeCommand(containerId, terminalInput);
    setTerminalInput('');
  };

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="cyber-lab">
      <div className="lab-header">
        <div className="header-content">
          <div className="header-icon">🧪</div>
          <div className="header-text">
            <h2>Laboratório de Cibersegurança</h2>
            <p>Ambiente profissional para prática com containers Docker</p>
          </div>
        </div>
      </div>

      {/* Docker Status Warning */}
      {!dockerStatus.checking && !dockerStatus.available && (
        <div className="docker-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h3>Docker não está disponível</h3>
            <p>{dockerStatus.hint || dockerStatus.error}</p>
            <div className="warning-steps">
              <strong>Passos para resolver:</strong>
              <ol>
                <li>Abra o Docker Desktop</li>
                <li>Aguarde o Docker iniciar completamente</li>
                <li>Recarregue esta página</li>
              </ol>
            </div>
            <button onClick={checkDockerStatus} className="retry-btn">
              🔄 Verificar Novamente
            </button>
          </div>
        </div>
      )}

      {dockerStatus.checking && (
        <div className="docker-checking">
          <div className="spinner-large"></div>
          <p>Verificando Docker...</p>
        </div>
      )}

      {dockerStatus.available && dockerStatus.version && (
        <div className="docker-status-ok">
          <span className="status-icon">✅</span>
          Docker {dockerStatus.version} - {dockerStatus.containers} containers, {dockerStatus.images} imagens
        </div>
      )}

      <div className="lab-navigation">
        <button
          className={`nav-btn ${activeView === 'laboratories' ? 'active' : ''}`}
          onClick={() => setActiveView('laboratories')}
        >
          <span className="nav-icon">🎓</span>
          Laboratórios de Aprendizado
        </button>
        <button
          className={`nav-btn ${activeView === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveView('catalog')}
        >
          <span className="nav-icon">📚</span>
          Catálogo de Containers
        </button>
        <button
          className={`nav-btn ${activeView === 'mycontainers' ? 'active' : ''}`}
          onClick={() => setActiveView('mycontainers')}
        >
          <span className="nav-icon">🐳</span>
          Meus Containers ({containers.length})
        </button>
        <button
          className={`nav-btn ${activeView === 'terminal' ? 'active' : ''}`}
          onClick={() => setActiveView('terminal')}
          disabled={!selectedContainer}
        >
          <span className="nav-icon">💻</span>
          Terminal Interativo
        </button>
      </div>

      {/* Pull Progress */}
      {Object.keys(pullProgress).length > 0 && (
        <div className="pull-progress-container">
          {Object.entries(pullProgress).map(([pullId, progress]) => (
            <div key={pullId} className="pull-progress-card">
              <div className="pull-header">
                <span>📥 Baixando: {progress.image}</span>
                <span className="pull-status">{progress.status}</span>
              </div>
              {progress.progress && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: progress.progress }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CATALOG VIEW */}
      {activeView === 'catalog' && (
        <div className="catalog-view">
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          <div className="templates-grid">
            {filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-icon">{template.icon}</div>
                <h3>{template.name}</h3>
                <p className="template-category">{template.category}</p>
                <p className="template-description">{template.description}</p>
                <div className="template-image">{template.image}</div>
                <button
                  className="create-btn"
                  onClick={() => createContainer(template.id)}
                >
                  🚀 Criar Container
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY CONTAINERS VIEW */}
      {activeView === 'mycontainers' && (
        <div className="containers-view">
          {containers.length === 0 ? (
            <div className="no-containers">
              <div className="no-containers-icon">📦</div>
              <h3>Nenhum container ainda</h3>
              <p>Vá para o Catálogo e crie seu primeiro ambiente de prática!</p>
              <button className="goto-catalog-btn" onClick={() => setActiveView('catalog')}>
                Ir para Catálogo
              </button>
            </div>
          ) : (
            <div className="containers-grid">
              {containers.map(container => (
                <div key={container.id} className="container-card">
                  <div className="container-header">
                    <h3>{container.name}</h3>
                    <span className={`status-badge ${container.status}`}>
                      {container.status}
                    </span>
                  </div>

                  <div className="container-info">
                    <div className="info-row">
                      <span className="label">ID:</span>
                      <span className="value">{container.id}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Imagem:</span>
                      <span className="value">{container.image}</span>
                    </div>
                  </div>

                  {containerStats[container.id] && (
                    <div className="container-stats">
                      <div className="stat-item">
                        <span className="stat-label">CPU:</span>
                        <span className="stat-value">{containerStats[container.id].cpu}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Memória:</span>
                        <span className="stat-value">
                          {containerStats[container.id].memory.usage}MB /
                          {containerStats[container.id].memory.limit}MB
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="container-actions">
                    <button
                      className="action-btn terminal"
                      onClick={() => {
                        setSelectedContainer(container);
                        setActiveView('terminal');
                        loadContainerLogs(container.id);
                      }}
                      disabled={container.status !== 'running'}
                    >
                      💻 Terminal
                    </button>
                    <button
                      className="action-btn logs"
                      onClick={() => loadContainerLogs(container.id)}
                    >
                      📝 Logs
                    </button>
                    <button
                      className="action-btn remove"
                      onClick={() => removeContainer(container.id)}
                    >
                      🗑️ Remover
                    </button>
                  </div>

                  {logs[container.id] && (
                    <div className="container-logs">
                      <pre>{logs[container.id]}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TERMINAL VIEW */}
      {activeView === 'terminal' && selectedContainer && (
        <div className="terminal-view-wrapper">
          <TerminalEmulator containerId={selectedContainer.id} />
        </div>
      )}

      {/* LABORATORIES VIEW */}
      {activeView === 'laboratories' && (
        <div className="laboratories-view">
          {userStats && (
            <div className="user-stats-banner">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <div className="stat-value">{userStats.totalPoints}</div>
                  <div className="stat-label">Pontos Totais</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <div className="stat-value">{userStats.totalLabs}</div>
                  <div className="stat-label">Labs Iniciados</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{userStats.totalExercises}</div>
                  <div className="stat-label">Exercícios</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎖️</div>
                <div className="stat-info">
                  <div className="stat-value">{userStats.totalCertificates}</div>
                  <div className="stat-label">Certificados</div>
                </div>
              </div>
            </div>
          )}

          <div className="laboratories-grid">
            {laboratories.length === 0 ? (
              <div className="no-laboratories">
                <div className="no-labs-icon">📚</div>
                <h3>Carregando laboratórios...</h3>
                <p>Aguarde enquanto carregamos os laboratórios disponíveis.</p>
              </div>
            ) : (
              laboratories.map(lab => (
                <div key={lab.id} className="laboratory-card">
                  <div className="lab-card-icon">{lab.icon}</div>
                  <h3>{lab.name}</h3>
                  <p className="lab-card-category">{lab.category}</p>
                  <p className="lab-card-description">{lab.description}</p>
                  <div className="lab-card-meta">
                    <span className={`difficulty-badge ${lab.difficulty}`}>{lab.difficulty}</span>
                    <span className="duration-badge">⏱️ {lab.duration}</span>
                  </div>
                  <div className="lab-card-stats">
                    <span>📖 {lab.moduleCount} módulos</span>
                    <span>💻 {lab.challengeCount} desafios</span>
                  </div>
                  <button
                    className="start-lab-btn"
                    onClick={() => openLaboratory(lab.id)}
                  >
                    🚀 Iniciar Laboratório
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* LEARNING VIEW */}
      {activeView === 'learning' && selectedLaboratory && (
        <LaboratoryView
          laboratory={selectedLaboratory}
          containerId={labContainer?.id || selectedContainer?.id}
          userId={userId}
          onClose={closeLaboratory}
        />
      )}

      {/* CONTAINER SETUP MODAL */}
      {showContainerSetup && setupLaboratory && (
        <ContainerSetupModal
          laboratory={setupLaboratory}
          onClose={handleCloseContainerSetup}
          onContainerReady={handleContainerReady}
          existingContainer={null}
        />
      )}
    </div>
  );
};

export default CyberLab;
