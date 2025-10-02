# 🧪 CyberLab - Laboratório de Cibersegurança Profissional

## 📋 Visão Geral

O CyberLab é uma plataforma completa e profissional de aprendizado de cibersegurança, inspirada no LinuxTips Girus Labs. Permite que estudantes aprendam, pratiquem e dominem tecnologias de segurança através de containers Docker interativos.

## ✨ Funcionalidades Principais

### 🎓 Laboratórios Educacionais Completos

- **Python para Cibersegurança**: Aprenda Python do zero com foco em automação e ferramentas de segurança
- **Kali Linux - Ferramentas de Pentest**: Domine Nmap, Metasploit e outras ferramentas essenciais
- **Network Security**: Análise de pacotes com tcpdump e Wireshark
- **Web Application Security**: OWASP Top 10 e técnicas de teste de aplicações web
- **Docker & Container Security**: Segurança em containers e orquestração

### 📚 Sistema de Aprendizado

Cada laboratório inclui:

#### Módulos Estruturados
- Conteúdo teórico em Markdown com syntax highlighting
- Explicações detalhadas com exemplos práticos
- Progressão lógica do básico ao avançado

#### Exercícios Práticos
- Editor de código integrado
- Execução de código diretamente no container
- Validação automática de soluções
- Sistema de pontos e conquistas

#### Desafios Finais
- Projetos práticos complexos
- Requerem aplicação de todos os conceitos aprendidos
- Recompensas especiais ao completar

### 🐳 Gerenciamento de Containers Docker

- **Catálogo Completo**: Dezenas de imagens pré-configuradas
- **Download Automático**: Pull de imagens com barra de progresso em tempo real
- **Gerenciamento Fácil**: Criar, iniciar, parar e remover containers via interface
- **Monitoramento**: Visualização de logs, estatísticas de CPU/memória

### 💻 Terminal Web Integrado (xterm.js)

- Terminal completo no navegador
- Execução de comandos Linux diretamente no container
- Histórico de comandos (↑↓)
- Suporte a cores ANSI
- Interface similar ao terminal nativo

### 🎯 Sistema de Progresso

- **Pontuação**:
  - 10 pontos por lição concluída
  - 25 pontos por exercício resolvido
  - 100+ pontos por desafios

- **Certificados**: Ganhe certificados ao completar 80% dos exercícios + 1 desafio

- **Ranking**: Compare seu progresso com outros estudantes

## 🏗️ Arquitetura

### Backend (Node.js + Express)

```
server/
├── routes/
│   └── cyberLab.js          # Todas as APIs do CyberLab
├── data/
│   └── laboratories.js      # Conteúdo educacional completo
└── index.js                 # Servidor principal
```

#### APIs Principais

**Laboratórios**:
- `GET /api/cyberlab/laboratories` - Listar todos os laboratórios
- `GET /api/cyberlab/laboratories/:labId` - Detalhes de um laboratório

**Containers Docker**:
- `GET /api/cyberlab/status` - Status do Docker
- `GET /api/cyberlab/templates` - Templates de containers disponíveis
- `GET /api/cyberlab/containers` - Listar containers do usuário
- `POST /api/cyberlab/create` - Criar novo container
- `POST /api/cyberlab/pull` - Download de imagem Docker
- `POST /api/cyberlab/exec/:containerId` - Executar comando
- `POST /api/cyberlab/execute/:containerId` - Executar código (Python, etc)
- `DELETE /api/cyberlab/remove/:containerId` - Remover container

**Progresso**:
- `GET /api/cyberlab/progress/:userId/:labId` - Progresso do usuário
- `POST /api/cyberlab/progress/:userId/:labId/lesson` - Marcar lição completa
- `POST /api/cyberlab/progress/:userId/:labId/exercise` - Marcar exercício completo
- `POST /api/cyberlab/progress/:userId/:labId/challenge` - Marcar desafio completo
- `GET /api/cyberlab/stats/:userId` - Estatísticas gerais
- `GET /api/cyberlab/leaderboard/:labId` - Ranking de usuários

### Frontend (React)

```
client/src/
├── components/
│   ├── CyberLab.js          # Componente principal
│   ├── LaboratoryView.js    # Visualizador de laboratórios
│   ├── CodeEditor.js        # Editor de código
│   └── TerminalEmulator.js  # Terminal web (xterm.js)
└── styles/
    ├── CyberLab.css
    ├── LaboratoryView.css
    ├── CodeEditor.css
    └── TerminalEmulator.css
```

## 🚀 Como Usar

### 1. Iniciar o Sistema

```bash
# Terminal 1 - Backend
cd /Users/cliente/Documents/cyber/bruteforce-wifi
npm run server

# Terminal 2 - Frontend
cd /Users/cliente/Documents/cyber/bruteforce-wifi/client
npm start
```

### 2. Acessar a Interface

Abra o navegador em `http://localhost:3000` e navegue até a seção CyberLab.

### 3. Workflow Típico

#### a) Explorar Laboratórios
1. Clique em "🎓 Laboratórios de Aprendizado"
2. Veja seus stats (pontos, exercícios, certificados)
3. Escolha um laboratório e clique em "🚀 Iniciar Laboratório"

