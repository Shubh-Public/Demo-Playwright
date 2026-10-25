import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/allure';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly loginControl: Locator;
  private readonly businessMailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitControl: Locator;
  private readonly invalidEmailIdOrPasswordTarget: Locator;

  constructor(page: Page) {
    super(page);
    this.loginControl = page.getByRole('link', { name: 'Login' });
    this.businessMailInput = page.locator('form').filter({ has: page.getByRole('button', { name: 'Submit', exact: true }) }).getByRole('textbox', { name: 'Business Email', exact: true });
    this.passwordInput = page.locator('form').filter({ has: page.getByRole('button', { name: 'Submit', exact: true }) }).getByRole('textbox', { name: 'Password', exact: true });
    this.submitControl = page.getByRole('button', { name: 'Submit' });
    this.invalidEmailIdOrPasswordTarget = page.getByText('Invalid Email ID or Password');

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
      await this.page.waitForFunction('(url) => location.href !== url', previous, { timeout: 4000 }).catch(() => undefined);
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

  private async formReady(name: string): Promise<void> {
    await this.page.waitForFunction('(label) => {\n      const wanted = String(label).trim().toLowerCase();\n      const forms = Array.from(document.querySelectorAll("form"));\n      const form = forms.find((item) => Array.from(item.querySelectorAll("button, input[type=submit]")).some((control) => (control.textContent || control.getAttribute("value") || "").replace(/\\s+/g, " ").trim().toLowerCase() === wanted));\n      if (!form) return false;\n      const nextApp = Boolean(document.getElementById("__NEXT_DATA__") || document.getElementById("__next") || Array.from(document.scripts).some((script) => (script.src || "").includes("/_next/")));\n      const key = Object.keys(form).find((item) => item.startsWith("__reactProps$"));\n      if (!key) return !nextApp;\n      const props = form[key];\n      return typeof props?.onSubmit === "function";\n    }', name, { timeout: 8000 }).catch(() => undefined);
  }

}
