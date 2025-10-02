# 🚀 Guia de Deploy - WiFi Security Testing Tool

## ⚠️ IMPORTANTE: Limitações de Deploy

Este projeto **NÃO pode ser deployado completamente na Vercel** ou outras plataformas serverless por motivos técnicos:

### 🚫 Por que não funciona na Vercel?

1. **Comandos específicos do macOS**: O sistema usa `networksetup` e `airport` que são exclusivos do macOS
2. **Serverless não suporta comandos de sistema**: Vercel/Netlify rodam em containers Linux sem acesso a rede WiFi
3. **WebSocket persistente**: Requer servidor sempre ativo, não serverless
4. **Acesso direto ao hardware**: Precisa acessar adaptador WiFi do sistema

### ✅ Soluções de Deploy

## Opção 1: Deploy Local (Recomendado para este projeto)

Este é o melhor método, pois o sistema precisa acessar o hardware WiFi local.

### Passo 1: Usar ngrok para expor localmente
```bash
# Instalar ngrok
brew install ngrok

# Iniciar o backend
cd /Users/cliente/Documents/cyber/bruteforce-wifi
node server/index.js

# Em outro terminal, expor a porta 5000
ngrok http 5000
```

### Passo 2: Atualizar o frontend com a URL do ngrok
```bash
# Editar client/src/services/api.js e websocket.js
# Substituir localhost:5000 pela URL do ngrok
```

## Opção 2: Deploy Separado (Frontend na Vercel + Backend Local)

### Frontend na Vercel:

1. **Criar build estático**:
```bash
cd client
npm run build
```

2. **Deploy apenas o diretório client/build**:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy do frontend
cd client
vercel --prod
```

3. **Configurar variáveis de ambiente**:
```bash
# No painel da Vercel, adicionar:
REACT_APP_API_URL=http://seu-ip-local:5000/api
REACT_APP_WS_URL=ws://seu-ip-local:5000
```

### Backend Local:

```bash
# Rodar o backend na sua máquina
cd /Users/cliente/Documents/cyber/bruteforce-wifi
node server/index.js

# Expor com ngrok
ngrok http 5000
```

## Opção 3: Deploy em VPS (Servidor Dedicado)

Se você tiver um Mac Server ou VPS macOS:

### 3.1 DigitalOcean/Linode/AWS (⚠️ Não funcionará para WiFi)

```bash
# Estes rodam Linux, então os comandos macOS não funcionarão
# Você precisaria adaptar o código para Linux usando:
# - nmcli (Network Manager CLI)
# - wpa_supplicant
# - iwlist
```

### 3.2 MacStadium ou Mac Mini Server (✅ Funcionará)

```bash
# Clone o repositório
git clone seu-repo.git
cd wifi-bruteforce

# Instale dependências
npm run install-all

# Configure PM2 para manter rodando
npm install -g pm2
pm2 start server/index.js --name wifi-backend
pm2 save
pm2 startup

# Configure Nginx como proxy reverso
# ... configuração do nginx ...
```

## Opção 4: Deploy Dockerizado (Local ou VPS macOS)

⚠️ **Importante**: Docker Desktop precisa estar rodando em macOS para acessar WiFi.

### Dockerfile (Backend):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server ./server
EXPOSE 5000
CMD ["node", "server/index.js"]
```

### docker-compose.yml:
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    network_mode: "host"
    privileged: true

  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./client:/app
    ports:
      - "3000:3000"
    command: npm start
```

## 🎯 Solução Recomendada para Desenvolvimento

### Para Desenvolvimento Local:
```bash
# Terminal 1 - Backend
node server/index.js

# Terminal 2 - Frontend
cd client && npm start
```

### Para Demonstração/Apresentação:
```bash
# Use ngrok para compartilhar com outros
ngrok http 5000
```

### Para Produção (se necessário):
1. **Frontend**: Deploy estático na Vercel/Netlify
2. **Backend**: Manter rodando localmente ou em Mac Server
3. **Conexão**: Usar ngrok ou VPN para conectar frontend ao backend

## 📝 Alternativa: Adaptar para Linux

Se quiser fazer deploy "real" na nuvem, você precisaria:

### 1. Reescrever os comandos para Linux:

```javascript
// server/utils/wifiScanner.js - Versão Linux

// Escanear redes (Linux)
const { stdout } = await execAsync('nmcli -t -f SSID,SIGNAL,SECURITY dev wifi');

// Conectar (Linux)
const { stdout } = await execAsync(`nmcli dev wifi connect "${ssid}" password "${password}"`);
```

### 2. Usar diferentes comandos por SO:

```javascript
const os = require('os');

function getScanCommand() {
  const platform = os.platform();

  if (platform === 'darwin') {
    return '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s';
  } else if (platform === 'linux') {
    return 'nmcli -t -f SSID,SIGNAL,SECURITY dev wifi';
  } else {
    throw new Error('Sistema operacional não suportado');
  }
}
```

## 🔐 Considerações de Segurança para Deploy

1. **Nunca exponha publicamente sem autenticação**
2. **Use HTTPS/WSS em produção**
3. **Implemente autenticação robusta**
4. **Limite acesso por IP/VPN**
5. **Não commite credenciais no git**

## 📋 Checklist de Deploy

### Para Deploy Local com Ngrok:
- [ ] Backend rodando em localhost:5000
- [ ] Frontend rodando em localhost:3000
- [ ] Ngrok instalado
- [ ] Ngrok expondo porta 5000
- [ ] URLs atualizadas no frontend

### Para Deploy Separado:
- [ ] Frontend buildado e deployado
- [ ] Backend rodando localmente
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Firewall permite conexões

### Para Deploy em VPS macOS:
- [ ] Servidor macOS provisionado
- [ ] Dependências instaladas
- [ ] PM2 configurado
- [ ] Nginx/Apache configurado
- [ ] SSL/TLS configurado
- [ ] Firewall configurado

## 🆘 Resolução de Problemas

### Erro: "This script is only for macOS"
**Solução**: Código precisa rodar em macOS. Adapte para Linux se necessário.

### Erro: "CORS policy blocked"
**Solução**: Configure CORS no backend para aceitar origem do frontend:
```javascript
app.use(cors({
  origin: 'https://seu-frontend.vercel.app'
}));
```

### Erro: "WebSocket connection failed"
**Solução**:
- Use WSS (WebSocket Secure) em produção
- Configure proxy reverso corretamente
- Verifique firewall

---

## 🎯 Conclusão

**Para este projeto específico**, a melhor abordagem é:

1. ✅ **Desenvolvimento**: Rodar tudo localmente
2. ✅ **Demonstração**: Usar ngrok para compartilhar
3. ⚠️ **Produção**: Considerar adaptar para Linux ou usar Mac Server

**A Vercel não é adequada** para este tipo de aplicação que requer acesso direto ao hardware WiFi.
