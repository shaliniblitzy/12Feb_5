# Technical Specification

# 0. Agent Action Plan

## 0.1 Intent Clarification


### 0.1.1 Core Testing Objective

Based on the provided requirements, the Blitzy platform understands that the testing objective is to **create a comprehensive unit and integration test suite from scratch** for a new Node.js + Express.js server application that hosts two HTTP endpoints.

**Request Category:** Add new tests (greenfield testing for a new feature implementation)

The user's requirements are as follows:

- Build a Node.js server tutorial application hosting one endpoint that returns the response **"Hello world"**
- Integrate Express.js into the project as the HTTP framework
- Add a second endpoint that returns the response **"Good evening"**
- Create the complete test suite to validate both endpoints function correctly

The Blitzy platform has identified the following implicit testing needs derived from the above requirements:

- **Endpoint response validation** — Each endpoint must return the exact string responses specified by the user ("Hello world" and "Good evening")
- **HTTP status code verification** — Both endpoints should respond with HTTP 200 for successful requests
- **Content-type header validation** — Responses should carry appropriate content-type headers
- **Route isolation testing** — Each route should be independently testable without starting the server listener
- **Negative path testing** — Requests to undefined routes should return HTTP 404
- **HTTP method enforcement** — Non-GET requests to GET-only endpoints should be handled appropriately
- **Server startup and teardown** — Tests must properly manage Express app lifecycle to avoid port conflicts and open handles

### 0.1.2 Special Instructions and Constraints

The user has not specified any explicit testing constraints. The following implicit conventions are adopted based on the greenfield nature of the project:

- The repository is currently empty (contains only `README.md`), so all source code, test code, and configuration must be created from scratch
- No existing test patterns exist to follow; patterns will be established as part of this implementation
- The project targets **Node.js v20.20.0** as documented in the technical specification (Section 3.1)
- Express.js v5.x will be used as it is the current default version on npm and is compatible with Node.js 20
- Jest will be used as the testing framework (industry standard for Node.js projects) with Supertest for HTTP assertion testing

**User Example:** The user provided these exact response strings that must be preserved in tests:
- Endpoint 1: `"Hello world"`
- Endpoint 2: `"Good evening"`

### 0.1.3 Technical Interpretation

These testing requirements translate to the following technical test implementation strategy:

- To **test the "Hello world" endpoint**, we will create a test file at `__tests__/app.test.js` that uses Supertest to send a GET request to the root route (`/`) and assert the response body matches the string `"Hello world"` with HTTP status 200
- To **test the "Good evening" endpoint**, we will extend the same test file to send a GET request to the `/evening` route and assert the response body matches `"Good evening"` with HTTP status 200
- To **ensure testability**, the Express application (`app.js`) must export the Express app instance separately from the server listener (`server.js`), enabling Supertest to bind to the app without opening a persistent network port
- To **validate error handling**, we will add test cases for unknown routes returning 404 and verify proper response formatting

### 0.1.4 Coverage Requirements Interpretation

The user has not specified explicit coverage targets. Based on the following analysis, the Blitzy platform defines the coverage strategy:

- **Industry standard for Node.js/Express applications:** 80%+ line and branch coverage is the commonly accepted baseline
- **Existing coverage patterns in the repository:** None exist (greenfield project)
- **Critical path analysis:** Both endpoints represent the entire application surface area and are therefore critical paths

To achieve comprehensive testing, coverage should include:

- 100% of defined route handlers (2 endpoints)
- 100% of the Express application setup logic in `app.js`
- Error handling middleware coverage for undefined routes
- All response status codes and content-type headers validated per route
- Target overall coverage: **90%+** for this simple tutorial application, as the codebase is small enough to achieve near-complete coverage


## 0.2 Test Discovery and Analysis


### 0.2.1 Existing Test Infrastructure Assessment

Repository analysis was conducted using `get_source_folder_contents` on the root directory and `bash` commands to search the filesystem. The repository is a **greenfield project** containing only a single `README.md` file at the root level. No source code, dependency manifests, test files, or test configurations exist.

**Discovery findings:**

