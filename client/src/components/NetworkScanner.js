import React, { useState, useEffect } from 'react';
import { scanNetworks } from '../services/api';
import './NetworkScanner.css';

function NetworkScanner({ selectedNetwork, onSelectNetwork, disabled }) {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await scanNetworks();
      setNetworks(result.networks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleScan();
  }, []);

  const getSignalStrength = (rssi) => {
    if (rssi >= -50) return { label: 'Excelente', class: 'excellent' };
    if (rssi >= -60) return { label: 'Bom', class: 'good' };
    if (rssi >= -70) return { label: 'Regular', class: 'fair' };
    return { label: 'Fraco', class: 'poor' };
  };

  return (
    <div className="card network-scanner">
      <h2>📡 Redes WiFi Disponíveis</h2>

      <div className="scanner-actions">
        <button
          className="btn btn-primary"
          onClick={handleScan}
          disabled={loading || disabled}
        >
          {loading ? <span className="loading"></span> : '🔄'}
          {loading ? ' Escaneando...' : ' Escanear Redes'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <div className="networks-list">
        {networks.length === 0 && !loading && (
          <p className="no-networks">Nenhuma rede encontrada. Clique em "Escanear Redes".</p>
        )}

        {networks.map((network, index) => {
          const signal = getSignalStrength(network.rssi);
          const isSelected = selectedNetwork?.ssid === network.ssid;

          return (
            <div
              key={index}
              className={`network-item ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onSelectNetwork(network)}
            >
              <div className="network-info">
                <div className="network-name">{network.ssid}</div>
                <div className="network-details">
                  <span className="network-bssid">{network.bssid}</span>
                  <span className="network-channel">Canal {network.channel}</span>
                </div>
                <div className="network-security">{network.security}</div>
              </div>

              <div className="network-signal">
                <div className={`signal-indicator ${signal.class}`}>
                  {network.rssi} dBm
                </div>
                <div className="signal-label">{signal.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NetworkScanner;
