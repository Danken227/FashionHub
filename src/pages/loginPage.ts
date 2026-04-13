import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username')
    this.passwordInput = page.locator('#password')
    this.loginButton = page.getByRole('button').filter({ hasText: 'Login' })
  }

  async goto(): Promise<void> {
    await this.page.goto("login.html", { waitUntil: "domcontentloaded" });
    await expect(this.page.getByRole("heading", { name: /login to fashionhub/i })).toBeVisible();
  }

  async loginWith(username: string, password: string): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectWelcomeMessage(username: string): Promise<void> {
    await expect(this.page.getByText(`Welcome, ${username}`)).toBeVisible();
  }
}
