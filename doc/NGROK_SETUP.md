# 🔧 Como Configurar o Ngrok

## ⚠️ Ngrok Requer Autenticação

O ngrok agora exige uma conta gratuita. Aqui está como configurar:

## 📝 Opção 1: Ngrok (Recomendado - Grátis)

### Passo 1: Criar Conta Grátis
1. Acesse: https://dashboard.ngrok.com/signup
2. Cadastre-se (é grátis!)
3. Confirme seu email

### Passo 2: Pegar seu Authtoken
1. Faça login em: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copie seu authtoken (algo como: `2ab...xyz`)

### Passo 3: Configurar no Terminal
```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

### Passo 4: Iniciar o Túnel
```bash
ngrok http 5000
```

Você verá algo assim:
```
Session Status                online
Forwarding                    https://abc-123.ngrok-free.app -> http://localhost:5000
```

**Copie essa URL!** 🎉

---

## 🚀 Opção 2: LocalTunnel (Sem Cadastro!)

Alternativa ao ngrok que NÃO precisa de conta:

### Instalar:
```bash
npm install -g localtunnel
```

### Usar:
```bash
lt --port 5000
```

Vai gerar uma URL tipo: `https://funny-panda-42.loca.lt`

⚠️ **Primeira vez**: Você verá uma página de aviso. Clique em "Click to Continue"

---

## 🌐 Opção 3: Cloudflared (Da Cloudflare - Grátis)

Outra alternativa sem cadastro:

### Instalar:
```bash
brew install cloudflared
```

### Usar:
```bash
cloudflared tunnel --url http://localhost:5000
```

Gera URL tipo: `https://abc-def.trycloudflare.com`

---

## 📊 Comparação Rápida

| Ferramenta | Precisa Conta? | Velocidade | Estabilidade |
|------------|---------------|------------|--------------|
| **Ngrok** | ✅ Sim (grátis) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **LocalTunnel** | ❌ Não | ⭐⭐⭐ | ⭐⭐⭐ |
| **Cloudflared** | ❌ Não | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## ✅ Teste Rápido Agora

### Opção Mais Rápida (LocalTunnel):

```bash
# 1. Instalar
npm install -g localtunnel

# 2. Verificar se backend está rodando
curl http://localhost:5000/api/wordlist/list

# 3. Expor
lt --port 5000

# 4. Copiar URL e testar
# Ex: https://funny-panda-42.loca.lt/api/wordlist/list
```

### Opção Mais Estável (Ngrok):

```bash
# 1. Criar conta em: https://dashboard.ngrok.com/signup
# 2. Pegar token em: https://dashboard.ngrok.com/get-started/your-authtoken
# 3. Configurar token
ngrok config add-authtoken SEU_TOKEN

# 4. Expor
ngrok http 5000

# 5. Copiar URL pública
```

---

## 🎯 Depois de Ter a URL

### 1. Testar o Backend:
```bash
# Substituir pela sua URL
curl https://SUA-URL.ngrok-free.app/api/wordlist/list
```

### 2. Atualizar o Frontend:

Edite `client/.env.production`:
```env
REACT_APP_API_URL=https://SUA-URL.ngrok-free.app/api
REACT_APP_WS_URL=wss://SUA-URL.ngrok-free.app
```

### 3. Deploy do Frontend:
```bash
cd client
vercel --prod
```

---

## 🐛 Problemas Comuns

### "authtoken required"
- **Solução**: Use LocalTunnel ou Cloudflared (não precisam de conta)
- **Ou**: Configure o authtoken do ngrok

### "tunnel session failed"
- **Solução**: Verifique se a porta 5000 está em uso: `lsof -ti:5000`

### "ERR_NGROK_4018"
- **Solução**: Configure o authtoken ou use alternativa

---

## 🎉 Resumo Executivo

**Caminho mais rápido (2 minutos):**
```bash
npm install -g localtunnel
lt --port 5000
# Copie a URL e pronto!
```

**Caminho mais profissional (5 minutos):**
```bash
# 1. Criar conta em https://dashboard.ngrok.com/signup
# 2. ngrok config add-authtoken SEU_TOKEN
# 3. ngrok http 5000
# 4. Usar a URL gerada
```

Escolha o que preferir! 🚀
