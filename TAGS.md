# Test Tags Guide

Tests are organized with dual tags: type + feature.

## Tag Structure

- **Type Tags:** `@api` or `@frontend`
- **Feature Tags:** `@login`, `@products`, `@users`, `@home`, `@registration`

## Available Tags

### API Tests
- `@api @login` - Authentication and token generation
- `@api @products` - Product management
- `@api @users` - User management

### Frontend Tests
- `@frontend @login` - Login authentication
- `@frontend @products` - Product catalog and admin controls
- `@frontend @home` - Home page and logout
- `@frontend @registration` - User registration

## Running Tests with Tags

Use `GREP_TAGS` with `npm run cy:run:tags`. Without `TEST_ENV`, the run uses **production** (`.env.production`). Set `TEST_ENV=local` to use `.env.local`.

### By Type
```bash
# Run all API tests
GREP_TAGS="@api" npm run cy:run:tags

# Run all Frontend tests
GREP_TAGS="@frontend" npm run cy:run:tags
```

### By Feature
```bash
# Run all Login tests (API + Frontend)
GREP_TAGS="@login" npm run cy:run:tags

# Run all Products tests
GREP_TAGS="@products" npm run cy:run:tags
```

### OR Mode (Multiple tags, run if ANY match)
```bash
# Use | separator
# Run tests that have @api OR @login
GREP_TAGS="@api|@login" npm run cy:run:tags

# Run tests that have @users OR @products
GREP_TAGS="@users|@products" npm run cy:run:tags
```

### AND Mode (Multiple tags, run if ALL match)
```bash
# Use , separator
# Run ONLY API login tests (must have both @api AND @login)
GREP_TAGS="@api,@login" npm run cy:run:tags

# Run ONLY frontend products tests (must have both @frontend AND @products)
GREP_TAGS="@frontend,@products" npm run cy:run:tags
```

### Tags + environment
```bash
# Local (requires ServeRest running locally)
TEST_ENV=local GREP_TAGS="@api" npm run cy:run:tags
TEST_ENV=local GREP_TAGS="@frontend" npm run cy:run:tags
TEST_ENV=local GREP_TAGS="@api,@login" npm run cy:run:tags
TEST_ENV=local GREP_TAGS="@frontend,@products" npm run cy:run:tags

# Production (explicit; same as omitting TEST_ENV)
TEST_ENV=production GREP_TAGS="@api" npm run cy:run:tags
TEST_ENV=production GREP_TAGS="@frontend,@login" npm run cy:run:tags
```

## CI/CD Pipeline Behavior

GitHub Actions workflow automatically filters jobs based on tags:

| Trigger | API Job | Frontend Job |
|---------|---------|--------------|
| Push to main/PR | ✅ Runs | ✅ Runs |
| Manual: `@api` | ✅ Runs | ❌ Skipped |
| Manual: `@frontend` | ❌ Skipped | ✅ Runs |
| Manual: `@login` | ✅ Runs | ✅ Runs |
| Manual: `@api,@login` | ✅ Runs | ✅ Runs |
| Manual: `@api\|@frontend` | ✅ Runs | ✅ Runs |
| Manual: empty | ✅ Runs | ✅ Runs |

**Workflow Rules:**
- Push/PR → Both jobs always run
- `workflow_dispatch` with `@api` → Only API job
- `workflow_dispatch` with `@frontend` → Only Frontend job
- `workflow_dispatch` with anything else (feature tags, combinations) → Both jobs run

## Test Counts

- **API Tests:** 10 test cases
  - Login: 3
  - Products: 3
  - Users: 4
- **Frontend Tests:** 10 test cases
  - Home: 1
  - Login: 3
  - Products: 3
  - Registration: 3
- **Total:** 20 test cases
