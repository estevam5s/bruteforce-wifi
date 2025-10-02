const express = require('express');
const router = express.Router();
const { spawn, exec } = require('child_process');
const Docker = require('dockerode');
const { getLaboratoryById, getAllLaboratories, getCategories } = require('../data/laboratories');

// Configuração do Docker baseada no sistema operacional
const os = require('os');
const fs = require('fs');

let docker;

// Função para detectar o socket do Docker
function getDockerSocket() {
  const possibleSockets = [
    '/Users/cliente/.docker/run/docker.sock',  // Docker Desktop no Mac (usuário específico)
    `${os.homedir()}/.docker/run/docker.sock`, // Docker Desktop no Mac (qualquer usuário)
    '/var/run/docker.sock',                    // Linux/Mac padrão
  ];

  for (const socketPath of possibleSockets) {
    if (fs.existsSync(socketPath)) {
      console.log(`✅ Docker socket encontrado: ${socketPath}`);
      return socketPath;
    }
  }

  console.log('⚠️ Nenhum socket Docker encontrado. Usando configuração padrão.');
  return '/var/run/docker.sock';
}

try {
  const socketPath = getDockerSocket();
  docker = new Docker({ socketPath });
  console.log('🐳 Docker inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Docker:', error.message);
  docker = new Docker({ socketPath: '/var/run/docker.sock' }); // Fallback
}

