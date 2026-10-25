import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/allure';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly loginControl: Locator;
  private readonly businessMailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitControl: Locator;
  private readonly invalidEmailIdOrPasswordTarget: Locator;
  private readonly invalidEmailAddressTarget: Locator;

  constructor(page: Page) {
    super(page);
    this.loginControl = page.getByRole('link', { name: 'Login' });
    this.businessMailInput = page.locator('form').filter({ has: page.getByRole('button', { name: 'Submit', exact: true }) }).getByRole('textbox', { name: 'Business Email', exact: true });
    this.passwordInput = page.locator('form').filter({ has: page.getByRole('button', { name: 'Submit', exact: true }) }).getByRole('textbox', { name: 'Password', exact: true });
    this.submitControl = page.getByRole('button', { name: 'Submit' });
    this.invalidEmailIdOrPasswordTarget = page.getByText('Invalid Email ID or Password');
    this.invalidEmailAddressTarget = page.getByText('Invalid email address');

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

  async enterBusinessMail(value: string): Promise<void> {
    await step('Enter Business mail', async () => {
      await this.formReady('Submit');
      await this.businessMailInput.fill(value);
    });
  }

  async enterPassword(value: string): Promise<void> {
    await step('Enter password', async () => {
      await this.formReady('Submit');
      await this.passwordInput.fill(value);
    });
  }

  async clickSubmit(): Promise<void> {
    await step('Click submit', async () => {
      await this.formReady('Submit');
      await this.submitControl.click();
    });
  }

  invalidEmailIdOrPassword(): Locator {
    return this.invalidEmailIdOrPasswordTarget;
  }

  invalidEmailAddress(): Locator {
    return this.invalidEmailAddressTarget;
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
