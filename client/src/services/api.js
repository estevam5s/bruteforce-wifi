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
