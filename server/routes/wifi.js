const express = require('express');
const router = express.Router();
const { scanNetworks, startBruteforce, stopBruteforce, getStatus } = require('../utils/wifiScanner');

// Rota para escanear redes WiFi disponíveis
router.get('/scan', async (req, res) => {
  try {
    const networks = await scanNetworks();
    res.json({ success: true, networks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota para iniciar bruteforce
router.post('/start', async (req, res) => {
  try {
    const { ssid, wordlistPath } = req.body;

    if (!ssid || !wordlistPath) {
      return res.status(400).json({
        success: false,
        error: 'SSID e wordlist são obrigatórios'
      });
    }

    await startBruteforce(ssid, wordlistPath);
    res.json({ success: true, message: 'Bruteforce iniciado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota para parar bruteforce
router.post('/stop', (req, res) => {
  try {
    stopBruteforce();
    res.json({ success: true, message: 'Bruteforce parado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota para obter status atual
router.get('/status', (req, res) => {
  const status = getStatus();
  res.json({ success: true, status });
});

module.exports = router;
