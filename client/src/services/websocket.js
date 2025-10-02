let ws = null;
let reconnectInterval = null;

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

export const connectWebSocket = (onMessage) => {
  // Fechar conexão existente se houver
  if (ws) {
    ws.close();
  }

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('✅ WebSocket conectado');

    // Limpar interval de reconexão se existir
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      onMessage(message);
    } catch (error) {
      console.error('Erro ao parsear mensagem WebSocket:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('❌ Erro WebSocket:', error);
  };

  ws.onclose = () => {
    console.log('🔌 WebSocket desconectado. Tentando reconectar...');

    // Tentar reconectar após 3 segundos
    if (!reconnectInterval) {
      reconnectInterval = setInterval(() => {
        console.log('🔄 Tentando reconectar...');
        connectWebSocket(onMessage);
      }, 3000);
    }
  };

  return ws;
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }

  if (reconnectInterval) {
    clearInterval(reconnectInterval);
    reconnectInterval = null;
  }
};

export const sendMessage = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket não está conectado');
  }
};
