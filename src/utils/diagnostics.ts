import type { Page, TestInfo } from '@playwright/test';
import { logger } from './logger';

export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  return errors;
}

export async function attachFailureDiagnostics(
  page: Page,
  testInfo: TestInfo,
  errors: string[],
): Promise<void> {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  await testInfo.attach('page-url', { body: page.url(), contentType: 'text/plain' });

  try {
    await testInfo.attach('dom', { body: await page.content(), contentType: 'text/html' });
  } catch (error) {
    logger.error(`DOM capture failed: ${String(error)}`);
  }

  if (errors.length > 0) {
    await testInfo.attach('browser-errors', {
      body: errors.join('\n'),
      contentType: 'text/plain',
    });
  }
}
