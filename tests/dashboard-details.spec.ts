import { test } from "@playwright/test";
import { DashboardDetailsPage } from "../pages/dashboard-details.page";

test("Dashboard Details", async ({ page }) => {
  const dashboardDetailsPage = new DashboardDetailsPage(page);

  await test.step("TC_04 Verify tabs on the dashboards", async () => {
    await dashboardDetailsPage.open("https://stage.goliveqa.com/");
    // Login with 'shubhamjn71@gmail.com' and password 'GoliveQA@123'
    await dashboardDetailsPage.expectText("the tabs Analytics and Product Context is available");
  });
});
