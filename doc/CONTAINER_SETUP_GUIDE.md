# 🐳 Guia do Sistema de Setup Automático de Containers

## ✨ O que foi implementado

Sistema completo de gerenciamento automático de containers para os laboratórios, com:

### 🎯 Funcionalidades Principais

1. **Detecção Automática** de containers existentes
2. **Modal Elegante** de seleção de versão
3. **Download com Progresso em Tempo Real**
4. **Integração Total** com o laboratório

## 🚀 Como Funciona

### Fluxo de Uso

1. **Usuário clica em "🚀 Iniciar Laboratório"**
   - Sistema verifica se já existe container rodando para aquele lab
   - Se **SIM**: Vai direto para o aprendizado ✅
   - Se **NÃO**: Abre modal de setup 🔧

2. **Modal de Seleção de Versão**
   - Mostra versões disponíveis (ex: Python 3.11, 3.10, 3.9)
   - Indica tamanho de cada imagem (~150MB, ~800MB, etc)
   - Usuário seleciona a versão desejada
   - Clica em "🚀 Continuar"

3. **Download Automático** (se imagem não existe)
   - Animação elegante de download
   - Barra de progresso em tempo real
   - Status detalhado (Pulling, Extracting, Complete)
   - WebSocket para atualizações instantâneas

4. **Criação do Container**
   - Container é criado automaticamente após download
   - Status muda para "Iniciando ambiente..."
   - Container é iniciado e fica pronto

5. **Ambiente Pronto!** ✅
   - Modal mostra sucesso
   - Exibe detalhes do container (nome, status, imagem)
   - Botão "🎓 Começar Aprendizado"
   - Redireciona para interface de aprendizado

## 📋 Versões Disponíveis por Laboratório

### 🐍 Python para Cibersegurança
- **Python 3.11** (Recomendado) - `python:3.11-slim` (~150MB)
- **Python 3.10** - `python:3.10-slim` (~145MB)
- **Python 3.9** - `python:3.9-slim` (~140MB)

### 🔓 Kali Linux - Ferramentas de Pentest
- **Kali Rolling** - `kalilinux/kali-rolling` (~800MB)

### 🦈 Network Security & Packet Analysis
- **Wireshark Latest** - `linuxserver/wireshark:latest` (~400MB)

### 🕷️ Web Application Security
- **OWASP ZAP Stable** - `owasp/zap2docker-stable` (~1GB)

### 🐳 Docker & Container Security
- **Docker in Docker** - `docker:dind` (~250MB)

## 🎨 Interface do Modal

### Estrutura Visual

```
┌─────────────────────────────────────────────┐
│  🐍 Python para Cibersegurança         [✕] │
├─────────────────────────────────────────────┤
│  [1] Selecione a versão do ambiente        │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ [✓] Python 3.11 (Recomendado)        │ │
│  │     python:3.11-slim                  │ │
│  │     Tamanho: ~150MB                   │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ [ ] Python 3.10                       │ │
│  │     python:3.10-slim                  │ │
│  │     Tamanho: ~145MB                   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  [Cancelar]              [🚀 Continuar]   │
└─────────────────────────────────────────────┘
```

### Estados do Modal

1. **Seleção de Versão** (step: 'version')
   - Cards clicáveis com versões
   - Destaque visual na versão selecionada
   - Botão "Continuar" habilitado apenas com seleção

2. **Download em Progresso** (step: 'downloading')
   - Animação de download (ícone 📥 com ondas)
   - Barra de progresso animada
   - Porcentagem em tempo real
   - Status detalhado (ex: "Pulling fs layer...")
   - Dica sobre download único

3. **Iniciando Container** (step: 'starting')
   - Spinner animado
   - Texto "Configurando o ambiente..."

4. **Ambiente Pronto** (step: 'ready')
   - Ícone de sucesso ✅ com animação
   - Detalhes do container
   - Botão grande "🎓 Começar Aprendizado"

## 🔧 Integração com o Terminal

Quando o usuário entra no laboratório:

1. **Container ativo** é passado para o `LaboratoryView`
2. **Terminal web** se conecta ao container
3. **Execução de código** usa o container selecionado
4. **Exercícios práticos** rodam no ambiente configurado

### Exemplo de Uso no Python Lab

