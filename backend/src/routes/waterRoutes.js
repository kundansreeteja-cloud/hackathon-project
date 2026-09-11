/**
 * Water Routes
 * Maps API routes to their corresponding controller functions.
 * 
 * Endpoints:
 * - GET  /api/health
 * - POST /api/analyze-water-usage
 */

const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');

// Health check endpoint
router.get('/health', waterController.getHealth);

// Main analysis endpoint
router.post('/analyze-water-usage', waterController.analyzeUsage);

module.exports = router;
