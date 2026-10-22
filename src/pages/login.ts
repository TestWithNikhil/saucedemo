import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/basePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.locator('[data-test="username"]');
    this.passwordInput = this.page.locator('[data-test="password"]');
    this.loginButton = this.page.locator('[data-test="login-button"]');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithInvalidCredentials(username: string, password: string): Promise<void> {
    await this.login(username, password);
  }

  async loginWithValidCredentials(username: string, password: string): Promise<void> {
    await this.login(username, password);
  }
}