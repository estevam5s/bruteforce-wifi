import React, { useState } from 'react';
import '../styles/PortScanner.css';

function PortScanner({ api }) {
  const [target, setTarget] = useState('');
  const [ports, setPorts] = useState([]);
  const [scanning, setScanning] = useState(false);

  const scanPorts = async () => {
    if (!target) return;
    setScanning(true);
    // Simulação de scan de portas
    setTimeout(() => {
      setPorts([
        { port: 80, status: 'open', service: 'HTTP' },
        { port: 443, status: 'open', service: 'HTTPS' },
        { port: 22, status: 'closed', service: 'SSH' },
      ]);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="port-scanner">
      <div className="scanner-header">
        <h2>🔌 Scanner de Portas</h2>
      </div>

      <div className="scan-controls">
        <input
          type="text"
          placeholder="IP ou hostname"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <button onClick={scanPorts} disabled={scanning}>
          {scanning ? '⏳ Escaneando...' : '🔍 Escanear'}
        </button>
      </div>

      <div className="ports-list">
        {ports.map((port, idx) => (
          <div key={idx} className={`port-item ${port.status}`}>
            <span className="port-number">{port.port}</span>
            <span className="port-service">{port.service}</span>
            <span className={`port-status ${port.status}`}>{port.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortScanner;
