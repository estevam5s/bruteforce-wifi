import React, { useState, useEffect } from 'react';
import './SiteBlocker.css';

const SiteBlocker = () => {
  const [blockedSites, setBlockedSites] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBlock, setNewBlock] = useState({
    device: '',
    url: '',
    category: 'custom'
  });

  const fetchBlockedSites = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/blocked-sites');
      const data = await response.json();

      if (data.success) {
        setBlockedSites(data.data || {});
      }
    } catch (error) {
      console.error('Erro ao buscar sites bloqueados:', error);
    } finally {
      setLoading(false);
    }
  };

  const blockSite = async () => {
    if (!newBlock.device || !newBlock.url) {
      alert('Dispositivo e URL são obrigatórios');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/blocked-sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlock)
      });
      const data = await response.json();

      if (data.success) {
        alert('Site bloqueado com sucesso!');
        setShowAddForm(false);
        setNewBlock({ device: '', url: '', category: 'custom' });
        fetchBlockedSites();
      }
    } catch (error) {
      console.error('Erro ao bloquear site:', error);
      alert('Erro ao bloquear site');
    }
  };

  const unblockSite = async (device, url) => {
    if (!window.confirm(`Desbloquear ${url} para ${device}?`)) return;

    try {
      const response = await fetch('http://localhost:5000/api/netmgmt/blocked-sites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device, url })
      });
      const data = await response.json();

      if (data.success) {
        alert('Site desbloqueado com sucesso!');
        fetchBlockedSites();
      }
    } catch (error) {
      console.error('Erro ao desbloquear site:', error);
      alert('Erro ao desbloquear site');
    }
  };

  useEffect(() => {
    fetchBlockedSites();
  }, []);

  const categories = [
    { value: 'custom', label: 'Personalizado', icon: '🔧' },
    { value: 'social', label: 'Redes Sociais', icon: '📱' },
    { value: 'adult', label: 'Conteúdo Adulto', icon: '🔞' },
    { value: 'gaming', label: 'Jogos', icon: '🎮' },
    { value: 'shopping', label: 'Compras', icon: '🛒' },
    { value: 'streaming', label: 'Streaming', icon: '📺' }
  ];

  const getCategoryInfo = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat || { label: category, icon: '📋' };
  };

  return (
    <div className="site-blocker">
      <div className="blocker-header">
        <h2>🚫 Bloqueio de Sites</h2>
        <div className="header-actions">
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✖ Cancelar' : '➕ Bloquear Site'}
          </button>
          <button onClick={fetchBlockedSites} disabled={loading}>
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="block-form">
          <h3>Bloquear Novo Site</h3>

          <div className="form-group">
            <label>MAC do Dispositivo:</label>
            <input
              type="text"
              value={newBlock.device}
              onChange={(e) => setNewBlock({ ...newBlock, device: e.target.value })}
              placeholder="00:11:22:33:44:55"
            />
          </div>

          <div className="form-group">
            <label>URL do Site:</label>
            <input
              type="text"
              value={newBlock.url}
              onChange={(e) => setNewBlock({ ...newBlock, url: e.target.value })}
              placeholder="example.com ou www.example.com"
            />
          </div>

          <div className="form-group">
            <label>Categoria:</label>
            <select
              value={newBlock.category}
              onChange={(e) => setNewBlock({ ...newBlock, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <button onClick={blockSite} className="submit-btn">
            Bloquear Site
          </button>
        </div>
      )}

      <div className="blocked-sites-list">
        {Object.keys(blockedSites).length === 0 ? (
          <div className="empty-state">
            Nenhum site bloqueado. Clique em "Bloquear Site" para adicionar.
          </div>
        ) : (
          Object.entries(blockedSites).map(([device, sites]) => (
            <div key={device} className="device-block">
              <div className="device-header">
                <div className="device-mac">
                  <span className="icon">📱</span>
                  {device}
                </div>
                <div className="sites-count">
                  {sites.length} site{sites.length !== 1 ? 's' : ''} bloqueado{sites.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="sites-grid">
                {sites.map((site, idx) => (
                  <div key={idx} className="site-card">
                    <div className="site-header">
                      <div className="category-badge">
                        {getCategoryInfo(site.category).icon} {getCategoryInfo(site.category).label}
                      </div>
                      <button
                        onClick={() => unblockSite(device, site.url)}
                        className="unblock-btn"
                        title="Desbloquear"
                      >
                        ✖
                      </button>
                    </div>
                    <div className="site-url">{site.url}</div>
                    <div className="site-date">
                      Bloqueado: {new Date(site.blockedAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SiteBlocker;