- **Test files found:** None — no files matching patterns `*test*`, `*spec*`, `test_*`, `spec_*`, `*_test.*`, or `*_spec.*` exist in the repository
- **Testing framework detected:** None — no `package.json`, `jest.config.js`, `jest.config.ts`, `.mocharc.*`, `vitest.config.*`, or any other test configuration file is present
- **Dependency manifest:** None — no `package.json` or `package-lock.json` exists; the project has no declared dependencies
- **Coverage tools:** None configured
- **Mock/stub libraries:** None detected
- **Test data fixtures or factories:** None present

**Repository analysis reveals** that this is an entirely empty project with zero testing infrastructure. All testing components — framework, configuration, test files, fixtures, and utilities — must be created as part of this implementation.

**Infrastructure to be established:**

| Component | Current State | Required Action |
|-----------|--------------|-----------------|
| `package.json` | Does not exist | Create with project metadata, dependencies, and test scripts |
| Test framework (Jest) | Not installed | Add as devDependency |
| HTTP testing library (Supertest) | Not installed | Add as devDependency |
| Test configuration (`jest.config.js`) | Does not exist | Create with Node.js test environment settings |
| Test directory (`__tests__/`) | Does not exist | Create with initial test file |
| Coverage configuration | Does not exist | Configure within Jest settings |

### 0.2.2 Web Search Research Conducted

The following research was conducted to validate compatibility and identify best practices for the target testing stack:

- **Express.js 5.x compatibility with Node.js 20:** Confirmed via the official npm registry and Express.js migration guide. Express 5 requires Node.js 18 or higher. Node.js v20.20.0 is fully compatible.
- **Jest 30 compatibility with Node.js 20:** Confirmed via the official Jest v30 migration guide at `jestjs.io/docs/upgrading-to-jest30`. Jest 30 drops support for Node 14, 16, 19, and 21. The minimum supported Node version is 18.x. Node.js v20.20.0 is fully compatible.
- **Supertest 7.x usage patterns:** Supertest requires the Express app instance to be exported separately from the `server.listen()` call. This is the standard pattern for Express endpoint testing.
- **Express 5 route syntax changes:** Express 5 uses updated `path-to-regexp@8.x` syntax. Wildcards must now have names (e.g., `/*splat` instead of `/*`). This impacts how catch-all 404 handlers are defined and tested.
- **Jest 30 breaking changes relevant to this project:** Removed matcher aliases (e.g., `.toBeCalled()` removed in favor of `.toHaveBeenCalled()`). Since this is a greenfield project, we will use only the current canonical matcher names from the start.


## 0.3 Testing Scope Analysis


### 0.3.1 Test Target Identification

**Primary code to be tested:**

Since this is a greenfield project, the source files below will be created as part of the feature implementation and are the targets for testing:

- **Module:** Express Application at `app.js` — requires unit and integration tests
  - `GET /` route handler returning `"Hello world"`
  - `GET /evening` route handler returning `"Good evening"`
  - Express app initialization and middleware configuration
  - 404 handler for undefined routes

- **Module:** Server Entry Point at `server.js` — requires startup verification
  - Server listener binding to a configured port
  - Graceful export of the app instance for test consumption

**Functions and route handlers requiring test categories:**

| Function/Handler | Test Categories Needed |
|-----------------|----------------------|
| `GET /` route handler | Happy path, response format, status code, content-type |
| `GET /evening` route handler | Happy path, response format, status code, content-type |
| 404 catch-all handler | Error handling, unknown route response |
| Express app initialization | Integration (app exports correctly, middleware chain works) |

**Existing test file mapping:**

| Source File | Existing Test File | Test Categories Present |
|-------------|-------------------|------------------------|
| `app.js` (to be created) | None | None |
| `server.js` (to be created) | None | None |

**Dependencies requiring mocking:**

- **No external services** need to be mocked — this is a self-contained Express application with no database, API, or file system dependencies
- **No database interactions** to stub — endpoints return static string responses
- **No file system operations** to virtualize — the application performs only HTTP request/response handling
- **Port binding** — The Express app must be exported without calling `.listen()` so Supertest can manage the HTTP layer directly during tests

### 0.3.2 Version Compatibility Research

Based on the current runtime of **Node.js v20.20.0** and validated through web search and npm registry queries, the recommended testing stack is:

