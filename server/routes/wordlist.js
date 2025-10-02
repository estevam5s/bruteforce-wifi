const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// Configurar multer para upload de wordlists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../wordlists');
    if (!fsSync.existsSync(uploadDir)) {
      fsSync.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Listar wordlists disponíveis
router.get('/list', async (req, res) => {
  try {
    const wordlistDir = path.join(__dirname, '../../wordlists');

    // Criar diretório se não existir
    if (!fsSync.existsSync(wordlistDir)) {
      fsSync.mkdirSync(wordlistDir, { recursive: true });
    }

    const files = await fs.readdir(wordlistDir);
    const wordlists = [];

    for (const file of files) {
      const filePath = path.join(wordlistDir, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim()).length;

        wordlists.push({
          name: file,
          path: filePath,
          size: stats.size,
          passwordCount: lines,
          isDefault: file === 'words.txt'
        });
      }
    }

    res.json({ success: true, wordlists });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload de nova wordlist
router.post('/upload', upload.single('wordlist'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Nenhum arquivo enviado' });
    }

    res.json({
      success: true,
      message: 'Wordlist enviada com sucesso',
      file: {
        name: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Criar nova wordlist manualmente
router.post('/create', async (req, res) => {
  try {
    const { name, passwords } = req.body;

    if (!name || !passwords || !Array.isArray(passwords)) {
      return res.status(400).json({
        success: false,
        error: 'Nome e lista de senhas são obrigatórios'
      });
    }

    const wordlistDir = path.join(__dirname, '../../wordlists');
    if (!fsSync.existsSync(wordlistDir)) {
      fsSync.mkdirSync(wordlistDir, { recursive: true });
    }

    const filePath = path.join(wordlistDir, `${name}.txt`);
    const content = passwords.join('\n');

    await fs.writeFile(filePath, content, 'utf-8');

    res.json({
      success: true,
      message: 'Wordlist criada com sucesso',
      file: {
        name: `${name}.txt`,
        path: filePath,
        passwordCount: passwords.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deletar wordlist
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../wordlists', filename);

    // Não permitir deletar a wordlist padrão
    if (filename === 'words.txt') {
      return res.status(403).json({
        success: false,
        error: 'Não é possível deletar a wordlist padrão'
      });
    }

    await fs.unlink(filePath);
    res.json({ success: true, message: 'Wordlist deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
