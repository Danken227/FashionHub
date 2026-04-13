import { test } from "@playwright/test";
import { LoginPage } from "../src/pages/loginPage";
import { validUser } from "../src/test-data/users";

test.describe("Login", () => {
  test("valid user can log in and see personalized welcome message", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginWith(validUser.username, validUser.password);
    await loginPage.expectWelcomeMessage(validUser.username);
  });
});
