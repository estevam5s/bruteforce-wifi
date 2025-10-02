# 🐳 Configuração do Docker para o Laboratório de Cibersegurança

## 📋 Pré-requisitos

Para usar o **Laboratório de Cibersegurança**, você precisa ter o Docker instalado e rodando.

## 🚀 Instalação do Docker

### macOS

1. **Baixe o Docker Desktop:**
   - Visite: https://www.docker.com/products/docker-desktop
   - Clique em "Download for Mac"
   - Escolha a versão apropriada (Intel ou Apple Silicon)

2. **Instale o Docker Desktop:**
   - Abra o arquivo `.dmg` baixado
   - Arraste o ícone do Docker para a pasta Applications
   - Abra o Docker Desktop da pasta Applications

3. **Aguarde a inicialização:**
   - O Docker pode levar alguns minutos para iniciar
   - Você verá o ícone da baleia na barra de menu
   - Quando estiver pronto, o ícone ficará estável

## ✅ Verificando a Instalação

Abra o Terminal e execute:

```bash
docker --version
docker ps
```

Se os comandos funcionarem, o Docker está pronto!

## 🔧 Configuração do Socket do Docker

O laboratório tenta conectar automaticamente ao Docker usando:

1. `/var/run/docker.sock` (padrão Linux/Mac)
2. `/Users/cliente/.docker/run/docker.sock` (Docker Desktop Mac)
3. `localhost:2375` (Docker remoto)

### Verificar o socket do Docker Desktop no Mac:

```bash
ls -la ~/.docker/run/
```

Você deve ver o arquivo `docker.sock`.

## 🐛 Solução de Problemas

### Erro: "connect ECONNREFUSED"

**Causa:** Docker não está rodando

**Solução:**
1. Abra o Docker Desktop
2. Aguarde aparecer "Docker is running" na interface
3. Recarregue a página do laboratório

### Erro: "Cannot connect to Docker daemon"

**Solução:**
```bash
# Reinicie o Docker Desktop
# Ou execute no terminal:
sudo launchctl stop com.docker.docker
sudo launchctl start com.docker.docker
```

### Permissões negadas

```bash
# Adicione seu usuário ao grupo docker:
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

## 🎯 Testando o Laboratório

1. **Inicie o servidor backend:**
   ```bash
   cd server
   npm start
   ```

2. **Inicie o frontend:**
   ```bash
   cd client
   npm start
   ```

3. **Acesse:**
   - Abra http://localhost:3000
   - Vá para "Laboratório Docker"
   - Você deve ver: ✅ Docker [versão] disponível

## 📚 Uso do Laboratório

### Criar um Container

1. Vá para **"Catálogo de Ambientes"**
2. Escolha um template (Python, Ubuntu, Kali Linux, etc.)
3. Clique em **"🚀 Criar Container"**
4. Aguarde o download da imagem (primeira vez)
5. O container aparecerá em **"Meus Containers"**

### Usar o Terminal

1. Vá para **"Meus Containers"**
2. Clique em **"💻 Terminal"** no container desejado
3. Digite comandos no terminal interativo
4. Execute comandos Linux, Python, Node, etc.

### Remover Containers

1. Vá para **"Meus Containers"**
2. Clique em **"🗑️ Remover"** no container
3. Confirme a remoção

## 🎓 Exemplos de Containers Disponíveis

### Linguagens de Programação
- 🐍 Python 3.11
- 📗 Node.js 20
- ☕ Java 17
- 🔵 Golang 1.21

### Sistemas Operacionais
- 🐧 Ubuntu 22.04
- ⛰️ Alpine Linux
- 🌀 Debian 12

### Ferramentas de Segurança
- 🔓 Kali Linux
- 💣 Metasploit Framework
- 🔍 Nmap
- 🦈 Wireshark
- 🕷️ OWASP ZAP

### Bancos de Dados
- 🐘 PostgreSQL
- 🐬 MySQL
- 🍃 MongoDB
- 📮 Redis

## 💡 Dicas

- **Primeira vez:** O download de imagens pode demorar (dependendo da internet)
- **Espaço em disco:** Cada imagem ocupa de 100MB a 2GB
- **Performance:** Containers são leves e iniciam rapidamente
- **Isolamento:** Cada container é isolado e seguro
- **Aprendizado:** Use os containers para praticar comandos Linux, programação e segurança

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- Use os containers apenas para fins educacionais
- Não exponha containers publicamente
- Remova containers quando não estiver usando
- Ferramentas de pentest devem ser usadas apenas em ambientes autorizados

## 📞 Suporte

Se encontrar problemas:

1. Verifique se o Docker Desktop está aberto
2. Verifique se o servidor backend está rodando
3. Consulte os logs do servidor (terminal onde rodou `npm start`)
4. Tente reiniciar o Docker Desktop

---

**Desenvolvido para fins educacionais** 🎓
