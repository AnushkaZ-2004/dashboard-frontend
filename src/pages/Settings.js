import React, { useState } from 'react';
import { useTheme } from '../App';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30,
      showAnimations: true,
      compactMode: false
    },
    account: {
      name: 'Admin User',
      email: 'admin@dashboard.com',
      role: 'Administrator',
      timezone: 'UTC'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 60,
      passwordExpiry: 90
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔐' }
  ];

  return (
    <div className={`settings-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Settings</h2>
            <p>Manage your dashboard preferences and account settings</p>
          </div>
        </div>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              
              <div className="setting-group">
                <h4>Appearance</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Dark Mode</label>
                    <span className="setting-description">Toggle between light and dark theme</span>
                  </div>
                  <button 
                    className={`toggle-switch ${darkMode ? 'active' : ''}`}
                    onClick={toggleTheme}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Show Animations</label>
                    <span className="setting-description">Enable smooth transitions and animations</span>
                  </div>
                  <button 
                    className={`toggle-switch ${settings.dashboard.showAnimations ? 'active' : ''}`}
                    onClick={() => handleSettingChange('dashboard', 'showAnimations', !settings.dashboard.showAnimations)}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Compact Mode</label>
                    <span className="setting-description">Use a more compact layout to fit more content</span>
                  </div>
                  <button 
                    className={`toggle-switch ${settings.dashboard.compactMode ? 'active' : ''}`}
                    onClick={() => handleSettingChange('dashboard', 'compactMode', !settings.dashboard.compactMode)}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <h4>Dashboard</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto Refresh</label>
                    <span className="setting-description">Automatically refresh dashboard data</span>
                  </div>
                  <button 
                    className={`toggle-switch ${settings.dashboard.autoRefresh ? 'active' : ''}`}
                    onClick={() => handleSettingChange('dashboard', 'autoRefresh', !settings.dashboard.autoRefresh)}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Refresh Interval</label>
                    <span className="setting-description">How often to refresh data (seconds)</span>
                  </div>
                  <select 
                    className="setting-select"
                    value={settings.dashboard.refreshInterval}
                    onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              
              <div className="setting-group">
                <h4>Notification Types</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Email Notifications</label>
                    <span className="setting-description">Receive notifications via email</span>
                  </div>
                  <button 
                    className={`toggle-switch ${settings.notifications.email ? 'active' : ''}`}
                    onClick={() => handleSettingChange('notifications', 'email', !settings.notifications.email)}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Push Notifications</label>
                    <span className="setting-description">Receive browser push notifications</span>
                  </div>
                  <button 
                    className={`toggle-switch ${settings.notifications.push ? 'active' : ''}`}
                    onClick={() => handleSettingChange('notifications', 'push', !settings.notifications.push)}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>SMS Notifications</label>
                    <span className="setting-description">Receive important alerts via SMS</span>
                  </div>
                  <button 
                    className={`toggle-switch ${settings.notifications.sms ? 'active' : ''}`}
                    onClick={() => handleSettingChange('notifications', 'sms', !settings.notifications.sms)}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="settings-section">
              <h3>Account Settings</h3>
              
              <div className="setting-group">
                <h4>Profile Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settings.account.name}
                      onChange={(e) => handleSettingChange('account', 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={settings.account.email}
                      onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select 
                      className="form-select"
                      value={settings.account.role}
                      onChange={(e) => handleSettingChange('account', 'role', e.target.value)}
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Manager">Manager</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select 
                      className="form-select"
                      value={settings.account.timezone}
                      onChange={(e) => handleSettingChange('account', 'timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              
              <div className="setting-group">
                <h4>Authentication</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Two-Factor Authentication</label>
                    <span className="setting-description">Add an extra layer of security to your account</span>
                  </div>
                  <button 
                    className={`toggle-switch ${settings.security.twoFactor ? 'active' : ''}`}
                    onClick={() => handleSettingChange('security', 'twoFactor', !settings.security.twoFactor)}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Session Timeout</label>
                    <span className="setting-description">Automatically log out after inactivity (minutes)</span>
                  </div>
                  <select 
                    className="setting-select"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={480}>8 hours</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Password Expiry</label>
                    <span className="setting-description">Require password change after (days)</span>
                  </div>
                  <select 
                    className="setting-select"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>6 months</option>
                    <option value={365}>1 year</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h4>Actions</h4>
                <div className="action-buttons">
                  <button className="btn btn-secondary">Change Password</button>
                  <button className="btn btn-secondary">Download Data</button>
                  <button className="btn btn-danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="save-section">
            <button 
              className={`btn btn-primary save-btn ${isSaving ? 'loading' : ''}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          padding: 0;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .header-content h2 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .settings-page.light .header-content h2 {
          color: #1e293b;
        }

        .settings-page.dark .header-content h2 {
          color: #f1f5f9;
        }

        .header-content p {
          margin: 4px 0 0 0;
          font-size: 1rem;
        }

        .settings-page.light .header-content p {
          color: #64748b;
        }

        .settings-page.dark .header-content p {
          color: #94a3b8;
        }

        .settings-container {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 32px;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          text-align: left;
        }

        .settings-page.light .nav-tab {
          background: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .settings-page.dark .nav-tab {
          background: #1e293b;
          color: #94a3b8;
          border: 1px solid #334155;
        }

        .nav-tab:hover {
          transform: translateX(4px);
        }

        .settings-page.light .nav-tab:hover {
          background: #f8fafc;
          color: #2563eb;
          border-color: #2563eb;
        }

        .settings-page.dark .nav-tab:hover {
          background: #334155;
          color: #60a5fa;
          border-color: #60a5fa;
        }

        .nav-tab.active {
          transform: translateX(4px);
        }

        .settings-page.light .nav-tab.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .settings-page.dark .nav-tab.active {
          background: #1d4ed8;
          color: white;
          border-color: #1d4ed8;
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .settings-content {
          padding: 0;
        }

        .settings-section {
          margin-bottom: 48px;
        }

        .settings-section h3 {
          margin: 0 0 32px 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2563eb;
        }

        .setting-group {
          margin-bottom: 32px;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid;
        }

        .settings-page.light .setting-group {
          background: white;
          border-color: #e2e8f0;
        }

        .settings-page.dark .setting-group {
          background: #1e293b;
          border-color: #334155;
        }

        .setting-group h4 {
          margin: 0 0 20px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .settings-page.light .setting-group h4 {
          color: #1e293b;
        }

        .settings-page.dark .setting-group h4 {
          color: #f1f5f9;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid;
        }

        .settings-page.light .setting-item {
          border-color: #f1f5f9;
        }

        .settings-page.dark .setting-item {
          border-color: #374151;
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-info {
          flex: 1;
        }

        .setting-info label {
          display: block;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .settings-page.light .setting-info label {
          color: #1e293b;
        }

        .settings-page.dark .setting-info label {
          color: #f1f5f9;
        }

        .setting-description {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .settings-page.light .setting-description {
          color: #64748b;
        }

        .settings-page.dark .setting-description {
          color: #94a3b8;
        }

        .toggle-switch {
          width: 52px;
          height: 28px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .settings-page.light .toggle-switch {
          background: #e2e8f0;
        }

        .settings-page.dark .toggle-switch {
          background: #4b5563;
        }

        .toggle-switch.active {
          background: #2563eb;
        }

        .toggle-slider {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-slider {
          transform: translateX(24px);
        }

        .setting-select {
          padding: 8px 12px;
          border: 1px solid;
          border-radius: 6px;
          font-size: 0.9rem;
          min-width: 150px;
        }

        .settings-page.light .setting-select {
          background: white;
          border-color: #d1d5db;
          color: #374151;
        }

        .settings-page.dark .setting-select {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .save-section {
          padding: 24px;
          border-top: 1px solid;
          margin-top: 32px;
        }

        .settings-page.light .save-section {
          border-color: #e2e8f0;
        }

        .settings-page.dark .save-section {
          border-color: #334155;
        }

        .save-btn {
          min-width: 150px;
        }

        .save-btn.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .settings-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .settings-nav {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 8px;
          }

          .nav-tab {
            padding: 12px 16px;
            justify-content: center;
            text-align: center;
          }

          .tab-name {
            display: none;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;