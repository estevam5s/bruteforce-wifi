const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

/**
 * GET /api/docs/generate
 * Gera documentação do sistema
 */
router.get('/generate', async (req, res) => {
  try {
    const documentation = {
      title: 'WiFi Security Testing Tool - Documentação Técnica',
      version: '2.0.0',
      generated: new Date().toISOString(),
      sections: [
        {
          title: 'Visão Geral',
          content: `Este sistema é uma ferramenta profissional de análise e teste de segurança WiFi desenvolvida para profissionais de TI.
          Oferece funcionalidades abrangentes de análise de rede, detecção de vulnerabilidades, testes de penetração educacionais e monitoramento de segurança.`
        },
        {
          title: 'Funcionalidades Principais',
          features: [
            {
              name: 'Análise de Rede Completa',
              description: 'Análise detalhada de todas as configurações e métricas da rede WiFi',
              endpoints: ['/api/network/analyze', '/api/network/status']
            },
            {
              name: 'Escaneamento de Vulnerabilidades',
              description: 'Identificação de falhas de segurança e configurações inadequadas',
              endpoints: ['/api/network/vulnerabilities']
            },
            {
              name: 'Teste de Velocidade',
              description: 'Medição de latência, largura de banda e qualidade da conexão',
              endpoints: ['/api/network/speed-test', '/api/network/performance']
            },
            {
              name: 'Detecção de Ataques',
              description: 'Monitoramento em tempo real de possíveis ataques DDoS e ARP spoofing',
              endpoints: ['/api/network/attack-detection']
            },
            {
              name: 'Testes de Penetração',
              description: 'Testes educacionais de segurança para avaliar robustez da rede',
              endpoints: ['/api/network/pentest']
            },
            {
              name: 'Bruteforce WiFi',
              description: 'Teste de força bruta de senhas WiFi (apenas para fins educacionais)',
              endpoints: ['/api/wifi/scan', '/api/wifi/start', '/api/wifi/stop']
            },
            {
              name: 'Gerenciamento de Wordlists',
              description: 'Criação, upload e gerenciamento de listas de senhas',
              endpoints: ['/api/wordlist/list', '/api/wordlist/upload', '/api/wordlist/create']
            },
            {
              name: 'Escaneamento de Dispositivos',
              description: 'Identificação de todos os dispositivos conectados na rede',
              endpoints: ['/api/network/devices']
            }
          ]
        },
        {
          title: 'API Reference',
          endpoints: [
            {
              method: 'POST',
              path: '/api/network/analyze',
              description: 'Realiza análise completa da rede',
              parameters: {
                ssid: 'string (required)',
                password: 'string (optional)'
              },
              response: 'Objeto com análise detalhada incluindo conexão, segurança, performance, dispositivos, gateway e DNS'
            },
            {
              method: 'GET',
              path: '/api/network/vulnerabilities',
              description: 'Escaneia vulnerabilidades de segurança',
              response: 'Lista de vulnerabilidades encontradas com níveis de severidade'
            },
            {
              method: 'GET',
              path: '/api/network/speed-test',
              description: 'Executa teste de velocidade da rede',
              response: 'Métricas de latência, download e qualificação da velocidade'
            },
            {
              method: 'GET',
              path: '/api/network/status',
              description: 'Obtém status atual da conexão',
              response: 'Informações de conexão, performance e gateway'
            },
            {
              method: 'GET',
              path: '/api/network/attack-detection',
              description: 'Detecta possíveis ataques em andamento',
              response: 'Lista de ataques detectados e métricas de segurança'
            },
            {
              method: 'GET',
              path: '/api/network/devices',
              description: 'Lista dispositivos conectados',
              response: 'Array de dispositivos com IP, MAC e fabricante'
            },
            {
              method: 'GET',
              path: '/api/network/performance',
              description: 'Métricas de performance da rede',
              response: 'Latência, jitter, perda de pacotes e largura de banda'
            },
            {
              method: 'POST',
              path: '/api/network/pentest',
              description: 'Executa testes de penetração educacionais',
              parameters: {
                ssid: 'string (required)',
                tests: 'array (optional)'
              },
              response: 'Resultados dos testes de segurança e recomendações'
            },
            {
              method: 'GET',
              path: '/api/wifi/scan',
              description: 'Escaneia redes WiFi disponíveis',
              response: 'Lista de redes com SSID, BSSID, canal, segurança e força do sinal'
            },
            {
              method: 'POST',
              path: '/api/wifi/start',
              description: 'Inicia teste de bruteforce',
              parameters: {
                ssid: 'string (required)',
                bssid: 'string (required)',
                wordlist: 'string (required)'
              },
              response: 'Status do início do teste'
            },
            {
              method: 'POST',
              path: '/api/wifi/stop',
              description: 'Para teste de bruteforce em andamento',
              response: 'Confirmação de parada'
            },
            {
              method: 'GET',
              path: '/api/wordlist/list',
              description: 'Lista todas as wordlists disponíveis',
              response: 'Array de wordlists com detalhes'
            }
          ]
        },
        {
          title: 'Guia de Uso',
          steps: [
            {
              step: 1,
              title: 'Análise de Rede',
              instructions: [
                'Acesse a seção "Análise de Rede" no painel',
                'Clique em "Analisar Rede Atual" para obter análise completa',
                'Visualize métricas de conexão, segurança e performance',
                'Revise recomendações de segurança'
              ]
            },
            {
              step: 2,
              title: 'Escaneamento de Vulnerabilidades',
              instructions: [
                'Navegue até "Scanner de Vulnerabilidades"',
                'Clique em "Escanear Agora"',
                'Analise vulnerabilidades detectadas',
                'Implemente recomendações de correção'
              ]
            },
            {
              step: 3,
              title: 'Teste de Velocidade',
              instructions: [
                'Abra a seção "Teste de Velocidade"',
                'Clique em "Iniciar Teste"',
                'Aguarde medição de latência e banda',
                'Visualize resultados e gráficos'
              ]
            },
            {
              step: 4,
              title: 'Monitoramento de Ataques',
              instructions: [
                'Acesse "Monitor de Ataques"',
                'Habilite monitoramento em tempo real',
                'Visualize alertas de segurança',
                'Tome ações preventivas conforme necessário'
              ]
            },
            {
              step: 5,
              title: 'Teste de Penetração',
              instructions: [
                'Navegue até "Pentest"',
                'IMPORTANTE: Use apenas em redes próprias',
                'Configure parâmetros do teste',
                'Execute análise de segurança',
                'Revise relatório de vulnerabilidades'
              ]
            },
            {
              step: 6,
              title: 'Bruteforce WiFi',
              instructions: [
                'Acesse "Redes WiFi Disponíveis"',
                'Clique em "Escanear Redes"',
                'Selecione uma rede',
                'Escolha ou crie uma wordlist',
                'Inicie teste (APENAS EM REDES PRÓPRIAS)',
                'Acompanhe progresso em tempo real'
              ]
            }
          ]
        },
        {
          title: 'Segurança e Ética',
          warnings: [
            'Este sistema deve ser usado APENAS para fins educacionais e em redes próprias',
            'Testar segurança de redes sem autorização é ILEGAL',
            'Usuários são responsáveis pelo uso adequado da ferramenta',
            'Sempre obtenha permissão explícita antes de realizar testes',
            'Utilize para melhorar a segurança de suas próprias redes',
            'Não compartilhe credenciais ou informações sensíveis obtidas'
          ]
        },
        {
          title: 'Requisitos do Sistema',
          requirements: {
            os: 'macOS (requerido para comandos airport e networksetup)',
            node: 'Node.js 18 ou superior',
            npm: 'npm 8 ou superior',
            permissions: 'Permissões de administrador para comandos de rede',
            network: 'Interface WiFi ativa (en0)'
          }
        },
        {
          title: 'Suporte e Contribuição',
          contact: {
            repository: 'https://github.com/seu-usuario/wifi-bruteforce',
            issues: 'Use GitHub Issues para reportar problemas',
            documentation: 'Documentação completa disponível no README.md'
          }
        }
      ]
    };

    res.json({
      success: true,
      data: documentation
    });
  } catch (error) {
    console.error('Erro ao gerar documentação:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/docs/user-guide
 * Retorna guia do usuário simplificado
 */
router.get('/user-guide', async (req, res) => {
  try {
    const userGuide = {
      title: 'Guia Rápido do Usuário',
      version: '2.0.0',
      sections: [
        {
          title: 'Primeiros Passos',
          content: 'Bem-vindo ao WiFi Security Testing Tool! Este guia irá ajudá-lo a começar.'
        },
        {
          title: 'Interface Principal',
          components: [
            {
              name: 'Painel de Controle',
              description: 'Visão geral do sistema com métricas principais'
            },
            {
              name: 'Análise de Rede',
              description: 'Análise detalhada da sua conexão WiFi'
            },
            {
              name: 'Scanner de Vulnerabilidades',
              description: 'Identifica problemas de segurança'
            },
            {
              name: 'Teste de Velocidade',
              description: 'Mede performance da sua rede'
            },
            {
              name: 'Monitor de Ataques',
              description: 'Detecta atividades suspeitas'
            },
            {
              name: 'Gráficos e Estatísticas',
              description: 'Visualização de dados em tempo real'
            }
          ]
        },
        {
          title: 'Dicas Importantes',
          tips: [
            'Execute análises regulares para manter segurança',
            'Mantenha firmware do roteador atualizado',
            'Use senhas fortes (mínimo 12 caracteres)',
            'Desabilite WPS se não for necessário',
            'Monitore dispositivos desconhecidos na rede',
            'Configure firewall adequadamente',
            'Use WPA3 quando disponível'
          ]
        },
        {
          title: 'Interpretando Resultados',
          guide: {
            'Sinal Excelente': 'RSSI > -50 dBm',
            'Sinal Bom': 'RSSI -50 a -60 dBm',
            'Sinal Regular': 'RSSI -60 a -70 dBm',
            'Sinal Fraco': 'RSSI < -70 dBm',
            'Latência Excelente': '< 30ms',
            'Latência Boa': '30-50ms',
            'Latência Regular': '50-100ms',
            'Latência Ruim': '> 100ms'
          }
        }
      ]
    };

    res.json({
      success: true,
      data: userGuide
    });
  } catch (error) {
    console.error('Erro ao gerar guia do usuário:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/docs/export
 * Exporta relatório de análise completo
 */
router.post('/export', async (req, res) => {
  try {
    const { format, data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Dados para exportação são obrigatórios'
      });
    }

    const report = {
      title: 'Relatório de Análise de Rede WiFi',
      generated: new Date().toISOString(),
      format: format || 'json',
      data: data,
      summary: {
        totalChecks: 0,
        vulnerabilitiesFound: 0,
        securityScore: 0,
        performanceScore: 0
      }
    };

    // Calcular resumo
    if (data.security) {
      report.summary.securityScore = data.security.score || 0;
      report.summary.vulnerabilitiesFound = data.security.vulnerabilities?.length || 0;
    }

    if (data.performance) {
      report.summary.performanceScore = data.performance.quality?.score || 0;
    }

    res.json({
      success: true,
      data: report,
      message: 'Relatório gerado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
