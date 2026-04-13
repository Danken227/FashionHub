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

## 8) How to run in Jenkins

This repository includes a ready-to-use `Jenkinsfile` that runs tests inside a Docker Playwright image.

### Step 1: Create a Pipeline job

1. In Jenkins, create a new **Pipeline** job.
2. In **Pipeline definition**, choose **Pipeline script from SCM**.
3. Select your SCM (for example Git) and provide the repository URL.
4. Ensure the script path is `Jenkinsfile`.

### Step 2: Ensure Jenkins agent prerequisites

The Jenkins agent that executes this job must have:
- Docker available and accessible for the Jenkins user,
- internet access to pull `mcr.microsoft.com/playwright:v1.59.1-noble`,
- access to your repository.

### Step 3: Run the pipeline with parameters

The pipeline exposes two parameters:
- `TARGET_ENV`: `staging`, `production`, or `local`,
- `BROWSER_PROJECT`: `chromium`, `firefox`, or `webkit`.

Recommended first run:
- `TARGET_ENV=staging`
- `BROWSER_PROJECT=chromium`

### Step 4: What the Jenkinsfile executes

The pipeline stages are:
1. `Checkout`
2. `Install Dependencies` (`npm ci`)
3. `Build Validation` (`npm run build`)
4. `Run Playwright Tests`

Behavior of the test command:
- for `TARGET_ENV=local`, the pipeline runs:
  - `npm test -- --env local --project=${BROWSER_PROJECT} --base-url http://host.docker.internal:4000/fashionhub/`
- for `TARGET_ENV=staging` or `production`, the pipeline runs:
  - `npm test -- --env ${TARGET_ENV} --project=${BROWSER_PROJECT}`

### Step 5: Collect results

After each run, Jenkins archives:
- `playwright-report/**`
- `test-results/**`

Open archived artifacts from the build page to inspect failure screenshots, traces, videos, and HTML report files.

### Optional: running against local environment

If you choose `TARGET_ENV=local`, start the FashionHub app on the host machine first:

```bash
docker run -d --name fashionhub -p 4000:80 <FASHIONHUB_IMAGE>
```

In the Jenkins Docker pipeline, `localhost` points to the container itself, not the host.  
That is why the pipeline uses:
- `http://host.docker.internal:4000/fashionhub/`

If your app runs on a different host/port in CI, pass a custom URL:

```bash
npm test -- --env local --base-url http://<host>:<port>/fashionhub/
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
