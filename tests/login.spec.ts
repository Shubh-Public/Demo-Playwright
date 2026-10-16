import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test("Login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step("TC_01 Verify user able to login", async () => {
    await loginPage.open("https://stage.goliveqa.com/");
    await loginPage.click("Login");
    await loginPage.fill("Business mail", "shubhamjn71@gmail.com");
    await loginPage.fill("password", "jhvjdsck");
    await loginPage.expectText("Invalid Email ID or Password on same page");
  });

  await test.step("TC_02 Verify user able to login", async () => {
    await loginPage.open("https://stage.goliveqa.com/");
    await loginPage.click("Login");
    await loginPage.fill("Business mail", "sdvsfdw");
    await loginPage.fill("password", "jhvjdsck");
    await loginPage.expectText("Invalid Email ID or Password on same page");
  });

  await test.step("TC_03 Verify user able to login", async () => {
    await loginPage.open("https://stage.goliveqa.com/");
    await loginPage.click("Login");
    await loginPage.fill("Business mail", "shubhamjn71@gmail.com");
    await loginPage.fill("password", "GoliveQA@123");
    await loginPage.expectText("user able to login and url is https://stage.goliveqa.com/dashboard");
  });
});
