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
    this.businessMailInput = page.getByRole('textbox', { name: 'Business Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitControl = page.getByRole('button', { name: 'Submit' });
    this.invalidEmailIdOrPasswordTarget = page.getByText('Invalid Email ID or Password', { exact: false });

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

  async enterBusinessMail(value: string): Promise<void> {
    await step('Enter Business mail', async () => {
      await this.businessMailInput.click();
      await this.businessMailInput.press('ControlOrMeta+A');
      await this.businessMailInput.pressSequentially(value);
    });
  }

  async enterPassword(value: string): Promise<void> {
    await step('Enter password', async () => {
      await this.passwordInput.click();
      await this.passwordInput.press('ControlOrMeta+A');
      await this.passwordInput.pressSequentially(value);
    });
  }

  async clickSubmit(): Promise<void> {
    await step('Click submit', async () => {
      await this.submitControl.click();
    });
  }

  invalidEmailIdOrPassword(): Locator {
    return this.invalidEmailIdOrPasswordTarget;
  }

}
