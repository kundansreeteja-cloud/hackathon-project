import React, { useState } from 'react';
import Header from './components/Header';
import UsageForm from './components/UsageForm';
import ResultCard from './components/ResultCard';
import LeakAlert from './components/LeakAlert';
import ConservationTips from './components/ConservationTips';
import UsageChart from './components/UsageChart';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeWaterUsage, API_BASE_URL } from './services/api';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Submits household water data to the backend API.
   * Completely replaces any previous analysis results with fresh backend data.
   */
  const handleAnalyzeUsage = async (payload) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastPayload(payload);

    try {
      const data = await analyzeWaterUsage(payload);
      setAnalysisResult(data);

      // Smooth scroll to the results section on mobile/desktop
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while communicating with the backend.'
      );
      // We don't wipe previous valid results if an error occurs, or we can keep or reset depending on user expectation
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation & Project Tagline */}
      <Header />

      <main className="main-content">
        <div className="dashboard-grid">
          {/* Left Column: Input Form & Configuration */}
          <section className="form-column" aria-label="Input Water Metrics">
            <UsageForm onSubmit={handleAnalyzeUsage} isLoading={isLoading} />
          </section>

          {/* Right Column: Dynamic Analysis Dashboard */}
          <section
            id="results-section"
            className="results-column"
            aria-label="Analysis Results Dashboard"
          >
            {/* Error Message Banner */}
            {errorMessage && (
              <div className="error-banner" role="alert">
                <div className="error-icon" aria-hidden="true">⚠️</div>
                <div className="error-content">
                  <h3 className="error-title">Analysis Failed</h3>
                  <p className="error-description">{errorMessage}</p>
                  <p className="error-hint">
                    Check that your backend server is active at <code>{API_BASE_URL}</code> and reachable.
                  </p>
                </div>
                <button
                  type="button"
                  className="dismiss-error-btn"
                  onClick={() => setErrorMessage(null)}
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && <LoadingSpinner />}

            {/* Empty State / Initial Prompt (when no analysis has been run yet) */}
            {!isLoading && !analysisResult && (
              <div className="empty-dashboard-card">
                <div className="empty-graphic" aria-hidden="true">💧</div>
                <h3 className="empty-title">Ready to Analyze Consumption</h3>
                <p className="empty-desc">
                  Enter your household metrics or select one of the quick presets on the left, then click{' '}
                  <strong>“Analyze Water Usage”</strong> to view leak risk detection, excess consumption diagnostics, and personalized conservation tips.
                </p>
                <div className="empty-features">
                  <div className="empty-feature-item">
                    <span className="feature-icon" aria-hidden="true">🛡️</span>
                    <span>Automated Leak Flagging</span>
                  </div>
                  <div className="empty-feature-item">
                    <span className="feature-icon" aria-hidden="true">📈</span>
                    <span>Daily Consumption Trends</span>
                  </div>
                  <div className="empty-feature-item">
                    <span className="feature-icon" aria-hidden="true">🌱</span>
                    <span>Actionable Conservation Tips</span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Analysis Results */}
            {!isLoading && analysisResult && (
              <div className="dashboard-results-stack">
                {/* 1. Leak Detection Alert & Risk Level */}
                <LeakAlert data={analysisResult} />

                {/* 2. Usage Status, Metrics & System Assessment */}
                <ResultCard
                  data={analysisResult}
                  householdSize={lastPayload?.householdSize}
                />

                {/* 3. Trend Visualization */}
                <UsageChart
                  trend={analysisResult.trend}
                  previousDailyUsage={
                    analysisResult.previousDailyUsage || lastPayload?.previousDailyUsage
                  }
                  breakdown={lastPayload?.usage}
                />

                {/* 4. Dynamic Conservation Tips */}
                <ConservationTips tips={analysisResult.tips} />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>AquaWatch</strong> — Hackathon Project for Problem Statement <code>DVPS-33</code>
          </p>
          <p className="footer-sub">
            Built with React, Vite &amp; Vanilla CSS • Dedicated to household water conservation &amp; leak prevention
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
