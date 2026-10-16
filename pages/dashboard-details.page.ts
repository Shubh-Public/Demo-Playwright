import { expect, type Page } from "@playwright/test";

export class DashboardDetailsPage {
  constructor(private readonly page: Page) {}

  async open(url: string) {
    await this.page.goto(url);
  }

  async expectText(text: string) {
    await expect(this.page.getByText(text, { exact: false })).toBeVisible();
  }

}
