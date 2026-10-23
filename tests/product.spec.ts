import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login';
import { ProductPage } from '../src/pages/product';
import logger from '../src/utils/logger';

test.describe('Product page', () => {
  test('should list all products and add highest and lowest price items to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    const username = process.env.SAUCEDEMO_USERNAME || process.env.USERNAME || 'standard_user';
    const password = process.env.SAUCEDEMO_PASSWORD || process.env.PASSWORD || 'secret_sauce';

    logger.info('Starting product flow test');
    await loginPage.navigateTo('/');
    await loginPage.login(username, password);

    const products = await productPage.getAllProducts();
    logger.info(`Product list: ${JSON.stringify(products.map((p) => ({ title: p.title, price: p.priceText })))}`);

    expect(products.length).toBeGreaterThan(0);

    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    const lowestProduct = sortedProducts[0];
    const highestProduct = sortedProducts[sortedProducts.length - 1];

    logger.info(`Lowest priced product: ${lowestProduct.title} - ${lowestProduct.priceText}`);
    logger.info(`Highest priced product: ${highestProduct.title} - ${highestProduct.priceText}`);

    expect(lowestProduct).toBeDefined();
    expect(highestProduct).toBeDefined();

    await productPage.addHighestAndLowestPriceProductsToCart();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

    logger.info('Product flow test completed successfully');
  });
});
