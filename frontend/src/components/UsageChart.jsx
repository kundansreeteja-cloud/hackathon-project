import React, { useState } from 'react';

/**
 * UsageChart Component
 * Renders an interactive, responsive zero-dependency SVG chart
 * visualizing the backend trend data and category breakdown.
 */
function UsageChart({ trend, previousDailyUsage, breakdown }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!trend || !Array.isArray(trend) || trend.length === 0) {
    return (
      <div className="card chart-card">
        <div className="card-header">
          <div className="card-title-wrap">
            <span className="card-icon" aria-hidden="true">📈</span>
            <h2 className="card-title">Usage Trend Over Time</h2>
          </div>
        </div>
        <div className="chart-empty-state">
          <p>No historical daily trend data returned from the backend for this period.</p>
        </div>
      </div>
    );
  }

  // Calculate scales
  const usages = trend.map((t) => Number(t.usage) || 0);
  const maxUsage = Math.max(...usages, Number(previousDailyUsage) || 0, 100);
  // Give 15% headroom above max
  const yCeiling = Math.ceil((maxUsage * 1.15) / 100) * 100;

  // Chart dimensions
  const chartHeight = 220;
  const paddingBottom = 40;
  const paddingTop = 30;
  const plotHeight = chartHeight - paddingBottom - paddingTop;

  const baseline = Number(previousDailyUsage) || null;
  const baselineY = baseline !== null && yCeiling > 0
    ? chartHeight - paddingBottom - (baseline / yCeiling) * plotHeight
    : null;

  // Calculate category breakdown if provided
  const breakdownCategories = breakdown
    ? Object.entries(breakdown).filter(([, val]) => Number(val) > 0)
    : [];
  const totalBreakdown = breakdownCategories.reduce((acc, [, val]) => acc + Number(val), 0);

  const categoryLabels = {
    bathing: { label: 'Bathing', color: '#0284c7', icon: '🚿' },
    kitchen: { label: 'Kitchen', color: '#059669', icon: '🍳' },
    laundry: { label: 'Laundry', color: '#8b5cf6', icon: '🧺' },
    cleaning: { label: 'Cleaning', color: '#d97706', icon: '🧹' },
    other: { label: 'Other', color: '#64748b', icon: '🚰' },
  };

  return (
    <div className="card chart-card">
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon" aria-hidden="true">📈</span>
          <h2 className="card-title">Daily Consumption Pattern &amp; Trend</h2>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-bar normal-bar-legend" />
            <span>Normal Daily</span>
          </div>
          {baseline !== null && (
            <div className="legend-item">
              <span className="legend-line baseline-line-legend" />
              <span>Baseline ({baseline}L)</span>
            </div>
          )}
        </div>
      </div>

      <div className="chart-container">
        {/* Responsive SVG Chart */}
        <svg
          className="trend-svg"
          viewBox={`0 0 ${Math.max(trend.length * 80 + 60, 500)} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Water usage trend chart"
        >
          <defs>
            <linearGradient id="barGradientAqua" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="barGradientHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="barGradientModerate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - paddingBottom - ratio * plotHeight;
            const val = Math.round(ratio * yCeiling);
            return (
              <g key={i} className="grid-group">
                <line
                  x1="45"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 4"
                />
                <text
                  x="38"
                  y={y + 4}
                  textAnchor="end"
                  className="axis-text"
                  fontSize="11"
                  fill="currentColor"
                  opacity="0.5"
                >
                  {val}L
                </text>
              </g>
            );
          })}

          {/* Baseline Reference Line */}
          {baselineY !== null && (
            <g className="baseline-group">
              <line
                x1="45"
                y1={baselineY}
                x2="100%"
                y2={baselineY}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x="50"
                y={baselineY - 6}
                fill="#d97706"
                fontSize="11"
                fontWeight="600"
              >
                Baseline: {baseline}L
              </text>
            </g>
          )}

          {/* Trend Bars & Labels */}
          {trend.map((item, index) => {
            const barWidth = 36;
            const totalWidth = Math.max(trend.length * 80 + 60, 500) - 60;
            const step = totalWidth / trend.length;
            const x = 55 + index * step + (step - barWidth) / 2;

            const usage = Number(item.usage) || 0;
            const barHeight = yCeiling > 0 ? (usage / yCeiling) * plotHeight : 0;
            const y = chartHeight - paddingBottom - barHeight;

            const isAboveBaseline = baseline !== null && usage > baseline;
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={index}
                className="bar-group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Value on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize={isHovered ? '13' : '11'}
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isAboveBaseline ? '#ef4444' : '#0369a1'}
                >
                  {usage}L
                </text>

                {/* Bar Rectangle */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 3)}
                  rx="6"
                  ry="6"
                  fill={
                    isAboveBaseline
                      ? 'url(#barGradientHigh)'
                      : 'url(#barGradientAqua)'
                  }
                  opacity={hoveredIndex === null || isHovered ? 1 : 0.65}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Day label on X Axis */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isHovered ? '700' : '500'}
                  fill="currentColor"
                  opacity={isHovered ? 1 : 0.75}
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Optional Activity Breakdown Bar (if user provided breakdown) */}
      {breakdownCategories.length > 0 && totalBreakdown > 0 && (
        <div className="chart-breakdown-section">
          <div className="breakdown-header">
            <span className="breakdown-title">Consumption Breakdown by Category:</span>
            <span className="breakdown-total">Total: {totalBreakdown.toLocaleString()} L</span>
          </div>

          <div className="breakdown-stacked-bar">
            {breakdownCategories.map(([key, val]) => {
              const percent = ((Number(val) / totalBreakdown) * 100).toFixed(1);
              const meta = categoryLabels[key] || { label: key, color: '#0284c7', icon: '💧' };
              return (
                <div
                  key={key}
                  className="breakdown-bar-segment"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: meta.color,
                  }}
                  title={`${meta.label}: ${val}L (${percent}%)`}
                />
              );
            })}
          </div>

          <div className="breakdown-legend-row">
            {breakdownCategories.map(([key, val]) => {
              const percent = ((Number(val) / totalBreakdown) * 100).toFixed(1);
              const meta = categoryLabels[key] || { label: key, color: '#0284c7', icon: '💧' };
              return (
                <div key={key} className="breakdown-legend-item">
                  <span className="legend-chip" style={{ backgroundColor: meta.color }} />
                  <span className="legend-name">
                    {meta.icon} {meta.label}
                  </span>
                  <span className="legend-val">
                    {val}L ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default UsageChart;
