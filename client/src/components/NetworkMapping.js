import React, { useState, useEffect } from 'react';
import '../styles/NetworkMapping.css';

function NetworkMapping({ api }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapNetwork = async () => {
    setLoading(true);
    try {
      const response = await api.getConnectedDevices();
      if (response.success) {
        setDevices(response.data.devices || []);
      }
    } catch (error) {
      console.error('Erro ao mapear rede:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mapNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="network-mapping">
      <div className="mapping-header">
        <h2>🗺️ Mapeamento de Rede</h2>
        <button onClick={mapNetwork} disabled={loading}>
          {loading ? '⏳ Mapeando...' : '🔄 Atualizar'}
        </button>
      </div>

      <div className="devices-map">
        {devices.map((device, idx) => (
          <div key={idx} className="device-node">
            <div className="device-icon">📱</div>
            <div className="device-details">
              <div><strong>IP:</strong> {device.ip}</div>
              <div><strong>MAC:</strong> {device.mac}</div>
              <div><strong>Vendor:</strong> {device.vendor}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NetworkMapping;