| Component | Name | Version | Compatibility Rationale |
|-----------|------|---------|------------------------|
| Runtime | Node.js | 20.20.0 | Already installed; matches tech spec sidecar version |
| Server Framework | Express | 5.2.1 | Latest stable; requires Node.js 18+ (v20 compatible) |
| Testing Framework | Jest | 30.2.0 | Latest stable; minimum Node.js 18.x (v20 compatible) |
| HTTP Test Utility | Supertest | 7.2.2 | Latest stable; works with Express 5 app instances |

**Version conflict analysis:** No version conflicts detected. All selected packages are mutually compatible and support the Node.js 20.x runtime. Express 5.2.1 specifically resolves an erroneous breaking change from 5.2.0 related to the extended query parser, making it the preferred patch version.


## 0.4 Test Implementation Design


### 0.4.1 Test Strategy Selection

**Test types to implement:**

- **Unit tests:** Focus on each route handler in isolation — verify that individual GET endpoints return the correct response body, status code, and content-type header
- **Integration tests:** Cover the full Express middleware chain — verify that requests flow through the Express app correctly from route matching to response delivery
- **Edge case tests:** Address boundary conditions — empty request bodies, trailing slashes on routes, case sensitivity of route paths
- **Error handling tests:** Verify failure scenarios — requests to undefined routes return proper 404 responses, non-GET HTTP methods on GET-only routes are handled appropriately

### 0.4.2 Test Case Blueprint

```
Component: GET / (Hello World Endpoint)
Test Categories:
- Happy path: GET / returns "Hello world" with status 200
- Happy path: GET / response has text/html content-type
- Edge cases: GET / with trailing query parameters still resolves
- Error cases: POST / returns 404 or 405 (method not allowed)
```

```
Component: GET /evening (Good Evening Endpoint)
Test Categories:
- Happy path: GET /evening returns "Good evening" with status 200
- Happy path: GET /evening response has text/html content-type
- Edge cases: GET /evening with trailing query parameters still resolves
- Error cases: POST /evening returns 404 or 405 (method not allowed)
```

```
Component: Express App (General Behavior)
Test Categories:
- Happy path: App instance is a valid Express application
- Error cases: GET /nonexistent returns 404 status
- Error cases: GET /unknown-path returns appropriate error body
```

### 0.4.3 Existing Test Extension Strategy

Since this is a greenfield project, there are no existing tests to extend, refactor, or fix. All test files will be created from scratch:

- **Tests to create:** `__tests__/app.test.js` — comprehensive test suite covering all route handlers, error scenarios, and edge cases as defined in the blueprint above
- **Configuration to create:** `jest.config.js` — Jest configuration targeting the Node.js environment with coverage thresholds

### 0.4.4 Test Data and Fixtures Design

**Required test data structures:**

This application returns static string responses, so the test data requirements are minimal:

- **Expected response constants** — Defined inline within test files:
  - `"Hello world"` for the root endpoint
  - `"Good evening"` for the evening endpoint
- **No fixture files required** — The application has no dynamic data, database state, or complex input structures
- **No mock objects required** — The application has no external dependencies, third-party API calls, or database connections to mock

**Test database/state management approach:**

- Not applicable — the application is stateless with no persistence layer
- Each test uses a fresh Supertest agent wrapping the Express app instance, providing natural isolation between test cases

**App/Server separation pattern for testability:**

The `app.js` file must export the Express app instance without calling `.listen()`. The `server.js` file imports this instance and binds it to a port. This separation allows Supertest to inject requests directly into the Express routing layer without network overhead:

```javascript
// app.js exports the app; server.js calls app.listen(PORT)
const request = require('supertest');
const app = require('../app');
```


## 0.5 Test File Transformation Mapping


### 0.5.1 File-by-File Test Plan

The following table maps every file to be created, updated, or referenced as part of this testing implementation. Since this is a greenfield project, all entries use the **CREATE** transformation mode.

| Target Test File | Transformation | Source File/Test | Purpose/Changes |
|-----------------|----------------|------------------|-----------------|
| `__tests__/app.test.js` | CREATE | `app.js` | Comprehensive test suite covering GET / ("Hello world"), GET /evening ("Good evening"), 404 handling for unknown routes, and HTTP method validation |
| `jest.config.js` | CREATE | N/A | Jest configuration file specifying Node.js test environment, test file patterns, and coverage thresholds |
| `package.json` | CREATE | N/A | Project manifest with Express as dependency, Jest and Supertest as devDependencies, and `test` / `test:coverage` npm scripts |