#### b) Aprender e Praticar
1. Leia o conteúdo teórico na aba "📖 Conteúdo"
2. Marque a lição como concluída (+10 pontos)
3. Vá para a aba "💻 Exercícios"
4. Escreva código no editor
5. Clique em "▶️ Executar" para testar
6. Complete o exercício para ganhar pontos

#### c) Usar Container
1. Vá para "📚 Catálogo de Containers"
2. Escolha uma imagem (Python, Kali Linux, etc)
3. Clique em "🚀 Criar Container"
4. Aguarde o download (se necessário)
5. Vá para "🐳 Meus Containers"
6. Clique em "💻 Terminal" para usar

#### d) Terminal Interativo
1. Digite comandos Linux normalmente
2. Use ↑↓ para navegar no histórico
3. Execute scripts, instale pacotes, etc
4. Comandos especiais:
   - `clear` - Limpar tela
   - `help` - Ver ajuda
   - `history` - Ver histórico

## 🎨 Interface

### Design Profissional

- **Tema Cyberpunk**: Cores neon (#00ff9d) com fundo escuro
- **Animações Suaves**: Transições e hover effects
- **Responsivo**: Funciona em desktop e mobile
- **Acessível**: Navegação intuitiva

### Componentes Visuais

- Cards de laboratórios com badges de dificuldade
- Editor de código com syntax highlighting
- Terminal web com cores ANSI
- Barras de progresso para downloads
- Estatísticas em tempo real

## 📖 Conteúdo Educacional

### Python para Cibersegurança (4 horas)

**Módulo 1**: Introdução ao Python
- Variáveis e tipos de dados
- Estruturas de controle (if/else, loops)
- Funções

**Módulo 2**: Network Programming
- Sockets TCP/UDP
- Port scanning
- Banner grabbing

**Módulo 3**: Automação e Scripts
- Requisições HTTP
- Web scraping
- Automação de tarefas

**Desafio Final**: Multi-Tool Scanner

### Kali Linux - Ferramentas de Pentest (6 horas)

**Módulo 1**: Information Gathering com Nmap
- Scanning básico
- Detecção de serviços e versões
- NSE Scripts

**Módulo 2**: Exploração com Metasploit
- Estrutura do framework
- Exploits e payloads
- Listeners e reverse shells

**Desafio**: Pentest completo em ambiente controlado

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express**: Servidor API RESTful
- **Dockerode**: Controle do Docker via API
- **WebSocket (ws)**: Comunicação real-time para progresso de downloads

### Frontend
- **React 18**: Framework UI
- **xterm.js**: Emulador de terminal
- **react-markdown**: Renderização de conteúdo
- **remark-gfm**: Suporte a GitHub Flavored Markdown

### DevOps
- **Docker**: Containerização de ambientes
- **Imagens Oficiais**: python, kalilinux, owasp/zap, etc

## 🎓 Pedagogia

### Metodologia

1. **Aprender**: Conteúdo teórico claro e objetivo
2. **Praticar**: Exercícios hands-on imediatos
3. **Aplicar**: Desafios complexos e reais
4. **Evoluir**: Sistema de pontos e feedback

### Gamificação

- ⭐ Pontos por ações
- 🎖️ Certificados de conclusão
- 🏆 Ranking entre estudantes
- ✅ Progresso visual

## 🚧 Próximas Melhorias

### Curto Prazo
- [ ] Adicionar mais laboratórios (Ruby, Go, Rust)
- [ ] Sistema de hints nos exercícios
- [ ] Modo escuro/claro
- [ ] Salvar código localmente

### Médio Prazo
- [ ] Banco de dados (PostgreSQL) para persistência
- [ ] Autenticação de usuários (JWT)
- [ ] Sistema de comentários nas lições
- [ ] Fórum de discussão

### Longo Prazo
- [ ] Máquinas virtuais vulneráveis (CTF)
- [ ] Competições entre estudantes
- [ ] Certificados oficiais
- [ ] Marketplace de laboratórios da comunidade

## 📊 Métricas de Sucesso

O sistema já suporta tracking de:

- Lições visualizadas e concluídas
- Exercícios resolvidos corretamente
- Tempo gasto em cada módulo
- Taxa de conclusão de laboratórios
- Pontuação total acumulada

## 🤝 Contribuindo

Para adicionar novos laboratórios, edite:

```javascript
// server/data/laboratories.js

const LABORATORIES = {
  seu_lab: {
    id: 'seu_lab',
    name: 'Nome do Lab',
    category: 'Categoria',
    icon: '🚀',
    image: 'imagem:tag',
    difficulty: 'beginner|intermediate|advanced',
    duration: '4 horas',
    description: 'Descrição...',
    modules: [
      // Seus módulos aqui
    ],
    challenges: [
      // Seus desafios aqui
    ]
  }
};
```

## 📝 Licença

Este projeto é parte do sistema de Bruteforce WiFi e segue a mesma licença.

## 🎉 Conclusão

O CyberLab é uma plataforma completa e profissional para aprendizado de cibersegurança, combinando:

✅ Conteúdo educacional de alta qualidade
✅ Prática hands-on com containers Docker
✅ Interface moderna e intuitiva
✅ Sistema de progresso gamificado
✅ Terminal web integrado
✅ Execução de código em tempo real

**Pronto para começar sua jornada em cibersegurança!** 🚀
