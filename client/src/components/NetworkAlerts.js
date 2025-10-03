import React, { useState, useEffect } from 'react';
import './NetworkAlerts.css';

const NetworkAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    type: 'new_device',
    threshold: '',
    email: '',
    pushNotification: false
  });

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/alerts');
      const data = await response.json();

      if (data.success) {
        setAlerts(data.data.alerts || []);
        setRules(data.data.rules || []);
      }
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRule = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/alerts/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      const data = await response.json();

      if (data.success) {
        alert('Regra criada com sucesso!');
        setShowNewRule(false);
        setNewRule({
          type: 'new_device',
          threshold: '',
          email: '',
          pushNotification: false
        });
        fetchAlerts();
      }
    } catch (error) {
      console.error('Erro ao criar regra:', error);
      alert('Erro ao criar regra');
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta regra?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/netmgmt/alerts/rules/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        alert('Regra removida com sucesso!');
        fetchAlerts();
      }
    } catch (error) {
      console.error('Erro ao remover regra:', error);
      alert('Erro ao remover regra');
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    const icons = {
      new_device: '🆕',
      traffic_limit: '⚠️',
      suspicious_activity: '🚨'
    };
    return icons[type] || '📢';
  };

  const getRuleTypeLabel = (type) => {
    const labels = {
      new_device: 'Novo Dispositivo',
      traffic_limit: 'Limite de Tráfego',
      suspicious_activity: 'Atividade Suspeita'
    };
    return labels[type] || type;
  };

  return (
    <div className="network-alerts">
      <div className="alerts-header">
        <h2>🔔 Alertas e Notificações</h2>
        <div className="header-actions">
          <button onClick={() => setShowNewRule(!showNewRule)}>
            {showNewRule ? '✖ Cancelar' : '➕ Nova Regra'}
          </button>
          <button onClick={fetchAlerts} disabled={loading}>
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {showNewRule && (
        <div className="new-rule-form">
          <h3>Nova Regra de Alerta</h3>

          <div className="form-group">
            <label>Tipo de Alerta:</label>
            <select
              value={newRule.type}
              onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
            >
              <option value="new_device">Novo Dispositivo</option>
              <option value="traffic_limit">Limite de Tráfego</option>
              <option value="suspicious_activity">Atividade Suspeita</option>
            </select>
          </div>

          {newRule.type === 'traffic_limit' && (
            <div className="form-group">
              <label>Limite (MB):</label>
              <input
                type="number"
                value={newRule.threshold}
                onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
                placeholder="Ex: 1000"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email para Notificação:</label>
            <input
              type="email"
              value={newRule.email}
              onChange={(e) => setNewRule({ ...newRule, email: e.target.value })}
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={newRule.pushNotification}
                onChange={(e) => setNewRule({ ...newRule, pushNotification: e.target.checked })}
              />
              Ativar Notificação Push
            </label>
          </div>

          <button onClick={createRule} className="create-btn">
            Criar Regra
          </button>
        </div>
      )}

      <div className="alerts-content">
        <div className="rules-section">
          <h3>Regras Ativas ({rules.length})</h3>
          {rules.length === 0 ? (
            <div className="empty-state">Nenhuma regra configurada</div>
          ) : (
            <div className="rules-list">
              {rules.map((rule) => (
                <div key={rule.id} className="rule-item">
                  <div className="rule-info">
                    <div className="rule-type">
                      {getAlertIcon(rule.type)} {getRuleTypeLabel(rule.type)}
                    </div>
                    {rule.threshold && (
                      <div className="rule-threshold">Limite: {rule.threshold} MB</div>
                    )}
                    {rule.email && (
                      <div className="rule-email">📧 {rule.email}</div>
                    )}
                    {rule.pushNotification && (
                      <div className="rule-push">📱 Push ativado</div>
                    )}
                  </div>
                  <div className="rule-actions">
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="alerts-section">
          <h3>Alertas Recentes ({alerts.length})</h3>
          {alerts.length === 0 ? (
            <div className="empty-state">Nenhum alerta registrado</div>
          ) : (
            <div className="alerts-list">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`alert-item ${alert.severity}`}>
                  <div className="alert-icon">{getAlertIcon(alert.type)}</div>
                  <div className="alert-info">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">
                      {new Date(alert.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkAlerts;