**Supporting source files required for testability (not test files, but necessary for tests to function):**

| Target Source File | Transformation | Purpose |
|-------------------|----------------|---------|
| `app.js` | CREATE | Express application with route definitions; exports app instance for Supertest consumption |
| `server.js` | CREATE | Server entry point that imports app.js and binds to a port; separated from app.js to enable testing without port conflicts |

### 0.5.2 New Test Files Detail

- **`__tests__/app.test.js`** — Primary test file for all endpoint coverage
  - **Test categories:**
    - Happy path: Validates correct response body and status for both endpoints
    - Edge cases: Tests trailing query strings, response content-type headers
    - Error cases: Verifies 404 for unknown routes, validates non-GET method handling
  - **Mock dependencies:** None required — application has no external dependencies
  - **Assertions focus:** Response status codes (`expect(res.status).toBe(200)`), response body text matching (`expect(res.text).toBe("Hello world")`), content-type header validation

  **Test methods to be included:**

  - `describe('GET /')` block:
    - `it('should return "Hello world" with status 200')`
    - `it('should return text/html content-type')`
    - `it('should handle query parameters gracefully')`
  - `describe('GET /evening')` block:
    - `it('should return "Good evening" with status 200')`
    - `it('should return text/html content-type')`
    - `it('should handle query parameters gracefully')`
  - `describe('Unknown routes')` block:
    - `it('should return 404 for undefined routes')`
    - `it('should return 404 for POST on GET-only routes')`

### 0.5.3 Test Configuration Updates

- **`jest.config.js`** — Created with the following settings:
  - `testEnvironment: 'node'` — Appropriate for server-side Express testing
  - `testMatch: ['**/__tests__/**/*.test.js']` — Matches test files in the `__tests__` directory
  - `collectCoverageFrom: ['app.js', 'server.js']` — Targets source files for coverage measurement
  - `coverageThreshold` — Enforces minimum coverage percentages
  - `coverageDirectory: 'coverage'` — Output directory for coverage reports

- **`package.json`** `scripts` section:
  - `"test": "jest"` — Default test execution
  - `"test:coverage": "jest --coverage"` — Test execution with coverage reporting

### 0.5.4 Cross-File Test Dependencies

- **Shared fixtures:** Not applicable — no fixtures needed for static response testing
- **Mock objects:** Not applicable — no external dependencies require mocking
- **Test utilities:** Not applicable — Supertest provides all necessary HTTP assertion utilities out of the box
- **Import dependencies:** `__tests__/app.test.js` imports `app.js` (the Express app instance) and `supertest` (the HTTP testing library). No other cross-file imports are needed.
- **Critical dependency chain:** `__tests__/app.test.js` → `app.js` → `express` (runtime dependency)


## 0.6 Dependency Inventory


### 0.6.1 Testing Dependencies

All package versions below have been verified as the current latest stable releases via `npm view <package> version` and confirmed compatible with Node.js v20.20.0 through official documentation and migration guides.

| Registry | Package Name | Version | Purpose |
|----------|-------------|---------|---------|
| npm | jest | 30.2.0 | Testing framework — test runner, assertion library, and coverage engine for Node.js |
| npm | supertest | 7.2.2 | HTTP assertion library — enables testing Express routes without starting a live server |

**Runtime dependencies (required for the source code under test):**

| Registry | Package Name | Version | Purpose |
|----------|-------------|---------|---------|
| npm | express | 5.2.1 | HTTP server framework — provides routing and middleware for the application endpoints |

**Version validation notes:**

- **Jest 30.2.0:** Requires Node.js 18.x minimum. Node.js v20.20.0 exceeds this requirement. Jest 30 removes deprecated matcher aliases and upgrades glob to v10. All tests will use canonical matcher names (e.g., `.toHaveBeenCalled()` instead of the removed `.toBeCalled()`).
- **Supertest 7.2.2:** Works with any Express app instance exported as a module. No special version constraints beyond a functioning HTTP framework.
- **Express 5.2.1:** Requires Node.js 18+. This specific patch version reverts an erroneous breaking change from 5.2.0 related to the extended query parser. Route syntax uses `path-to-regexp@8.x` — all route definitions in tests will follow Express 5 conventions.

