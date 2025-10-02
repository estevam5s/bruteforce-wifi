import React, { useState } from 'react';
import '../styles/PacketAnalyzer.css';

function PacketAnalyzer({ api }) {
  const [capturing, setCapturing] = useState(false);
  const [packets, setPackets] = useState([]);

  const toggleCapture = () => {
    setCapturing(!capturing);
    if (!capturing) {
      // Simulação de captura
      const interval = setInterval(() => {
        setPackets(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          protocol: ['TCP', 'UDP', 'HTTP'][Math.floor(Math.random() * 3)],
          src: '192.168.1.' + Math.floor(Math.random() * 255),
          dst: '192.168.1.' + Math.floor(Math.random() * 255),
          length: Math.floor(Math.random() * 1500)
        }].slice(-50));
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  return (
    <div className="packet-analyzer">
      <div className="analyzer-header">
        <h2>📡 Análise de Pacotes</h2>
        <button onClick={toggleCapture} className={capturing ? 'active' : ''}>
          {capturing ? '⏸️ Parar Captura' : '▶️ Iniciar Captura'}
        </button>
      </div>

      <div className="packets-table">
        <table>
          <thead>
            <tr>
              <th>Tempo</th>
              <th>Protocolo</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Tamanho</th>
            </tr>
          </thead>
          <tbody>
            {packets.map((packet, idx) => (
              <tr key={idx}>
                <td>{packet.time}</td>
                <td><span className={`protocol ${packet.protocol}`}>{packet.protocol}</span></td>
                <td>{packet.src}</td>
                <td>{packet.dst}</td>
                <td>{packet.length} bytes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PacketAnalyzer;
