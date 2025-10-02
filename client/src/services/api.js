import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// WiFi APIs
export const scanNetworks = async () => {
  const response = await axios.get(`${API_BASE_URL}/wifi/scan`);
  return response.data;
};

export const startBruteforce = async (ssid, wordlistPath) => {
  const response = await axios.post(`${API_BASE_URL}/wifi/start`, {
    ssid,
    wordlistPath
  });
  return response.data;
};

export const stopBruteforce = async () => {
  const response = await axios.post(`${API_BASE_URL}/wifi/stop`);
  return response.data;
};

export const getStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/wifi/status`);
  return response.data;
};

// Wordlist APIs
export const getWordlists = async () => {
  const response = await axios.get(`${API_BASE_URL}/wordlist/list`);
  return response.data;
};

export const uploadWordlist = async (file) => {
  const formData = new FormData();
  formData.append('wordlist', file);

  const response = await axios.post(`${API_BASE_URL}/wordlist/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const createWordlist = async (name, passwords) => {
  const response = await axios.post(`${API_BASE_URL}/wordlist/create`, {
    name,
    passwords
  });
  return response.data;
};

export const deleteWordlist = async (filename) => {
  const response = await axios.delete(`${API_BASE_URL}/wordlist/${filename}`);
  return response.data;
};

// Network Analysis APIs
export const analyzeNetwork = async () => {
  const response = await axios.get(`${API_BASE_URL}/network/analyze`);
  return response.data;
};

export const scanVulnerabilities = async () => {
  const response = await axios.get(`${API_BASE_URL}/network/vulnerabilities`);
  return response.data;
};

export const speedTest = async () => {
  const response = await axios.get(`${API_BASE_URL}/network/speed-test`);
  return response.data;
};

export const getNetworkStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/network/status`);
  return response.data;
};

export const detectAttacks = async () => {
  const response = await axios.get(`${API_BASE_URL}/network/attack-detection`);
  return response.data;
};

export const getConnectedDevices = async () => {
  const response = await axios.get(`${API_BASE_URL}/network/devices`);
  return response.data;
};

export const getPerformance = async () => {
  const response = await axios.get(`${API_BASE_URL}/network/performance`);
  return response.data;
};

export const runPentest = async (ssid, tests) => {
  const response = await axios.post(`${API_BASE_URL}/network/pentest`, {
    ssid,
    tests
  });
  return response.data;
};

// Advanced Pentesting APIs
export const executeCode = async (language, code) => {
  const response = await axios.post(`${API_BASE_URL}/pentest/execute`, {
    language,
    code
  });
  return response.data;
};

export const testExploit = async (target, port, payloadType) => {
  const response = await axios.post(`${API_BASE_URL}/pentest/exploit`, {
    target,
    port,
    payloadType
  });
  return response.data;
};

export const scanPorts = async (target, ports) => {
  const response = await axios.post(`${API_BASE_URL}/pentest/port-scan`, {
    target,
    ports
  });
  return response.data;
};

export const crackHash = async (hash, hashType) => {
  const response = await axios.post(`${API_BASE_URL}/pentest/hash-crack`, {
    hash,
    hashType
  });
  return response.data;
};

export const webFuzzer = async (target, wordlist) => {
  const response = await axios.post(`${API_BASE_URL}/pentest/web-fuzzer`, {
    target,
    wordlist
  });
  return response.data;
};

// Documentation APIs
export const getDocumentation = async () => {
  const response = await axios.get(`${API_BASE_URL}/docs/generate`);
  return response.data;
};

export const getUserGuide = async () => {
  const response = await axios.get(`${API_BASE_URL}/docs/user-guide`);
  return response.data;
};

export const exportReport = async (format, data) => {
  const response = await axios.post(`${API_BASE_URL}/docs/export`, {
    format,
    data
  });
  return response.data;
};
