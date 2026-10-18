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
    await dashboardDetailsPage.click('Login');
    await dashboardDetailsPage.fill('Email', 'shubhamjn71@gmail.com');
    await dashboardDetailsPage.fill('Password', 'GoliveQA@123');
    await dashboardDetailsPage.click('Login submit');
    await expect(dashboardDetailsPage.text('Analytics')).toBeVisible();
    await expect(dashboardDetailsPage.text('Product Context')).toBeVisible();
  });

});
