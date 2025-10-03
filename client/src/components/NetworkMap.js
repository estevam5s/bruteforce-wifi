import React, { useState, useEffect } from 'react';
import './NetworkMap.css';

const NetworkMap = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localIP, setLocalIP] = useState('');
  const [subnet, setSubnet] = useState('');

  const fetchNetworkMap = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/map');
      const data = await response.json();

      if (data.success) {
        setDevices(data.data.devices || []);
        setLocalIP(data.data.localIP || '');
        setSubnet(data.data.subnet || '');
      }
    } catch (error) {
      console.error('Erro ao buscar mapa da rede:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkMap();
    const interval = setInterval(fetchNetworkMap, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (type) => {
    const icons = {
      computer: '💻',
      smartphone: '📱',
      router: '🌐',
      tv: '📺',
      printer: '🖨️',
      iot: '🔌',
      unknown: '❓'
    };
    return icons[type] || icons.unknown;
  };

  return (
    <div className="network-map">
      <div className="network-map-header">
        <h2>🗺️ Mapa da Rede</h2>
        <button onClick={fetchNetworkMap} disabled={loading}>
          {loading ? 'Escaneando...' : '🔄 Atualizar'}
        </button>
      </div>

      <div className="network-info">
        <div className="info-item">
          <strong>IP Local:</strong> {localIP}
        </div>
        <div className="info-item">
          <strong>Sub-rede:</strong> {subnet}.0/24
        </div>
        <div className="info-item">
          <strong>Dispositivos:</strong> {devices.length}
        </div>
      </div>

      {loading && devices.length === 0 ? (
        <div className="loading">Escaneando rede...</div>
      ) : (
        <div className="devices-grid">
          {devices.map((device, index) => (
            <div key={index} className={`device-card ${device.status}`}>
              <div className="device-icon">{getDeviceIcon(device.type)}</div>
              <div className="device-info">
                <div className="device-ip">{device.ip}</div>
                <div className="device-mac">{device.mac}</div>
                {device.hostname && (
                  <div className="device-hostname">{device.hostname}</div>
                )}
                <div className="device-vendor">{device.vendor}</div>
                <div className="device-type">{device.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && devices.length === 0 && (
        <div className="no-devices">
          Nenhum dispositivo encontrado. Clique em "Atualizar" para escanear.
        </div>
      )}
    </div>
  );
};

export default NetworkMap;
