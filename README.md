# ServeRest — Automated Tests with Cypress

End-to-end and API test automation project for the [ServeRest](https://serverest.dev/) application, built with Cypress and JavaScript.

## Application under test

| Environment | Frontend (`BASE_URL`) | API (`API_URL`) |
|-------------|-----------------------|-----------------|
| Production (default) | https://front.serverest.dev | https://serverest.dev |
| Local | http://localhost:3001 | http://localhost:3000 |

URLs are loaded from `.env.${TEST_ENV}` (see `.env.example`). `TEST_ENV` defaults to `production`.

## Tech stack

- [Cypress](https://www.cypress.io/) v13
- [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) — HTML reports
- GitHub Actions — CI/CD pipeline

## Architecture

The project applies the following design patterns:

| Pattern | Usage |
|---------|-------|
| **Page Object Model (POM)** | Encapsulates selectors and actions per screen in `cypress/pages/` |
| **Service Object Pattern** | Abstracts API HTTP calls in `cypress/services/` |
| **Fixtures** | Centralizes test data and templates in `cypress/fixtures/` |
| **Custom Commands** | Reuses common operations (`cy.createUser`, `cy.loginUI`, etc.) |
| **cy.session** | Reuses authenticated session across tests, avoiding repeated UI logins |

```
cypress/
├── e2e/
│   ├── frontend/           # E2E tests (UI)
│   │   ├── login.cy.js
│   │   ├── registration.cy.js
│   │   ├── home.cy.js
│   │   └── products.cy.js
│   └── api/                # API tests
│       ├── login.cy.js
│       ├── users.cy.js
│       └── products.cy.js
├── fixtures/               # Test data and templates
│   ├── users.json
│   └── products.json
├── pages/                  # Page Objects (POM)
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── HomePage.js
│   └── ProductsPage.js
├── services/               # Service Objects (API)
│   ├── AuthService.js
│   ├── UserService.js
│   └── ProductService.js
└── support/
    ├── commands.js         # Reusable custom commands
    └── e2e.js
```

## Test Scenarios

### Frontend E2E

| File | Suite | Test cases |
|------|-------|------------|
| `login.cy.js` | Login — User Authentication | ✅ Valid credentials / ❌ Wrong password / ❌ Unregistered email |
| `registration.cy.js` | Registration — New User Registration | ✅ Navigate to registration / ✅ Successful registration / ❌ Existing email |
| `home.cy.js` | Home — Authenticated user actions | ✅ Logout and redirect to login |
| `products.cy.js` | Products — Catalog View & Access Control | ✅ Product list / ✅ Admin button visible / ❌ Admin button hidden for non-admin |

### API

| File | Suite | Test cases |
|------|-------|------------|
| `login.cy.js` | API Login — Token generation (POST /login) | ✅ Valid credentials return token / ❌ Wrong password (401) / ❌ Unregistered email (401) |
| `users.cy.js` | API Users — User management (/usuarios) | ✅ Create user (201) / ❌ Duplicate email (400) / ✅ Fetch by ID (200) / ❌ Missing required fields (400) |
| `products.cy.js` | API Products — Product management (/produtos) | ✅ Create with token (201) / ✅ List products (200) / ❌ Create without token (401) |

## Installation and usage

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

Copy `.env.example` and adjust if you run against a local ServeRest instance:

```bash
cp .env.example .env.local
```

### Run all tests (headless)

Uses production by default:

```bash
npm test
```

### Run against a specific environment

```bash
# Production
npm run cy:run:prod
npm run cy:open:prod

# Local (requires ServeRest running locally)
npm run cy:run:local
npm run cy:open:local

# Or set TEST_ENV on any script
TEST_ENV=local npm test
```

### Run frontend tests only

```bash
npm run cy:run:frontend
```

### Run API tests only

```bash
npm run cy:run:api
```

### Run tests by tag

Tests are tagged for flexible filtering in CI/CD pipelines. Combine `GREP_TAGS` with `TEST_ENV` (`production` by default, or `local`).

**Type tags:** `@api` or `@frontend`  
**Feature tags:** `@login`, `@products`, `@users`, `@home`, `@registration`

**OR mode** (run if ANY tag matches) — use `|`:

```bash
# Run all API tests (production)
GREP_TAGS="@api" npm run cy:run:tags

# Run all frontend tests (production)
GREP_TAGS="@frontend" npm run cy:run:tags

# Run tests with @api OR @login
GREP_TAGS="@api|@login" npm run cy:run:tags
```

**AND mode** (run if ALL tags match) — use `,`:

```bash
# Run ONLY API login tests (must have both @api AND @login)
GREP_TAGS="@api,@login" npm run cy:run:tags

# Run ONLY frontend products tests
GREP_TAGS="@frontend,@products" npm run cy:run:tags
```

**Tags + environment**

```bash
# Local ServeRest
TEST_ENV=local GREP_TAGS="@api" npm run cy:run:tags
TEST_ENV=local GREP_TAGS="@frontend,@login" npm run cy:run:tags

# Production (explicit)
TEST_ENV=production GREP_TAGS="@api,@login" npm run cy:run:tags
```

See [TAGS.md](TAGS.md) for complete tag reference and CI/CD examples.

### Open interactive mode

```bash
npm run cy:open
```

## CI/CD

Tests run automatically via **GitHub Actions** on every `push` or `pull request` to `main`/`master`. API and Frontend jobs run in parallel.

HTML reports (Mochawesome) are published as **artifacts** in the repository's Actions tab.
