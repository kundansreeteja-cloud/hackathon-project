import React from 'react';
import { API_BASE_URL } from '../services/api';

/**
 * Header Component
 * Highlights project purpose, problem statement code DVPS-33,
 * and current API endpoint for judges.
 */
function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-section">
          <div className="logo-icon-wrap" aria-hidden="true">
            <svg
              className="water-drop-logo"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <div className="title-row">
              <h1 className="brand-title">AquaWatch</h1>
              <span className="problem-badge" title="Hackathon Problem Statement">
                DVPS-33
              </span>
            </div>
            <p className="brand-subtitle">
              Smart Household Water-Usage Monitoring &amp; Leak Detection
            </p>
          </div>
        </div>

        <div className="header-meta">
          <div className="api-badge" title="Target Backend API Endpoint">
            <span className="api-dot" />
            <span className="api-label">Backend API:</span>
            <code className="api-url">{API_BASE_URL}</code>
          </div>
        </div>
      </div>

      <div className="hero-banner">
        <p className="hero-tagline">
          💧 Monitor your household water usage, detect possible leaks, and save water.
        </p>
      </div>
    </header>
  );
}

export default Header;
