import { Status } from 'allure-js-commons';
import { defineConfig, devices, type Project } from '@playwright/test';
import os from 'node:os';
import { env } from './src/config/env';

const supportedBrowsers = ['chromium', 'firefox', 'webkit', 'mobile-chrome'] as const;
type BrowserName = (typeof supportedBrowsers)[number];

function selectedBrowsers(): BrowserName[] {
  const names = (process.env.BROWSERS ?? 'chromium')
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const unsupported = names.filter((name) => !supportedBrowsers.includes(name as BrowserName));
  if (unsupported.length > 0) {
    throw new Error(
      `Unsupported BROWSERS value: ${unsupported.join(', ')}. Use ${supportedBrowsers.join(', ')}.`,
    );
  }

  return names as BrowserName[];
}

function browserUse(name: BrowserName) {
  switch (name) {
    case 'chromium':
      return devices['Desktop Chrome'];
    case 'firefox':
      return devices['Desktop Firefox'];
    case 'webkit':
      return devices['Desktop Safari'];
    case 'mobile-chrome':
      return devices['Pixel 7'];
  }
}

function uiProjects(kind: 'guest' | 'e2e'): Project[] {
  return selectedBrowsers().map((browser) => ({
    name: `${kind}-${browser}`,
    testMatch: new RegExp(`${kind}/.*\\.spec\\.ts`),
    use: {
      ...browserUse(browser),
    },
  }));
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: env.timeouts.expect,
  },
  grepInvert: process.env.CI ? /@quarantine/ : undefined,
  outputDir: 'test-results',
  reportSlowTests: { max: 5, threshold: 20_000 },
  metadata: {
    environment: env.name,
    baseUrl: env.baseUrl,
  },
  use: {
    baseURL: env.baseUrl,
    headless: process.env.HEADLESS !== 'false',
    actionTimeout: env.timeouts.action,
    navigationTimeout: env.timeouts.navigation,
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    locale: env.locale,
    timezoneId: env.timezone,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          environment: env.name,
          base_url: env.baseUrl,
          api_base_url: env.apiBaseUrl,
          os: `${os.platform()} ${os.release()}`,
          node: process.version,
        },
        categories: [
          {
            name: 'Timeouts',
            messageRegex: '.*Timeout.*',
            matchedStatuses: [Status.FAILED, Status.BROKEN],
          },
          {
            name: 'Assertion failures',
            messageRegex: '.*[Ee]xpect.*',
            matchedStatuses: [Status.FAILED],
          },
          {
            name: 'Skipped',
            matchedStatuses: [Status.SKIPPED],
          },
        ],
      },
    ],
  ],
  projects: [
    ...uiProjects('guest'),
    ...uiProjects('e2e'),
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
    },
  ],
});
