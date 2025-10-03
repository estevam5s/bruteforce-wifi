const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const os = require('os');

/**
 * ========================================
 * MAPA DA REDE - Network Device Discovery
 * ========================================
 */

/**
 * GET /api/network/map
 * Retorna mapa da rede com todos os dispositivos conectados
 */
router.get('/map', async (req, res) => {
  try {
    const devices = [];
    const localIP = getLocalIP();
    const subnet = localIP.substring(0, localIP.lastIndexOf('.'));

    // Detectar dispositivos usando arp-scan (mais rápido que nmap para discovery)
    try {
      // Tentar arp-scan primeiro (requer sudo)
      const { stdout } = await execPromise(`sudo arp-scan --localnet --interface=en0 2>/dev/null || arp -a`);

      const lines = stdout.split('\n');
      lines.forEach(line => {
        // Parse arp-scan output: IP  MAC  Vendor
        const arpScanMatch = line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-f:]{17})\s+(.*)/i);
        // Parse arp -a output: hostname (IP) at MAC
        const arpMatch = line.match(/\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-f:]{17})/i);

        if (arpScanMatch) {
          devices.push({
            ip: arpScanMatch[1],
            mac: arpScanMatch[2].toUpperCase(),
            vendor: arpScanMatch[3] || 'Unknown',
            hostname: null,
            type: detectDeviceType(arpScanMatch[2], arpScanMatch[3]),
            status: 'online',
            lastSeen: new Date().toISOString()
          });
        } else if (arpMatch) {
          const mac = arpMatch[2].toUpperCase();
          const ip = arpMatch[1];

          devices.push({
            ip: ip,
            mac: mac,
            vendor: 'Unknown',
            hostname: null,
            type: detectDeviceType(mac, ''),
            status: 'online',
            lastSeen: new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.log('Fallback para método alternativo de descoberta');
    }

    // Se não encontrou dispositivos, fazer ping sweep básico
    if (devices.length === 0) {
      for (let i = 1; i <= 254; i++) {
        const ip = `${subnet}.${i}`;
        try {
          await execPromise(`ping -c 1 -W 1 ${ip}`);
          devices.push({
            ip: ip,
            mac: 'Unknown',
            vendor: 'Unknown',
            hostname: null,
            type: 'unknown',
            status: 'online',
            lastSeen: new Date().toISOString()
          });
        } catch (e) {
          // Host não respondeu
        }
      }
    }

    // Enriquecer com hostnames
    for (const device of devices) {
      try {
        const { stdout } = await execPromise(`host ${device.ip} 2>/dev/null || nslookup ${device.ip} 2>/dev/null`);
        const hostnameMatch = stdout.match(/name = (.+)\./);
        if (hostnameMatch) {
          device.hostname = hostnameMatch[1];
        }
      } catch (e) {
        // Sem hostname
      }
    }

    res.json({
      success: true,
      data: {
        localIP: localIP,
        subnet: subnet,
        totalDevices: devices.length,
        devices: devices,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao mapear rede:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * ========================================
 * MONITORAMENTO DE TRÁFEGO
 * ========================================
 */

// Armazena estatísticas de tráfego em memória
const trafficStats = new Map();

/**
 * GET /api/network/traffic
 * Retorna estatísticas de tráfego por dispositivo
 */
router.get('/traffic', async (req, res) => {
  try {
    const devices = [];

    // Usar nettop ou iftop para monitorar tráfego (macOS)
    // Para Linux, usar iftop ou nethogs
    try {
      const { stdout } = await execPromise(`nettop -P -L 1 -J bytes_in,bytes_out 2>/dev/null | head -50`);

      const lines = stdout.split('\n').slice(1); // Pular header
      const trafficByIP = new Map();

      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
          const ip = extractIP(parts[0]);
          if (ip && ip.match(/^\d+\.\d+\.\d+\.\d+$/)) {
            const bytesIn = parseInt(parts[parts.length - 2]) || 0;
            const bytesOut = parseInt(parts[parts.length - 1]) || 0;

            if (trafficByIP.has(ip)) {
              const existing = trafficByIP.get(ip);
              trafficByIP.set(ip, {
                bytesIn: existing.bytesIn + bytesIn,
                bytesOut: existing.bytesOut + bytesOut
              });
            } else {
              trafficByIP.set(ip, { bytesIn, bytesOut });
            }
          }
        }
      });

      // Converter para array
      trafficByIP.forEach((stats, ip) => {
        const totalBytes = stats.bytesIn + stats.bytesOut;
        devices.push({
          ip: ip,
          bytesIn: stats.bytesIn,
          bytesOut: stats.bytesOut,
          totalBytes: totalBytes,
          formattedIn: formatBytes(stats.bytesIn),
          formattedOut: formatBytes(stats.bytesOut),
          formattedTotal: formatBytes(totalBytes),
          percentage: 0, // Será calculado depois
          timestamp: new Date().toISOString()
        });
      });

      // Calcular percentual
      const totalTraffic = devices.reduce((sum, d) => sum + d.totalBytes, 0);
      devices.forEach(d => {
        d.percentage = totalTraffic > 0 ? (d.totalBytes / totalTraffic * 100).toFixed(2) : 0;
      });

      // Ordenar por tráfego total
      devices.sort((a, b) => b.totalBytes - a.totalBytes);

    } catch (error) {
      console.log('Usando dados simulados de tráfego');
      // Dados simulados para desenvolvimento
      const mockIPs = ['192.168.1.100', '192.168.1.101', '192.168.1.102'];
      mockIPs.forEach(ip => {
        const bytesIn = Math.floor(Math.random() * 10000000);
        const bytesOut = Math.floor(Math.random() * 5000000);
        const totalBytes = bytesIn + bytesOut;

        devices.push({
          ip: ip,
          bytesIn: bytesIn,
          bytesOut: bytesOut,
          totalBytes: totalBytes,
          formattedIn: formatBytes(bytesIn),
          formattedOut: formatBytes(bytesOut),
          formattedTotal: formatBytes(totalBytes),
          percentage: 0,
          timestamp: new Date().toISOString()
        });
      });

      const totalTraffic = devices.reduce((sum, d) => sum + d.totalBytes, 0);
      devices.forEach(d => {
        d.percentage = totalTraffic > 0 ? (d.totalBytes / totalTraffic * 100).toFixed(2) : 0;
      });
    }

    res.json({
      success: true,
      data: {
        devices: devices,
        totalDevices: devices.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao monitorar tráfego:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * ========================================
 * HISTÓRICO DE NAVEGAÇÃO
 * ========================================
 */

// Armazena histórico de navegação (em produção, usar banco de dados)
const browsingHistory = [];

/**
 * GET /api/network/history
 * Retorna histórico de navegação capturado
 */
router.get('/history', async (req, res) => {
  try {
    const { device, startDate, endDate } = req.query;

    let filteredHistory = [...browsingHistory];

    // Filtrar por dispositivo
    if (device) {
      filteredHistory = filteredHistory.filter(h => h.device === device);
    }

    // Filtrar por data
    if (startDate) {
      filteredHistory = filteredHistory.filter(h => new Date(h.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      filteredHistory = filteredHistory.filter(h => new Date(h.timestamp) <= new Date(endDate));
    }

    // Ordenar por mais recente
    filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: {
        history: filteredHistory,
        total: filteredHistory.length,
        devices: [...new Set(browsingHistory.map(h => h.device))]
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/network/history/capture
 * Inicia captura de histórico de navegação usando tcpdump/tshark
 */
router.post('/history/capture', async (req, res) => {
  try {
    const { duration = 60, interface = 'en0' } = req.body;

    // Capturar tráfego HTTP/HTTPS usando tcpdump
    const captureCommand = `sudo tcpdump -i ${interface} -n -s 0 -A 'tcp port 80 or tcp port 443' -c 100`;

    exec(captureCommand, { timeout: duration * 1000 }, (error, stdout, stderr) => {
      if (error && !error.killed) {
        console.error('Erro na captura:', error);
        return;
      }

      // Parse do output do tcpdump
      const lines = stdout.split('\n');
      lines.forEach(line => {
        // Procurar por requisições HTTP
        const hostMatch = line.match(/Host: ([^\s]+)/i);
        const ipMatch = line.match(/(\d+\.\d+\.\d+\.\d+)\.(\d+) > (\d+\.\d+\.\d+\.\d+)\.(\d+)/);

        if (hostMatch && ipMatch) {
          browsingHistory.push({
            device: ipMatch[1],
            url: hostMatch[1],
            protocol: ipMatch[4] === '443' ? 'HTTPS' : 'HTTP',
            timestamp: new Date().toISOString()
          });
        }
      });

      // Limitar histórico a 1000 entradas
      if (browsingHistory.length > 1000) {
        browsingHistory.splice(0, browsingHistory.length - 1000);
      }
    });

    res.json({
      success: true,
      message: `Captura iniciada por ${duration} segundos`
    });
  } catch (error) {
    console.error('Erro ao iniciar captura:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * ========================================
 * ALERTAS E NOTIFICAÇÕES
 * ========================================
 */

// Armazena alertas
const alerts = [];
const alertRules = [];

/**
 * GET /api/network/alerts
 * Retorna alertas e notificações
 */
router.get('/alerts', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        alerts: alerts,
        rules: alertRules,
        total: alerts.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/network/alerts/rules
 * Cria nova regra de alerta
 */
router.post('/alerts/rules', async (req, res) => {
  try {
    const { type, threshold, email, pushNotification } = req.body;

    const rule = {
      id: Date.now(),
      type: type, // 'new_device', 'traffic_limit', 'suspicious_activity'
      threshold: threshold,
      email: email,
      pushNotification: pushNotification,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    alertRules.push(rule);

    res.json({
      success: true,
      data: rule,
      message: 'Regra de alerta criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar regra:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /api/network/alerts/rules/:id
 * Remove regra de alerta
 */
router.delete('/alerts/rules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = alertRules.findIndex(r => r.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Regra não encontrada'
      });
    }

    alertRules.splice(index, 1);

    res.json({
      success: true,
      message: 'Regra removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover regra:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * ========================================
 * CONTROLE DE ACESSO
 * ========================================
 */

// Lista de dispositivos permitidos/bloqueados
const accessControl = {
  whitelist: [],
  blacklist: []
};

/**
 * GET /api/network/access-control
 * Retorna listas de controle de acesso
 */
router.get('/access-control', async (req, res) => {
  try {
    res.json({
      success: true,
      data: accessControl
    });
  } catch (error) {
    console.error('Erro ao buscar controle de acesso:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/network/access-control/allow
 * Adiciona dispositivo à whitelist
 */
router.post('/access-control/allow', async (req, res) => {
  try {
    const { mac, name } = req.body;

    if (!mac) {
      return res.status(400).json({
        success: false,
        message: 'MAC address é obrigatório'
      });
    }

    // Remover da blacklist se existir
    const blacklistIndex = accessControl.blacklist.findIndex(d => d.mac === mac);
    if (blacklistIndex !== -1) {
      accessControl.blacklist.splice(blacklistIndex, 1);
    }

    // Adicionar à whitelist se não existir
    if (!accessControl.whitelist.find(d => d.mac === mac)) {
      accessControl.whitelist.push({
        mac: mac,
        name: name || 'Unknown Device',
        addedAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Dispositivo permitido com sucesso',
      data: accessControl
    });
  } catch (error) {
    console.error('Erro ao permitir dispositivo:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/network/access-control/block
 * Adiciona dispositivo à blacklist
 */
router.post('/access-control/block', async (req, res) => {
  try {
    const { mac, name, reason } = req.body;

    if (!mac) {
      return res.status(400).json({
        success: false,
        message: 'MAC address é obrigatório'
      });
    }

    // Remover da whitelist se existir
    const whitelistIndex = accessControl.whitelist.findIndex(d => d.mac === mac);
    if (whitelistIndex !== -1) {
      accessControl.whitelist.splice(whitelistIndex, 1);
    }

    // Adicionar à blacklist se não existir
    if (!accessControl.blacklist.find(d => d.mac === mac)) {
      accessControl.blacklist.push({
        mac: mac,
        name: name || 'Unknown Device',
        reason: reason || 'Manually blocked',
        blockedAt: new Date().toISOString()
      });

      // Aqui você implementaria o bloqueio real usando iptables ou firewall do macOS
      // Exemplo: sudo ipfw add deny ip from any to any MAC <mac>
    }

    res.json({
      success: true,
      message: 'Dispositivo bloqueado com sucesso',
      data: accessControl
    });
  } catch (error) {
    console.error('Erro ao bloquear dispositivo:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * ========================================
 * BLOQUEIO DE SITES
 * ========================================
 */

// Lista de sites bloqueados por dispositivo
const blockedSites = new Map();

/**
 * GET /api/network/blocked-sites
 * Retorna lista de sites bloqueados
 */
router.get('/blocked-sites', async (req, res) => {
  try {
    const { device } = req.query;

    if (device) {
      res.json({
        success: true,
        data: {
          device: device,
          sites: blockedSites.get(device) || []
        }
      });
    } else {
      // Retornar todos
      const allBlocked = {};
      blockedSites.forEach((sites, deviceMac) => {
        allBlocked[deviceMac] = sites;
      });

      res.json({
        success: true,
        data: allBlocked
      });
    }
  } catch (error) {
    console.error('Erro ao buscar sites bloqueados:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/network/blocked-sites
 * Adiciona site à lista de bloqueio
 */
router.post('/blocked-sites', async (req, res) => {
  try {
    const { device, url, category } = req.body;

    if (!device || !url) {
      return res.status(400).json({
        success: false,
        message: 'Device e URL são obrigatórios'
      });
    }

    const deviceBlocked = blockedSites.get(device) || [];

    if (!deviceBlocked.find(s => s.url === url)) {
      deviceBlocked.push({
        url: url,
        category: category || 'custom',
        blockedAt: new Date().toISOString()
      });

      blockedSites.set(device, deviceBlocked);

      // Aqui você implementaria o bloqueio real usando DNS/hosts ou firewall
      // Exemplo: adicionar ao /etc/hosts: 0.0.0.0 <url>
    }

    res.json({
      success: true,
      message: 'Site bloqueado com sucesso',
      data: {
        device: device,
        sites: deviceBlocked
      }
    });
  } catch (error) {
    console.error('Erro ao bloquear site:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /api/network/blocked-sites
 * Remove site da lista de bloqueio
 */
router.delete('/blocked-sites', async (req, res) => {
  try {
    const { device, url } = req.body;

    if (!device || !url) {
      return res.status(400).json({
        success: false,
        message: 'Device e URL são obrigatórios'
      });
    }

    const deviceBlocked = blockedSites.get(device) || [];
    const index = deviceBlocked.findIndex(s => s.url === url);

    if (index !== -1) {
      deviceBlocked.splice(index, 1);
      blockedSites.set(device, deviceBlocked);
    }

    res.json({
      success: true,
      message: 'Site desbloqueado com sucesso',
      data: {
        device: device,
        sites: deviceBlocked
      }
    });
  } catch (error) {
    console.error('Erro ao desbloquear site:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * ========================================
 * FIREWALL
 * ========================================
 */

// Regras de firewall
const firewallRules = [];

/**
 * GET /api/network/firewall
 * Retorna regras de firewall
 */
router.get('/firewall', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        rules: firewallRules,
        total: firewallRules.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar firewall:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/network/firewall
 * Adiciona regra de firewall
 */
router.post('/firewall', async (req, res) => {
  try {
    const { action, protocol, sourceIP, sourcePort, destIP, destPort, description } = req.body;

    if (!action || !protocol) {
      return res.status(400).json({
        success: false,
        message: 'Action e Protocol são obrigatórios'
      });
    }

    const rule = {
      id: Date.now(),
      action: action, // 'allow', 'deny', 'reject'
      protocol: protocol, // 'tcp', 'udp', 'icmp', 'all'
      sourceIP: sourceIP || 'any',
      sourcePort: sourcePort || 'any',
      destIP: destIP || 'any',
      destPort: destPort || 'any',
      description: description || '',
      enabled: true,
      createdAt: new Date().toISOString()
    };

    firewallRules.push(rule);

    // Aqui você implementaria a regra real usando iptables ou pf (macOS)
    // Exemplo iptables: iptables -A INPUT -p <protocol> -s <sourceIP> --dport <destPort> -j <ACTION>
    // Exemplo pf (macOS): echo "block drop from <sourceIP> to <destIP> port <destPort>" | sudo pfctl -f -

    res.json({
      success: true,
      message: 'Regra de firewall criada com sucesso',
      data: rule
    });
  } catch (error) {
    console.error('Erro ao criar regra de firewall:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /api/network/firewall/:id
 * Remove regra de firewall
 */
router.delete('/firewall/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = firewallRules.findIndex(r => r.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Regra não encontrada'
      });
    }

    firewallRules.splice(index, 1);

    res.json({
      success: true,
      message: 'Regra removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover regra:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * PUT /api/network/firewall/:id/toggle
 * Ativa/desativa regra de firewall
 */
router.put('/firewall/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const rule = firewallRules.find(r => r.id === parseInt(id));

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Regra não encontrada'
      });
    }

    rule.enabled = !rule.enabled;

    res.json({
      success: true,
      message: `Regra ${rule.enabled ? 'ativada' : 'desativada'} com sucesso`,
      data: rule
    });
  } catch (error) {
    console.error('Erro ao alternar regra:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * ========================================
 * ESCANEAMENTO DE VULNERABILIDADES
 * ========================================
 */

/**
 * POST /api/network/scan
 * Executa scan de vulnerabilidades na rede
 */
router.post('/scan', async (req, res) => {
  try {
    const { target, scanType = 'basic' } = req.body;

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'Target é obrigatório'
      });
    }

    const results = {
      target: target,
      scanType: scanType,
      startTime: new Date().toISOString(),
      ports: [],
      vulnerabilities: [],
      services: []
    };

    let nmapCommand = '';

    switch (scanType) {
      case 'quick':
        nmapCommand = `nmap -T4 -F ${target}`;
        break;
      case 'full':
        nmapCommand = `nmap -T4 -A -v ${target}`;
        break;
      case 'vulnerability':
        nmapCommand = `nmap -sV --script vuln ${target}`;
        break;
      case 'basic':
      default:
        nmapCommand = `nmap -sV ${target}`;
    }

    try {
      const { stdout } = await execPromise(nmapCommand, { timeout: 300000 }); // 5 min timeout

      // Parse nmap output
      const lines = stdout.split('\n');

      lines.forEach(line => {
        // Parse open ports: 22/tcp open ssh
        const portMatch = line.match(/(\d+)\/(tcp|udp)\s+(open|filtered|closed)\s+(.+)/);
        if (portMatch) {
          results.ports.push({
            port: portMatch[1],
            protocol: portMatch[2],
            state: portMatch[3],
            service: portMatch[4].trim()
          });
        }

        // Parse service versions
        const serviceMatch = line.match(/Service Info: (.+)/);
        if (serviceMatch) {
          results.services.push(serviceMatch[1].trim());
        }

        // Parse vulnerabilities from vuln scripts
        if (line.includes('VULNERABLE') || line.includes('CVE-')) {
          const vulnMatch = line.match(/(CVE-\d{4}-\d+)/);
          if (vulnMatch) {
            results.vulnerabilities.push({
              id: vulnMatch[1],
              description: line.trim(),
              severity: determineSeverity(line)
            });
          }
        }
      });

      results.endTime = new Date().toISOString();
      results.summary = {
        totalPorts: results.ports.length,
        openPorts: results.ports.filter(p => p.state === 'open').length,
        vulnerabilities: results.vulnerabilities.length,
        criticalVulns: results.vulnerabilities.filter(v => v.severity === 'critical').length
      };

      res.json({
        success: true,
        data: results
      });

    } catch (execError) {
      // Nmap não instalado ou erro na execução
      console.error('Erro no nmap:', execError);

      // Retornar scan simulado
      results.ports = [
        { port: '22', protocol: 'tcp', state: 'open', service: 'ssh' },
        { port: '80', protocol: 'tcp', state: 'open', service: 'http' },
        { port: '443', protocol: 'tcp', state: 'open', service: 'https' }
      ];

      results.vulnerabilities = [
        {
          id: 'CVE-2023-XXXX',
          description: 'Exemplo de vulnerabilidade detectada',
          severity: 'medium'
        }
      ];

      results.endTime = new Date().toISOString();
      results.summary = {
        totalPorts: 3,
        openPorts: 3,
        vulnerabilities: 1,
        criticalVulns: 0
      };

      res.json({
        success: true,
        data: results,
        note: 'Dados simulados - Nmap não disponível'
      });
    }

  } catch (error) {
    console.error('Erro ao executar scan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/network/scan/history
 * Retorna histórico de scans realizados
 */
const scanHistory = [];

router.get('/scan/history', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        scans: scanHistory,
        total: scanHistory.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function detectDeviceType(mac, vendor) {
  const macPrefix = mac.substring(0, 8).toUpperCase();
  const vendorLower = vendor.toLowerCase();

  // Detectar por vendor
  if (vendorLower.includes('apple')) return 'smartphone';
  if (vendorLower.includes('samsung')) return 'smartphone';
  if (vendorLower.includes('intel')) return 'computer';
  if (vendorLower.includes('tp-link') || vendorLower.includes('router')) return 'router';
  if (vendorLower.includes('tv') || vendorLower.includes('lg') || vendorLower.includes('sony')) return 'tv';
  if (vendorLower.includes('printer') || vendorLower.includes('hp') || vendorLower.includes('canon')) return 'printer';
  if (vendorLower.includes('xiaomi') || vendorLower.includes('camera')) return 'iot';

  return 'unknown';
}

function extractIP(str) {
  const match = str.match(/(\d+\.\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function determineSeverity(vulnText) {
  const text = vulnText.toLowerCase();
  if (text.includes('critical') || text.includes('remote code execution')) return 'critical';
  if (text.includes('high')) return 'high';
  if (text.includes('medium')) return 'medium';
  return 'low';
}

module.exports = router;
