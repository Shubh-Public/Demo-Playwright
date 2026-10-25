import { expect, test } from '../../src/fixtures/test.fixture';
import { meta } from '../../src/utils/allure';

test.describe('Login', () => {
  test('TC_01 Verify user not able to login with correct mail and wrong password', { tag: ['@regression'] }, async ({ loginPage }) => {
    await meta({
      epic: 'Web',
      feature: 'Login',
      story: 'Verify user not able to login with correct mail and wrong password',
      severity: 'normal',
    });

    await loginPage.open('/');
    await loginPage.clickLogin();
    await loginPage.enterBusinessMail('shubhamjn71@gmail.com');
    await loginPage.enterPassword('jhvjdsck');
    await loginPage.clickSubmit();
    await expect(loginPage.invalidEmailIdOrPassword()).toBeVisible();
  });

  test('TC_02 Verify user not able to login with wrong mail and right password', { tag: ['@regression'] }, async ({ loginPage }) => {
    await meta({
      epic: 'Web',
      feature: 'Login',
      story: 'Verify user not able to login with wrong mail and right password',
      severity: 'normal',
    });

    await loginPage.open('/');
    await loginPage.clickLogin();
    await loginPage.enterBusinessMail('sdvsfdw');
    await loginPage.enterPassword('jhvjdsck');
    await loginPage.clickSubmit();
    await expect(loginPage.invalidEmailAddress()).toBeVisible();
  });

  test('TC_03 Verify user able to login with correct mail and password', { tag: ['@regression'] }, async ({ loginPage, page }) => {
    await meta({
      epic: 'Web',
      feature: 'Login',
      story: 'Verify user able to login with correct mail and password',
      severity: 'normal',
    });

    await loginPage.open('/');
    await loginPage.clickLogin();
    await loginPage.enterBusinessMail('shubhamjn71@gmail.com');
    await loginPage.enterPassword('GoliveQA@123');
    await loginPage.clickSubmit();
    await expect(page).toHaveURL(/\/dashboard\/?$/);
  });

});
