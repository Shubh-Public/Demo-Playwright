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
    this.emailInput = page.getByRole('textbox', { name: 'Business Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
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
      await this.loginControl.click();
    });
  }

  async enterEmail(value: string): Promise<void> {
    await step('Enter Email', async () => {
      await this.emailInput.click();
      await this.emailInput.press('ControlOrMeta+A');
      await this.emailInput.pressSequentially(value);
    });
  }

  async enterPassword(value: string): Promise<void> {
    await step('Enter Password', async () => {
      await this.passwordInput.click();
      await this.passwordInput.press('ControlOrMeta+A');
      await this.passwordInput.pressSequentially(value);
    });
  }

  async clickSubmit(): Promise<void> {
    await step('Click Submit', async () => {
      await this.submitControl.click();
    });
  }

  analytics(): Locator {
    return this.analyticsTarget;
  }

  productContext(): Locator {
    return this.productContextTarget;
  }

}
