# 🔓 Como Usar LocalTunnel - Solução da Senha

## ℹ️ Sobre a Tela de Senha

Quando você acessa a URL do LocalTunnel pela primeira vez, aparece uma tela pedindo "Tunnel Password". **Isso é normal!**

### 📱 O que fazer:

A tela mostra um campo com asteriscos (`*******`). **IGNORE esse campo!**

**Solução: Apenas clique em "Click to Submit"** sem digitar nada. É só uma proteção contra bots.

---

## ✅ Passo a Passo Completo

### 1. LocalTunnel está rodando:
```
URL: https://witty-flowers-burn.loca.lt
```

### 2. Ao acessar a primeira vez:
- ✅ Vai aparecer a tela de aviso
- ✅ Campo "Tunnel Password" com asteriscos
- ✅ **Apenas clique em "Click to Submit"**
- ✅ Pronto! Você será redirecionado para a API

### 3. Acessar direto a API:
Depois de "desbloquear" uma vez, você pode acessar:
```
https://witty-flowers-burn.loca.lt/api/wordlist/list
https://witty-flowers-burn.loca.lt/api/wifi/scan
```

---

## 🚀 Alternativa SEM Senha: Cloudflared

Se não quiser lidar com a tela de senha, use Cloudflared (da Cloudflare):

### Instalar:
```bash
brew install cloudflared
```

### Usar:
```bash
cloudflared tunnel --url http://localhost:5000
```

**Vantagens:**
- ✅ Sem tela de senha
- ✅ Sem cadastro
- ✅ URL pública instantânea
- ✅ Feito pela Cloudflare (confiável)

Exemplo de URL gerada:
```
https://abc-def-123.trycloudflare.com
```

---

## 📊 Comparação

| Ferramenta | Tela de Senha? | Precisa Conta? | Estabilidade |
|------------|---------------|----------------|--------------|
| **LocalTunnel** | ⚠️ Sim (1x) | ❌ Não | ⭐⭐⭐ |
| **Cloudflared** | ❌ Não | ❌ Não | ⭐⭐⭐⭐⭐ |
| **Ngrok** | ❌ Não | ✅ Sim | ⭐⭐⭐⭐⭐ |

---

## 🎯 Recomendação

### Para Teste Rápido (Agora):
1. ✅ Use LocalTunnel (já está rodando)
2. ✅ Clique em "Click to Submit" quando pedir senha
3. ✅ Use a API normalmente

### Para Uso Mais Profissional:
```bash
# Instalar Cloudflared
brew install cloudflared

# Parar LocalTunnel
# (aperte Ctrl+C no terminal do lt)

# Iniciar Cloudflared
cloudflared tunnel --url http://localhost:5000
```

---

## 📝 Teste Atual

Seu LocalTunnel está rodando em:
```
https://witty-flowers-burn.loca.lt
```

**Como usar:**
1. Abra essa URL no navegador
2. Clique em "Click to Submit" (ignore o campo de senha)
3. Será redirecionado para a API
4. Teste: https://witty-flowers-burn.loca.lt/api/wifi/scan

---

## 🔧 Comandos Úteis

### Ver todas as URLs do LocalTunnel ativas:
```bash
lsof -ti:5000
```

### Matar LocalTunnel:
```bash
pkill -f localtunnel
# ou
lsof -ti:5000 | xargs kill
```

### Reiniciar com novo subdomínio customizado:
```bash
lt --port 5000 --subdomain meu-wifi-test
# URL será: https://meu-wifi-test.loca.lt
```

⚠️ **Subdomínios customizados** requerem conta paga no LocalTunnel.

---

## ✅ Conclusão

A tela de senha do LocalTunnel é apenas uma proteção anti-bot. **Basta clicar em "Click to Submit"** uma vez e depois a API funcionará normalmente!

**URL ativa agora:**
https://witty-flowers-burn.loca.lt

**Próximo passo:**
1. Clique em "Click to Submit" na tela
2. Teste a API
3. Configure o frontend para usar essa URL
