/**
 * AquaWatch Backend Server
 * Hackathon Problem Statement DVPS-33:
 * Smart water-usage monitoring app for households that flags leaks
 * and suggests conservation tips based on consumption patterns.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const waterRoutes = require('./src/routes/waterRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration: allow all origins by default for local development,
// or specify origin(s) via CORS_ORIGIN in production environment
const corsOrigin = process.env.CORS_ORIGIN || '*';
const corsOptions = {
  origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((o) => o.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route for quick sanity checking in browser or Render
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'AquaWatch Water Usage Monitoring API',
    version: '1.0.0',
    status: 'online',
    problemStatement: 'DVPS-33',
    endpoints: {
      health: 'GET /api/health',
      analyze: 'POST /api/analyze-water-usage',
    },
  });
});

// Mount water monitoring API routes under /api
app.use('/api', waterRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. Please check the endpoint documentation.`,
  });
});

// Central 500 error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected server error occurred.',
  });
});

// Start Express server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=============================================`);
  console.log(`💧 AquaWatch API Server running on port ${PORT}`);
  console.log(`🔗 Health Check : http://localhost:${PORT}/api/health`);
  console.log(`🔗 Analysis API : http://localhost:${PORT}/api/analyze-water-usage`);
  console.log(`=============================================`);
});

module.exports = { app, server };
