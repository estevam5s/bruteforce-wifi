import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import '../styles/TerminalEmulator.css';

const TerminalEmulator = ({ containerId }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Criar instância do terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#00ff00',
        black: '#000000',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#d19a66',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#abb2bf',
        brightBlack: '#5c6370',
        brightRed: '#e06c75',
        brightGreen: '#98c379',
        brightYellow: '#d19a66',
        brightBlue: '#61afef',
        brightMagenta: '#c678dd',
        brightCyan: '#56b6c2',
        brightWhite: '#ffffff'
      },
      rows: 24,
      cols: 80
    });

    // Adicionar addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    // Abrir terminal no elemento DOM
    term.open(terminalRef.current);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Aguardar o terminal estar completamente inicializado antes de fazer fit
    const tryFit = () => {
      try {
        if (!fitAddon || !terminalRef.current) return false;

        const element = terminalRef.current;

        // Verificar se o elemento DOM tem dimensões válidas
        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
          return false;
        }

        // Verificar se o terminal xterm está completamente inicializado
        // O viewport precisa existir antes de chamar fit()
        if (!term._core || !term._core.viewport) {
          return false;
        }

        fitAddon.fit();
        return true;
      } catch (error) {
        console.warn('Erro ao fazer fit do terminal:', error);
        return false;
      }
    };

    // Usar requestAnimationFrame para garantir que o browser renderizou tudo
    // e múltiplas tentativas com delays incrementais
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!tryFit()) {
          setTimeout(() => {
            if (!tryFit()) {
              setTimeout(tryFit, 300);
            }
          }, 200);
        }
      }, 100);
    });

    // Mensagem de boas-vindas
    term.writeln('\x1b[1;32m╔═══════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[1;32m║         Terminal Web Integrado - CyberLab             ║\x1b[0m');
    term.writeln('\x1b[1;32m╚═══════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[1;33mDicas:\x1b[0m');
    term.writeln('  • Digite comandos e pressione Enter para executar');
    term.writeln('  • Use ↑↓ para navegar no histórico de comandos');
    term.writeln('  • clear - Limpar terminal');
    term.writeln('  • help - Ver comandos disponíveis');
    term.writeln('');

    if (!containerId) {
      term.writeln('\x1b[1;31m⚠️  Nenhum container ativo!\x1b[0m');
      term.writeln('\x1b[33mCrie um container no catálogo para executar comandos.\x1b[0m');
      term.writeln('');
    } else {
      term.writeln('\x1b[1;32m✓ Container conectado: ' + containerId + '\x1b[0m');
      term.writeln('');
    }

    writePrompt(term);

    // Resize handler
    const handleResize = () => {
      try {
        if (!fitAddon || !terminalRef.current || !term) return;

        const element = terminalRef.current;

        // Verificar se o elemento tem dimensões válidas
        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
          return;
        }

        // Verificar se o terminal está completamente inicializado
        if (!term._core || !term._core.viewport) {
          return;
        }

        fitAddon.fit();
      } catch (error) {
        console.warn('Erro ao fazer fit no resize:', error);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (term) {
        term.dispose();
      }
    };
  }, [containerId]);

  const writePrompt = (term) => {
    term.write('\x1b[1;36m$\x1b[0m ');
  };

  const executeCommand = async (cmd) => {
    const term = xtermRef.current;
    if (!term) return;

    term.writeln('');

    // Comandos locais
    if (cmd === 'clear') {
      term.clear();
      writePrompt(term);
      return;
    }

    if (cmd === 'help') {
      term.writeln('\x1b[1;33mComandos Disponíveis:\x1b[0m');
      term.writeln('  clear       - Limpar terminal');
      term.writeln('  help        - Mostrar esta ajuda');
      term.writeln('  history     - Ver histórico de comandos');
      term.writeln('');
      term.writeln('\x1b[1;33mComandos Linux Comuns:\x1b[0m');
      term.writeln('  ls          - Listar arquivos');
      term.writeln('  pwd         - Diretório atual');
      term.writeln('  cat <file>  - Ver conteúdo de arquivo');
      term.writeln('  python3     - Iniciar Python');
      term.writeln('  pip install - Instalar pacotes');
      term.writeln('');
      writePrompt(term);
      return;
    }

    if (cmd === 'history') {
      term.writeln('\x1b[1;33mHistórico de Comandos:\x1b[0m');
      history.forEach((h, i) => {
        term.writeln(`  ${i + 1}  ${h}`);
      });
      term.writeln('');
      writePrompt(term);
      return;
    }

    // Executar comando no container
    if (!containerId) {
      term.writeln('\x1b[1;31mErro: Nenhum container ativo!\x1b[0m');
      term.writeln('');
      writePrompt(term);
      return;
    }

    term.writeln('\x1b[90mExecutando...\x1b[0m');

    try {
      const response = await fetch(`http://localhost:5000/api/cyberlab/exec/${containerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });

      const data = await response.json();

      if (data.success) {
        // Limpar output do Docker (remove control characters)
        const output = data.output.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
        term.write(output);
      } else {
        term.writeln('\x1b[1;31mErro: ' + data.details + '\x1b[0m');
      }
    } catch (error) {
      term.writeln('\x1b[1;31mErro: ' + error.message + '\x1b[0m');
    }

    term.writeln('');
    writePrompt(term);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const term = xtermRef.current;
    if (!term) return;

    // Escrever comando no terminal
    term.write(command);

    // Adicionar ao histórico
    setHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Executar
    executeCommand(command);

    // Limpar input
    setCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="terminal-emulator">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="btn-close"></span>
          <span className="btn-minimize"></span>
          <span className="btn-maximize"></span>
        </div>
        <div className="terminal-title">
          Terminal - {containerId ? `Container: ${containerId.substring(0, 12)}` : 'Desconectado'}
        </div>
      </div>
      <div className="terminal-body">
        <div ref={terminalRef} className="xterm-container"></div>
      </div>
      <form onSubmit={handleCommandSubmit} className="terminal-input-area">
        <span className="input-prompt">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          placeholder="Digite um comando..."
          autoFocus
        />
        <button type="submit" className="btn-execute">
          ▶️ Executar
        </button>
      </form>
    </div>
  );
};

export default TerminalEmulator;
