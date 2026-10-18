import { expect, test } from '../../src/fixtures/test.fixture';
import { meta } from '../../src/utils/allure';

test.describe('Dashboard Details', () => {
  test('TC_04 Verify user able to see the left tabs', { tag: ['@regression'] }, async ({ dashboardDetailsPage }) => {
    await meta({
      epic: 'Web',
      feature: 'Dashboard Details',
      story: 'Verify user able to see the left tabs',
      severity: 'normal',
    });

    await dashboardDetailsPage.open('/');
    await dashboardDetailsPage.clickLogin();
    await dashboardDetailsPage.enterEmail('shubhamjn71@gmail.com');
    await dashboardDetailsPage.enterPassword('GoliveQA@123');
    await dashboardDetailsPage.clickLoginSubmit();
    await expect(dashboardDetailsPage.analytics()).toBeVisible();
    await expect(dashboardDetailsPage.productContext()).toBeVisible();
  });

});
