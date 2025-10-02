# 🔐 WiFi Security Testing Tool - Web Interface

Sistema web para teste de segurança em redes WiFi - **APENAS PARA FINS EDUCACIONAIS**

⚠️ **IMPORTANTE**: Esta ferramenta deve ser usada **APENAS** em redes WiFi que você possui ou tem autorização explícita para testar. O uso não autorizado é **ILEGAL**.

## 📋 Sobre o Projeto

Este é um sistema web completo que permite testar a segurança de redes WiFi através de uma interface visual moderna. Ele foi desenvolvido com base no script Python `WifiBF.py` e inclui:

- 🌐 Interface web moderna com React
- 📡 Escaneamento de redes WiFi disponíveis
- 📝 Gerenciamento de wordlists (criar, fazer upload, deletar)
- ⚡ Teste de segurança em tempo real
- 📊 Logs detalhados com WebSocket
- 📈 Barra de progresso visual

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- WebSocket (ws)
- Multer (upload de arquivos)

### Frontend
- React 18
- Axios
- CSS3 com gradientes modernos

## 📦 Instalação

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- macOS (o script usa comandos específicos do macOS)

### Passo 1: Instalar Dependências

```bash
# Instalar dependências do backend e frontend
npm run install-all
```

Ou instale manualmente:

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Passo 2: Criar diretório de wordlists

```bash
mkdir -p wordlists
```

## 🚀 Como Usar

### Modo Desenvolvimento

Execute o servidor backend e o frontend simultaneamente:

```bash
npm run dev
```

Ou execute separadamente:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

O sistema estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **WebSocket**: ws://localhost:5000

### Modo Produção

```bash
# Build do frontend
npm run build

# Inicie o servidor em modo produção
NODE_ENV=production node server/index.js
```

## 📖 Guia de Uso

### 1. Escanear Redes WiFi

1. Clique no botão **"🔄 Escanear Redes"** no painel esquerdo
2. As redes disponíveis aparecerão ordenadas por força do sinal
3. Clique em uma rede para selecioná-la

### 2. Gerenciar Wordlists

Você tem três opções:

**Opção A: Usar Wordlist Padrão**
- A wordlist padrão (`words.txt`) já vem selecionada automaticamente

**Opção B: Criar Nova Wordlist**
1. Clique em **"➕ Criar Nova"**
2. Digite um nome para a wordlist
3. Adicione senhas (uma por linha)
4. Clique em **"Criar"**

**Opção C: Fazer Upload**
1. Clique em **"📤 Upload"**
2. Selecione um arquivo `.txt` com senhas (uma por linha)

### 3. Executar Teste

1. Certifique-se de ter uma rede e wordlist selecionadas
2. Clique em **"🚀 Iniciar Teste"**
3. Acompanhe o progresso em tempo real no painel de controle
4. Veja os logs detalhados no painel inferior direito

### 4. Parar Teste

- Clique em **"⏹️ Parar Teste"** a qualquer momento para interromper

## 📁 Estrutura do Projeto

```
bruteforce-wifi/
├── server/                    # Backend Node.js
│   ├── index.js              # Servidor principal
│   ├── routes/
│   │   ├── wifi.js          # Rotas WiFi
│   │   └── wordlist.js      # Rotas Wordlist
│   └── utils/
│       └── wifiScanner.js   # Lógica de scan e bruteforce
├── client/                    # Frontend React
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/       # Componentes React
│       │   ├── NetworkScanner.js
│       │   ├── WordlistManager.js
│       │   ├── BruteforcePanel.js
│       │   └── LogViewer.js
│       ├── services/         # Serviços
│       │   ├── api.js       # Chamadas API
│       │   └── websocket.js # WebSocket
│       ├── App.js
│       └── index.js
├── wordlists/                # Wordlists armazenadas
│   └── words.txt            # Wordlist padrão
├── WifiBF.py                # Script Python original
├── package.json             # Dependências do projeto
├── README.md                # README original do Python
└── README_WEB.md           # Este arquivo
```

## 🔧 API Endpoints

### WiFi Routes

- `GET /api/wifi/scan` - Escaneia redes WiFi disponíveis
- `POST /api/wifi/start` - Inicia teste de bruteforce
- `POST /api/wifi/stop` - Para teste em execução
- `GET /api/wifi/status` - Obtém status atual

### Wordlist Routes

- `GET /api/wordlist/list` - Lista todas as wordlists
- `POST /api/wordlist/upload` - Faz upload de wordlist
- `POST /api/wordlist/create` - Cria nova wordlist
- `DELETE /api/wordlist/:filename` - Deleta wordlist

## ⚡ Recursos

- ✅ Escaneamento automático de redes WiFi
- ✅ Interface visual moderna e responsiva
- ✅ Logs em tempo real via WebSocket
- ✅ Barra de progresso detalhada
- ✅ Gerenciamento completo de wordlists
- ✅ Upload de arquivos de senha
- ✅ Criação manual de wordlists
- ✅ Indicador visual de força do sinal
- ✅ Auto-scroll nos logs
- ✅ Reconexão automática do WebSocket

## 🔒 Considerações de Segurança

### ⚠️ AVISOS LEGAIS

1. **USE APENAS EM SUAS PRÓPRIAS REDES**
2. Testar redes sem autorização é **CRIME** em muitos países
3. Esta ferramenta é **EXCLUSIVAMENTE EDUCACIONAL**
4. O desenvolvedor **NÃO SE RESPONSABILIZA** por uso indevido
5. Sempre obtenha **AUTORIZAÇÃO ESCRITA** antes de testar redes de terceiros

### Melhores Práticas

- Use apenas para auditar suas próprias redes
- Mantenha logs de todos os testes realizados
- Não compartilhe wordlists que contenham senhas reais
- Teste em ambiente controlado
- Documente todas as vulnerabilidades encontradas

## 🐛 Troubleshooting

### Erro: "This script is only for macOS"

**Solução**: Este sistema foi desenvolvido especificamente para macOS. Para usar em outros sistemas operacionais, você precisará adaptar os comandos em `server/utils/wifiScanner.js`.

### Erro: "Permission denied"

**Solução**: Alguns comandos de rede podem requerer permissões de administrador.

### WebSocket não conecta

**Solução**: Verifique se o servidor backend está rodando na porta 5000 e se não há firewall bloqueando a conexão.

### Wordlist não aparece

**Solução**: Certifique-se de que o diretório `wordlists/` existe. Crie com: `mkdir -p wordlists`

## 📝 Licença

Este projeto é fornecido "como está" para fins educacionais. Use por sua conta e risco.

## 👨‍💻 Créditos

- Script Python original por **Brahim Jarrar** (https://github.com/BrahimJarrar/)
- Modificações para macOS por **Gemini**
- Sistema Web desenvolvido com **Claude Code**

---

**Lembre-se: Com grandes poderes vêm grandes responsabilidades. Use esta ferramenta de forma ética e legal!** 🦸‍♂️
