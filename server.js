/**
 * Server Entry Point
 *
 * Imports the Express application instance from app.js and binds it to a
 * network port. This file is deliberately separated from app.js so that
 * Supertest can import the app directly without triggering a persistent
 * server listener, preventing port conflicts and open handle issues during
 * testing.
 *
 * Usage:
 *   node server.js
 *
 * The server listens on the port specified by the PORT environment variable,
 * falling back to 3000 when the variable is not set.
 */

const app = require('./app');

/**
 * Port configuration.
 * Reads from the PORT environment variable for deployment flexibility,
 * defaulting to 3000 for local development.
 */
const PORT = process.env.PORT || 3000;

/**
 * Start the HTTP server.
 * Binds the Express app to the configured port and logs a confirmation
 * message once the server is ready to accept connections.
 */
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