```javascript
// Container Python 3.11 está rodando
// Usuário escreve código no editor:
print("Hello from CyberLab!")
import socket
print(socket.gethostname())

// Clica em "▶️ Executar"
// Código roda no container Python 3.11
// Saída aparece em tempo real
```

## 📁 Arquivos Criados

```
client/src/
├── components/
│   ├── ContainerSetupModal.js    [NOVO] - Modal de setup
│   └── CyberLab.js                [MODIFICADO] - Integração
│
└── styles/
    └── ContainerSetupModal.css    [NOVO] - Estilos do modal

server/routes/
└── cyberLab.js                    [MODIFICADO] - Suporte customImage
```

## 🎯 Melhorias Implementadas

### Frontend

1. **Estado de Container por Lab** - `labContainer` separado de `selectedContainer`
2. **Verificação Inteligente** - Busca container existente antes de criar novo
3. **Modal Responsivo** - Funciona em desktop e mobile
4. **Animações Suaves** - Transições e feedback visual
5. **WebSocket Integration** - Progresso em tempo real

### Backend

1. **Custom Image Support** - Aceita `customImage` no POST /create
2. **Template Flexibility** - Usa imagem customizada ou padrão
3. **Error Handling** - Tratamento robusto de erros
4. **Progress Tracking** - WebSocket para progresso de pull

## 🧪 Como Testar

### 1. Reiniciar Servidores

```bash
# Terminal 1 - Backend
cd /Users/cliente/Documents/cyber/bruteforce-wifi
pkill -9 -f "node server/index.js"
node server/index.js

# Terminal 2 - Frontend (deve recarregar automaticamente)
# Se não recarregar, Cmd+R no navegador
```

### 2. Acessar Laboratórios

1. Abra http://localhost:3000
2. Vá para "🎓 Laboratórios de Aprendizado"
3. Clique em qualquer laboratório

### 3. Testar Fluxos

#### Fluxo 1: Primeira Vez (Download Necessário)
1. Clique em "Python para Cibersegurança"
2. Modal abre com seleção de versão
3. Selecione "Python 3.11 (Recomendado)"
4. Clique "🚀 Continuar"
5. **Aguarde o download** (barra de progresso)
6. Quando pronto, clique "🎓 Começar Aprendizado"
7. Verifique que o terminal funciona

#### Fluxo 2: Container Existente
1. Saia do laboratório
2. Volte para "Laboratórios de Aprendizado"
3. Clique no mesmo laboratório novamente
4. **Deve ir direto** para o aprendizado (sem modal)

#### Fluxo 3: Múltiplas Versões
1. Vá para "🐳 Meus Containers"
2. Remova o container Python
3. Volte e clique no lab Python
4. Selecione **Python 3.10** desta vez
5. Baixe e teste

## 🎨 Customização

### Adicionar Novas Versões

Edite `ContainerSetupModal.js`:

```javascript
function getVersionsForLab(labId) {
  const versionMap = {
    seu_lab: [
      {
        id: 'imagem:tag',
        label: 'Descrição',
        size: '~200MB'
      },
      // Adicione mais versões...
    ]
  };
  // ...
}
```

### Personalizar Animações

Edite `ContainerSetupModal.css`:

```css
/* Mudar cor do progresso */
.progress-bar-fill {
  background: linear-gradient(90deg, #seu-cor 0%, #outra-cor 100%);
}

/* Ajustar velocidade de animações */
@keyframes wave {
  /* Seus ajustes */
}
```

## 🐛 Troubleshooting

### Modal não abre
- Verifique console do navegador (F12)
- Confirme que backend está rodando
- Verifique se há erros na API `/api/cyberlab/laboratories`

### Download trava
- Verifique conexão com Docker
- Abra Docker Desktop
- Teste manualmente: `docker pull python:3.11-slim`

### Container não inicia
- Veja logs: "🐳 Meus Containers" → "📝 Logs"
- Verifique Docker: `docker ps -a`
- Tente remover e criar novamente

### WebSocket não conecta
- Verifique porta 5000
- Firewall pode estar bloqueando
- Tente restart do backend

## 🎉 Resultado Final

✅ Sistema completo de setup de containers
✅ Modal elegante e profissional
✅ Download com progresso em tempo real
✅ Integração total com o aprendizado
✅ Detecção inteligente de containers existentes
✅ Suporte a múltiplas versões por tecnologia

**Pronto para estudantes aprenderem de forma profissional!** 🚀
