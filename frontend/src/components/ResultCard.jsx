import React from 'react';

/**
 * ResultCard Component
 * Displays overall water consumption status, key daily metrics,
 * excess water usage, and the backend-generated message.
 */
function ResultCard({ data, householdSize }) {
  if (!data) return null;

  // Normalize status string (e.g. "high", "moderate", "normal")
  const rawStatus = (data.status || 'normal').toLowerCase();
  
  // Determine display text and styling
  let statusBadgeClass = 'status-normal';
  let statusLabel = 'Normal';
  let statusIcon = '✅';

  if (rawStatus.includes('high')) {
    statusBadgeClass = 'status-high';
    statusLabel = 'High Usage';
    statusIcon = '🚨';
  } else if (rawStatus.includes('mod') || rawStatus.includes('medium')) {
    statusBadgeClass = 'status-moderate';
    statusLabel = 'Moderate Usage';
    statusIcon = '⚠️';
  } else {
    statusBadgeClass = 'status-normal';
    statusLabel = 'Normal Usage';
    statusIcon = '💧';
  }

  // Calculate percentage change if excessUsage and previousDailyUsage exist
  const current = Number(data.currentDailyUsage) || 0;
  const previous = Number(data.previousDailyUsage) || 0;
  // excessUsage from backend or difference
  const excess = typeof data.excessUsage === 'number' 
    ? data.excessUsage 
    : (current - previous);

  const percentDiff = previous > 0 
    ? (((current - previous) / previous) * 100).toFixed(1)
    : null;

  // Calculate per person usage if householdSize is available
  const perPerson = householdSize && householdSize > 0 
    ? Math.round(current / householdSize) 
    : null;

  return (
    <div className="card result-card">
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon" aria-hidden="true">📊</span>
          <h2 className="card-title">Consumption Analysis Summary</h2>
        </div>
        <div className={`status-pill ${statusBadgeClass}`}>
          <span className="status-icon" aria-hidden="true">{statusIcon}</span>
          <span className="status-text">{data.status ? data.status.toUpperCase() : statusLabel.toUpperCase()}</span>
        </div>
      </div>

      {/* Backend Generated Message */}
      {data.message && (
        <div className={`backend-message-box ${rawStatus.includes('high') ? 'msg-warning' : 'msg-info'}`}>
          <div className="message-icon" aria-hidden="true">
            {rawStatus.includes('high') ? '⚠️' : 'ℹ️'}
          </div>
          <div className="message-content">
            <span className="message-heading">System Assessment:</span>
            <p className="message-body">{data.message}</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {/* Current Daily Usage */}
        <div className="metric-box">
          <span className="metric-label">Current Daily Usage</span>
          <div className="metric-value-row">
            <span className="metric-num current-val">{current.toLocaleString()}</span>
            <span className="metric-unit">L / day</span>
          </div>
          {perPerson && (
            <span className="metric-sub">~{perPerson} L / person / day</span>
          )}
        </div>

        {/* Previous Daily Usage */}
        <div className="metric-box">
          <span className="metric-label">Previous Daily Usage</span>
          <div className="metric-value-row">
            <span className="metric-num prev-val">{previous.toLocaleString()}</span>
            <span className="metric-unit">L / day</span>
          </div>
          <span className="metric-sub">Baseline comparison</span>
        </div>

        {/* Excess Usage */}
        <div className={`metric-box ${excess > 0 ? 'metric-excess' : 'metric-saved'}`}>
          <span className="metric-label">
            {excess >= 0 ? 'Excess Consumption' : 'Water Saved'}
          </span>
          <div className="metric-value-row">
            <span className="metric-num">
              {excess > 0 ? `+${excess.toLocaleString()}` : excess.toLocaleString()}
            </span>
            <span className="metric-unit">L / day</span>
          </div>
          {percentDiff !== null && (
            <span className={`metric-variance ${excess > 0 ? 'var-up' : 'var-down'}`}>
              {excess > 0 ? `▲ +${percentDiff}%` : `▼ ${percentDiff}%`} vs baseline
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
