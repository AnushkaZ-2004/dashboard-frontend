import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../App';

const Layout = ({ children }) => {
  const { darkMode } = useTheme();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/users':
        return 'Users';
      case '/orders':
        return 'Orders';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className={`layout ${darkMode ? 'dark' : 'light'}`}>
      <Sidebar />
      <div className="main-content">
        <Header title={getPageTitle()} />
        <main className="content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          transition: all 0.3s ease;
        }

        .main-content {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          background: transparent;
        }

        .layout.light {
          background: #f8fafc;
        }

        .layout.dark {
          background: #0f172a;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100%;
          }

          .content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;