# 🚀 Solução para Deploy - WiFi Bruteforce

## ⚠️ Problema

A Vercel **rejeitou o deploy** porque este projeto precisa acessar WiFi do macOS, o que não é possível em ambiente serverless Linux.

## ✅ Solução Simples em 3 Passos

### **Passo 1: Instalar Ngrok**

```bash
brew install ngrok
```

### **Passo 2: Expor o Backend Local**

```bash
# O backend já está rodando em http://localhost:5000
# Abra um NOVO TERMINAL e execute:

ngrok http 5000
```

Você verá algo assim:
```
Forwarding   https://abc-123-xyz.ngrok-free.app -> http://localhost:5000
```

**Copie essa URL!** ☝️

### **Passo 3: Deploy do Frontend na Vercel**

Agora vamos fazer deploy APENAS do frontend:

#### 3.1 - Criar arquivo de configuração

Crie o arquivo `client/.env.production`:

```bash
# Substituir pela SUA URL do ngrok (sem /api no final)
REACT_APP_API_URL=https://abc-123-xyz.ngrok-free.app/api
REACT_APP_WS_URL=wss://abc-123-xyz.ngrok-free.app
```

#### 3.2 - Fazer deploy do frontend

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Ir para a pasta do cliente
cd client

# Deploy
vercel --prod
```

A Vercel vai perguntar algumas coisas:
- **Set up and deploy?** → YES
- **Which scope?** → Seu usuário
- **Link to existing project?** → NO
- **Project name?** → wifi-bruteforce-client
- **Directory?** → . (ponto)

Pronto! Seu frontend estará online! 🎉

---

## 🎯 Resultado Final

- ✅ **Frontend**: Hospedado na Vercel (acesso público)
- ✅ **Backend**: Rodando local com ngrok (acesso público)
- ✅ **Funcionando**: Frontend se comunica com backend via ngrok

---

## 🔄 Manter Rodando

### Terminal 1 - Backend Local:
```bash
cd /Users/cliente/Documents/cyber/bruteforce-wifi
node server/index.js
```

### Terminal 2 - Ngrok:
```bash
ngrok http 5000
```

**Importante**:
- Mantenha os 2 terminais abertos
- A URL do ngrok gratuito muda a cada reinício
- Para URL fixa, use ngrok pago ($8/mês)

---

## 📱 Alternativa: Tudo Local

Se não quiser usar ngrok, pode rodar tudo local mesmo:

```bash
# Terminal 1 - Backend
node server/index.js

# Terminal 2 - Frontend
cd client && npm start
```

Acesse: http://localhost:3000

---

## 🐛 Problemas Comuns

### "ngrok command not found"
```bash
brew install ngrok
# ou
npm install -g ngrok
```

### "CORS blocked"
Já está configurado! O backend aceita qualquer origem.

### "WebSocket failed"
Certifique-se de usar `wss://` (não `ws://`) na URL do ngrok.

---

## 🎉 Resumo

Este projeto **funciona perfeitamente local**, mas precisa de adaptações para cloud:

1. **Frontend**: Pode ir para Vercel ✅
2. **Backend**: Precisa rodar em macOS (ngrok resolve isso) ✅

**Está funcionando localmente?** Sim! (http://localhost:3000)
**Quer compartilhar?** Use ngrok!
**Quer deploy completo?** Precisaria de um servidor macOS dedicado.
