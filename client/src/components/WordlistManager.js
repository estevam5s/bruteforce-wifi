import React, { useState, useEffect } from 'react';
import { getWordlists, uploadWordlist, createWordlist, deleteWordlist } from '../services/api';
import './WordlistManager.css';

function WordlistManager({ selectedWordlist, onSelectWordlist, disabled }) {
  const [wordlists, setWordlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWordlistName, setNewWordlistName] = useState('');
  const [newPasswords, setNewPasswords] = useState('');

  const loadWordlists = async () => {
    setLoading(true);
    try {
      const result = await getWordlists();
      setWordlists(result.wordlists);

      // Selecionar automaticamente a wordlist padrão
      const defaultWordlist = result.wordlists.find(w => w.isDefault);
      if (defaultWordlist && !selectedWordlist) {
        onSelectWordlist(defaultWordlist);
      }
    } catch (err) {
      console.error('Erro ao carregar wordlists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWordlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadWordlist(file);
      await loadWordlists();
    } catch (err) {
      alert('Erro ao fazer upload: ' + err.message);
    }
  };

  const handleCreate = async () => {
    if (!newWordlistName || !newPasswords) {
      alert('Preencha todos os campos');
      return;
    }

    const passwords = newPasswords.split('\n').filter(p => p.trim());

    try {
      await createWordlist(newWordlistName, passwords);
      setShowCreateModal(false);
      setNewWordlistName('');
      setNewPasswords('');
      await loadWordlists();
    } catch (err) {
      alert('Erro ao criar wordlist: ' + err.message);
    }
  };

  const handleDelete = async (wordlist) => {
    if (wordlist.isDefault) {
      alert('Não é possível deletar a wordlist padrão');
      return;
    }

    if (!window.confirm(`Deseja realmente deletar "${wordlist.name}"?`)) {
      return;
    }

    try {
      await deleteWordlist(wordlist.name);
      await loadWordlists();
    } catch (err) {
      alert('Erro ao deletar: ' + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="card wordlist-manager">
      <h2>📝 Gerenciador de Wordlists</h2>

      <div className="wordlist-actions">
        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
          disabled={disabled}
        >
          ➕ Criar Nova
        </button>

        <label className={`btn btn-secondary ${disabled ? 'disabled' : ''}`}>
          📤 Upload
          <input
            type="file"
            accept=".txt"
            onChange={handleUpload}
            disabled={disabled}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="wordlists-list">
        {loading && <p>Carregando...</p>}

        {wordlists.map((wordlist, index) => {
          const isSelected = selectedWordlist?.name === wordlist.name;

          return (
            <div
              key={index}
              className={`wordlist-item ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onSelectWordlist(wordlist)}
            >
              <div className="wordlist-info">
                <div className="wordlist-name">
                  {wordlist.name}
                  {wordlist.isDefault && <span className="default-badge">Padrão</span>}
                </div>
                <div className="wordlist-details">
                  <span>{wordlist.passwordCount} senhas</span>
                  <span>{formatFileSize(wordlist.size)}</span>
                </div>
              </div>

              {!wordlist.isDefault && !disabled && (
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(wordlist);
                  }}
                >
                  🗑️
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Criar Nova Wordlist</h3>

            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                value={newWordlistName}
                onChange={(e) => setNewWordlistName(e.target.value)}
                placeholder="minha-wordlist"
              />
            </div>

            <div className="form-group">
              <label>Senhas (uma por linha):</label>
              <textarea
                value={newPasswords}
                onChange={(e) => setNewPasswords(e.target.value)}
                placeholder="senha1&#10;senha2&#10;senha3"
                rows="10"
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-success" onClick={handleCreate}>
                Criar
              </button>
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WordlistManager;
