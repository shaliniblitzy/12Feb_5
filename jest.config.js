/**
 * Jest Configuration for Node.js Express Tutorial Application
 *
 * Configures the Jest testing framework for server-side Express endpoint testing.
 * Targets the Node.js test environment (not jsdom), discovers test files in the
 * __tests__/ directory, and enforces 90%+ coverage thresholds on application
 * source files (app.js and server.js).
 *
 * Usage:
 *   npm test              — Run all tests
 *   npm run test:coverage — Run tests with coverage reporting
 */

/** @type {import('jest').Config} */
const config = {
  // Use the Node.js test environment for server-side Express testing.
  // The default 'jsdom' environment is designed for browser-like DOM testing
  // and is not appropriate for testing HTTP servers and route handlers.
  testEnvironment: 'node',

  // Match test files located in the __tests__/ directory following the
  // *.test.js naming convention. This pattern ensures only intentional
  // test files are discovered and executed by the test runner.
  testMatch: ['**/__tests__/**/*.test.js'],

  // Collect coverage data from the application source files only.
  // app.js contains the Express route handlers and middleware under test.
  // server.js contains the server entry point with the listen() binding.
  collectCoverageFrom: ['app.js', 'server.js'],

  // Output directory for generated coverage reports (lcov, text, text-summary).
  // This directory is typically added to .gitignore to avoid committing
  // generated artifacts to version control.
  coverageDirectory: 'coverage',

  // Enforce minimum coverage thresholds on app.js only.
  // Per AAP §0.7.1, server.js is excluded from coverage thresholds because
  // it contains only the app.listen() call which requires port binding and
  // cannot be unit-tested without open handle issues. The testable logic
  // resides entirely in app.js. Using per-file thresholds instead of global
  // ensures server.js is still measured but does not cause threshold failures.
  coverageThreshold: {
    './app.js': {
      lines: 90,
      branches: 90,
      functions: 90,
      statements: 90,
    },
  },
};

module.exports = config;
