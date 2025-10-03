import React, { useState } from 'react';
import NetworkMap from './NetworkMap';
import TrafficMonitor from './TrafficMonitor';
import BrowsingHistory from './BrowsingHistory';
import NetworkAlerts from './NetworkAlerts';
import AccessControl from './AccessControl';
import SiteBlocker from './SiteBlocker';
import FirewallManager from './FirewallManager';
import VulnerabilityScanner from './VulnerabilityScanner';
import './NetworkManagement.css';

const NetworkManagement = () => {
  const [activeTab, setActiveTab] = useState('map');

  const tabs = [
    { id: 'map', label: '🗺️ Mapa da Rede', component: NetworkMap },
    { id: 'traffic', label: '📊 Tráfego', component: TrafficMonitor },
    { id: 'history', label: '🌐 Histórico', component: BrowsingHistory },
    { id: 'alerts', label: '🔔 Alertas', component: NetworkAlerts },
    { id: 'access', label: '🔐 Controle de Acesso', component: AccessControl },
    { id: 'blocker', label: '🚫 Bloqueio de Sites', component: SiteBlocker },
    { id: 'firewall', label: '🛡️ Firewall', component: FirewallManager },
    { id: 'scanner', label: '🔍 Scanner de Vulnerabilidades', component: VulnerabilityScanner }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="network-management">
      <div className="nm-header">
        <h1>🌐 Gerenciamento de Rede</h1>
        <p className="nm-subtitle">
          Monitore, controle e proteja sua rede com ferramentas profissionais
        </p>
      </div>

      <div className="nm-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nm-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="nm-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default NetworkManagement;
