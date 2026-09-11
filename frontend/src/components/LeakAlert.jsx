import React from 'react';

/**
 * LeakAlert Component
 * Visualizes leak detection results with clear High/Medium/Low risk indicators
 * and actionable inspection recommendations when risk is elevated.
 */
function LeakAlert({ data }) {
  if (!data) return null;

  const isLeak = data.leakDetected === true || String(data.leakDetected).toLowerCase() === 'true';
  const riskStr = (data.leakRisk || (isLeak ? 'High' : 'Low')).trim();
  const normalizedRisk = riskStr.toLowerCase();

  const isHigh = normalizedRisk === 'high' || isLeak;
  const isMedium = normalizedRisk === 'medium' || normalizedRisk === 'moderate';

  let bannerClass = 'leak-low';
  let title = 'Normal Flow — No Leak Detected';
  let badgeText = 'Low Risk';

  if (isHigh) {
    bannerClass = 'leak-high';
    title = '🚨 Potential Water Leak Flagged!';
    badgeText = 'High Risk';
  } else if (isMedium) {
    bannerClass = 'leak-medium';
    title = '⚠️ Possible Flow Anomaly Detected';
    badgeText = 'Moderate Risk';
  }

  return (
    <div className={`card leak-alert-card ${bannerClass}`}>
      <div className="leak-header">
        <div className="leak-title-group">
          <div className="leak-badge-icon" aria-hidden="true">
            {isHigh ? '🚨' : isMedium ? '⚠️' : '🛡️'}
          </div>
          <div>
            <h3 className="leak-title">{title}</h3>
            <p className="leak-subtitle">
              {isHigh
                ? 'Abnormal continuous consumption or sudden spike detected compared to baseline history.'
                : isMedium
                ? 'Usage is moderately elevated. A minor valve drip or fixture issue might be present.'
                : 'Consumption patterns are consistent with normal household activity.'}
            </p>
          </div>
        </div>

        <div className="leak-status-tag">
          <span className="risk-level-label">Leak Risk Level:</span>
          <span className={`risk-tag ${bannerClass}`}>
            {data.leakRisk ? data.leakRisk : badgeText}
          </span>
        </div>
      </div>

      {isHigh && (
        <div className="leak-urgent-actions">
          <div className="urgent-badge">
            <span className="pulsing-alert-dot" aria-hidden="true" />
            <span>Immediate Inspection Recommended</span>
          </div>
          <ul className="leak-checklist">
            <li>
              <strong>Running Toilets:</strong> Check for a silent flapper valve leak (drop food coloring in the tank).
            </li>
            <li>
              <strong>Fixtures &amp; Faucets:</strong> Inspect all taps, showerheads, and hose bibs for continuous dripping.
            </li>
            <li>
              <strong>Main Meter Check:</strong> Turn off all household taps for 15 minutes and check if the water meter continues spinning.
            </li>
            <li>
              <strong>Under-sink &amp; Appliances:</strong> Check washing machine hoses and reverse-osmosis purifier drain lines.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default LeakAlert;
