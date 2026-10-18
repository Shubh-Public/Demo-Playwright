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
    const known: Record<string, Locator> = {
      'Login': this.page.getByRole('link', { name: 'Login' }),
    };
    await step('Click', async () => {
      await (known[name] ?? this.page.getByRole('button', { name })).click();
    });
  }

  async fill(field: string, value: string): Promise<void> {
    const known: Record<string, Locator> = {
      'Business mail': this.page.getByRole('textbox', { name: 'Business Email' }),
      'password': this.page.getByRole('textbox', { name: 'Password' }),
    };
    await step('Fill field', async () => {
      await (known[field] ?? this.page.getByLabel(field)).fill(value);
    });
  }

  text(value: string): Locator {
    const known: Record<string, Locator> = {
      'Invalid Email ID or Password': this.page.getByRole('textbox', { name: 'Password' }),
    };
    return known[value] ?? this.page.getByText(value, { exact: false });
  }

}
