import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../App';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { darkMode } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/analytics',
      name: 'Analytics',
      icon: '📈'
    },
    {
      path: '/users',
      name: 'Users',
      icon: '👥'
    },
    {
      path: '/orders',
      name: 'Orders',
      icon: '📦'
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: '⚙️'
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${darkMode ? 'dark' : 'light'}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💙</span>
          {!isCollapsed && <span className="logo-text">Dashboard</span>}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                title={isCollapsed ? item.name : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-text">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          {!isCollapsed && (
            <div className="user-details">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;