// Templates de containers disponíveis
const CONTAINER_TEMPLATES = {
  // Linguagens de Programação
  python: {
    id: 'python',
    name: 'Python 3.11',
    category: 'Linguagens de Programação',
    image: 'python:3.11-slim',
    description: 'Ambiente Python com pip e bibliotecas científicas',
    icon: '🐍',
    cmd: ['/bin/bash'],
    tty: true,
    openStdin: true,
    workingDir: '/workspace'
  },
  nodejs: {
    id: 'nodejs',
    name: 'Node.js 20',
    category: 'Linguagens de Programação',
    image: 'node:20-alpine',
    description: 'Ambiente Node.js com npm e ferramentas de desenvolvimento',
    icon: '📗',
    cmd: ['/bin/sh'],
    tty: true,
    openStdin: true,
    workingDir: '/workspace'
  },
  java: {
    id: 'java',
    name: 'Java OpenJDK 17',
    category: 'Linguagens de Programação',
    image: 'openjdk:17-slim',
    description: 'Ambiente Java com OpenJDK e Maven',
    icon: '☕',
    cmd: ['/bin/bash'],
    tty: true,
    openStdin: true,
    workingDir: '/workspace'
  },
  go: {
    id: 'go',
    name: 'Golang 1.21',
    category: 'Linguagens de Programação',
    image: 'golang:1.21-alpine',
    description: 'Ambiente Go com ferramentas de build',
    icon: '🔵',
    cmd: ['/bin/sh'],
    tty: true,
    openStdin: true,
    workingDir: '/workspace'
  },

  // Sistemas Operacionais
  ubuntu: {
    id: 'ubuntu',
    name: 'Ubuntu 22.04',
    category: 'Sistemas Operacionais',
    image: 'ubuntu:22.04',
    description: 'Sistema Ubuntu completo para práticas Linux',
    icon: '🐧',
    cmd: ['/bin/bash'],
    tty: true,
    openStdin: true,
    workingDir: '/root'
  },
  alpine: {
    id: 'alpine',
    name: 'Alpine Linux',
    category: 'Sistemas Operacionais',
    image: 'alpine:latest',
    description: 'Sistema Linux minimalista e leve',
    icon: '⛰️',
    cmd: ['/bin/sh'],
    tty: true,
    openStdin: true,
    workingDir: '/root'
  },
  debian: {
    id: 'debian',
    name: 'Debian 12',
    category: 'Sistemas Operacionais',
    image: 'debian:12-slim',
    description: 'Sistema Debian estável',
    icon: '🌀',
    cmd: ['/bin/bash'],
    tty: true,
    openStdin: true,
    workingDir: '/root'
  },

  // Bancos de Dados
  postgres: {
    id: 'postgres',
    name: 'PostgreSQL 16',
    category: 'Bancos de Dados',
    image: 'postgres:16-alpine',
    description: 'Banco de dados PostgreSQL com psql',
    icon: '🐘',
    cmd: ['postgres'],
    env: ['POSTGRES_PASSWORD=postgres', 'POSTGRES_USER=postgres', 'POSTGRES_DB=testdb'],
    exposedPorts: { '5432/tcp': {} }
  },
  mysql: {
    id: 'mysql',
    name: 'MySQL 8',
    category: 'Bancos de Dados',
    image: 'mysql:8-debian',
    description: 'Banco de dados MySQL',
    icon: '🐬',
    cmd: ['mysqld'],
    env: ['MYSQL_ROOT_PASSWORD=root', 'MYSQL_DATABASE=testdb'],
    exposedPorts: { '3306/tcp': {} }
  },
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB 7',
    category: 'Bancos de Dados',
    image: 'mongo:7',
    description: 'Banco de dados NoSQL MongoDB',
    icon: '🍃',
    cmd: ['mongod'],
    exposedPorts: { '27017/tcp': {} }
  },
  redis: {
    id: 'redis',
    name: 'Redis 7',
    category: 'Bancos de Dados',
    image: 'redis:7-alpine',
    description: 'Cache e banco de dados Redis',
    icon: '📮',
    cmd: ['redis-server'],
    exposedPorts: { '6379/tcp': {} }
  },

  // Ferramentas de Cibersegurança
  kali: {
    id: 'kali',
    name: 'Kali Linux',
    category: 'Cibersegurança',
    image: 'kalilinux/kali-rolling',
    description: 'Sistema Kali Linux com ferramentas de pentest',
    icon: '🔓',
    cmd: ['/bin/bash'],
    tty: true,
    openStdin: true,
    workingDir: '/root',
    privileged: true
  },
  metasploit: {
    id: 'metasploit',
    name: 'Metasploit Framework',
    category: 'Cibersegurança',
    image: 'metasploitframework/metasploit-framework',
    description: 'Framework de exploração Metasploit',
    icon: '💣',
    cmd: ['/bin/bash'],
    tty: true,
    openStdin: true,
    workingDir: '/root'
  },
  nmap: {
    id: 'nmap',
    name: 'Nmap Scanner',
    category: 'Cibersegurança',
    image: 'instrumentisto/nmap',
    description: 'Ferramenta de scanning de rede Nmap',
    icon: '🔍',
    cmd: ['/bin/sh'],
    tty: true,
    openStdin: true,
    networkMode: 'host'
  },
  wireshark: {
    id: 'wireshark',
    name: 'Wireshark (TShark)',
    category: 'Cibersegurança',
    image: 'linuxserver/wireshark',
    description: 'Analisador de pacotes de rede',
    icon: '🦈',
    cmd: ['/bin/bash'],
    tty: true,
    openStdin: true,
    networkMode: 'host'
  },
  burpsuite: {
    id: 'burpsuite',
    name: 'OWASP ZAP',
    category: 'Cibersegurança',
    image: 'owasp/zap2docker-stable',
    description: 'Proxy de interceptação para testes web',
    icon: '🕷️',
    cmd: ['zap.sh', '-daemon', '-host', '0.0.0.0', '-port', '8080'],
    exposedPorts: { '8080/tcp': {} }
  },

  // Docker
  dockerindocker: {
    id: 'dockerindocker',
    name: 'Docker in Docker',
    category: 'DevOps',
    image: 'docker:dind',
    description: 'Docker dentro do Docker para práticas avançadas',
    icon: '🐳',
    cmd: ['dockerd-entrypoint.sh'],
    privileged: true,
    tty: true,
    openStdin: true
  }
};

// Verificar status do Docker
router.get('/status', async (req, res) => {
  try {
    await docker.ping();
    const info = await docker.info();
    res.json({
      available: true,
      version: info.ServerVersion,
      containers: info.Containers,
      images: info.Images,
      os: info.OperatingSystem
    });
  } catch (error) {
    res.json({
      available: false,
      error: error.message,
      hint: 'Docker não está rodando. Inicie o Docker Desktop e tente novamente.'
    });
  }
});

// Listar templates disponíveis
router.get('/templates', (req, res) => {
  const templates = Object.values(CONTAINER_TEMPLATES).map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    icon: t.icon,
    image: t.image
  }));

  const categories = [...new Set(templates.map(t => t.category))];

  res.json({
    templates,
    categories,
    total: templates.length
  });
});

// Listar containers em execução
router.get('/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });

    const formattedContainers = containers.map(container => ({
      id: container.Id.substring(0, 12),
      fullId: container.Id,
      name: container.Names[0].replace('/', ''),
      image: container.Image,
      status: container.State,
      created: container.Created,
      ports: container.Ports,
      labels: container.Labels
    }));

    res.json({
      containers: formattedContainers,
      total: formattedContainers.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to list containers',
      details: error.message
    });
  }
});

