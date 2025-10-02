# 🔐 WiFi Security Testing Tool - Sistema Web Completo

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Educational-red.svg)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)

**Sistema web profissional para testes de segurança em redes WiFi**

⚠️ **APENAS PARA FINS EDUCACIONAIS E TESTES AUTORIZADOS**

[Instalação](#-instalação) • [Uso](#-como-usar) • [API](#-api-reference) • [Ngrok](#-ngrok-setup) • [Deploy](#-deploy)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [API Reference](#-api-reference)
- [Ngrok Setup](#-ngrok-setup)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)
- [Segurança](#-segurança)

---

## 🎯 Sobre o Projeto

Este é um **sistema web completo** para teste de segurança em redes WiFi, desenvolvido com tecnologias modernas e interface visual intuitiva. O projeto foi criado com base no script Python `WifiBF.py` e expandido para incluir:

### ✨ Funcionalidades

- 🌐 **Interface Web Moderna** - Frontend React responsivo e intuitivo
- 📡 **Escaneamento de Redes** - Detecta todas as redes WiFi disponíveis
- 📝 **Gerenciamento de Wordlists** - Criar, upload e gerenciar listas de senhas
- ⚡ **Teste de Segurança** - Bruteforce com progresso em tempo real
- 📊 **Logs em Tempo Real** - WebSocket para atualizações instantâneas
- 🔒 **Sistema de Segurança** - CORS, validações e proteções

### 🎨 Interface

O sistema possui uma interface visual completa com:
- Painel de redes WiFi com indicador de força do sinal
- Gerenciador visual de wordlists
- Painel de controle com barra de progresso
- Visualizador de logs em tempo real
- Design moderno com gradientes e animações

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
bruteforce-wifi/
├── server/                      # Backend Node.js
│   ├── index.js                # Servidor Express + WebSocket
│   ├── routes/
│   │   ├── wifi.js            # Rotas de WiFi (scan, start, stop)
│   │   └── wordlist.js        # Rotas de wordlists (CRUD)
│   └── utils/
│       └── wifiScanner.js     # Lógica de scan e bruteforce
│
├── client/                      # Frontend React
│   ├── public/
│   │   └── index.html         # HTML base
│   └── src/
│       ├── components/         # Componentes React
│       │   ├── NetworkScanner.js      # Lista de redes WiFi
│       │   ├── WordlistManager.js     # Gerenciador de wordlists
│       │   ├── BruteforcePanel.js     # Painel de controle
│       │   └── LogViewer.js           # Visualizador de logs
│       ├── services/
│       │   ├── api.js         # Cliente API (Axios)
│       │   └── websocket.js   # Cliente WebSocket
│       ├── App.js             # Componente principal
│       └── index.js           # Entry point
│
├── wordlists/                   # Armazenamento de wordlists
│   └── words.txt               # Wordlist padrão (4809 senhas)
│
├── WifiBF.py                   # Script Python original
├── package.json                # Dependências do projeto
├── vercel.json                 # Configuração Vercel
├── ngrok.yml                   # Configuração Ngrok
└── README.md                   # Este arquivo
```

### Fluxo de Dados

```
┌─────────────┐         HTTP/WS         ┌─────────────┐
│   Frontend  │ <──────────────────────> │   Backend   │
│   (React)   │                          │  (Node.js)  │
└─────────────┘                          └─────────────┘
                                                 │
                                                 │ System Commands
                                                 │ (networksetup, airport)
                                                 ▼
                                         ┌─────────────┐
                                         │    macOS    │
                                         │  WiFi API   │
                                         └─────────────┘
```

---

## 🛠️ Tecnologias

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js 4.x** - Framework web
- **WebSocket (ws)** - Comunicação em tempo real
- **Multer** - Upload de arquivos
- **CORS** - Cross-Origin Resource Sharing
- **Child Process** - Execução de comandos do sistema

### Frontend
- **React 18** - Biblioteca UI
- **Axios** - Cliente HTTP
- **WebSocket API** - Comunicação real-time
- **CSS3** - Estilização moderna com gradientes
- **Create React App** - Tooling e build

### DevOps & Deploy
- **Ngrok** - Túnel HTTPS para localhost
- **Vercel** - Deploy de frontend
- **Nodemon** - Hot reload em desenvolvimento
- **Concurrently** - Execução paralela de scripts

---

## 📦 Instalação

### Pré-requisitos

- **Node.js 14+** - [Download](https://nodejs.org/)
- **npm ou yarn** - Incluído com Node.js
- **macOS** - Sistema operacional (comandos específicos do macOS)
- **Homebrew** - Gerenciador de pacotes para macOS

### Passo 1: Clonar o Repositório

```bash
git clone <seu-repositorio>
cd bruteforce-wifi
```

### Passo 2: Instalar Dependências

```bash
# Instalar todas as dependências (backend + frontend)
npm run install-all
```

**Ou manualmente:**

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Passo 3: Verificar Instalação

```bash
# Verificar estrutura
ls -la

# Deve mostrar:
# - server/
# - client/
# - wordlists/
# - package.json
```

---

## 🚀 Como Usar

### Modo 1: Desenvolvimento Local (Recomendado)

#### Opção A: Script Único

```bash
npm run dev
```

Este comando inicia **backend e frontend simultaneamente**.

#### Opção B: Terminais Separados

```bash
# Terminal 1 - Backend
npm run server
# ou
node server/index.js

# Terminal 2 - Frontend
npm run client
# ou
cd client && npm start
```

### Modo 2: Produção

```bash
# Build do frontend
npm run build

# Iniciar em modo produção
NODE_ENV=production node server/index.js
```

### Acessar o Sistema

- **Frontend Local:** http://localhost:3000
- **Backend Local:** http://localhost:5000
- **WebSocket:** ws://localhost:5000

---

## 🔌 API Reference

### Base URL

```
Local:  http://localhost:5000/api
Ngrok:  https://<seu-ngrok>.ngrok-free.dev/api
Ngrok:  https://judson-throneless-aide.ngrok-free.dev/api
```

### Endpoints

#### 1. WiFi Routes

##### `GET /api/wifi/scan`

Escaneia redes WiFi disponíveis.

**Response:**
```json
{
  "success": true,
  "networks": [
    {
      "ssid": "MinhaRede",
      "bssid": "00:11:22:33:44:55",
      "rssi": -45,
      "channel": "6",
      "security": "WPA2(PSK/AES/AES)"
    }
  ]
}
```

##### `POST /api/wifi/start`

Inicia teste de bruteforce.

**Request:**
```json
{
  "ssid": "MinhaRede",
  "wordlistPath": "/path/to/wordlist.txt"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bruteforce iniciado"
}
```

##### `POST /api/wifi/stop`

Para o teste em execução.

**Response:**
```json
{
  "success": true,
  "message": "Bruteforce parado"
}
```

##### `GET /api/wifi/status`

Obtém status atual do teste.

**Response:**
```json
{
  "success": true,
  "status": {
    "isRunning": true,
    "ssid": "MinhaRede",
    "currentPassword": "senha123",
    "attemptCount": 150,
    "totalPasswords": 4809,
    "startTime": "2025-10-02T03:00:00.000Z"
  }
}
```

#### 2. Wordlist Routes

##### `GET /api/wordlist/list`

Lista todas as wordlists disponíveis.

**Response:**
```json
{
  "success": true,
  "wordlists": [
    {
      "name": "words.txt",
      "path": "/path/to/wordlists/words.txt",
      "size": 50171,
      "passwordCount": 4809,
      "isDefault": true
    }
  ]
}
```

##### `POST /api/wordlist/upload`

Faz upload de uma wordlist.

**Request:** `multipart/form-data`
- `wordlist`: arquivo .txt

**Response:**
```json
{
  "success": true,
  "message": "Wordlist enviada com sucesso",
  "file": {
    "name": "minha-wordlist.txt",
    "path": "/path/to/wordlists/minha-wordlist.txt",
    "size": 12345
  }
}
```

##### `POST /api/wordlist/create`

Cria nova wordlist manualmente.

**Request:**
```json
{
  "name": "minha-lista",
  "passwords": ["senha1", "senha2", "senha3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wordlist criada com sucesso",
  "file": {
    "name": "minha-lista.txt",
    "path": "/path/to/wordlists/minha-lista.txt",
    "passwordCount": 3
  }
}
```

##### `DELETE /api/wordlist/:filename`

Deleta uma wordlist.

**Response:**
```json
{
  "success": true,
  "message": "Wordlist deletada com sucesso"
}
```

### WebSocket Events

#### Cliente → Servidor

Conexão automática, sem eventos enviados pelo cliente.

#### Servidor → Cliente

##### Event: `start`
```json
{
  "type": "start",
  "data": {
    "ssid": "MinhaRede",
    "totalPasswords": 4809
  }
}
```

##### Event: `progress`
```json
{
  "type": "progress",
  "data": {
    "attemptCount": 150,
    "totalPasswords": 4809,
    "currentPassword": "senha123",
    "percentage": "3.12"
  }
}
```

##### Event: `success`
```json
{
  "type": "success",
  "data": {
    "ssid": "MinhaRede",
    "password": "senhaCorreta123",
    "attemptCount": 234
  }
}
```

##### Event: `failed`
```json
{
  "type": "failed",
  "data": {
    "attemptCount": 150,
    "password": "senhaErrada"
  }
}
```

##### Event: `finished`
```json
{
  "type": "finished",
  "data": {
    "message": "Todas as senhas foram testadas sem sucesso",
    "attemptCount": 4809
  }
}
```

---

## 🌐 Ngrok Setup

### O que é Ngrok?

Ngrok é uma ferramenta que cria um túnel seguro HTTPS para expor seu servidor local na internet.

### Instalação do Ngrok

#### Via Homebrew (Recomendado)

```bash
brew install ngrok
```

#### Via Download Direto

1. Acesse: https://ngrok.com/download
2. Baixe a versão para macOS
3. Extraia e mova para `/usr/local/bin`

### Configuração do Ngrok

#### Passo 1: Criar Conta (Grátis)

1. Acesse: https://dashboard.ngrok.com/signup
2. Cadastre-se (Google, GitHub ou Email)
3. Confirme seu email

#### Passo 2: Obter Authtoken

1. Faça login em: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copie seu authtoken (exemplo: `2ab...xyz`)

#### Passo 3: Configurar Authtoken

```bash
ngrok config add-authtoken SEU_TOKEN_COMPLETO_AQUI
```

**Exemplo:**
```bash
ngrok config add-authtoken 33UZre4pA8qeweg5exFeyhsVOg9_6H4gXy2nJkdYFBA2WXYQi
```

### Usar Ngrok com o Projeto

#### Opção 1: Expor Backend (Porta 5000)

```bash
# Certifique-se que o backend está rodando
node server/index.js

# Em outro terminal, expor com ngrok
ngrok http 5000
```

**Output:**
```
Session Status    online
Forwarding        https://abc-123.ngrok-free.dev -> http://localhost:5000
```

**URLs disponíveis:**
- Raiz: `https://abc-123.ngrok-free.dev/`
- API: `https://abc-123.ngrok-free.dev/api/wifi/scan`

#### Opção 2: Expor Frontend (Porta 3000)

```bash
# Certifique-se que o frontend está rodando
cd client && npm start

# Em outro terminal
ngrok http 3000
```

**Importante:** Configure o React para aceitar hosts externos:

Edite `client/package.json`:
```json
"scripts": {
  "start": "DANGEROUSLY_DISABLE_HOST_CHECK=true react-scripts start"
}
```

#### Opção 3: Múltiplos Túneis (Plano Pago)

Crie arquivo `ngrok.yml`:
```yaml
version: "2"
authtoken: SEU_TOKEN_AQUI

tunnels:
  backend:
    proto: http
    addr: 5000
  frontend:
    proto: http
    addr: 3000
```

Inicie ambos:
```bash
ngrok start --all --config=ngrok.yml
```

### Testar Ngrok

```bash
# Obter URL do ngrok
curl http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url'

# Testar API
curl https://SEU-NGROK.ngrok-free.dev/api/wordlist/list
```

### Interface Web do Ngrok

Acesse: http://127.0.0.1:4040

Você verá:
- 📊 Estatísticas de tráfego
- 📝 Requisições em tempo real
- 🔍 Detalhes de cada request/response

### Limites do Plano Gratuito

| Recurso | Limite Gratuito |
|---------|----------------|
| Túneis simultâneos | 1 |
| Conexões/minuto | 40 |
| URL | Aleatória (muda ao reiniciar) |
| HTTPS | ✅ Sim |
| Autenticação | ❌ Não |

### Upgrade para Plano Pago

**Personal Plan - $8/mês:**
- 3 túneis simultâneos
- URLs customizadas
- IP whitelisting
- Autenticação básica

**Pro Plan - $20/mês:**
- 5 túneis
- Domínios customizados
- Reserva de URLs

---

## 🚀 Deploy

### Opção 1: Deploy Completo (Frontend + Backend Local + Ngrok)

#### Passo 1: Iniciar Backend Local
```bash
node server/index.js
```

#### Passo 2: Expor Backend com Ngrok
```bash
ngrok http 5000
# Copie a URL: https://abc-123.ngrok-free.dev
```

#### Passo 3: Configurar Frontend

Edite `client/.env.production`:
```env
REACT_APP_API_URL=https://abc-123.ngrok-free.dev/api
REACT_APP_WS_URL=wss://abc-123.ngrok-free.dev
```

#### Passo 4: Deploy Frontend na Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

### Opção 2: Deploy Apenas Frontend (Vercel)

```bash
cd client
npm run build
vercel --prod
```

Configure variáveis de ambiente na Vercel:
```
REACT_APP_API_URL=http://SEU-IP:5000/api
REACT_APP_WS_URL=ws://SEU-IP:5000
```

### Opção 3: Deploy em VPS (DigitalOcean, AWS, etc.)

**⚠️ Importante:** Servidores cloud usam Linux. Você precisará adaptar os comandos de WiFi.

#### Adaptação para Linux

Edite `server/utils/wifiScanner.js`:

```javascript
// macOS (atual)
const { stdout } = await execAsync(
  '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s'
);

// Linux (adaptação)
const { stdout } = await execAsync('nmcli -t -f SSID,SIGNAL,SECURITY dev wifi');
```

#### Deploy no VPS

```bash
# SSH no servidor
ssh user@seu-servidor.com

# Clonar projeto
git clone <seu-repo>
cd bruteforce-wifi

# Instalar dependências
npm run install-all

# Build frontend
npm run build

# Instalar PM2
npm install -g pm2

# Iniciar com PM2
pm2 start server/index.js --name wifi-bruteforce
pm2 save
pm2 startup
```

---

## 🔧 Troubleshooting

### Erro: "This script is only for macOS"

**Causa:** O script usa comandos específicos do macOS.

**Solução:**
- Use em macOS
- Ou adapte para Linux (veja seção Deploy)

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
npm run install-all
```

### Erro: "Port 5000 already in use"

**Causa:** Outra aplicação usando a porta.

**Solução:**
```bash
# Encontrar processo
lsof -ti:5000

# Matar processo
lsof -ti:5000 | xargs kill -9

# Ou usar outra porta
PORT=5001 node server/index.js
```

### Erro: "Invalid Host header" (Ngrok)

**Causa:** React rejeita hosts desconhecidos.

**Solução:** Configure no `package.json`:
```json
"start": "DANGEROUSLY_DISABLE_HOST_CHECK=true react-scripts start"
```

### Erro: "WebSocket connection failed"

**Causa:** Firewall ou CORS bloqueando.

**Solução:**
```javascript
// server/index.js
app.use(cors({
  origin: '*', // ou especifique domínios permitidos
  credentials: true
}));
```

### Erro: "ngrok authtoken required"

**Causa:** Token não configurado.

**Solução:**
```bash
ngrok config add-authtoken SEU_TOKEN
```

### Wordlist não aparece

**Causa:** Diretório não existe.

**Solução:**
```bash
mkdir -p wordlists
cp words.txt wordlists/
```

---

## 🔒 Segurança

### ⚠️ Avisos Legais

**LEIA ATENTAMENTE:**

1. ✅ **USE APENAS EM REDES PRÓPRIAS**
2. ❌ Testar redes sem autorização é **CRIME**
3. 📚 Esta ferramenta é **EXCLUSIVAMENTE EDUCACIONAL**
4. ⚖️ O desenvolvedor **NÃO SE RESPONSABILIZA** por uso indevido
5. 📝 Sempre obtenha **AUTORIZAÇÃO ESCRITA** antes de testar

### Legislação Brasileira

**Lei Nº 12.737/2012 (Lei Carolina Dieckmann):**
- Invasão de dispositivo sem autorização: **6 meses a 2 anos de detenção**
- Se causar prejuízo econômico: **1 a 3 anos de reclusão**

### Boas Práticas de Segurança

1. **Autenticação**
   - Adicione autenticação ao sistema em produção
   - Use JWT ou sessões seguras

2. **HTTPS Obrigatório**
   - Use sempre HTTPS em produção
   - Configure certificados SSL

3. **Rate Limiting**
   - Implemente limites de requisições
   - Use Express Rate Limit

4. **Logs e Auditoria**
   - Mantenha logs de todas as ações
   - Registre IPs e timestamps

5. **Wordlists Seguras**
   - Não compartilhe wordlists públicas
   - Use senhas fictícias para testes

### Configurações de Segurança

#### 1. Adicionar Autenticação

```javascript
// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

#### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use('/api/', limiter);
```

#### 3. Helmet (Segurança Headers)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 📊 Estatísticas do Projeto

- **Linhas de Código:** ~3.500
- **Componentes React:** 4
- **Endpoints API:** 9
- **Eventos WebSocket:** 6
- **Dependências:** 26
- **Wordlist Padrão:** 4.809 senhas

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é fornecido "como está" para **fins educacionais**.

**Isenção de Responsabilidade:**
- Use por sua conta e risco
- Apenas para aprendizado
- Sempre com autorização

---

## 👨‍💻 Créditos

- **Script Python Original:** [Brahim Jarrar](https://github.com/BrahimJarrar/)
- **Adaptação macOS:** Gemini
- **Sistema Web:** Desenvolvido com Claude Code
- **Tecnologias:** React, Node.js, Express, WebSocket

---

## 📞 Suporte

Para questões técnicas ou bugs:
- Abra uma [Issue](https://github.com/seu-usuario/bruteforce-wifi/issues)
- Consulte a seção [Troubleshooting](#-troubleshooting)

---

<div align="center">

**🔐 Use com Responsabilidade - Segurança é Coisa Séria 🔐**

Made with ❤️ for Education

[⬆ Voltar ao Topo](#-wifi-security-testing-tool---sistema-web-completo)

</div>
