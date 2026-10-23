import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login';
import logger from '../src/utils/logger';

test.describe('Login page', () => {
  test('@smoke: login page loads successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    logger.info('Starting smoke test: login page loads successfully');

    await loginPage.navigateTo('/');
    await expect(page).toHaveURL(/saucedemo/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    logger.info('Smoke test completed: login page loads successfully');
  });

  test('@regression: user can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const username = process.env.SAUCEDEMO_USERNAME || process.env.USERNAME || 'standard_user';
    const password = process.env.SAUCEDEMO_PASSWORD || process.env.PASSWORD || 'secret_sauce';

    logger.info('Starting regression test: user can login with valid credentials');
    logger.info(`Using credentials: username=${username}, password=${password ? '***provided***' : 'missing'}`);

    if (!username || !password) {
      logger.error('Missing SauceDemo credentials in environment variables.');
      throw new Error('Missing SauceDemo credentials in environment variables.');
    }

    await loginPage.navigateTo('/');
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    logger.info('Regression test completed: user can login with valid credentials');
  });

  test('@regression: invalid credentials show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    logger.info('Starting regression test: invalid credentials show an error');

    await loginPage.navigateTo('/');
    await loginPage.login('locked_out_user', 'wrong_password');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(/Username and password do not match/i);
    logger.info('Regression test completed: invalid credentials show an error');
  });
});
