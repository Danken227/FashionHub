# FashionHub Playwright Automation

This project automates the FashionHub login scenario with a focus on:
- running across multiple browsers (Chromium, Firefox, WebKit),
- running across multiple environments (local, staging, production),
- simple CI/CD deployment (for example Jenkins + Docker).

## 1) Requirements

- Node.js 20+
- npm 9+
- (optional) Docker to run the app locally

## 2) Installation

```bash
npm install
npx playwright install chromium firefox webkit
```

## 3) Environment configuration

Default URLs are defined in `config/environments.json`:

- `local`: `http://localhost:4000/fashionhub/`
- `staging`: `https://staging-env/fashionhub/`
- `production`: `https://pocketaces2.github.io/fashionhub/`

Environment selection priority:

1. CLI parameter `--env` (highest priority),
2. `TEST_ENV` environment variable,
3. `defaultEnvironment` from `config/environments.json` (fallback).

`baseURL` selection priority:

1. CLI parameter `--base-url`,
2. `BASE_URL` environment variable,
3. URL assigned to the selected environment in `config/environments.json`.

## 4) Running tests

### All browsers

```bash
npm test
```

### Specific environment

```bash
npm run test:local
npm run test:staging
npm run test:prod
```

### Override from CLI (highest priority)

```bash
npm test -- --env staging
npm test -- --env production --base-url https://pocketaces2.github.io/fashionhub/
```

### Single browser

```bash
npm run test:chromium
```

### HTML report

```bash
npm run report
```

## 5) Build/check

The project is written in TypeScript, so a validation step is included:

```bash
npm run build
```

## 6) Implemented scenario

Scenario: a user logs in with valid credentials and sees a welcome message containing the username.

- URL: `/login.html` (on the selected `baseURL`)
- Username: `demouser`
- Password: `fashion123`

Files:
- `tests/login.spec.ts`
- `src/pages/loginPage.ts`
- `src/test-data/users.ts`

## 7) Running the app locally (Docker)

The task description references the "Fashionhub Demo App" image. Use an image consistent with the task documentation, for example:

```bash
docker run -d --name fashionhub -p 4000:80 <FASHIONHUB_IMAGE>
```

Then run:

```bash
npm run test:local
```

## 8) Jenkins / CI (example)

Run the following in your pipeline:

```bash
npm ci
npx playwright install --with-deps
npm run build
npm test -- --env staging
```

## 9) Project structure

```text
config/
  environments.json
src/
  config/testEnvironment.ts
  pages/loginPage.ts
  test-data/users.ts
tests/
  login.spec.ts
playwright.config.ts
```
