import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login';
import logger from '../src/utils/logger';
import { testData } from '../src/utils/testData';

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
    const username = testData.validUser.username;
    const password = testData.validUser.password;

    logger.info('Starting regression test: user can login with valid credentials');

    if (!username || !password) {
      logger.error('Missing SauceDemo credentials in environment variables.');
      throw new Error('Missing SauceDemo credentials in environment variables.');
    }

    logger.info(`Using credentials: username=${username}, password=***provided***`);

    await loginPage.navigateTo('/');
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    logger.info('Regression test completed: user can login with valid credentials');
  });

  test('@regression: invalid credentials show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const invalidUsername = testData.invalidUser.username;
    const invalidPassword = testData.invalidUser.password;

    logger.info('Starting regression test: invalid credentials show an error');

    await loginPage.navigateTo('/');
    await loginPage.login(invalidUsername, invalidPassword);

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(/Username and password do not match/i);
    logger.info('Regression test completed: invalid credentials show an error');
  });
});
