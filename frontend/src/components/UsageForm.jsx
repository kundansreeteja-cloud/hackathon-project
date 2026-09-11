import React, { useState } from 'react';

/**
 * UsageForm Component
 * Collects household water usage data with validation and quick demo presets.
 */
function UsageForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    householdSize: '',
    currentDailyUsage: '',
    previousDailyUsage: '',
    daysAnalyzed: '',
    usage: {
      bathing: '',
      kitchen: '',
      laundry: '',
      cleaning: '',
      other: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Handle changes for top-level fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle changes for breakdown fields
  const handleBreakdownChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      usage: {
        ...prev.usage,
        [name]: value,
      },
    }));
    const errorKey = `usage_${name}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};

    // Validate householdSize
    if (!formData.householdSize.toString().trim()) {
      newErrors.householdSize = 'Household size is required.';
    } else {
      const val = Number(formData.householdSize);
      if (isNaN(val) || !Number.isInteger(val) || val <= 0) {
        newErrors.householdSize = 'Must be a positive whole number (e.g. 1, 2, 4).';
      }
    }

    // Validate currentDailyUsage
    if (!formData.currentDailyUsage.toString().trim()) {
      newErrors.currentDailyUsage = 'Current daily usage is required.';
    } else {
      const val = Number(formData.currentDailyUsage);
      if (isNaN(val) || val < 0) {
        newErrors.currentDailyUsage = 'Must be a non-negative number in liters.';
      }
    }

    // Validate previousDailyUsage
    if (!formData.previousDailyUsage.toString().trim()) {
      newErrors.previousDailyUsage = 'Previous daily usage is required.';
    } else {
      const val = Number(formData.previousDailyUsage);
      if (isNaN(val) || val < 0) {
        newErrors.previousDailyUsage = 'Must be a non-negative number in liters.';
      }
    }

    // Validate daysAnalyzed
    if (!formData.daysAnalyzed.toString().trim()) {
      newErrors.daysAnalyzed = 'Number of days analyzed is required.';
    } else {
      const val = Number(formData.daysAnalyzed);
      if (isNaN(val) || !Number.isInteger(val) || val <= 0) {
        newErrors.daysAnalyzed = 'Must be a positive integer (e.g. 7).';
      }
    }

    // Validate breakdown if filled
    ['bathing', 'kitchen', 'laundry', 'cleaning', 'other'].forEach((cat) => {
      const valStr = formData.usage[cat]?.toString().trim();
      if (valStr) {
        const val = Number(valStr);
        if (isNaN(val) || val < 0) {
          newErrors[`usage_${cat}`] = 'Must be a non-negative number.';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Construct the payload matching backend contract
    const payload = {
      householdSize: Number(formData.householdSize),
      currentDailyUsage: Number(formData.currentDailyUsage),
      previousDailyUsage: Number(formData.previousDailyUsage),
      daysAnalyzed: Number(formData.daysAnalyzed),
      usage: {
        bathing: formData.usage.bathing !== '' ? Number(formData.usage.bathing) : 0,
        kitchen: formData.usage.kitchen !== '' ? Number(formData.usage.kitchen) : 0,
        laundry: formData.usage.laundry !== '' ? Number(formData.usage.laundry) : 0,
        cleaning: formData.usage.cleaning !== '' ? Number(formData.usage.cleaning) : 0,
        other: formData.usage.other !== '' ? Number(formData.usage.other) : 0,
      },
    };

    onSubmit(payload);
  };

  // Demo Presets for Hackathon Judges
  const loadScenario = (type) => {
    if (type === 'leak') {
      setFormData({
        householdSize: '4',
        currentDailyUsage: '850',
        previousDailyUsage: '650',
        daysAnalyzed: '7',
        usage: {
          bathing: '300',
          kitchen: '150',
          laundry: '200',
          cleaning: '100',
          other: '100',
        },
      });
      setShowBreakdown(true);
    } else if (type === 'normal') {
      setFormData({
        householdSize: '3',
        currentDailyUsage: '500',
        previousDailyUsage: '520',
        daysAnalyzed: '7',
        usage: {
          bathing: '180',
          kitchen: '120',
          laundry: '110',
          cleaning: '50',
          other: '40',
        },
      });
      setShowBreakdown(true);
    }
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      householdSize: '',
      currentDailyUsage: '',
      previousDailyUsage: '',
      daysAnalyzed: '',
      usage: {
        bathing: '',
        kitchen: '',
        laundry: '',
        cleaning: '',
        other: '',
      },
    });
    setErrors({});
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <div className="card-title-wrap">
          <span className="card-icon" aria-hidden="true">📋</span>
          <h2 className="card-title">Household Water Usage Input</h2>
        </div>
        <div className="demo-presets" aria-label="Demo Presets">
          <span className="presets-label">Quick Presets:</span>
          <button
            type="button"
            className="preset-btn warning-preset"
            onClick={() => loadScenario('leak')}
            title="Load test scenario: 850L current vs 650L previous"
          >
            ⚠️ High Leak Test
          </button>
          <button
            type="button"
            className="preset-btn success-preset"
            onClick={() => loadScenario('normal')}
            title="Load test scenario: 500L current vs 520L previous"
          >
            ✅ Normal Usage Test
          </button>
          <button
            type="button"
            className="preset-btn clear-preset"
            onClick={handleReset}
            title="Clear form inputs"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Household Size */}
          <div className="form-group">
            <label htmlFor="householdSize" className="form-label">
              Household Size <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon" aria-hidden="true">👥</span>
              <input
                type="number"
                id="householdSize"
                name="householdSize"
                className={`form-input ${errors.householdSize ? 'input-error' : ''}`}
                placeholder="e.g. 4"
                min="1"
                step="1"
                value={formData.householdSize}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.householdSize && (
              <p className="error-text" role="alert">{errors.householdSize}</p>
            )}
            <span className="input-hint">Total number of residents</span>
          </div>

          {/* Days Analyzed */}
          <div className="form-group">
            <label htmlFor="daysAnalyzed" className="form-label">
              Days Analyzed <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon" aria-hidden="true">📅</span>
              <input
                type="number"
                id="daysAnalyzed"
                name="daysAnalyzed"
                className={`form-input ${errors.daysAnalyzed ? 'input-error' : ''}`}
                placeholder="e.g. 7"
                min="1"
                step="1"
                value={formData.daysAnalyzed}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.daysAnalyzed && (
              <p className="error-text" role="alert">{errors.daysAnalyzed}</p>
            )}
            <span className="input-hint">Observation period (e.g. 7 days)</span>
          </div>

          {/* Current Daily Usage */}
          <div className="form-group">
            <label htmlFor="currentDailyUsage" className="form-label">
              Current Daily Usage (Liters) <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon" aria-hidden="true">💧</span>
              <input
                type="number"
                id="currentDailyUsage"
                name="currentDailyUsage"
                className={`form-input ${errors.currentDailyUsage ? 'input-error' : ''}`}
                placeholder="e.g. 850"
                min="0"
                step="any"
                value={formData.currentDailyUsage}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.currentDailyUsage && (
              <p className="error-text" role="alert">{errors.currentDailyUsage}</p>
            )}
            <span className="input-hint">Average consumption during current period</span>
          </div>

          {/* Previous Daily Usage */}
          <div className="form-group">
            <label htmlFor="previousDailyUsage" className="form-label">
              Previous Daily Usage (Liters) <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon" aria-hidden="true">📊</span>
              <input
                type="number"
                id="previousDailyUsage"
                name="previousDailyUsage"
                className={`form-input ${errors.previousDailyUsage ? 'input-error' : ''}`}
                placeholder="e.g. 650"
                min="0"
                step="any"
                value={formData.previousDailyUsage}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.previousDailyUsage && (
              <p className="error-text" role="alert">{errors.previousDailyUsage}</p>
            )}
            <span className="input-hint">Historical baseline daily average</span>
          </div>
        </div>

        {/* Optional Breakdown Toggle */}
        <div className="breakdown-toggle-section">
          <button
            type="button"
            className="toggle-breakdown-btn"
            onClick={() => setShowBreakdown((prev) => !prev)}
            aria-expanded={showBreakdown}
          >
            <span>{showBreakdown ? '▲ Hide' : '▼ Add'} Optional Usage Breakdown (by category)</span>
          </button>
        </div>

        {/* Optional Breakdown Fields */}
        {showBreakdown && (
          <div className="breakdown-section">
            <p className="breakdown-subtitle">
              Optional: Enter daily liters consumed across specific household activities for granular analysis.
            </p>
            <div className="breakdown-grid">
              <div className="form-group">
                <label htmlFor="bathing" className="form-label">🚿 Bathing (L)</label>
                <input
                  type="number"
                  id="bathing"
                  name="bathing"
                  className={`form-input ${errors.usage_bathing ? 'input-error' : ''}`}
                  placeholder="e.g. 300"
                  min="0"
                  value={formData.usage.bathing}
                  onChange={handleBreakdownChange}
                  disabled={isLoading}
                />
                {errors.usage_bathing && <p className="error-text">{errors.usage_bathing}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="kitchen" className="form-label">🍳 Kitchen (L)</label>
                <input
                  type="number"
                  id="kitchen"
                  name="kitchen"
                  className={`form-input ${errors.usage_kitchen ? 'input-error' : ''}`}
                  placeholder="e.g. 150"
                  min="0"
                  value={formData.usage.kitchen}
                  onChange={handleBreakdownChange}
                  disabled={isLoading}
                />
                {errors.usage_kitchen && <p className="error-text">{errors.usage_kitchen}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="laundry" className="form-label">🧺 Laundry (L)</label>
                <input
                  type="number"
                  id="laundry"
                  name="laundry"
                  className={`form-input ${errors.usage_laundry ? 'input-error' : ''}`}
                  placeholder="e.g. 200"
                  min="0"
                  value={formData.usage.laundry}
                  onChange={handleBreakdownChange}
                  disabled={isLoading}
                />
                {errors.usage_laundry && <p className="error-text">{errors.usage_laundry}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="cleaning" className="form-label">🧹 Cleaning (L)</label>
                <input
                  type="number"
                  id="cleaning"
                  name="cleaning"
                  className={`form-input ${errors.usage_cleaning ? 'input-error' : ''}`}
                  placeholder="e.g. 100"
                  min="0"
                  value={formData.usage.cleaning}
                  onChange={handleBreakdownChange}
                  disabled={isLoading}
                />
                {errors.usage_cleaning && <p className="error-text">{errors.usage_cleaning}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="other" className="form-label">🚰 Other (L)</label>
                <input
                  type="number"
                  id="other"
                  name="other"
                  className={`form-input ${errors.usage_other ? 'input-error' : ''}`}
                  placeholder="e.g. 100"
                  min="0"
                  value={formData.usage.other}
                  onChange={handleBreakdownChange}
                  disabled={isLoading}
                />
                {errors.usage_other && <p className="error-text">{errors.usage_other}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="form-actions">
          <button
            type="submit"
            className={`btn-primary ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-inline" aria-hidden="true" />
                <span>Analyzing Water Usage...</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">🔍</span>
                <span>Analyze Water Usage</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsageForm;