### 0.6.2 Import Updates

Since this is a greenfield project, there are no existing imports to update. The following import structure will be established in the new test file:

**`__tests__/app.test.js` imports:**

```javascript
const request = require('supertest');
const app = require('../app');
```

**`app.js` imports:**

```javascript
const express = require('express');
```

**`server.js` imports:**

```javascript
const app = require('./app');
```

No import transformation rules are needed as there is no pre-existing code to migrate.


## 0.7 Coverage and Quality Targets


### 0.7.1 Coverage Metrics

- **Current coverage:** 0% — no tests or source code exist in the repository
- **Target coverage:** 90%+ based on industry best practice for small, self-contained Node.js applications. Given the minimal codebase (two route handlers and app setup), achieving near-complete coverage is both feasible and expected.

**Coverage gaps to address:**

| Component | Current Coverage | Target Coverage | Focus Areas |
|-----------|-----------------|-----------------|-------------|
| `app.js` — Route handlers | 0% | 95%+ | Both GET endpoints, Express app initialization, 404 error handler |
| `app.js` — Middleware chain | 0% | 90%+ | Request routing, response delivery pipeline |
| `server.js` — Server startup | 0% | Excluded from threshold | Server listener logic is excluded from unit test coverage as it requires port binding; validated through manual or integration testing |

**Per-file coverage targets:**

| File | Line Coverage Target | Branch Coverage Target | Function Coverage Target |
|------|---------------------|----------------------|-------------------------|
| `app.js` | 95% | 90% | 100% |
| `server.js` | Excluded | Excluded | Excluded |

**Rationale for `server.js` exclusion:** The `server.js` file contains only the `app.listen()` call which binds to a network port. Testing this in a unit test environment risks port conflicts and open handles. The testable logic resides entirely in `app.js`.

### 0.7.2 Test Quality Criteria

- **Assertion density:** Each test case must contain at least one meaningful assertion. Happy path tests should assert both status code and response body. Minimum of 2 assertions per endpoint test.
- **Test isolation:** Each test case must be independent and not rely on state from prior tests. Supertest creates a fresh HTTP connection per request, ensuring natural isolation.
- **Performance constraints:** The full test suite should execute in under 5 seconds. Given the simplicity of the application (no I/O, no database, static responses), individual test cases should complete in under 100ms.
- **Maintainability standards:**
  - Test descriptions must clearly describe the expected behavior (e.g., `'should return "Hello world" with status 200'`)
  - Tests should be grouped by endpoint using `describe` blocks
  - Magic strings (response bodies) should appear directly in assertions for maximum readability in a tutorial context
- **Convention adherence:** Since this is a greenfield project establishing patterns, the conventions defined here become the standard:
  - Test files placed in `__tests__/` directory
  - Test files named `*.test.js`
  - CommonJS `require()` syntax for module imports
  - `describe` / `it` block structure for test organization


## 0.8 Scope Boundaries


### 0.8.1 Exhaustively In Scope

**New test files:**
- `__tests__/app.test.js` — Complete unit and integration test suite for all Express endpoints

**Source files required for testability:**
- `app.js` — Express application with route definitions, exported for test consumption
- `server.js` — Server entry point, separated from app for clean test isolation

**Test configuration:**
- `jest.config.js` — Jest test runner configuration with Node.js environment and coverage settings
- `package.json` — Project manifest with dependency declarations and npm test scripts

**Test coverage areas:**
- `GET /` endpoint — response body `"Hello world"`, status 200, content-type header
- `GET /evening` endpoint — response body `"Good evening"`, status 200, content-type header
- Unknown route handling — 404 status for undefined paths
- HTTP method enforcement — Proper handling of non-GET requests on defined routes

### 0.8.2 Explicitly Out of Scope

