import React, { useState, useEffect } from 'react';
import './BrowsingHistory.css';

const BrowsingHistory = () => {
  const [history, setHistory] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [filters, setFilters] = useState({
    device: '',
    startDate: '',
    endDate: ''
  });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.device) params.append('device', filters.device);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`http://localhost:5000/api/netmgmt/history?${params}`);
      const data = await response.json();

      if (data.success) {
        setHistory(data.data.history || []);
        setDevices(data.data.devices || []);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCapture = async () => {
    setCapturing(true);
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/history/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 60, interface: 'en0' })
      });
      const data = await response.json();

      if (data.success) {
        alert('Captura iniciada por 60 segundos');
        setTimeout(() => {
          fetchHistory();
          setCapturing(false);
        }, 61000);
      }
    } catch (error) {
      console.error('Erro ao iniciar captura:', error);
      setCapturing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    fetchHistory();
  };

  const clearFilters = () => {
    setFilters({ device: '', startDate: '', endDate: '' });
    setTimeout(fetchHistory, 100);
  };

  return (
    <div className="browsing-history">
      <div className="history-header">
        <h2>🌐 Histórico de Navegação</h2>
        <div className="header-actions">
          <button onClick={startCapture} disabled={capturing}>
            {capturing ? '⏳ Capturando...' : '📡 Iniciar Captura'}
          </button>
          <button onClick={fetchHistory} disabled={loading}>
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Dispositivo:</label>
          <select name="device" value={filters.device} onChange={handleFilterChange}>
            <option value="">Todos</option>
            {devices.map((device, idx) => (
              <option key={idx} value={device}>{device}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Data Início:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Data Fim:</label>
          <input
            type="datetime-local"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-actions">
          <button onClick={applyFilters}>Filtrar</button>
          <button onClick={clearFilters} className="clear-btn">Limpar</button>
        </div>
      </div>

      {loading && history.length === 0 ? (
        <div className="loading">Carregando histórico...</div>
      ) : (
        <div className="history-list">
          <div className="history-stats">
            <span>Total de registros: {history.length}</span>
          </div>

          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-time">
                {new Date(item.timestamp).toLocaleString('pt-BR')}
              </div>
              <div className="history-device">
                <span className="label">Dispositivo:</span>
                <span className="value">{item.device}</span>
              </div>
              <div className="history-url">
                <span className={`protocol ${item.protocol.toLowerCase()}`}>
                  {item.protocol}
                </span>
                <span className="url">{item.url}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="no-history">
          <p>Nenhum histórico registrado.</p>
          <p>Clique em "Iniciar Captura" para começar a monitorar.</p>
        </div>
      )}
    </div>
  );
};

export default BrowsingHistory;