// Criar container
router.post('/create', async (req, res) => {
  try {
    const { templateId, containerName, customImage } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    const template = CONTAINER_TEMPLATES[templateId];
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const name = containerName || `cyberlab-${templateId}-${Date.now()}`;
    const imageToUse = customImage || template.image;

    // Verificar se a imagem existe, se não, fazer pull
    try {
      await docker.getImage(imageToUse).inspect();
    } catch (error) {
      // Imagem não existe, iniciar pull
      const wss = req.app.get('wss');

      return res.json({
        message: 'Image needs to be pulled first',
        action: 'pull',
        image: imageToUse,
        name,
        templateId
      });
    }

    // Criar container
    const container = await docker.createContainer({
      Image: imageToUse,
      name,
      Cmd: template.cmd,
      Tty: template.tty || false,
      OpenStdin: template.openStdin || false,
      AttachStdin: template.openStdin || false,
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: template.workingDir || '/',
      Env: template.env || [],
      ExposedPorts: template.exposedPorts || {},
      HostConfig: {
        NetworkMode: template.networkMode || 'bridge',
        Privileged: template.privileged || false,
        AutoRemove: false
      },
      Labels: {
        'cyberlab': 'true',
        'cyberlab.template': templateId
      }
    });

    // Iniciar container
    await container.start();

    const info = await container.inspect();

    res.json({
      success: true,
      container: {
        id: info.Id.substring(0, 12),
        fullId: info.Id,
        name: info.Name.replace('/', ''),
        image: imageToUse,
        status: info.State.Status,
        template: templateId
      }
    });

  } catch (error) {
    console.error('Error creating container:', error);
    res.status(500).json({
      error: 'Failed to create container',
      details: error.message
    });
  }
});

// Pull de imagem com progresso
router.post('/pull', async (req, res) => {
  try {
    const { image, containerName, templateId } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const pullId = Date.now().toString();

    res.json({
      message: 'Image pull started',
      pullId,
      image
    });

    // Iniciar pull em background
    const wss = req.app.get('wss');

    docker.pull(image, (err, stream) => {
      if (err) {
        broadcastToClients(wss, {
          type: 'image_pull_error',
          data: {
            pullId,
            error: err.message
          }
        });
        return;
      }

      docker.modem.followProgress(stream, async (err, output) => {
        if (err) {
          broadcastToClients(wss, {
            type: 'image_pull_error',
            data: {
              pullId,
              error: err.message
            }
          });
          return;
        }

        // Pull completo
        broadcastToClients(wss, {
          type: 'image_pull_complete',
          data: {
            pullId,
            image,
            containerName,
            templateId
          }
        });

      }, (event) => {
        // Progresso do pull
        broadcastToClients(wss, {
          type: 'image_pull_progress',
          data: {
            pullId,
            image,
            status: event.status,
            progress: event.progress,
            id: event.id
          }
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to pull image',
      details: error.message
    });
  }
});

// Parar container
router.post('/stop/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const container = docker.getContainer(containerId);

    await container.stop();

    res.json({
      success: true,
      message: 'Container stopped',
      containerId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to stop container',
      details: error.message
    });
  }
});

// Remover container
router.delete('/remove/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const container = docker.getContainer(containerId);

    // Parar se estiver rodando
    try {
      await container.stop();
    } catch (e) {
      // Container já parado
    }

    await container.remove();

    const wss = req.app.get('wss');
    broadcastToClients(wss, {
      type: 'container_removed',
      data: { containerId }
    });

    res.json({
      success: true,
      message: 'Container removed',
      containerId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to remove container',
      details: error.message
    });
  }
});

// Obter logs do container
router.get('/logs/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const container = docker.getContainer(containerId);

    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100,
      timestamps: true
    });

    res.json({
      success: true,
      logs: logs.toString('utf-8')
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get logs',
      details: error.message
    });
  }
});

// Obter estatísticas do container
router.get('/stats/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const container = docker.getContainer(containerId);

    const stats = await container.stats({ stream: false });

    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

    const memoryUsage = stats.memory_stats.usage || 0;
    const memoryLimit = stats.memory_stats.limit || 0;
    const memoryPercent = (memoryUsage / memoryLimit) * 100;

    res.json({
      success: true,
      stats: {
        cpu: cpuPercent.toFixed(2),
        memory: {
          usage: (memoryUsage / 1024 / 1024).toFixed(2), // MB
          limit: (memoryLimit / 1024 / 1024).toFixed(2), // MB
          percent: memoryPercent.toFixed(2)
        },
        network: stats.networks
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get stats',
      details: error.message
    });
  }
});

