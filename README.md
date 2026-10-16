# Playwright framework

TypeScript Playwright framework for web automation: page objects, fixtures, Allure and JUnit reporting, GitHub Actions, and Playwright MCP for Cursor.

Set `BASE_URL` and `API_BASE_URL` in `env/.env.dev` to the site you want to automate. There are no sample tests in this repo.

## Prerequisites

- Node.js 20 or newer
- Java 21, only if you want to generate or open the Allure HTML report

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

Install Firefox and WebKit as well when you run those projects:

```bash
npx playwright install firefox webkit
```

Environment files live in `env/`. `TEST_ENV` selects the file (`dev` by default, so `env/.env.dev`). A gitignored `.env` in the project root overrides that file. Shell variables override both.

```bash
TEST_ENV=staging npm test
BROWSERS=chromium,firefox npm test
HEADLESS=false npm run test:smoke
```

`BROWSERS` accepts `chromium`, `firefox`, `webkit`, and `mobile-chrome`.

## Scripts

| Script                    | What it does                                        |
| ------------------------- | --------------------------------------------------- |
| `npm test`                | Full suite                                          |
| `npm run test:smoke`      | Tests tagged `@smoke`                               |
| `npm run test:regression` | Tests tagged `@regression`                          |
| `npm run test:e2e`        | Guest and signed-in UI tests                        |
| `npm run test:api`        | API tests                                           |
| `npm run test:headed`     | Visible browser                                     |
| `npm run test:ui`         | Playwright UI mode                                  |
| `npm run test:debug`      | Inspector                                           |
| `npm run report`          | Open the Playwright HTML report                     |
| `npm run allure:serve`    | Build and open the Allure report                    |
| `npm run codegen`         | Record a script against `BASE_URL`                  |
| `npm run mcp`             | Start Playwright MCP on stdio                       |
| `npm run mcp:http`        | Start Playwright MCP at `http://localhost:8931/mcp` |
| `npm run typecheck`       | Typecheck                                           |
| `npm run lint`            | Lint                                                |

Tag a test with `{ tag: ['@smoke'] }`. CI ignores `@quarantine`.

## Reports

Each run writes:

- `playwright-report/` — HTML report
- `test-results/junit.xml` — JUnit for CI dashboards
- `allure-results/` — Allure raw results
- `logs/test.log` — timestamped step log

Screenshots, video, and trace are kept on failure. The failure fixture also attaches the page URL, DOM, and browser errors. Allure steps, epic, feature, story, severity, and owner are set from the tests.

Generate the Allure HTML report (requires Java):

```bash
npm run allure:generate
npm run allure:open
```

## Layout

```text
.cursor/mcp.json              Cursor Playwright MCP server
mcp/playwright.config.json    Browser, timeouts, and test id for MCP
env/                          dev and staging variables
src/pages                     Page objects
src/components                Shared widgets
src/fixtures/test.fixture.ts  The test object specs import
src/api                       API clients and response schemas
src/utils                     Allure, logging, failure attachments
tests/setup                   One-time setup, such as saved auth state
tests/guest                   Logged-out UI tests
tests/e2e                     Logged-in UI tests
tests/api                     API tests
test-data                     Data-driven cases
```

## How a test is wired

Specs import `test` and `expect` from `src/fixtures/test.fixture.ts`, not from `@playwright/test`. Register each page object as a fixture so specs receive it by name. `apiContext` is a request client pointed at `API_BASE_URL`.

`getByTestId` uses the `data-testid` attribute. Change `testIdAttribute` in `playwright.config.ts` and `mcp/playwright.config.json` if the site uses a different attribute.

## Add a page and a test

1. Create a class in `src/pages` that extends `BasePage`. Keep locators on the class and actions in methods. Wrap user-visible actions with `step()` so they show up in Allure.
2. Add a fixture in `src/fixtures/test.fixture.ts`.
3. Add a spec under `tests/guest`, `tests/e2e`, or `tests/api` and tag it.

```ts
import { test } from '../../src/fixtures/test.fixture';
import { meta } from '../../src/utils/allure';

test('example', { tag: ['@regression'] }, async ({ page }) => {
  await meta({
    epic: 'Web',
    feature: 'Home',
    story: 'Example',
    severity: 'normal',
  });
  await page.goto('/');
});
```

When a flow needs a saved login, add `tests/setup/auth.setup.ts`, write storage state to `playwright/.auth/`, and point the `e2e` project at that file with `storageState`.

## Playwright MCP

`.cursor/mcp.json` registers `@playwright/mcp` for this project. Enable it in Cursor Settings → MCP, then reload the window. The server uses `data-testid` as the test id attribute and generates TypeScript.

For a shared or headed session, run `npm run mcp:http` and point the client at `http://localhost:8931/mcp`.

## CI

`.github/workflows/playwright.yml` installs Chromium, runs the suite against `TEST_ENV=staging`, and uploads the Playwright report, JUnit, Allure results, and the generated Allure HTML report.

Run a cross-browser pass locally or in a scheduled workflow:

```bash
BROWSERS=chromium,firefox,webkit npm test
```
