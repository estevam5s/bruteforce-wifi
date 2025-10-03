import React, { useState, useEffect } from 'react';
import './TrafficMonitor.css';

const TrafficMonitor = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTraffic = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/traffic');
      const data = await response.json();

      if (data.success) {
        setDevices(data.data.devices || []);
      }
    } catch (error) {
      console.error('Erro ao buscar tráfego:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  const getPercentageColor = (percentage) => {
    if (percentage > 50) return '#ff0000';
    if (percentage > 25) return '#ffaa00';
    return '#00ff00';
  };

  return (
    <div className="traffic-monitor">
      <div className="traffic-header">
        <h2>📊 Monitoramento de Tráfego</h2>
        <button onClick={fetchTraffic} disabled={loading}>
          {loading ? 'Atualizando...' : '🔄 Atualizar'}
        </button>
      </div>

      {loading && devices.length === 0 ? (
        <div className="loading">Carregando dados de tráfego...</div>
      ) : (
        <div className="traffic-list">
          {devices.map((device, index) => (
            <div key={index} className="traffic-item">
              <div className="traffic-ip">
                <div className="ip-address">{device.ip}</div>
                <div className="traffic-percentage" style={{ color: getPercentageColor(parseFloat(device.percentage)) }}>
                  {device.percentage}% do tráfego total
                </div>
              </div>

              <div className="traffic-stats">
                <div className="stat-item">
                  <span className="stat-label">⬇️ Download:</span>
                  <span className="stat-value">{device.formattedIn}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">⬆️ Upload:</span>
                  <span className="stat-value">{device.formattedOut}</span>
                </div>
                <div className="stat-item total">
                  <span className="stat-label">📦 Total:</span>
                  <span className="stat-value">{device.formattedTotal}</span>
                </div>
              </div>

              <div className="traffic-bar">
                <div
                  className="traffic-fill"
                  style={{
                    width: `${device.percentage}%`,
                    background: getPercentageColor(parseFloat(device.percentage))
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && devices.length === 0 && (
        <div className="no-traffic">
          Nenhum tráfego detectado no momento.
        </div>
      )}
    </div>
  );
};

export default TrafficMonitor;
