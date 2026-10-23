import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/basePage';
import logger from '../utils/logger';

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
    logger.info(`Starting login flow for user "${username}"`);

    logger.info(`Filling username field for user "${username}"`);
    await this.usernameInput.fill(username);

    logger.info(`Filling password field for user "${username}"`);
    await this.passwordInput.fill(password);

    logger.info(`Clicking login button for user "${username}"`);
    await this.loginButton.click();

    logger.info(`Login action submitted for user "${username}"`);
  }

  async loginWithInvalidCredentials(username: string, password: string): Promise<void> {
    logger.info(`Attempting login with invalid credentials for user "${username}"`);
    await this.login(username, password);
  }

  async loginWithValidCredentials(username: string, password: string): Promise<void> {
    logger.info(`Attempting login with valid credentials for user "${username}"`);
    await this.login(username, password);
  }
}
