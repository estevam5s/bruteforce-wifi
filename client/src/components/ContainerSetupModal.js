import React, { useState, useEffect } from 'react';
import '../styles/ContainerSetupModal.css';

const ContainerSetupModal = ({
  laboratory,
  onClose,
  onContainerReady,
  existingContainer
}) => {
  const [step, setStep] = useState('version'); // version, downloading, starting, ready
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [downloadStatus, setDownloadStatus] = useState('');
  const [containerInfo, setContainerInfo] = useState(null);
  const [error, setError] = useState(null);

  // Definir versões disponíveis para cada tipo de laboratório
  const versions = getVersionsForLab(laboratory.id);

  useEffect(() => {
    // Se já existe container, pular para etapa de verificação
    if (existingContainer) {
      setStep('ready');
      setContainerInfo(existingContainer);
    } else if (versions.length === 1) {
      // Se só tem uma versão, selecionar automaticamente
      setSelectedVersion(versions[0]);
    }
  }, [existingContainer, versions]);

  function getVersionsForLab(labId) {
    const versionMap = {
      python_cyber: [
        { id: 'python:3.11-slim', label: 'Python 3.11 (Recomendado)', size: '~150MB' },
        { id: 'python:3.10-slim', label: 'Python 3.10', size: '~145MB' },
        { id: 'python:3.9-slim', label: 'Python 3.9', size: '~140MB' }
      ],
      kali_tools: [
        { id: 'kalilinux/kali-rolling', label: 'Kali Linux Rolling', size: '~800MB' }
      ],
      network_security: [
        { id: 'linuxserver/wireshark:latest', label: 'Wireshark Latest', size: '~400MB' }
      ],
      web_security: [
        { id: 'owasp/zap2docker-stable', label: 'OWASP ZAP Stable', size: '~1GB' }
      ],
      docker_advanced: [
        { id: 'docker:dind', label: 'Docker in Docker', size: '~250MB' }
      ]
    };

    return versionMap[labId] || [
      { id: laboratory.image, label: 'Versão Padrão', size: '~200MB' }
    ];
  }

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
  };

  const handleStartSetup = async () => {
    if (!selectedVersion) {
      setError('Selecione uma versão antes de continuar');
      return;
    }

    setStep('downloading');
    setDownloading(true);
    setError(null);

    try {
      // Verificar se imagem existe
      const checkResponse = await fetch('http://localhost:5000/api/cyberlab/containers');
      const containersData = await checkResponse.json();

      // Criar nome único para o container
      const containerName = `cyberlab-${laboratory.id}-${Date.now()}`;

      // Criar container (isso vai fazer pull se necessário)
      const createResponse = await fetch('http://localhost:5000/api/cyberlab/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: laboratory.id,
          containerName,
          customImage: selectedVersion.id
        })
      });

      const createData = await createResponse.json();

      if (createData.action === 'pull') {
        // Precisa fazer download
        setDownloadStatus('Iniciando download...');
        await startImagePull(selectedVersion.id, containerName);
      } else if (createData.success) {
        // Container criado com sucesso
        setStep('ready');
        setContainerInfo(createData.container);
        setTimeout(() => {
          onContainerReady(createData.container);
        }, 1500);
      } else {
        throw new Error(createData.error || 'Erro ao criar container');
      }
    } catch (err) {
      setError(err.message);
      setStep('version');
      setDownloading(false);
    }
  };

  const startImagePull = async (image, containerName) => {
    return new Promise((resolve, reject) => {
      // Conectar ao WebSocket para receber progresso
      const ws = new WebSocket('ws://localhost:5000');

      ws.onopen = async () => {
        // Iniciar pull
        try {
          await fetch('http://localhost:5000/api/cyberlab/pull', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image,
              containerName,
              templateId: laboratory.id
            })
          });
        } catch (err) {
          reject(err);
        }
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'image_pull_progress') {
          const data = message.data;
          setDownloadStatus(data.status || 'Baixando...');

          if (data.progress) {
            // Extrair porcentagem do formato "50.5%"
            const percentage = parseFloat(data.progress.replace('%', ''));
            setProgress({
              current: percentage,
              total: 100,
              percentage: percentage
            });
          }
        } else if (message.type === 'image_pull_complete') {
          setStep('starting');
          setDownloadStatus('Download concluído! Iniciando container...');

          // Container será criado automaticamente
          setTimeout(async () => {
            try {
              const response = await fetch('http://localhost:5000/api/cyberlab/containers');
              const data = await response.json();
              const newContainer = data.containers.find(c => c.name === containerName);

              if (newContainer) {
                setStep('ready');
                setContainerInfo(newContainer);
                setTimeout(() => {
                  onContainerReady(newContainer);
                  ws.close();
                  resolve();
                }, 1500);
              }
            } catch (err) {
              reject(err);
            }
          }, 2000);
        } else if (message.type === 'image_pull_error') {
          setError(message.data.error);
          setStep('version');
          setDownloading(false);
          ws.close();
          reject(new Error(message.data.error));
        }
      };

      ws.onerror = (error) => {
        setError('Erro de conexão WebSocket');
        reject(error);
      };
    });
  };

  return (
    <div className="container-setup-modal-overlay">
      <div className="container-setup-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon">{laboratory.icon}</span>
            <h2>{laboratory.name}</h2>
          </div>
          {step === 'version' && (
            <button className="modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* STEP 1: Seleção de Versão */}
          {step === 'version' && (
            <div className="version-selection">
              <div className="step-indicator">
                <span className="step-number">1</span>
                <span className="step-label">Selecione a versão do ambiente</span>
              </div>

              <div className="versions-grid">
                {versions.map(version => (
                  <div
                    key={version.id}
                    className={`version-card ${selectedVersion?.id === version.id ? 'selected' : ''}`}
                    onClick={() => handleVersionSelect(version)}
                  >
                    <div className="version-check">
                      {selectedVersion?.id === version.id && <span>✓</span>}
                    </div>
                    <div className="version-info">
                      <h4>{version.label}</h4>
                      <p className="version-image">{version.id}</p>
                      <span className="version-size">Tamanho: {version.size}</span>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button
                  className="btn-primary"
                  onClick={handleStartSetup}
                  disabled={!selectedVersion}
                >
                  {selectedVersion ? '🚀 Continuar' : 'Selecione uma versão'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Download em Progresso */}
          {step === 'downloading' && (
            <div className="download-progress">
              <div className="step-indicator">
                <span className="step-number">2</span>
                <span className="step-label">Baixando ambiente</span>
              </div>

              <div className="download-animation">
                <div className="download-icon">📥</div>
                <div className="download-waves">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
              </div>

              <div className="progress-info">
                <div className="progress-status">{downloadStatus}</div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <div className="progress-percentage">{progress.percentage.toFixed(1)}%</div>
              </div>

              <div className="download-details">
                <p className="download-image">Imagem: {selectedVersion?.id}</p>
                <p className="download-tip">
                  💡 <strong>Dica:</strong> Este download acontece apenas uma vez.
                  Nas próximas vezes, o ambiente iniciará instantaneamente!
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Iniciando Container */}
          {step === 'starting' && (
            <div className="starting-container">
              <div className="step-indicator">
                <span className="step-number">3</span>
                <span className="step-label">Iniciando ambiente</span>
              </div>

              <div className="starting-animation">
                <div className="spinner-large"></div>
                <p>Configurando o ambiente...</p>
              </div>
            </div>
          )}

          {/* STEP 4: Pronto! */}
          {step === 'ready' && (
            <div className="container-ready">
              <div className="success-animation">
                <div className="success-icon">✅</div>
                <h3>Ambiente Pronto!</h3>
                <p>Seu laboratório está configurado e pronto para uso.</p>
              </div>

              {containerInfo && (
                <div className="container-details">
                  <div className="detail-row">
                    <span className="detail-label">Container:</span>
                    <span className="detail-value">{containerInfo.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value status-running">🟢 Rodando</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Imagem:</span>
                    <span className="detail-value">{containerInfo.image}</span>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-primary btn-large" onClick={() => onContainerReady(containerInfo)}>
                  🎓 Começar Aprendizado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContainerSetupModal;
