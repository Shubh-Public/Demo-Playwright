import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/allure';
import { BasePage } from './base.page';

export class DashboardDetailsPage extends BasePage {
  private readonly loginControl: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitControl: Locator;
  private readonly analyticsTarget: Locator;
  private readonly productContextTarget: Locator;

  constructor(page: Page) {
    super(page);
    this.loginControl = page.getByRole('link', { name: 'Login' });
    this.emailInput = page.locator('form').filter({ has: page.getByRole('button', { name: 'Submit', exact: true }) }).getByRole('textbox', { name: 'Business Email', exact: true });
    this.passwordInput = page.locator('form').filter({ has: page.getByRole('button', { name: 'Submit', exact: true }) }).getByRole('textbox', { name: 'Password', exact: true });
    this.submitControl = page.getByRole('button', { name: 'Submit' });
    this.analyticsTarget = page.getByRole('heading', { name: 'Analytics' });
    this.productContextTarget = page.getByRole('link', { name: 'Product context' });

  }

  async open(path = '/'): Promise<void> {
    await step('Open page', async () => {
      await this.goto(path);
    });
  }

  async clickLogin(): Promise<void> {
    await step('Click Login', async () => {
      const previous = this.page.url();
      await this.loginControl.click();
      await this.page.waitForURL((url) => url.href !== previous, { timeout: 4000 }).catch(() => undefined);
    });
  }

  async enterEmail(value: string): Promise<void> {
    await step('Enter Email', async () => {
      await this.formReady('Submit');
      await this.emailInput.fill(value);
    });
  }

  async enterPassword(value: string): Promise<void> {
    await step('Enter Password', async () => {
      await this.formReady('Submit');
      await this.passwordInput.fill(value);
    });
  }

  async clickSubmit(): Promise<void> {
    await step('Click Submit', async () => {
      await this.formReady('Submit');
      await this.submitControl.click();
    });
  }

  analytics(): Locator {
    return this.analyticsTarget;
  }

  productContext(): Locator {
    return this.productContextTarget;
  }

  private async formReady(name: string): Promise<void> {
    await this.page.waitForFunction((label: string) => {
      if (document.readyState !== 'complete') return false;
      const wanted = label.trim().toLowerCase();
      const form = Array.from(document.querySelectorAll('form')).find((item) =>
        Array.from(item.querySelectorAll('button, input[type=submit]')).some(
          (control) => (control.textContent || control.getAttribute('value') || '').replace(/\s+/g, ' ').trim().toLowerCase() === wanted,
        ),
      );
      if (!form) return false;
      if (Object.keys(form).some((key) => key.startsWith('__reactProps$'))) return true;
      const react =
        Boolean(document.getElementById('__NEXT_DATA__') || document.getElementById('__next')) ||
        '__next_f' in window ||
        Array.from(document.scripts).some((script) => /\/_next\/|react/i.test(script.src));
      return !react;
    }, name, { timeout: 30000 }).catch(() => undefined);
  }

}
