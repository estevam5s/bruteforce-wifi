import React, { useState, useEffect } from 'react';
import './AccessControl.css';

const AccessControl = () => {
  const [whitelist, setWhitelist] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(null); // 'allow' or 'block'
  const [deviceForm, setDeviceForm] = useState({
    mac: '',
    name: '',
    reason: ''
  });

  const fetchAccessControl = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/access-control');
      const data = await response.json();

      if (data.success) {
        setWhitelist(data.data.whitelist || []);
        setBlacklist(data.data.blacklist || []);
      }
    } catch (error) {
      console.error('Erro ao buscar controle de acesso:', error);
    } finally {
      setLoading(false);
    }
  };

  const allowDevice = async () => {
    if (!deviceForm.mac) {
      alert('MAC address é obrigatório');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/access-control/allow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mac: deviceForm.mac,
          name: deviceForm.name
        })
      });
      const data = await response.json();

      if (data.success) {
        alert('Dispositivo permitido com sucesso!');
        setShowAddForm(null);
        setDeviceForm({ mac: '', name: '', reason: '' });
        fetchAccessControl();
      }
    } catch (error) {
      console.error('Erro ao permitir dispositivo:', error);
      alert('Erro ao permitir dispositivo');
    }
  };

  const blockDevice = async () => {
    if (!deviceForm.mac) {
      alert('MAC address é obrigatório');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/access-control/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceForm)
      });
      const data = await response.json();

      if (data.success) {
        alert('Dispositivo bloqueado com sucesso!');
        setShowAddForm(null);
        setDeviceForm({ mac: '', name: '', reason: '' });
        fetchAccessControl();
      }
    } catch (error) {
      console.error('Erro ao bloquear dispositivo:', error);
      alert('Erro ao bloquear dispositivo');
    }
  };

  useEffect(() => {
    fetchAccessControl();
  }, []);

  return (
    <div className="access-control">
      <div className="access-header">
        <h2>🔐 Controle de Acesso</h2>
        <button onClick={fetchAccessControl} disabled={loading}>
          {loading ? 'Atualizando...' : '🔄 Atualizar'}
        </button>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => setShowAddForm(showAddForm === 'allow' ? null : 'allow')}
          className="allow-btn"
        >
          {showAddForm === 'allow' ? '✖ Cancelar' : '✅ Permitir Dispositivo'}
        </button>
        <button
          onClick={() => setShowAddForm(showAddForm === 'block' ? null : 'block')}
          className="block-btn"
        >
          {showAddForm === 'block' ? '✖ Cancelar' : '🚫 Bloquear Dispositivo'}
        </button>
      </div>

      {showAddForm && (
        <div className={`device-form ${showAddForm}`}>
          <h3>{showAddForm === 'allow' ? 'Permitir Dispositivo' : 'Bloquear Dispositivo'}</h3>

          <div className="form-group">
            <label>MAC Address:</label>
            <input
              type="text"
              value={deviceForm.mac}
              onChange={(e) => setDeviceForm({ ...deviceForm, mac: e.target.value })}
              placeholder="00:11:22:33:44:55"
            />
          </div>

          <div className="form-group">
            <label>Nome do Dispositivo:</label>
            <input
              type="text"
              value={deviceForm.name}
              onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
              placeholder="Ex: iPhone do João"
            />
          </div>

          {showAddForm === 'block' && (
            <div className="form-group">
              <label>Motivo do Bloqueio:</label>
              <input
                type="text"
                value={deviceForm.reason}
                onChange={(e) => setDeviceForm({ ...deviceForm, reason: e.target.value })}
                placeholder="Ex: Dispositivo não autorizado"
              />
            </div>
          )}

          <button
            onClick={showAddForm === 'allow' ? allowDevice : blockDevice}
            className={`submit-btn ${showAddForm}`}
          >
            {showAddForm === 'allow' ? 'Permitir' : 'Bloquear'}
          </button>
        </div>
      )}

      <div className="access-lists">
        <div className="list-section whitelist-section">
          <h3>✅ Dispositivos Permitidos ({whitelist.length})</h3>
          {whitelist.length === 0 ? (
            <div className="empty-state">Nenhum dispositivo na lista de permissões</div>
          ) : (
            <div className="devices-list">
              {whitelist.map((device, idx) => (
                <div key={idx} className="device-item allowed">
                  <div className="device-icon">✅</div>
                  <div className="device-info">
                    <div className="device-name">{device.name}</div>
                    <div className="device-mac">{device.mac}</div>
                    <div className="device-date">
                      Adicionado: {new Date(device.addedAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="list-section blacklist-section">
          <h3>🚫 Dispositivos Bloqueados ({blacklist.length})</h3>
          {blacklist.length === 0 ? (
            <div className="empty-state">Nenhum dispositivo bloqueado</div>
          ) : (
            <div className="devices-list">
              {blacklist.map((device, idx) => (
                <div key={idx} className="device-item blocked">
                  <div className="device-icon">🚫</div>
                  <div className="device-info">
                    <div className="device-name">{device.name}</div>
                    <div className="device-mac">{device.mac}</div>
                    {device.reason && (
                      <div className="device-reason">Motivo: {device.reason}</div>
                    )}
                    <div className="device-date">
                      Bloqueado: {new Date(device.blockedAt).toLocaleString('pt-BR')}
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

export default AccessControl;
