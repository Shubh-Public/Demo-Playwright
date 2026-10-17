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
      'GoLiveQA': this.page.getByRole('link', { name: 'GoLiveQA' }),
      'About': this.page.getByRole('link', { name: 'About' }),
      'Services': this.page.getByRole('button', { name: 'Services' }),
      'Process': this.page.getByRole('link', { name: 'Process' }),
      'Pricing': this.page.getByRole('link', { name: 'Pricing' }),
      'Contact': this.page.getByRole('link', { name: 'Contact' }),
      'Careers': this.page.getByRole('link', { name: 'Careers' }),
      'Login': this.page.getByRole('link', { name: 'Login' }),
      'Sign up': this.page.getByRole('link', { name: 'Sign up' }),
      'Book a Call': this.page.getByRole('button', { name: 'Book a Call' }),
      'Book a Call →': this.page.getByRole('link', { name: 'Book a Call →' }),
      'Let\'s talk →': this.page.getByRole('link', { name: 'Let\'s talk →' }),
      'Book a 30 min slot': this.page.getByRole('button', { name: 'Book a 30 min slot' }),
    };
    await step('Click', async () => {
      await (known[name] ?? this.page.getByRole('button', { name })).click();
    });
  }

  async fill(field: string, value: string): Promise<void> {
    const known: Record<string, Locator> = {
      'Business email': this.page.getByRole('textbox', { name: 'Business email' }),
    };
    await step('Fill field', async () => {
      await (known[field] ?? this.page.getByLabel(field)).fill(value);
    });
  }

  text(value: string): Locator {
    return this.page.getByText(value, { exact: false });
  }

}
