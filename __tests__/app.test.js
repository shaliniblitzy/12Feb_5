/**
 * Comprehensive Unit and Integration Test Suite
 * for the Node.js Express Tutorial Application
 *
 * Tests all HTTP endpoints defined in app.js:
 *   GET /         — Returns "Hello world" with status 200
 *   GET /evening  — Returns "Good evening" with status 200
 *   Unknown routes — Returns "Not Found" with status 404
 *
 * Uses Supertest to inject HTTP requests directly into the Express app
 * instance without starting a live server or binding to a network port.
 * This avoids port conflicts and open handle issues during testing.
 *
 * Test organization:
 *   - describe('GET /') — Hello World endpoint tests
 *   - describe('GET /evening') — Good Evening endpoint tests
 *   - describe('Unknown routes') — Error handling tests for undefined routes
 *
 * Conventions:
 *   - CommonJS require() for all imports (no ES module syntax)
 *   - Jest 30 canonical matchers only (no removed aliases)
 *   - Minimum 2 assertions per happy path endpoint test
 *   - Every it() block is self-contained and independently executable
 */

const request = require('supertest');
const app = require('../app');

// ---------------------------------------------------------------------------
// GET / — Hello World Endpoint Tests
// ---------------------------------------------------------------------------
describe('GET /', () => {
  it('should return "Hello world" with status 200', async () => {
    const res = await request(app).get('/');

    // Assert HTTP 200 status and exact response body string
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello world');
  });

  it('should return text/html content-type', async () => {
    const res = await request(app).get('/');

    // Express sets Content-Type to "text/html; charset=utf-8" when sending
    // a string via res.send(). We use toMatch with a regex to account for
    // the charset suffix that Express appends automatically.
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  it('should handle query parameters gracefully', async () => {
    const res = await request(app).get('/?key=value');

    // Query parameters on a defined route should not interfere with routing.
    // The endpoint should still resolve and return the expected response.
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello world');
  });
});

// ---------------------------------------------------------------------------
// GET /evening — Good Evening Endpoint Tests
// ---------------------------------------------------------------------------
describe('GET /evening', () => {
  it('should return "Good evening" with status 200', async () => {
    const res = await request(app).get('/evening');

    // Assert HTTP 200 status and exact response body string
    expect(res.status).toBe(200);
    expect(res.text).toBe('Good evening');
  });

  it('should return text/html content-type', async () => {
    const res = await request(app).get('/evening');

    // Verify the Content-Type header includes text/html.
    // The full header value is "text/html; charset=utf-8".
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  it('should handle query parameters gracefully', async () => {
    const res = await request(app).get('/evening?key=value');

    // Query parameters should not affect the /evening route resolution.
    // The endpoint should return the same response regardless of query string.
    expect(res.status).toBe(200);
    expect(res.text).toBe('Good evening');
  });
});

// ---------------------------------------------------------------------------
// Unknown Routes — Error Handling Tests
// ---------------------------------------------------------------------------
describe('Unknown routes', () => {
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/nonexistent');

    // Requests to paths without a matching route definition should be caught
    // by the catch-all 404 middleware in app.js and respond with HTTP 404.
    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });

  it('should return 404 for POST on GET-only routes', async () => {
    const res = await request(app).post('/');

    // The root route (/) is defined only for GET requests. A POST request
    // to / does not match any route handler and falls through to the
    // catch-all 404 middleware. Express 5 returns 404 for unmatched
    // method+path combinations via the catch-all handler.
    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });
});
