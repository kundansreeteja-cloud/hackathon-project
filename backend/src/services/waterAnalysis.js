/**
 * Water Analysis Service
 * Implements consumption calculations, leak risk assessment,
 * dynamic conservation recommendations, and daily trend simulation.
 * 
 * Hackathon Problem Statement DVPS-33
 */

/**
 * Evaluates water consumption metrics, flags possible leaks, and generates conservation tips.
 * 
 * @param {Object} data
 * @param {number} data.householdSize - Number of occupants
 * @param {number} data.currentDailyUsage - Current average daily consumption in liters
 * @param {number} data.previousDailyUsage - Baseline daily consumption in liters
 * @param {number} data.daysAnalyzed - Number of days in the observation window
 * @param {Object} [data.usage] - Optional category breakdown (bathing, kitchen, laundry, etc.)
 * @returns {Object} Full analysis result conforming to the frontend contract
 */
function analyzeWaterConsumption({
  householdSize,
  currentDailyUsage,
  previousDailyUsage,
  daysAnalyzed,
  usage = {},
}) {
  // 1. Calculate excess consumption and percentage variance
  const excessUsage = Math.round((currentDailyUsage - previousDailyUsage) * 100) / 100;
  const rawPercentageChange = ((currentDailyUsage - previousDailyUsage) / previousDailyUsage) * 100;
  const percentageChange = Number(rawPercentageChange.toFixed(2));

  // 2. Classify consumption status and leak risk
  // Normal: <= 10% increase or reduction
  // Moderate: 10% to 25% increase
  // High: > 25% increase
  let status = 'normal';
  let leakRisk = 'Low';
  let leakDetected = false;
  let message = '';

  if (percentageChange > 25) {
    status = 'high';
    leakRisk = 'High';
    leakDetected = true;
    message = `Water usage is significantly higher than the previous pattern (+${percentageChange}%). High leak risk — possible leak detected. Immediate fixture inspection recommended.`;
  } else if (percentageChange > 10) {
    status = 'moderate';
    leakRisk = 'Medium';
    leakDetected = false;
    message = `Noticeable increase in daily water consumption (+${percentageChange}%). Moderate leak risk. Check for dripping taps and inspect fixtures.`;
  } else if (percentageChange >= 0) {
    status = 'normal';
    leakRisk = 'Low';
    leakDetected = false;
    message = `Water consumption is consistent with baseline patterns (+${percentageChange}%). Low leak risk detected.`;
  } else {
    status = 'normal';
    leakRisk = 'Low';
    leakDetected = false;
    message = `Water consumption is ${Math.abs(percentageChange)}% below your historical baseline. Excellent conservation performance with no leak anomalies detected.`;
  }

  // 3. Dynamically generate conservation recommendations
  const tips = generateConservationTips({
    status,
    householdSize,
    currentDailyUsage,
    usage,
  });

  // 4. Dynamically generate daily trend data reflecting consumption patterns
  const trend = generateUsageTrend({
    currentDailyUsage,
    previousDailyUsage,
    daysAnalyzed,
    status,
  });

  return {
    status,
    leakDetected,
    leakRisk,
    currentDailyUsage,
    previousDailyUsage,
    excessUsage,
    percentageChange,
    message,
    tips,
    trend,
  };
}

/**
 * Generates dynamic conservation tips based on status, per-capita usage, and breakdown.
 */