- **Advanced middleware** — No authentication, CORS, rate limiting, or body parsing middleware will be tested or implemented (not part of user requirements)
- **Database or persistence layer** — No database connections, ORM setup, or data storage of any kind
- **Environment configuration** — No `.env` files, environment variable management, or configuration libraries (the tutorial application uses hardcoded values)
- **Deployment configuration** — No Docker, CI/CD pipeline, or cloud deployment artifacts
- **TypeScript** — The project uses plain JavaScript with CommonJS modules; no TypeScript compilation or type checking is in scope
- **End-to-end testing** — No browser-based or full-stack E2E tests; only server-side unit and integration tests
- **Performance or load testing** — No stress tests, benchmarking, or performance profiling
- **Existing system code** — The Archie Job Reverse Document Generator (Python-based system documented in the tech spec) is entirely unrelated and out of scope
- **Linting or formatting** — No ESLint, Prettier, or code style enforcement tooling
- **README.md updates** — The existing `README.md` content will not be modified as part of this testing task


## 0.9 Execution Parameters


### 0.9.1 Testing-Specific Instructions

**Test execution command:**
```bash
npm test
```
This invokes `jest` via the `package.json` scripts section, running all test files matching `**/__tests__/**/*.test.js`.

**Coverage measurement command:**
```bash
npm run test:coverage
```
This invokes `jest --coverage`, generating a coverage report in the `coverage/` directory with lcov, text, and text-summary reporters.

**Single test execution pattern:**
```bash
npx jest __tests__/app.test.js
```

**Run specific test by name:**
```bash
npx jest --testNamePattern="Hello world"
```

**Debug mode execution:**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

**CI-safe execution (non-interactive, no watch mode):**
```bash
CI=true npx jest --watchAll=false --forceExit
```
The `--forceExit` flag ensures Jest terminates cleanly after all tests complete, preventing open handle issues with Supertest connections.

**Test patterns established for the repository:**
- All test files reside in `__tests__/` at the project root
- Test files follow the naming convention `*.test.js`
- Tests use CommonJS `require()` for module imports
- Tests are organized with `describe` blocks per endpoint and `it` blocks per assertion scenario
- Supertest wraps the Express app instance directly (no live server required)

**Environment setup requirements for tests:**
- Node.js v20.20.0 must be available
- Dependencies must be installed via `npm install` before test execution
- No environment variables are required
- No external services or databases need to be running
- No build step is required — source files are plain JavaScript executed directly by Node.js


## 0.10 Special Instructions for Testing


### 0.10.1 Testing-Specific Requirements

The following directives govern the test implementation for this greenfield project:

- **App/server separation is mandatory:** The Express application instance in `app.js` must be exported via `module.exports = app` without calling `.listen()`. The `server.js` file is responsible for importing the app and binding it to a port. This separation is a hard requirement for Supertest to function correctly and must not be bypassed.

- **Use Express 5 route conventions:** Since Express 5 uses `path-to-regexp@8.x`, any catch-all or wildcard routes must use named parameters (e.g., `/*splat` instead of `/*`). All route definitions in both source code and tests must conform to Express 5 syntax.

- **Preserve exact user-specified response strings:** The response bodies `"Hello world"` and `"Good evening"` must be used exactly as specified by the user, including capitalization and spacing. Test assertions must match these strings character-for-character.

- **CommonJS module syntax:** The project uses `require()` / `module.exports` throughout. Do not use ES module syntax (`import` / `export`) in any source or test file unless `"type": "module"` is added to `package.json` (which is not planned).

- **No source code modifications beyond what is needed for testability:** The `app.js` and `server.js` files should contain the minimum code necessary to implement the two endpoints and export the app. No over-engineering, no unnecessary middleware, no complex abstractions.

- **Jest canonical matchers only:** Since Jest 30 removes legacy matcher aliases, all test assertions must use the official matcher names: `.toBe()`, `.toEqual()`, `.toHaveBeenCalled()`, `.toBeDefined()`, etc. Do not use removed aliases like `.toBeCalled()` or `.toBeCalledWith()`.

- **Clean test teardown:** Ensure all tests complete without leaving open handles. Use `--forceExit` in CI environments if needed, but design tests to close naturally by avoiding persistent server listeners in the test context.

- **Test independence:** Every `it()` block must be self-contained and executable in isolation. Tests must not depend on execution order or shared mutable state between test cases.


