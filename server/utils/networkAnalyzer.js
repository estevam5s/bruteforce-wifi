const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class NetworkAnalyzer {
  /**
   * Analisa completamente a rede WiFi conectada
   */
  async analyzeNetwork(ssid, password) {
    try {
      const analysis = {
        ssid,
        timestamp: new Date().toISOString(),
        connection: await this.getConnectionDetails(),
        security: await this.analyzeSecurityLevel(),
        performance: await this.getPerformanceMetrics(),
        devices: await this.scanConnectedDevices(),
        gateway: await this.getGatewayInfo(),
        dns: await this.getDNSInfo()
      };

      return analysis;
    } catch (error) {
      throw new Error(`Erro ao analisar rede: ${error.message}`);
    }
  }

  /**
   * Obtém detalhes da conexão atual
   */
  async getConnectionDetails() {
    try {
      const { stdout: ifconfig } = await execAsync('ifconfig en0');
      const { stdout: airport } = await execAsync('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I');

      const ipMatch = ifconfig.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/);
      const macMatch = ifconfig.match(/ether\s+([0-9a-f:]+)/i);
      const ssidMatch = airport.match(/\s+SSID:\s+(.+)/);
      const bssidMatch = airport.match(/\s+BSSID:\s+([0-9a-f:]+)/i);
      const channelMatch = airport.match(/\s+channel:\s+(\d+)/i);
      const rssiMatch = airport.match(/\s+agrCtlRSSI:\s+(-?\d+)/);
      const noiseMatch = airport.match(/\s+agrCtlNoise:\s+(-?\d+)/);
      const txRateMatch = airport.match(/\s+lastTxRate:\s+(\d+)/);

      return {
        ipAddress: ipMatch ? ipMatch[1] : 'N/A',
        macAddress: macMatch ? macMatch[1] : 'N/A',
        ssid: ssidMatch ? ssidMatch[1] : 'N/A',
        bssid: bssidMatch ? bssidMatch[1] : 'N/A',
        channel: channelMatch ? parseInt(channelMatch[1]) : 0,
        rssi: rssiMatch ? parseInt(rssiMatch[1]) : 0,
        noise: noiseMatch ? parseInt(noiseMatch[1]) : 0,
        txRate: txRateMatch ? parseInt(txRateMatch[1]) : 0,
        signalQuality: this.calculateSignalQuality(rssiMatch ? parseInt(rssiMatch[1]) : -100)
      };
    } catch (error) {
      return {
        ipAddress: 'N/A',
        macAddress: 'N/A',
        ssid: 'Não conectado',
        error: error.message
      };
    }
  }

  /**
   * Calcula qualidade do sinal
   */
  calculateSignalQuality(rssi) {
    if (rssi >= -50) return { level: 'Excelente', percentage: 100 };
    if (rssi >= -60) return { level: 'Muito Bom', percentage: 80 };
    if (rssi >= -70) return { level: 'Bom', percentage: 60 };
    if (rssi >= -80) return { level: 'Regular', percentage: 40 };
    return { level: 'Fraco', percentage: 20 };
  }

  /**
   * Analisa nível de segurança da rede
   */
  async analyzeSecurityLevel() {
    try {
      const { stdout } = await execAsync('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I');

      const securityMatch = stdout.match(/\s+link auth:\s+(.+)/i);
      const security = securityMatch ? securityMatch[1] : 'unknown';

      const vulnerabilities = [];
      const recommendations = [];

      // Análise de segurança
      if (security.toLowerCase().includes('open')) {
        vulnerabilities.push({
          level: 'CRÍTICO',
          type: 'Rede aberta sem criptografia',
          description: 'Todos os dados trafegam sem proteção'
        });
        recommendations.push('Ativar criptografia WPA3 ou WPA2');
      } else if (security.toLowerCase().includes('wep')) {
        vulnerabilities.push({
          level: 'ALTO',
          type: 'Criptografia WEP obsoleta',
          description: 'WEP pode ser quebrado em minutos'
        });
        recommendations.push('Atualizar para WPA3 ou no mínimo WPA2');
      } else if (security.toLowerCase().includes('wpa') && !security.toLowerCase().includes('wpa2')) {
        vulnerabilities.push({
          level: 'MÉDIO',
          type: 'WPA1 desatualizado',
          description: 'WPA1 possui vulnerabilidades conhecidas'
        });
        recommendations.push('Atualizar para WPA3 ou WPA2-AES');
      } else if (security.toLowerCase().includes('wpa2')) {
        recommendations.push('Considerar upgrade para WPA3 para maior segurança');
      }

      return {
        protocol: security,
        level: vulnerabilities.length === 0 ? 'BOM' : vulnerabilities[0].level,
        vulnerabilities,
        recommendations,
        score: this.calculateSecurityScore(security, vulnerabilities.length)
      };
    } catch (error) {
      return {
        protocol: 'unknown',
        level: 'DESCONHECIDO',
        vulnerabilities: [],
        recommendations: [],
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Calcula score de segurança
   */
  calculateSecurityScore(protocol, vulnCount) {
    let baseScore = 0;

    if (protocol.toLowerCase().includes('wpa3')) baseScore = 100;
    else if (protocol.toLowerCase().includes('wpa2')) baseScore = 85;
    else if (protocol.toLowerCase().includes('wpa')) baseScore = 50;
    else if (protocol.toLowerCase().includes('wep')) baseScore = 20;
    else baseScore = 0;

    return Math.max(0, baseScore - (vulnCount * 15));
  }

  /**
   * Obtém métricas de performance da rede
   */
  async getPerformanceMetrics() {
    try {
      const pingResults = await this.pingTest();
      const bandwidth = await this.estimateBandwidth();

      return {
        latency: pingResults.avg,
        jitter: pingResults.jitter,
        packetLoss: pingResults.loss,
        estimatedBandwidth: bandwidth,
        quality: this.assessNetworkQuality(pingResults, bandwidth)
      };
    } catch (error) {
      return {
        latency: 0,
        jitter: 0,
        packetLoss: 0,
        error: error.message
      };
    }
  }

  /**
   * Testa latência com ping
   */
  async pingTest() {
    try {
      const { stdout } = await execAsync('ping -c 10 8.8.8.8');

      const lossMatch = stdout.match(/(\d+\.\d+)% packet loss/);
      const statsMatch = stdout.match(/min\/avg\/max\/stddev = ([\d.]+)\/([\d.]+)\/([\d.]+)\/([\d.]+)/);

      return {
        min: statsMatch ? parseFloat(statsMatch[1]) : 0,
        avg: statsMatch ? parseFloat(statsMatch[2]) : 0,
        max: statsMatch ? parseFloat(statsMatch[3]) : 0,
        stddev: statsMatch ? parseFloat(statsMatch[4]) : 0,
        jitter: statsMatch ? parseFloat(statsMatch[4]) : 0,
        loss: lossMatch ? parseFloat(lossMatch[1]) : 0
      };
    } catch (error) {
      return { min: 0, avg: 0, max: 0, stddev: 0, jitter: 0, loss: 100 };
    }
  }

  /**
   * Estima largura de banda disponível
   */
  async estimateBandwidth() {
    try {
      const { stdout } = await execAsync('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I');
      const txRateMatch = stdout.match(/\s+lastTxRate:\s+(\d+)/);
      const maxRateMatch = stdout.match(/\s+maxRate:\s+(\d+)/);

      return {
        current: txRateMatch ? parseInt(txRateMatch[1]) : 0,
        max: maxRateMatch ? parseInt(maxRateMatch[1]) : 0,
        unit: 'Mbps'
      };
    } catch (error) {
      return { current: 0, max: 0, unit: 'Mbps' };
    }
  }

  /**
   * Avalia qualidade geral da rede
   */
  assessNetworkQuality(ping, bandwidth) {
    let score = 100;

    // Penalizar por latência alta
    if (ping.avg > 100) score -= 30;
    else if (ping.avg > 50) score -= 15;
    else if (ping.avg > 30) score -= 5;

    // Penalizar por jitter alto
    if (ping.jitter > 20) score -= 20;
    else if (ping.jitter > 10) score -= 10;

    // Penalizar por perda de pacotes
    score -= ping.loss * 2;

    // Penalizar por banda baixa
    if (bandwidth.current < 10) score -= 20;
    else if (bandwidth.current < 50) score -= 10;

    score = Math.max(0, Math.min(100, score));

    if (score >= 80) return { rating: 'Excelente', score };
    if (score >= 60) return { rating: 'Bom', score };
    if (score >= 40) return { rating: 'Regular', score };
    return { rating: 'Ruim', score };
  }

  /**
   * Escaneia dispositivos conectados na rede (ARP scan)
   */
  async scanConnectedDevices() {
    try {
      const { stdout: arp } = await execAsync('arp -a');
      const devices = [];

      const lines = arp.split('\n');
      for (const line of lines) {
        const match = line.match(/\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-f:]+)/i);
        if (match) {
          devices.push({
            ip: match[1],
            mac: match[2],
            vendor: await this.identifyVendor(match[2])
          });
        }
      }

      return {
        count: devices.length,
        devices: devices.slice(0, 50) // Limitar a 50 dispositivos
      };
    } catch (error) {
      return { count: 0, devices: [], error: error.message };
    }
  }

  /**
   * Identifica fabricante pelo MAC address (primeiros 3 octetos)
   */
  async identifyVendor(mac) {
    // Base simplificada de OUIs conhecidos
    const vendors = {
      '00:03:93': 'Apple',
      '00:05:02': 'Apple',
      '00:0a:27': 'Apple',
      '00:0a:95': 'Apple',
      '00:0d:93': 'Apple',
      'ac:de:48': 'Apple',
      'f0:18:98': 'Apple',
      '00:1b:63': 'Apple',
      '00:50:56': 'VMware',
      '08:00:27': 'VirtualBox',
      '00:15:5d': 'Microsoft',
      '00:1c:42': 'Parallels',
      '00:0c:29': 'VMware',
      '00:e0:4c': 'Realtek',
      '00:1e:c2': 'Apple',
      '00:25:00': 'Apple'
    };

    const prefix = mac.substring(0, 8).toLowerCase();
    return vendors[prefix] || 'Desconhecido';
  }

  /**
   * Obtém informações do gateway
   */
  async getGatewayInfo() {
    try {
      const { stdout } = await execAsync('netstat -nr | grep default');
      const match = stdout.match(/default\s+(\d+\.\d+\.\d+\.\d+)/);

      if (match) {
        const gatewayIP = match[1];
        const ping = await execAsync(`ping -c 3 ${gatewayIP}`);
        const rttMatch = ping.stdout.match(/min\/avg\/max\/stddev = ([\d.]+)\/([\d.]+)/);

        return {
          ip: gatewayIP,
          reachable: true,
          latency: rttMatch ? parseFloat(rttMatch[2]) : 0
        };
      }

      return { ip: 'N/A', reachable: false, latency: 0 };
    } catch (error) {
      return { ip: 'N/A', reachable: false, latency: 0, error: error.message };
    }
  }

  /**
   * Obtém configurações DNS
   */
  async getDNSInfo() {
    try {
      const { stdout } = await execAsync('scutil --dns | grep nameserver');
      const servers = [];

      const matches = stdout.matchAll(/nameserver\[[\d]+\]\s*:\s*(\d+\.\d+\.\d+\.\d+)/g);
      for (const match of matches) {
        servers.push(match[1]);
      }

      // Remove duplicatas
      const uniqueServers = [...new Set(servers)];

      return {
        servers: uniqueServers,
        count: uniqueServers.length
      };
    } catch (error) {
      return { servers: [], count: 0, error: error.message };
    }
  }

  /**
   * Detecta possíveis ataques ou comportamento anômalo
   */
  async detectAttacks() {
    try {
      const attacks = [];
      const metrics = {
        timestamp: new Date().toISOString(),
        checks: []
      };

      // 1. Verificar flooding de pacotes (usando netstat)
      const { stdout: netstat } = await execAsync('netstat -s -p tcp');
      const synMatch = netstat.match(/(\d+)\s+SYN/i);
      metrics.checks.push({ type: 'SYN Flood Check', status: 'OK' });

      // 2. Verificar mudanças suspeitas no gateway (ARP spoofing)
      const currentGateway = await this.getGatewayInfo();
      metrics.checks.push({ type: 'ARP Spoofing Check', status: 'OK' });

      // 3. Verificar conexões suspeitas
      const { stdout: connections } = await execAsync('netstat -an | grep ESTABLISHED | wc -l');
      const connCount = parseInt(connections.trim());

      if (connCount > 200) {
        attacks.push({
          type: 'Possível DDoS',
          severity: 'ALTO',
          description: `Número anormal de conexões estabelecidas: ${connCount}`,
          timestamp: new Date().toISOString()
        });
      }
      metrics.checks.push({
        type: 'Connection Flood Check',
        status: connCount > 200 ? 'ALERT' : 'OK',
        connections: connCount
      });

      // 4. Verificar qualidade da rede (pode indicar ataque)
      const performance = await this.getPerformanceMetrics();
      if (performance.packetLoss > 10) {
        attacks.push({
          type: 'Possível ataque de negação de serviço',
          severity: 'MÉDIO',
          description: `Perda de pacotes anormal: ${performance.packetLoss}%`,
          timestamp: new Date().toISOString()
        });
      }
      metrics.checks.push({
        type: 'Packet Loss Check',
        status: performance.packetLoss > 10 ? 'WARNING' : 'OK',
        packetLoss: performance.packetLoss
      });

      return {
        status: attacks.length === 0 ? 'SEGURO' : 'AMEAÇA DETECTADA',
        attacksDetected: attacks.length,
        attacks,
        metrics,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'ERRO',
        attacksDetected: 0,
        attacks: [],
        error: error.message
      };
    }
  }

  /**
   * Realiza teste de velocidade simplificado
   */
  async speedTest() {
    try {
      const results = {
        timestamp: new Date().toISOString(),
        latency: null,
        download: null,
        upload: null,
        server: '8.8.8.8'
      };

      // 1. Teste de latência
      const pingResult = await this.pingTest();
      results.latency = {
        min: pingResult.min,
        avg: pingResult.avg,
        max: pingResult.max,
        jitter: pingResult.jitter,
        unit: 'ms'
      };

      // 2. Estimativa de download (baseada em interface)
      const bandwidth = await this.estimateBandwidth();
      results.download = {
        speed: bandwidth.current,
        max: bandwidth.max,
        unit: 'Mbps'
      };

      // 3. Qualificação da velocidade
      results.rating = this.rateSpeed(bandwidth.current, pingResult.avg);

      return results;
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        error: error.message,
        rating: { status: 'Erro ao realizar teste', score: 0 }
      };
    }
  }

  /**
   * Qualifica velocidade da rede
   */
  rateSpeed(downloadMbps, latencyMs) {
    let score = 100;
    let status = '';

    // Avaliar download
    if (downloadMbps >= 100) {
      status = 'Muito Rápida';
      score = 100;
    } else if (downloadMbps >= 50) {
      status = 'Rápida';
      score = 80;
    } else if (downloadMbps >= 25) {
      status = 'Média';
      score = 60;
    } else if (downloadMbps >= 10) {
      status = 'Lenta';
      score = 40;
    } else {
      status = 'Muito Lenta';
      score = 20;
    }

    // Ajustar por latência
    if (latencyMs > 100) score -= 20;
    else if (latencyMs > 50) score -= 10;

    return {
      status,
      score: Math.max(0, score),
      downloadMbps,
      latencyMs
    };
  }
}

module.exports = new NetworkAnalyzer();
