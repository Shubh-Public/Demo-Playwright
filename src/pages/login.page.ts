import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/allure';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(path = '/'): Promise<void> {
    await step('Open page', async () => {
      await this.goto(path);
    });
  }

  async click(name: string): Promise<void> {
    await step('Click', async () => {
      await this.page.getByRole('button', { name }).click();
    });
  }

  async fill(field: string, value: string): Promise<void> {
    await step('Fill field', async () => {
      await this.page.getByLabel(field).fill(value);
    });
  }

  text(value: string): Locator {
    return this.page.getByText(value, { exact: false });
  }

}
