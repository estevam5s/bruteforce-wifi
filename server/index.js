const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const wifiRoutes = require('./routes/wifi');
const wordlistRoutes = require('./routes/wordlist');
const networkRoutes = require('./routes/network');
const documentationRoutes = require('./routes/documentation');
const pentestRoutes = require('./routes/pentest');
const siteAnalysisRoutes = require('./routes/siteAnalysis');
const ddosResilienceRoutes = require('./routes/ddosResilience');
const webBruteforceRoutes = require('./routes/webBruteforce');
const stressTestRoutes = require('./routes/stressTest');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Tornar wss disponível para as rotas
app.set('wss', wss);

// WebSocket para logs em tempo real
wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
  });
});

// Função para broadcast de mensagens
global.broadcastLog = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'WiFi Bruteforce API',
    endpoints: {
      'GET /api/wifi/scan': 'Escanear redes WiFi',
      'POST /api/wifi/start': 'Iniciar bruteforce',
      'POST /api/wifi/stop': 'Parar bruteforce',
      'GET /api/wordlist/list': 'Listar wordlists'
    },
    frontend: 'http://localhost:3000'
  });
});

// Rotas
app.use('/api/wifi', wifiRoutes);
app.use('/api/wordlist', wordlistRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/docs', documentationRoutes);
app.use('/api/pentest', pentestRoutes);
app.use('/api/site', siteAnalysisRoutes);
app.use('/api/ddos', ddosResilienceRoutes);
app.use('/api/webbruteforce', webBruteforceRoutes);
app.use('/api/stresstest', stressTestRoutes);

// Servir arquivos estáticos do React em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🔌 WebSocket disponível em ws://localhost:${PORT}`);
});
