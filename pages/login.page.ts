import { expect, type Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(url: string) {
    await this.page.goto(url);
  }

  async click(name: string) {
    await this.page.getByText(name, { exact: false }).click();
  }

  async fill(field: string, value: string) {
    await this.page.getByLabel(field).fill(value);
  }

  async expectText(text: string) {
    await expect(this.page.getByText(text, { exact: false })).toBeVisible();
  }

}
