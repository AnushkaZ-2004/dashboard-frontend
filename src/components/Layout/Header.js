import React from 'react';
import { useTheme } from '../../App';
import ThemeToggle from '../Common/ThemeToggle';

const Header = ({ title = "Dashboard" }) => {
  const { darkMode } = useTheme();

  return (
    <header className={`header ${darkMode ? 'dark' : 'light'}`}>
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">{title}</h1>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{title}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <div className="realtime-indicator">
              <div className="pulse-dot"></div>
              <span>Live Data</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          height: 80px;
          padding: 0 30px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .header.light {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-color: #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header.dark {
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(10px);
          border-color: #334155;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .header-left {
          flex: 1;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          margin-bottom: 4px;
        }

        .header.light .page-title {
          color: #1e293b;
        }

        .header.dark .page-title {
          color: #f1f5f9;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .breadcrumb-item {
          color: #64748b;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-item:hover {
          color: #2563eb;
        }

        .breadcrumb-item.active {
          color: #2563eb;
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: #94a3b8;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .realtime-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .header.light .realtime-indicator {
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
        }

        .header.dark .realtime-indicator {
          background: rgba(96, 165, 250, 0.2);
          color: #60a5fa;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 0 20px;
            height: 70px;
          }

          .page-title {
            font-size: 1.4rem;
          }

          .breadcrumb {
            display: none;
          }

          .header-actions {
            gap: 12px;
          }

          .realtime-indicator span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;