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
    // Login with 'shubhamjn71@gmail.com' and password 'GoliveQA@123'
    await expect(dashboardDetailsPage.text('tabls visible on left side that Analytics and Product Context')).toBeVisible();
  });

});
