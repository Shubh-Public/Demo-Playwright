---
name: write-playwright-tests
description: >-
  Writes Playwright specs, page objects, fixtures, components, and API clients
  for this repository's Page Object Model framework, including Allure meta and
  tags. Use when the user asks to automate a website, write or generate test
  cases, one-click automation, add a spec, implement a page object, or extend
  the Playwright suite.
---

# Write Playwright tests

This framework has no sample tests. Copy the structure below. Do not invent a second style, and do not import `test` from `@playwright/test` inside a spec.

## Workflow

1. Read `env/.env.dev`. If `BASE_URL` or `API_BASE_URL` is still `https://example.com`, set them to the site the user named before writing tests. Do not pick a site the user did not name.
2. Open the live site and record real roles, labels, and `data-testid` values. Write locators from that page, not from memory.
3. Add files in this order: page or component, fixture registration, optional `test-data` JSON, then the spec.
4. Use the templates in [examples.md](examples.md).
5. Run the new spec file. If a locator fails, fix it from the page snapshot. Do not delete the assertion to make it pass.

## Placement

| Kind | Path | Playwright project |
| --- | --- | --- |
| Logged-out UI | `tests/guest/<feature>.spec.ts` | `guest-*` |
| Logged-in UI | `tests/e2e/<feature>.spec.ts` | `e2e-*` |
| HTTP API | `tests/api/<feature>.spec.ts` | `api` |
| Page | `src/pages/<name>.page.ts` | — |
| Shared widget | `src/components/<name>.component.ts` | — |
| API client | `src/api/<name>.client.ts` | — |
| Zod schema | `src/api/schemas/<name>.schema.ts` | — |
| Data file | `test-data/<name>.json` | — |
| Auth setup | `tests/setup/auth.setup.ts` | add a `setup` project only when login state is required |

`guest` and `e2e` only match `*.spec.ts` in those folders. `api` only matches `tests/api/**/*.spec.ts`. A spec outside these folders does not run.

## Required in every test

- Import `{ test, expect }` from `src/fixtures/test.fixture.ts` using a relative path.
- First statement in the test body: `await meta({ epic, feature, story, severity })`.
- `severity` is `blocker`, `critical`, `normal`, `minor`, or `trivial`. Default owner is `qa-team`.
- Tag the test: `@smoke` for the critical path, `@regression` for the rest, `@a11y` for axe checks, `@quarantine` only for a known broken case. CI greps out `@quarantine`.
- Assertions stay in the spec. Page methods act and return state.
- Navigate with `goto('/path')` or `page.goto('/path')`. Config `baseURL` is `env.baseUrl`.
- Locator order: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId` (`data-testid`), then `getByText`. Use CSS only when no accessible locator exists.
- No `waitForTimeout`, no `test.only`, no hardcoded credentials, no absolute site URL in a spec.

## Fixtures already provided

`test` in `src/fixtures/test.fixture.ts` already supplies:

- `page` with action and navigation timeouts, plus failure attachments (URL, DOM, browser errors)
- `apiContext` pointed at `env.apiBaseUrl` with `Accept: application/json`
- an auto `testLog` that labels Allure with the environment and project name

Add a new fixture when a spec needs a page or API client. Extend the `Fixtures` type and `base.extend`.

## Page objects

- Extend `BasePage`. Call `this.goto(path)` from action methods.
- Locators are private fields. Public methods are the actions a user takes.
- Wrap each public action in `step()` from `src/utils/allure.ts`.
- A widget used by two pages goes in `src/components` and is created by those pages.
- Register the page fixture in the same change as the spec that uses it.

## API

- HTTP calls belong in a client that takes `APIRequestContext`.
- Parse JSON with Zod in `src/api/schemas` before asserting a field.
- Assert the status code in the spec. Include one success and one error case per endpoint.
- Load repeated inputs from `test-data/*.json` with `readJson` from `src/utils/json.ts`, and record each input with `parameter()`.

## Logged-in UI

Add `tests/setup/auth.setup.ts` only after a real login exists. Save storage state under `playwright/.auth/`, gitignore the JSON, and set `storageState` plus `dependencies: ['setup']` on the `e2e` projects in `playwright.config.ts`. Guest specs stay logged out.

## Formatting

Prettier: single quotes, semicolons, trailing commas, print width 100. TypeScript `noUnusedLocals` is on. An empty Playwright fixture pattern needs `eslint-disable-next-line no-empty-pattern` on the line above it.