// Executar comando no container (terminal)
router.post('/exec/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    const container = docker.getContainer(containerId);

    const exec = await container.exec({
      Cmd: ['/bin/sh', '-c', command],
      AttachStdout: true,
      AttachStderr: true
    });

    const stream = await exec.start({ hijack: true, stdin: true });

    let output = '';

    stream.on('data', (chunk) => {
      output += chunk.toString('utf-8');
    });

    stream.on('end', () => {
      res.json({
        success: true,
        output: output
      });
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to execute command',
      details: error.message
    });
  }
});

// Função auxiliar para broadcast
const broadcastToClients = (wss, message) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN
        client.send(JSON.stringify(message));
      }
    });
  }
};

// ========== SISTEMA DE LABORATÓRIOS EDUCACIONAIS ==========

// Armazenamento em memória do progresso (em produção, usar banco de dados)
const userProgress = {};

// Listar todos os laboratórios disponíveis
router.get('/laboratories', (req, res) => {
  try {
    const labs = getAllLaboratories();
    const categories = getCategories();

    res.json({
      success: true,
      laboratories: labs,
      categories,
      total: labs.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load laboratories',
      details: error.message
    });
  }
});

// Obter detalhes completos de um laboratório
router.get('/laboratories/:labId', (req, res) => {
  try {
    const { labId } = req.params;
    const lab = getLaboratoryById(labId);

    if (!lab) {
      return res.status(404).json({
        error: 'Laboratory not found'
      });
    }

    res.json({
      success: true,
      laboratory: lab
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load laboratory',
      details: error.message
    });
  }
});

// Obter progresso do usuário em um laboratório
router.get('/progress/:userId/:labId', (req, res) => {
  try {
    const { userId, labId } = req.params;
    const key = `${userId}_${labId}`;

    const progress = userProgress[key] || {
      labId,
      userId,
      completedLessons: [],
      completedExercises: [],
      completedChallenges: [],
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      totalPoints: 0,
      certificates: []
    };

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load progress',
      details: error.message
    });
  }
});

// Marcar lição como concluída
router.post('/progress/:userId/:labId/lesson', (req, res) => {
  try {
    const { userId, labId } = req.params;
    const { moduleId, lessonId } = req.body;
    const key = `${userId}_${labId}`;

    if (!userProgress[key]) {
      userProgress[key] = {
        labId,
        userId,
        completedLessons: [],
        completedExercises: [],
        completedChallenges: [],
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        totalPoints: 0,
        certificates: []
      };
    }

    const lessonKey = `${moduleId}_${lessonId}`;
    if (!userProgress[key].completedLessons.includes(lessonKey)) {
      userProgress[key].completedLessons.push(lessonKey);
      userProgress[key].totalPoints += 10; // 10 pontos por lição
    }

    userProgress[key].lastAccessedAt = new Date().toISOString();

    res.json({
      success: true,
      progress: userProgress[key]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update progress',
      details: error.message
    });
  }
});

// Marcar exercício como concluído
router.post('/progress/:userId/:labId/exercise', (req, res) => {
  try {
    const { userId, labId } = req.params;
    const { moduleId, lessonId, exerciseId, solution } = req.body;
    const key = `${userId}_${labId}`;

    if (!userProgress[key]) {
      userProgress[key] = {
        labId,
        userId,
        completedLessons: [],
        completedExercises: [],
        completedChallenges: [],
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        totalPoints: 0,
        certificates: []
      };
    }

    const exerciseKey = `${moduleId}_${lessonId}_${exerciseId}`;
    if (!userProgress[key].completedExercises.includes(exerciseKey)) {
      userProgress[key].completedExercises.push(exerciseKey);
      userProgress[key].totalPoints += 25; // 25 pontos por exercício
    }

    userProgress[key].lastAccessedAt = new Date().toISOString();

    res.json({
      success: true,
      progress: userProgress[key],
      message: 'Exercício concluído com sucesso! +25 pontos'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update progress',
      details: error.message
    });
  }
});

