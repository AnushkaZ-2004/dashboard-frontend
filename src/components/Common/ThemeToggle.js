import React from 'react';
import { useTheme } from '../../App';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="theme-icon">
        {darkMode ? '☀️' : '🌙'}
      </span>
      <span className="theme-text">
        {darkMode ? 'Light' : 'Dark'}
      </span>

      <style jsx>{`
        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid;
          border-radius: 25px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          background: none;
          min-width: 100px;
          justify-content: center;
        }

        .theme-toggle.light {
          background: rgba(37, 99, 235, 0.1);
          border-color: rgba(37, 99, 235, 0.2);
          color: #2563eb;
        }

        .theme-toggle.dark {
          background: rgba(96, 165, 250, 0.1);
          border-color: rgba(96, 165, 250, 0.2);
          color: #60a5fa;
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .theme-toggle.light:hover {
          background: rgba(37, 99, 235, 0.15);
          border-color: rgba(37, 99, 235, 0.3);
        }

        .theme-toggle.dark:hover {
          background: rgba(96, 165, 250, 0.15);
          border-color: rgba(96, 165, 250, 0.3);
        }

        .theme-icon {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }

        .theme-toggle:hover .theme-icon {
          transform: rotate(15deg) scale(1.1);
        }

        .theme-text {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .theme-toggle {
            padding: 8px 12px;
            min-width: 80px;
          }

          .theme-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </button>
  );
};

export default ThemeToggle;