function generateConservationTips({ status, householdSize, currentDailyUsage, usage }) {
  const tips = [];
  const perPerson = householdSize > 0 ? currentDailyUsage / householdSize : 0;

  // Urgency / Leak specific tips for elevated consumption
  if (status === 'high') {
    tips.push('Check taps and visible pipes for continuous leaks or loose fittings.');
    tips.push('Check whether the toilet is continuously running (test flapper valve with food coloring).');
    tips.push('Inspect overhead water tanks, float valves, and overflow pipes for unattended spillage.');
    tips.push('Conduct a 15-minute static meter test by shutting all indoor taps to confirm concealed pipe leaks.');
  } else if (status === 'moderate') {
    tips.push('Inspect all indoor faucets and shower connections for slow drips.');
    tips.push('Monitor toilet cisterns for subtle trickles into the bowl between flushes.');
    tips.push('Keep a log of daily meter readings to verify whether usage continues trending upward.');
  } else {
    // Normal baseline tips
    tips.push('Continue monitoring daily consumption to maintain your water-efficient baseline.');
    tips.push('Fix small leaks and dripping taps early before they evolve into major water loss.');
    tips.push('Avoid unnecessary water wastage by ensuring taps are shut firmly after each use.');
  }

  // Category breakdown insights
  const { bathing = 0, kitchen = 0, laundry = 0, cleaning = 0, other = 0 } = usage || {};
  const totalBreakdown = bathing + kitchen + laundry + cleaning + other;

  if (totalBreakdown > 0) {
    const bathingRatio = bathing / totalBreakdown;
    const kitchenRatio = kitchen / totalBreakdown;
    const laundryRatio = laundry / totalBreakdown;
    const cleaningRatio = cleaning / totalBreakdown;

    // Bathing
    if (bathingRatio >= 0.35 || bathing >= 250) {
      tips.push('Bathing represents a major portion of consumption: reduce shower time or switch to a bucket bath.');
    }

    // Laundry
    if (laundryRatio >= 0.22 || laundry >= 180) {
      tips.push('Laundry usage is elevated: run washing machines only with full loads to maximize cycle efficiency.');
    }

    // Kitchen
    if (kitchenRatio >= 0.22 || kitchen >= 140) {
      tips.push('Kitchen usage is high: avoid running taps continuously while scrubbing dishes or washing produce.');
    }

    // Cleaning
    if (cleaningRatio >= 0.15 || cleaning >= 90) {
      tips.push('Cleaning usage is notable: use a bucket and mop rather than a running hose for outdoor and floor cleaning.');
    }
  }

  // Per-capita benchmark tip (Standard benchmark is ~135-150 L/person/day)
  if (perPerson > 200) {
    tips.push(`Average usage (~${Math.round(perPerson)} L/person/day) exceeds the recommended benchmark of 135-150 L/person/day.`);
  }

  // Ensure at least 3 tips, deduplicate, and limit to top 5
  const uniqueTips = Array.from(new Set(tips));
  return uniqueTips.slice(0, 5);
}

/**
 * Dynamically generates a daily consumption trend array based on actual metrics.
 * Simulates realistic daily variances rather than returning static numbers.
 */
function generateUsageTrend({ currentDailyUsage, previousDailyUsage, daysAnalyzed, status }) {
  // Bound days between 3 and 14 for optimal chart visualization
  const daysCount = Math.min(Math.max(Number(daysAnalyzed) || 7, 3), 14);
  const trend = [];

  for (let i = 0; i < daysCount; i++) {
    const dayNumber = i + 1;
    const progress = daysCount > 1 ? i / (daysCount - 1) : 1;

    let targetValue;

    if (status === 'high') {
      // In a leak scenario, consumption starts closer to the previous baseline
      // and surges upward towards the current daily usage in recent days
      const curve = Math.pow(progress, 1.8);
      targetValue = previousDailyUsage + (currentDailyUsage - previousDailyUsage) * curve;
    } else if (status === 'moderate') {
      // Moderate rise across the window
      targetValue = previousDailyUsage + (currentDailyUsage - previousDailyUsage) * progress;
    } else {
      // Normal / steady pattern hovering around current daily usage
      targetValue = currentDailyUsage;
    }

    // Introduce a realistic pseudo-random daily variance (+/- 3% to 6%)
    const varianceFactor = 1 + (Math.random() * 0.10 - 0.05);
    const dayUsage = Math.max(10, Math.round(targetValue * varianceFactor));

    trend.push({
      day: `Day ${dayNumber}`,
      usage: dayUsage,
    });
  }

  return trend;
}

module.exports = {
  analyzeWaterConsumption,
  generateConservationTips,
  generateUsageTrend,
};
