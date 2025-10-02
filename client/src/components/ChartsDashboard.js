import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/ChartsDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function ChartsDashboard({ api }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [securityData, setSecurityData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [perfResp, secResp] = await Promise.all([
        api.getPerformance(),
        api.scanVulnerabilities()
      ]);

      if (perfResp.success) {
        setPerformanceData(perfResp.data);
        setHistoryData(prev => [...prev, {
          time: new Date().toLocaleTimeString('pt-BR'),
          latency: perfResp.data.latency || 0,
          bandwidth: perfResp.data.estimatedBandwidth?.current || 0
        }].slice(-20));
      }

      if (secResp.success) {
        setSecurityData(secResp.data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Gráfico de Performance em Tempo Real
  const performanceChartData = {
    labels: historyData.map(d => d.time),
    datasets: [
      {
        label: 'Latência (ms)',
        data: historyData.map(d => d.latency),
        borderColor: '#ff4444',
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Banda (Mbps)',
        data: historyData.map(d => d.bandwidth),
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: { color: '#fff' }
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
        ticks: { color: '#ff4444' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: {
          display: true,
          text: 'Latência (ms)',
          color: '#ff4444'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: '#00ff88' },
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: 'Banda (Mbps)',
          color: '#00ff88'
        }
      }
    }
  };

  // Gráfico de Segurança (Donut)
  const securityChartData = securityData ? {
    labels: ['Score Atual', 'Margem'],
    datasets: [{
      data: [securityData.score || 0, 100 - (securityData.score || 0)],
      backgroundColor: ['#00ff88', 'rgba(255, 255, 255, 0.1)'],
      borderColor: ['#00ff88', 'rgba(255, 255, 255, 0.2)'],
      borderWidth: 2
    }]
  } : null;

  const securityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  };

  // Gráfico de Qualidade de Rede (Bar)
  const qualityChartData = performanceData ? {
    labels: ['Latência', 'Jitter', 'Perda Pacotes'],
    datasets: [{
      label: 'Métricas de Qualidade',
      data: [
        performanceData.latency || 0,
        performanceData.jitter || 0,
        performanceData.packetLoss || 0
      ],
      backgroundColor: [
        performanceData.latency < 50 ? '#00ff88' : '#ff4444',
        performanceData.jitter < 10 ? '#00ff88' : '#ff4444',
        performanceData.packetLoss < 1 ? '#00ff88' : '#ff4444'
      ],
      borderColor: [
        performanceData.latency < 50 ? '#00ff88' : '#ff4444',
        performanceData.jitter < 10 ? '#00ff88' : '#ff4444',
        performanceData.packetLoss < 1 ? '#00ff88' : '#ff4444'
      ],
      borderWidth: 1
    }]
  } : null;

  const qualityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#888' },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#888' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="charts-dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard de Métricas</h2>
        <div className="refresh-status">
          {loading ? (
            <span className="loading-indicator">⏳ Atualizando...</span>
          ) : (
            <span className="update-time">
              Atualizado: {new Date().toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Performance em Tempo Real */}
        <div className="chart-card large">
          <div className="card-header">
            <h3>⚡ Performance em Tempo Real</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              {historyData.length > 0 ? (
                <Line data={performanceChartData} options={performanceChartOptions} />
              ) : (
                <div className="no-data">Coletando dados...</div>
              )}
            </div>
          </div>
        </div>

        {/* Score de Segurança */}
        <div className="chart-card">
          <div className="card-header">
            <h3>🔒 Score de Segurança</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              {securityChartData ? (
                <>
                  <Doughnut data={securityChartData} options={securityChartOptions} />
                  <div className="chart-overlay">
                    <div className="overlay-score">{securityData.score || 0}</div>
                    <div className="overlay-label">/100</div>
                  </div>
                </>
              ) : (
                <div className="no-data">Carregando...</div>
              )}
            </div>
            {securityData && (
              <div className="security-info">
                <div className="info-item">
                  <span>Protocolo:</span>
                  <span>{securityData.protocol}</span>
                </div>
                <div className="info-item">
                  <span>Nível:</span>
                  <span>{securityData.level}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Qualidade de Rede */}
        <div className="chart-card">
          <div className="card-header">
            <h3>📈 Qualidade de Rede</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              {qualityChartData ? (
                <Bar data={qualityChartData} options={qualityChartOptions} />
              ) : (
                <div className="no-data">Carregando...</div>
              )}
            </div>
            {performanceData && (
              <div className="quality-info">
                <div className="info-badge">
                  {performanceData.quality?.rating || 'N/A'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="chart-card stats">
          <div className="card-header">
            <h3>📋 Estatísticas</h3>
          </div>
          <div className="card-body">
            <div className="stats-grid">
              {performanceData && (
                <>
                  <div className="stat-item">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                      <div className="stat-label">Latência Média</div>
                      <div className="stat-value">
                        {performanceData.latency?.toFixed(1) || 'N/A'} ms
                      </div>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <div className="stat-label">Jitter</div>
                      <div className="stat-value">
                        {performanceData.jitter?.toFixed(1) || 'N/A'} ms
                      </div>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">📉</div>
                    <div className="stat-info">
                      <div className="stat-label">Perda Pacotes</div>
                      <div className="stat-value">
                        {performanceData.packetLoss?.toFixed(1) || 'N/A'}%
                      </div>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">⬇️</div>
                    <div className="stat-info">
                      <div className="stat-label">Banda Atual</div>
                      <div className="stat-value">
                        {performanceData.estimatedBandwidth?.current || 'N/A'} Mbps
                      </div>
                    </div>
                  </div>
                </>
              )}

              {securityData && (
                <div className="stat-item">
                  <div className="stat-icon">🛡️</div>
                  <div className="stat-info">
                    <div className="stat-label">Vulnerabilidades</div>
                    <div className="stat-value">
                      {securityData.vulnerabilities?.length || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsDashboard;
