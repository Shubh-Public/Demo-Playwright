import { test as base, expect, type APIRequestContext } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { env } from '../config/env';
import { attachFailureDiagnostics, collectPageErrors } from '../utils/diagnostics';
import { logger } from '../utils/logger';
import { LoginPage } from '../pages/login.page';
import { DashboardDetailsPage } from '../pages/dashboard-details.page';

type Fixtures = {
  apiContext: APIRequestContext;
  testLog: void;
  loginPage: LoginPage;
  dashboardDetailsPage: DashboardDetailsPage;
};

export const test = base.extend<Fixtures>({
  testLog: [
    // Playwright auto fixtures that do not need a browser must use an empty pattern.
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      logger.info(`START ${testInfo.titlePath.join(' > ')}`);
      await allure.label('environment', env.name);
      await allure.label('browser', testInfo.project.name);
      await use();
      logger.info(`END ${testInfo.title} [${testInfo.status}]`);
    },
    { auto: true },
  ],

  page: async ({ page }, use, testInfo) => {
    page.setDefaultTimeout(env.timeouts.action);
    page.setDefaultNavigationTimeout(env.timeouts.navigation);
    const errors = collectPageErrors(page);
    await use(page);
    await attachFailureDiagnostics(page, testInfo, errors);
  },

  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.apiBaseUrl,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    await use(context);
    await context.dispose();
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardDetailsPage: async ({ page }, use) => {
    await use(new DashboardDetailsPage(page));
  },

});

export { expect };
