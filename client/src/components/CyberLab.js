import React, { useState, useEffect } from 'react';
import { connectWebSocket } from '../services/websocket';
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
  const [activeView, setActiveView] = useState('catalog'); // catalog, mycontainers, terminal
  const [dockerStatus, setDockerStatus] = useState({ available: null, checking: true });

  useEffect(() => {
    checkDockerStatus();
    loadTemplates();
    loadContainers();

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

      <div className="lab-navigation">
        <button
          className={`nav-btn ${activeView === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveView('catalog')}
        >
          <span className="nav-icon">📚</span>
          Catálogo de Ambientes
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
        <div className="terminal-view">
          <div className="terminal-header">
            <div className="terminal-title">
              <span className="terminal-icon">💻</span>
              Terminal: {selectedContainer.name}
            </div>
            <button
              className="close-terminal-btn"
              onClick={() => setActiveView('mycontainers')}
            >
              ✕
            </button>
          </div>

          <div className="terminal-output">
            <pre>{terminalOutput[selectedContainer.id] || 'Terminal pronto. Digite comandos abaixo.\n'}</pre>
          </div>

          <form
            className="terminal-input-form"
            onSubmit={(e) => handleTerminalSubmit(e, selectedContainer.id)}
          >
            <span className="terminal-prompt">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="terminal-input"
              placeholder="Digite um comando..."
              autoFocus
            />
            <button type="submit" className="terminal-submit">
              Executar
            </button>
          </form>

          <div className="terminal-help">
            <strong>Comandos úteis:</strong> ls, pwd, cd, cat, echo, python, node, etc.
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberLab;
