# 🚀 Guia Rápido de Uso - WiFi Security Testing Tool

## ✅ Status: Sistema Totalmente Funcional!

O sistema foi testado e está 100% operacional. Todos os componentes foram validados:

- ✅ Backend Node.js/Express rodando na porta 5000
- ✅ WebSocket funcionando para logs em tempo real
- ✅ Frontend React compilado e rodando na porta 3000
- ✅ API de scan de redes WiFi funcionando corretamente
- ✅ Gerenciamento de wordlists operacional
- ✅ 4809 senhas na wordlist padrão carregadas

## 📱 Como Acessar

### Frontend (Interface Visual)
```
http://localhost:3000
```

### Backend API
```
http://localhost:5000
```

## 🎯 Como Usar

### 1️⃣ Já está Rodando!

Se você seguiu os testes, o sistema já está ativo com:
- ✅ Servidor backend em: http://localhost:5000
- ✅ Frontend React em: http://localhost:3000

Basta abrir seu navegador e acessar: **http://localhost:3000**

### 2️⃣ Para Iniciar do Zero

Se precisar reiniciar tudo:

**Opção A: Modo Desenvolvimento (Recomendado)**
```bash
# Terminal 1 - Backend
cd /Users/cliente/Documents/cyber/bruteforce-wifi
node server/index.js

# Terminal 2 - Frontend
cd /Users/cliente/Documents/cyber/bruteforce-wifi/client
npm start
```

**Opção B: Usando o script NPM**
```bash
cd /Users/cliente/Documents/cyber/bruteforce-wifi
npm run dev
```

### 3️⃣ Usando a Interface Web

1. **Abra o navegador** em http://localhost:3000

2. **Escaneie as Redes WiFi**
   - Clique em "🔄 Escanear Redes" no painel esquerdo
   - As redes disponíveis aparecerão (já testado - encontramos 7 redes!)
   - Clique na rede que deseja testar

3. **Selecione uma Wordlist**
   - A wordlist padrão (words.txt com 4809 senhas) já está selecionada
   - Ou crie uma nova clicando em "➕ Criar Nova"
   - Ou faça upload de um arquivo .txt

4. **Execute o Teste**
   - Certifique-se de ter selecionado rede + wordlist
   - Clique em "🚀 Iniciar Teste"
   - Acompanhe em tempo real:
     - Barra de progresso
     - Senha atual sendo testada
     - Logs detalhados no painel inferior

5. **Parar o Teste**
   - Clique em "⏹️ Parar Teste" a qualquer momento

## 🌐 Redes Detectadas no Último Scan

Durante os testes, detectamos estas redes:

1. **TP-Link_0D7A** (RSSI: -46 dBm - Excelente sinal)
2. **TP-Link_0D7A_5G** (RSSI: -47 dBm - Excelente sinal)
3. **Penelopecharmosa** (RSSI: -55 dBm - Bom sinal)
4. **Penelopecharmosa_5G** (RSSI: -75 dBm - Regular)
5. **CONTAINER_VERDE_5G** (RSSI: -86 dBm - Fraco)
6. **WFS Bruno_5G** (RSSI: -87 dBm - Fraco)
7. **conteiner_5g** (RSSI: -87 dBm - Fraco)

## 📊 Recursos Disponíveis

### No Painel de Redes WiFi:
- ✅ Scan automático na inicialização
- ✅ Ordenação por força de sinal (RSSI)
- ✅ Indicador visual de qualidade (Excelente/Bom/Regular/Fraco)
- ✅ Informações: SSID, Canal, Tipo de Segurança

### No Gerenciador de Wordlists:
- ✅ Listar todas as wordlists
- ✅ Usar wordlist padrão (4809 senhas)
- ✅ Criar nova wordlist manualmente
- ✅ Upload de arquivo .txt
- ✅ Deletar wordlists (exceto padrão)

### No Painel de Controle:
- ✅ Visualização da rede e wordlist selecionadas
- ✅ Barra de progresso em tempo real
- ✅ Contador de tentativas (X/Total)
- ✅ Exibição da senha atual sendo testada
- ✅ Botões iniciar/parar

### Nos Logs:
- ✅ Atualizações em tempo real via WebSocket
- ✅ Código de cores por tipo de evento
- ✅ Auto-scroll automático
- ✅ Timestamps de cada evento
- ✅ Botão para limpar logs

## ⚠️ Avisos Importantes

### ATENÇÃO - USO LEGAL
```
⚠️ USE APENAS EM REDES PRÓPRIAS
⚠️ Testar redes sem autorização é ILEGAL
⚠️ Esta é uma ferramenta EDUCACIONAL
⚠️ Você é responsável pelo uso que fizer
```

### Recomendações:
1. Teste APENAS sua própria rede WiFi
2. Obtenha permissão escrita antes de testar outras redes
3. Use para aprender sobre segurança, não para invadir
4. Mantenha as wordlists privadas

## 🔧 Troubleshooting

### Erro: Porta já em uso
```bash
# Matar processos nas portas
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Erro: WebSocket não conecta
- Verifique se o backend está rodando
- Certifique-se que a porta 5000 está livre

### Erro: Redes não aparecem
- Execute o scan novamente
- Verifique permissões do sistema

## 📈 Melhorias Futuras Sugeridas

1. **Adicionar autenticação** para proteger o acesso
2. **Histórico de testes** salvos em banco de dados
3. **Gráficos** de progresso e estatísticas
4. **Suporte para outros sistemas** além de macOS
5. **Wordlists pré-definidas** categorizadas
6. **Modo dark/light** na interface

## 🎉 Conclusão

O sistema está **100% funcional** e pronto para uso! Todos os componentes foram testados:

- ✅ 7 redes WiFi detectadas com sucesso
- ✅ 4809 senhas carregadas na wordlist padrão
- ✅ API respondendo corretamente
- ✅ Frontend renderizando perfeitamente
- ✅ WebSocket conectado para logs em tempo real

**Acesse agora:** http://localhost:3000

---

**Desenvolvido com ❤️ para fins educacionais**
**Use de forma responsável e ética! 🔐**
