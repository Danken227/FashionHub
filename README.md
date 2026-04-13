# FashionHub Playwright Automation

Projekt automatyzuje scenariusz logowania dla FashionHub z naciskiem na:
- uruchamianie na wielu przegladarkach (Chromium, Firefox, WebKit),
- uruchamianie na wielu srodowiskach (local, staging, production),
- prosty deployment do CI/CD (np. Jenkins + Docker).

## 1) Wymagania

- Node.js 20+
- npm 9+
- (opcjonalnie) Docker do uruchomienia aplikacji lokalnie

## 2) Instalacja

```bash
npm install
npx playwright install chromium firefox webkit
```

## 3) Konfiguracja srodowisk

Domyslne adresy sa w `config/environments.json`:

- `local`: `http://localhost:4000/fashionhub/`
- `staging`: `https://staging-env/fashionhub/`
- `production`: `https://pocketaces2.github.io/fashionhub/`

Mechanizm wyboru srodowiska:

1. parametr CLI `--env` (najwyzszy priorytet),
2. zmienna `TEST_ENV`,
3. `defaultEnvironment` z `config/environments.json` (fallback).

Mechanizm wyboru `baseURL`:

1. parametr CLI `--base-url`,
2. zmienna `BASE_URL`,
3. URL przypisany do wybranego srodowiska w `config/environments.json`.

## 4) Uruchomienie testow

### Wszystkie przegladarki

```bash
npm test
```

### Konkretne srodowisko

```bash
npm run test:local
npm run test:staging
npm run test:prod
```

### Nadpisanie z CLI (priorytet)

```bash
npm test -- --env staging
npm test -- --env production --base-url https://pocketaces2.github.io/fashionhub/
```

### Jedna przegladarka

```bash
npm run test:chromium
```

### Raport HTML

```bash
npm run report
```

## 5) Build/check

Projekt jest w TypeScript, wiec dodano krok walidacji:

```bash
npm run build
```

## 6) Scenariusz zaimplementowany

Scenariusz: uzytkownik loguje sie poprawnymi danymi i widzi komunikat powitalny zawierajacy username.

- URL: `/login.html` (na wybranym `baseURL`)
- Username: `demouser`
- Password: `fashion123`

Pliki:
- `tests/login.spec.ts`
- `src/pages/loginPage.ts`
- `src/test-data/users.ts`

## 7) Uruchomienie aplikacji lokalnie (Docker)

W tresci zadania wskazany jest obraz "Fashionhub Demo App". Uzyj obrazu zgodnego z dokumentacja zadania, np.:

```bash
docker run -d --name fashionhub -p 4000:80 <FASHIONHUB_IMAGE>
```

Nastepnie:

```bash
npm run test:local
```

## 8) Jenkins / CI (przyklad)

W pipeline uruchom:

```bash
npm ci
npx playwright install --with-deps
npm run build
npm test -- --env staging
```

## 9) Struktura projektu

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
