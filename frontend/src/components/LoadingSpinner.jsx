import React from 'react';

/**
 * LoadingSpinner Component
 * Displays a friendly water-themed loading state during API analysis.
 */
function LoadingSpinner() {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="water-pulse-ring">
        <div className="water-ripple ripple-1"></div>
        <div className="water-ripple ripple-2"></div>
        <div className="water-drop-icon">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="drop-svg"
            width="32"
            height="32"
            aria-hidden="true"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>
      </div>
      <p className="loading-title">Analyzing your household water usage...</p>
      <p className="loading-subtitle">
        Evaluating consumption patterns, calculating variance, and screening for potential leaks.
      </p>
    </div>
  );
}

export default LoadingSpinner;
