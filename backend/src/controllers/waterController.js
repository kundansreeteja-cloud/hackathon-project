/**
 * Water Controller
 * Handles incoming HTTP requests for water usage analysis and health checks,
 * performs rigorous input validation, and formats error/success responses.
 * 
 * Hackathon Problem Statement DVPS-33
 */

const { analyzeWaterConsumption } = require('../services/waterAnalysis');

/**
 * Health check controller
 * GET /api/health
 */
function getHealth(req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'Water monitoring API is running',
  });
}

/**
 * Water usage analysis controller
 * POST /api/analyze-water-usage
 */
function analyzeUsage(req, res) {
  try {
    const {
      householdSize,
      currentDailyUsage,
      previousDailyUsage,
      daysAnalyzed,
      usage,
    } = req.body || {};

    // 1. Check for presence of required fields
    if (
      householdSize === undefined ||
      currentDailyUsage === undefined ||
      previousDailyUsage === undefined ||
      daysAnalyzed === undefined
    ) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Missing required fields: householdSize, currentDailyUsage, previousDailyUsage, and daysAnalyzed are all required.',
      });
    }

    // 2. Validate householdSize (must be a positive integer > 0)
    const parsedHousehold = Number(householdSize);
    if (
      isNaN(parsedHousehold) ||
      typeof householdSize === 'boolean' ||
      !Number.isInteger(parsedHousehold) ||
      parsedHousehold <= 0
    ) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid householdSize: must be a positive whole number greater than 0.',
      });
    }

    // 3. Validate currentDailyUsage (must be a positive number > 0)
    const parsedCurrent = Number(currentDailyUsage);
    if (
      isNaN(parsedCurrent) ||
      typeof currentDailyUsage === 'boolean' ||
      parsedCurrent <= 0
    ) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid currentDailyUsage: must be a positive number greater than 0.',
      });
    }

    // 4. Validate previousDailyUsage (must be a positive number > 0)
    const parsedPrevious = Number(previousDailyUsage);
    if (
      isNaN(parsedPrevious) ||
      typeof previousDailyUsage === 'boolean' ||
      parsedPrevious <= 0
    ) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid previousDailyUsage: must be a positive baseline number greater than 0.',
      });
    }

    // 5. Validate daysAnalyzed (must be a positive integer > 0)
    const parsedDays = Number(daysAnalyzed);
    if (
      isNaN(parsedDays) ||
      typeof daysAnalyzed === 'boolean' ||
      !Number.isInteger(parsedDays) ||
      parsedDays <= 0
    ) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid daysAnalyzed: must be a positive whole number greater than 0.',
      });
    }

    // 6. Validate optional usage categories breakdown
    const cleanedUsage = {};
    if (usage && typeof usage === 'object' && !Array.isArray(usage)) {
      const allowedCategories = ['bathing', 'kitchen', 'laundry', 'cleaning', 'other'];
      for (const cat of allowedCategories) {
        if (usage[cat] !== undefined && usage[cat] !== null && usage[cat] !== '') {
          const catVal = Number(usage[cat]);
          if (isNaN(catVal) || typeof usage[cat] === 'boolean' || catVal < 0) {
            return res.status(400).json({
              error: 'Validation Error',
              message: `Invalid usage.${cat}: must be a non-negative number.`,
            });
          }
          cleanedUsage[cat] = catVal;
        } else {
          cleanedUsage[cat] = 0;
        }
      }
    }

    // 7. Perform water usage analysis
    const result = analyzeWaterConsumption({
      householdSize: parsedHousehold,
      currentDailyUsage: parsedCurrent,
      previousDailyUsage: parsedPrevious,
      daysAnalyzed: parsedDays,
      usage: cleanedUsage,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing water usage:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected server error occurred while analyzing water usage metrics.',
    });
  }
}

module.exports = {
  getHealth,
  analyzeUsage,
};
