import React, { useState } from 'react';
import '../styles/DocumentGenerator.css';

function DocumentGenerator({ api }) {
  const [loading, setLoading] = useState(false);
  const [documentation, setDocumentation] = useState(null);
  const [userGuide, setUserGuide] = useState(null);
  const [activeTab, setActiveTab] = useState('documentation');

  const loadDocumentation = async () => {
    setLoading(true);
    try {
      const response = await api.getDocumentation();
      if (response.success) {
        setDocumentation(response.data);
        setActiveTab('documentation');
      }
    } catch (err) {
      console.error('Erro ao carregar documentação:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserGuide = async () => {
    setLoading(true);
    try {
      const response = await api.getUserGuide();
      if (response.success) {
        setUserGuide(response.data);
        setActiveTab('userGuide');
      }
    } catch (err) {
      console.error('Erro ao carregar guia:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    // Criar relatório com dados do sistema
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  return (
    <div className="document-generator">
      <div className="doc-header">
        <h2>📄 Documentação do Sistema</h2>
        <div className="doc-actions">
          <button className="btn-doc" onClick={loadDocumentation} disabled={loading}>
            📚 Documentação Técnica
          </button>
          <button className="btn-doc" onClick={loadUserGuide} disabled={loading}>
            📖 Guia do Usuário
          </button>
          <button className="btn-doc export" onClick={exportReport}>
            📥 Exportar Relatório
          </button>
        </div>
      </div>

      {loading && (
        <div className="doc-loading">⏳ Carregando documentação...</div>
      )}

      {/* Documentação Técnica */}
      {documentation && activeTab === 'documentation' && (
        <div className="doc-content">
          <div className="doc-title">
            <h1>{documentation.title}</h1>
            <div className="doc-meta">
              <span>Versão: {documentation.version}</span>
              <span>Gerado em: {new Date(documentation.generated).toLocaleString('pt-BR')}</span>
            </div>
          </div>

          {documentation.sections.map((section, idx) => (
            <div key={idx} className="doc-section">
              <h2>{section.title}</h2>

              {section.content && (
                <p className="section-content">{section.content}</p>
              )}

              {section.features && (
                <div className="features-list">
                  {section.features.map((feature, fIdx) => (
                    <div key={fIdx} className="feature-item">
                      <h3>{feature.name}</h3>
                      <p>{feature.description}</p>
                      {feature.endpoints && (
                        <div className="feature-endpoints">
                          <strong>Endpoints:</strong>
                          <ul>
                            {feature.endpoints.map((endpoint, eIdx) => (
                              <li key={eIdx}><code>{endpoint}</code></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.endpoints && (
                <div className="endpoints-list">
                  {section.endpoints.map((endpoint, eIdx) => (
                    <div key={eIdx} className="endpoint-item">
                      <div className="endpoint-header">
                        <span className={`method method-${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <code className="endpoint-path">{endpoint.path}</code>
                      </div>
                      <p className="endpoint-description">{endpoint.description}</p>
                      {endpoint.parameters && (
                        <div className="endpoint-params">
                          <strong>Parâmetros:</strong>
                          <pre>{JSON.stringify(endpoint.parameters, null, 2)}</pre>
                        </div>
                      )}
                      {endpoint.response && (
                        <div className="endpoint-response">
                          <strong>Resposta:</strong>
                          <p>{endpoint.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.steps && (
                <div className="steps-list">
                  {section.steps.map((step, sIdx) => (
                    <div key={sIdx} className="step-item">
                      <div className="step-number">{step.step}</div>
                      <div className="step-content">
                        <h3>{step.title}</h3>
                        <ol>
                          {step.instructions.map((instruction, iIdx) => (
                            <li key={iIdx}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.warnings && (
                <div className="warnings-section">
                  <div className="warning-icon">⚠️</div>
                  <ul>
                    {section.warnings.map((warning, wIdx) => (
                      <li key={wIdx} className="warning-item">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {section.requirements && (
                <div className="requirements-section">
                  <dl>
                    <dt>Sistema Operacional:</dt>
                    <dd>{section.requirements.os}</dd>
                    <dt>Node.js:</dt>
                    <dd>{section.requirements.node}</dd>
                    <dt>npm:</dt>
                    <dd>{section.requirements.npm}</dd>
                    <dt>Permissões:</dt>
                    <dd>{section.requirements.permissions}</dd>
                    <dt>Rede:</dt>
                    <dd>{section.requirements.network}</dd>
                  </dl>
                </div>
              )}

              {section.contact && (
                <div className="contact-section">
                  <p><strong>Repositório:</strong> <a href={section.contact.repository}>{section.contact.repository}</a></p>
                  <p><strong>Issues:</strong> {section.contact.issues}</p>
                  <p><strong>Documentação:</strong> {section.contact.documentation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Guia do Usuário */}
      {userGuide && activeTab === 'userGuide' && (
        <div className="doc-content user-guide">
          <div className="doc-title">
            <h1>{userGuide.title}</h1>
            <div className="doc-meta">
              <span>Versão: {userGuide.version}</span>
            </div>
          </div>

          {userGuide.sections.map((section, idx) => (
            <div key={idx} className="guide-section">
              <h2>{section.title}</h2>

              {section.content && (
                <p className="section-content">{section.content}</p>
              )}

              {section.components && (
                <div className="components-grid">
                  {section.components.map((component, cIdx) => (
                    <div key={cIdx} className="component-card">
                      <h3>{component.name}</h3>
                      <p>{component.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.tips && (
                <div className="tips-list">
                  {section.tips.map((tip, tIdx) => (
                    <div key={tIdx} className="tip-card">
                      <span className="tip-icon">💡</span>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.guide && (
                <div className="interpretation-guide">
                  {Object.entries(section.guide).map(([key, value], gIdx) => (
                    <div key={gIdx} className="guide-item">
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!documentation && !userGuide && !loading && (
        <div className="doc-empty">
          <div className="empty-icon">📚</div>
          <h3>Documentação do Sistema</h3>
          <p>Selecione uma opção acima para visualizar a documentação</p>
          <div className="quick-links">
            <button className="quick-link" onClick={loadDocumentation}>
              <span className="link-icon">📄</span>
              <div>
                <strong>Documentação Técnica</strong>
                <p>API, arquitetura e especificações</p>
              </div>
            </button>
            <button className="quick-link" onClick={loadUserGuide}>
              <span className="link-icon">📖</span>
              <div>
                <strong>Guia do Usuário</strong>
                <p>Como usar o sistema</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentGenerator;
