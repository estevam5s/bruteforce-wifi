import React, { useState, useEffect } from 'react';
import './FirewallManager.css';

const FirewallManager = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    action: 'deny',
    protocol: 'tcp',
    sourceIP: '',
    sourcePort: '',
    destIP: '',
    destPort: '',
    description: ''
  });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/firewall');
      const data = await response.json();

      if (data.success) {
        setRules(data.data.rules || []);
      }
    } catch (error) {
      console.error('Erro ao buscar regras:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRule = async () => {
    if (!newRule.action || !newRule.protocol) {
      alert('Action e Protocol são obrigatórios');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/firewall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      const data = await response.json();

      if (data.success) {
        alert('Regra criada com sucesso!');
        setShowNewRule(false);
        setNewRule({
          action: 'deny',
          protocol: 'tcp',
          sourceIP: '',
          sourcePort: '',
          destIP: '',
          destPort: '',
          description: ''
        });
        fetchRules();
      }
    } catch (error) {
      console.error('Erro ao criar regra:', error);
      alert('Erro ao criar regra');
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta regra?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/netmgmt/firewall/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        alert('Regra removida com sucesso!');
        fetchRules();
      }
    } catch (error) {
      console.error('Erro ao remover regra:', error);
      alert('Erro ao remover regra');
    }
  };

  const toggleRule = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/netmgmt/firewall/${id}/toggle`, {
        method: 'PUT'
      });
      const data = await response.json();

      if (data.success) {
        fetchRules();
      }
    } catch (error) {
      console.error('Erro ao alternar regra:', error);
      alert('Erro ao alternar regra');
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const getActionColor = (action) => {
    const colors = {
      allow: '#00ff00',
      deny: '#ff0000',
      reject: '#ff6600'
    };
    return colors[action] || '#888';
  };

  const getActionIcon = (action) => {
    const icons = {
      allow: '✅',
      deny: '🚫',
      reject: '⛔'
    };
    return icons[action] || '❓';
  };

  return (
    <div className="firewall-manager">
      <div className="firewall-header">
        <h2>🛡️ Firewall</h2>
        <div className="header-actions">
          <button onClick={() => setShowNewRule(!showNewRule)}>
            {showNewRule ? '✖ Cancelar' : '➕ Nova Regra'}
          </button>
          <button onClick={fetchRules} disabled={loading}>
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {showNewRule && (
        <div className="rule-form">
          <h3>Nova Regra de Firewall</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Ação:</label>
              <select
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
              >
                <option value="allow">✅ Allow (Permitir)</option>
                <option value="deny">🚫 Deny (Negar)</option>
                <option value="reject">⛔ Reject (Rejeitar)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Protocolo:</label>
              <select
                value={newRule.protocol}
                onChange={(e) => setNewRule({ ...newRule, protocol: e.target.value })}
              >
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
                <option value="icmp">ICMP</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>IP Origem:</label>
              <input
                type="text"
                value={newRule.sourceIP}
                onChange={(e) => setNewRule({ ...newRule, sourceIP: e.target.value })}
                placeholder="192.168.1.100 ou 'any'"
              />
            </div>

            <div className="form-group">
              <label>Porta Origem:</label>
              <input
                type="text"
                value={newRule.sourcePort}
                onChange={(e) => setNewRule({ ...newRule, sourcePort: e.target.value })}
                placeholder="80 ou 'any'"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>IP Destino:</label>
              <input
                type="text"
                value={newRule.destIP}
                onChange={(e) => setNewRule({ ...newRule, destIP: e.target.value })}
                placeholder="192.168.1.200 ou 'any'"
              />
            </div>

            <div className="form-group">
              <label>Porta Destino:</label>
              <input
                type="text"
                value={newRule.destPort}
                onChange={(e) => setNewRule({ ...newRule, destPort: e.target.value })}
                placeholder="443 ou 'any'"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição:</label>
            <input
              type="text"
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              placeholder="Ex: Bloquear tráfego SSH externo"
            />
          </div>

          <button onClick={createRule} className="create-btn">
            Criar Regra
          </button>
        </div>
      )}

      <div className="rules-list">
        {rules.length === 0 ? (
          <div className="empty-state">
            Nenhuma regra de firewall configurada. Clique em "Nova Regra" para adicionar.
          </div>
        ) : (
          <div className="rules-table">
            <div className="table-header">
              <div className="col-status">Status</div>
              <div className="col-action">Ação</div>
              <div className="col-protocol">Protocolo</div>
              <div className="col-source">Origem</div>
              <div className="col-dest">Destino</div>
              <div className="col-desc">Descrição</div>
              <div className="col-actions">Ações</div>
            </div>

            {rules.map((rule) => (
              <div key={rule.id} className={`table-row ${rule.enabled ? 'enabled' : 'disabled'}`}>
                <div className="col-status">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`toggle-btn ${rule.enabled ? 'on' : 'off'}`}
                  >
                    {rule.enabled ? '🟢' : '🔴'}
                  </button>
                </div>

                <div className="col-action">
                  <span
                    className="action-badge"
                    style={{ backgroundColor: getActionColor(rule.action) }}
                  >
                    {getActionIcon(rule.action)} {rule.action.toUpperCase()}
                  </span>
                </div>

                <div className="col-protocol">
                  <span className="protocol-badge">{rule.protocol.toUpperCase()}</span>
                </div>

                <div className="col-source">
                  <div className="endpoint">
                    <span className="ip">{rule.sourceIP}</span>
                    <span className="port">:{rule.sourcePort}</span>
                  </div>
                </div>

                <div className="col-dest">
                  <div className="endpoint">
                    <span className="ip">{rule.destIP}</span>
                    <span className="port">:{rule.destPort}</span>
                  </div>
                </div>

                <div className="col-desc">
                  {rule.description || '-'}
                </div>

                <div className="col-actions">
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="delete-btn"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirewallManager;
