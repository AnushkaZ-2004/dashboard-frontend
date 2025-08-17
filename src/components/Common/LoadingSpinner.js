import React from 'react';
import { useTheme } from '../../App';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const { darkMode } = useTheme();

  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className={`loading-container ${darkMode ? 'dark' : 'light'}`}>
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {text && <p className="loading-text">{text}</p>}

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          padding: 40px;
        }

        .spinner {
          border: 4px solid;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .loading-container.light .spinner {
          border-color: #e2e8f0;
          border-top-color: #2563eb;
        }

        .loading-container.dark .spinner {
          border-color: #374151;
          border-top-color: #60a5fa;
        }

        .spinner-small {
          width: 24px;
          height: 24px;
          border-width: 2px;
        }

        .spinner-medium {
          width: 40px;
          height: 40px;
          border-width: 4px;
        }

        .spinner-large {
          width: 60px;
          height: 60px;
          border-width: 6px;
        }

        .loading-text {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .loading-container.light .loading-text {
          color: #64748b;
        }

        .loading-container.dark .loading-text {
          color: #94a3b8;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;