// Marcar desafio como concluído
router.post('/progress/:userId/:labId/challenge', (req, res) => {
  try {
    const { userId, labId } = req.params;
    const { challengeId, solution } = req.body;
    const key = `${userId}_${labId}`;

    if (!userProgress[key]) {
      userProgress[key] = {
        labId,
        userId,
        completedLessons: [],
        completedExercises: [],
        completedChallenges: [],
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        totalPoints: 0,
        certificates: []
      };
    }

    const lab = getLaboratoryById(labId);
    const challenge = lab?.challenges?.find(c => c.id === challengeId);

    if (!userProgress[key].completedChallenges.includes(challengeId)) {
      userProgress[key].completedChallenges.push(challengeId);
      const points = challenge?.points || 100;
      userProgress[key].totalPoints += points;

      // Verificar se ganhou certificado
      const totalExercises = lab?.modules.reduce((acc, mod) => {
        return acc + mod.lessons.reduce((acc2, lesson) => acc2 + (lesson.exercises?.length || 0), 0);
      }, 0) || 0;

      const completionRate = userProgress[key].completedExercises.length / totalExercises;

      if (completionRate >= 0.8 && userProgress[key].completedChallenges.length >= 1) {
        if (!userProgress[key].certificates.includes(labId)) {
          userProgress[key].certificates.push(labId);
        }
      }
    }

    userProgress[key].lastAccessedAt = new Date().toISOString();

    res.json({
      success: true,
      progress: userProgress[key],
      message: `Desafio concluído! +${challenge?.points || 100} pontos`,
      certificateEarned: userProgress[key].certificates.includes(labId)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update progress',
      details: error.message
    });
  }
});

// Executar código Python no container
router.post('/execute/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const container = docker.getContainer(containerId);

    // Criar arquivo temporário com o código
    const filename = `/tmp/code_${Date.now()}.${language === 'python' ? 'py' : 'sh'}`;
    const createFileCmd = `cat > ${filename} << 'ENDOFFILE'
${code}
ENDOFFILE`;

    // Criar arquivo
    const createExec = await container.exec({
      Cmd: ['/bin/sh', '-c', createFileCmd],
      AttachStdout: true,
      AttachStderr: true
    });
    await createExec.start({ hijack: true });

    // Executar código
    let executeCmd;
    if (language === 'python') {
      executeCmd = `python3 ${filename}`;
    } else {
      executeCmd = `bash ${filename}`;
    }

    const exec = await container.exec({
      Cmd: ['/bin/sh', '-c', executeCmd],
      AttachStdout: true,
      AttachStderr: true
    });

    const stream = await exec.start({ hijack: true, stdin: true });

    let output = '';
    let errorOutput = '';

    stream.on('data', (chunk) => {
      const str = chunk.toString('utf-8');
      // Docker usa multiplexing, primeiro byte indica tipo
      const type = chunk[0];
      const data = chunk.slice(8).toString('utf-8');

      if (type === 1) { // stdout
        output += data;
      } else if (type === 2) { // stderr
        errorOutput += data;
      }
    });

    stream.on('end', () => {
      // Limpar arquivo temporário
      container.exec({
        Cmd: ['/bin/sh', '-c', `rm -f ${filename}`],
        AttachStdout: false,
        AttachStderr: false
      }).then(exec => exec.start({ hijack: true }));

      res.json({
        success: true,
        output: output || errorOutput,
        error: errorOutput && !output ? true : false
      });
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to execute code',
      details: error.message
    });
  }
});

// Obter ranking de usuários
router.get('/leaderboard/:labId', (req, res) => {
  try {
    const { labId } = req.params;

    // Filtrar progresso para o laboratório específico
    const leaderboard = Object.values(userProgress)
      .filter(p => p.labId === labId)
      .map(p => ({
        userId: p.userId,
        totalPoints: p.totalPoints,
        completedExercises: p.completedExercises.length,
        completedChallenges: p.completedChallenges.length,
        certificates: p.certificates.length
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 100); // Top 100

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load leaderboard',
      details: error.message
    });
  }
});

// Obter estatísticas gerais do usuário
router.get('/stats/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    // Calcular estatísticas
    const userLabs = Object.values(userProgress).filter(p => p.userId === userId);

    const stats = {
      totalLabs: userLabs.length,
      totalPoints: userLabs.reduce((acc, p) => acc + p.totalPoints, 0),
      totalExercises: userLabs.reduce((acc, p) => acc + p.completedExercises.length, 0),
      totalChallenges: userLabs.reduce((acc, p) => acc + p.completedChallenges.length, 0),
      totalCertificates: userLabs.reduce((acc, p) => acc + p.certificates.length, 0),
      recentActivity: userLabs
        .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
        .slice(0, 5)
        .map(p => ({
          labId: p.labId,
          lastAccessed: p.lastAccessedAt,
          progress: p.completedExercises.length
        }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load stats',
      details: error.message
    });
  }
});

module.exports = router;
