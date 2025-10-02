import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/SpeedTest.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SpeedTest({ api }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const runSpeedTest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.speedTest();
      if (response.success) {
        setResults(response.data);
        // Adicionar ao histórico
        setHistory(prev => [...prev, {
          timestamp: new Date(),
          ...response.data
        }].slice(-10)); // Manter apenas últimos 10 testes
      } else {
        setError(response.message || 'Erro ao realizar teste');
      }
    } catch (err) {
      setError(err.message || 'Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  const getSpeedColor = (status) => {
    if (status?.includes('Muito Rápida')) return '#00ff88';
    if (status?.includes('Rápida')) return '#00cc66';
    if (status?.includes('Média')) return '#ffcc00';
    if (status?.includes('Lenta')) return '#ffaa00';
    return '#ff4444';
  };

  const getLatencyColor = (ms) => {
    if (ms < 30) return '#00ff88';
    if (ms < 50) return '#ffcc00';
    if (ms < 100) return '#ffaa00';
    return '#ff4444';
  };

  // Dados para o gráfico de histórico
  const chartData = {
    labels: history.map((h, i) => `Teste ${i + 1}`),
    datasets: [
      {
        label: 'Download (Mbps)',
        data: history.map(h => h.download?.speed || 0),
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4
      },
      {
        label: 'Latência (ms)',
        data: history.map(h => h.latency?.avg || 0),
        borderColor: '#ff4444',
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#888' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: { color: '#00ff88' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: {
          display: true,
          text: 'Download (Mbps)',
          color: '#00ff88'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: '#ff4444' },
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: 'Latência (ms)',
          color: '#ff4444'
        }
      }
    }
  };

  return (
    <div className="speed-test">
      <div className="speedtest-header">
        <h2>🚀 Teste de Velocidade</h2>
        <button
          className="btn-test"
          onClick={runSpeedTest}
          disabled={loading}
        >
          {loading ? '⏳ Testando...' : '▶️ Iniciar Teste'}
        </button>
      </div>

      {error && (
        <div className="speedtest-error">
          <span>❌</span> {error}
        </div>
      )}

      {results && (
        <div className="speedtest-results">
          {/* Status Geral */}
          <div className="speed-status-card">
            <div className="status-main">
              <div
                className="speed-indicator"
                style={{ borderColor: getSpeedColor(results.rating?.status) }}
              >
                <span className="speed-label">Velocidade</span>
                <span
                  className="speed-value"
                  style={{ color: getSpeedColor(results.rating?.status) }}
                >
                  {results.rating?.status || 'N/A'}
                </span>
                <span className="speed-score">Score: {results.rating?.score || 0}/100</span>
              </div>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="metrics-grid">
            {/* Download */}
            <div className="metric-card">
              <div className="metric-icon">⬇️</div>
              <div className="metric-info">
                <h3>Download</h3>
                <div className="metric-value">
                  <span className="value-number">
                    {results.download?.speed || 0}
                  </span>
                  <span className="value-unit">Mbps</span>
                </div>
                <div className="metric-detail">
                  Máximo: {results.download?.max || 0} Mbps
                </div>
              </div>
            </div>

            {/* Latência */}
            <div className="metric-card">
              <div className="metric-icon">⏱️</div>
              <div className="metric-info">
                <h3>Latência</h3>
                <div className="metric-value">
                  <span
                    className="value-number"
                    style={{ color: getLatencyColor(results.latency?.avg) }}
                  >
                    {results.latency?.avg?.toFixed(1) || 0}
                  </span>
                  <span className="value-unit">ms</span>
                </div>
                <div className="metric-detail">
                  Min: {results.latency?.min?.toFixed(1) || 0}ms |
                  Max: {results.latency?.max?.toFixed(1) || 0}ms
                </div>
              </div>
            </div>

            {/* Jitter */}
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-info">
                <h3>Jitter</h3>
                <div className="metric-value">
                  <span className="value-number">
                    {results.latency?.jitter?.toFixed(1) || 0}
                  </span>
                  <span className="value-unit">ms</span>
                </div>
                <div className="metric-detail">
                  Variação da latência
                </div>
              </div>
            </div>

            {/* Servidor */}
            <div className="metric-card">
              <div className="metric-icon">🌐</div>
              <div className="metric-info">
                <h3>Servidor</h3>
                <div className="metric-value server-value">
                  {results.server || 'N/A'}
                </div>
                <div className="metric-detail">
                  Testado em {new Date(results.timestamp).toLocaleTimeString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          {/* Interpretação dos Resultados */}
          <div className="interpretation-card">
            <div className="card-header">
              <h3>📖 Interpretação dos Resultados</h3>
            </div>
            <div className="card-body">
              <div className="interpretation-grid">
                <div className="interp-item">
                  <h4>Qualidade da Conexão</h4>
                  <p>
                    {results.rating?.status === 'Muito Rápida' &&
                      'Excelente! Sua conexão é ideal para streaming 4K, jogos online e downloads pesados.'}
                    {results.rating?.status === 'Rápida' &&
                      'Ótima conexão! Suporta múltiplos dispositivos e atividades simultâneas.'}
                    {results.rating?.status === 'Média' &&
                      'Conexão adequada para navegação e streaming HD. Pode ter limitações com múltiplos usuários.'}
                    {results.rating?.status?.includes('Lenta') &&
                      'Conexão lenta. Pode ter dificuldades com streaming e downloads. Considere verificar sua rede.'}
                  </p>
                </div>

                <div className="interp-item">
                  <h4>Latência</h4>
                  <p>
                    {results.latency?.avg < 30 &&
                      'Excelente! Ideal para jogos online e videochamadas.'}
                    {results.latency?.avg >= 30 && results.latency?.avg < 50 &&
                      'Boa latência. Adequada para a maioria das atividades online.'}
                    {results.latency?.avg >= 50 && results.latency?.avg < 100 &&
                      'Latência moderada. Pode haver atrasos perceptíveis em jogos e chamadas.'}
                    {results.latency?.avg >= 100 &&
                      'Latência alta. Podem ocorrer atrasos significativos em aplicações em tempo real.'}
                  </p>
                </div>

                <div className="interp-item">
                  <h4>Jitter</h4>
                  <p>
                    {results.latency?.jitter < 10 &&
                      'Excelente estabilidade de conexão!'}
                    {results.latency?.jitter >= 10 && results.latency?.jitter < 20 &&
                      'Estabilidade moderada. Pode haver variações ocasionais.'}
                    {results.latency?.jitter >= 20 &&
                      'Jitter alto indica instabilidade na conexão. Pode afetar qualidade de chamadas e jogos.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de Testes */}
          {history.length > 0 && (
            <div className="history-card">
              <div className="card-header">
                <h3>📈 Histórico de Testes</h3>
                <span className="history-count">{history.length} teste(s)</span>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <Line data={chartData} options={chartOptions} />
                </div>

                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Horário</th>
                        <th>Download</th>
                        <th>Latência</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.slice().reverse().map((test, idx) => (
                        <tr key={idx}>
                          <td>{new Date(test.timestamp).toLocaleTimeString('pt-BR')}</td>
                          <td>{test.download?.speed || 0} Mbps</td>
                          <td>{test.latency?.avg?.toFixed(1) || 0} ms</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{ backgroundColor: getSpeedColor(test.rating?.status) }}
                            >
                              {test.rating?.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Guia de Referência */}
          <div className="reference-guide-card">
            <div className="card-header">
              <h3>📊 Guia de Referência</h3>
            </div>
            <div className="card-body">
              <div className="reference-grid">
                <div className="ref-section">
                  <h4>Download</h4>
                  <ul>
                    <li><span className="ref-indicator" style={{background: '#00ff88'}}></span> &gt;100 Mbps - Excelente</li>
                    <li><span className="ref-indicator" style={{background: '#00cc66'}}></span> 50-100 Mbps - Ótimo</li>
                    <li><span className="ref-indicator" style={{background: '#ffcc00'}}></span> 25-50 Mbps - Bom</li>
                    <li><span className="ref-indicator" style={{background: '#ffaa00'}}></span> 10-25 Mbps - Regular</li>
                    <li><span className="ref-indicator" style={{background: '#ff4444'}}></span> &lt;10 Mbps - Lento</li>
                  </ul>
                </div>

                <div className="ref-section">
                  <h4>Latência</h4>
                  <ul>
                    <li><span className="ref-indicator" style={{background: '#00ff88'}}></span> &lt;30ms - Excelente</li>
                    <li><span className="ref-indicator" style={{background: '#ffcc00'}}></span> 30-50ms - Bom</li>
                    <li><span className="ref-indicator" style={{background: '#ffaa00'}}></span> 50-100ms - Regular</li>
                    <li><span className="ref-indicator" style={{background: '#ff4444'}}></span> &gt;100ms - Ruim</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpeedTest;
