import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login';

test.describe('Login page', () => {
  test('@smoke: login page loads successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo('/');
    await expect(page).toHaveURL(/saucedemo/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('@regression: user can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
      throw new Error('Missing USERNAME or PASSWORD in .env file.');
    }

    await loginPage.navigateTo('/');
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('@regression: invalid credentials show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo('/');
    await loginPage.login('locked_out_user', 'wrong_password');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(/Username and password do not match/i);
  });
});
