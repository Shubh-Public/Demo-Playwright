import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/allure';
import { BasePage } from './base.page';

export class DashboardDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(path = '/'): Promise<void> {
    await step('Open page', async () => {
      await this.goto(path);
    });
  }

  text(value: string): Locator {
    const known: Record<string, Locator> = {

    };
    return known[value] ?? this.page.getByText(value, { exact: false });
  }

}
