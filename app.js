/**
 * Express Application Module
 *
 * Defines all HTTP route handlers for the tutorial application.
 * Exports the Express app instance WITHOUT calling .listen() to enable
 * Supertest-based testing without port binding or open handle issues.
 *
 * Endpoints:
 *   GET /         — Returns "Hello world" with status 200
 *   GET /evening  — Returns "Good evening" with status 200
 *   All other     — Returns "Not Found" with status 404
 */

const express = require('express');

// Create the Express application instance
const app = express();

/**
 * GET / — Hello World endpoint
 * Returns the exact string "Hello world" with HTTP 200 status.
 */
app.get('/', (req, res) => {
  res.send('Hello world');
});

/**
 * GET /evening — Good Evening endpoint
 * Returns the exact string "Good evening" with HTTP 200 status.
 */
app.get('/evening', (req, res) => {
  res.send('Good evening');
});

/**
 * 404 Catch-All Handler
 * Handles all requests to undefined routes by returning HTTP 404.
 * Uses Express 5 middleware-style catch-all (no path parameter)
 * which is compatible with path-to-regexp@8.x.
 */
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Export the app instance for use by server.js and test suites.
// IMPORTANT: Do NOT call app.listen() here — that is server.js's responsibility.
module.exports = app;
