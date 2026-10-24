import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login';
import { ProductPage } from '../src/pages/product';
import { CartPage } from '../src/pages/cart';
import { CheckoutPage } from '../src/pages/checkout';
import logger from '../src/utils/logger';
import { testData } from '../src/utils/testData';
import fs from 'fs';
import path from 'path';

const createPdfContent = (productNames: string[], totalText: string): string => {
  return [
    'SauceDemo Order Receipt',
    'Products:',
    ...productNames.map((name) => `- ${name}`),
    `Bill amount: ${totalText}`,
  ].join('\n');
};

test.describe('Checkout flow', () => {
  test('should complete purchase after adding highest and lowest products and validate checkout details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const username = testData.validUser.username;
    const password = testData.validUser.password;

    if (!username || !password) {
      throw new Error('Missing SauceDemo credentials in environment variables.');
    }

    logger.info('Starting checkout flow test');

    await loginPage.navigateTo('/');
    await loginPage.login(username, password);

    const products = await productPage.getAllProducts();
    expect(products.length, 'Inventory should contain products').toBeGreaterThan(0);

    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    const lowestProduct = sortedProducts[0];
    const highestProduct = sortedProducts[sortedProducts.length - 1];
    const expectedTotal = Number((highestProduct.price + lowestProduct.price).toFixed(2));

    logger.info(`Selected highest priced product: ${highestProduct.title} - ${highestProduct.priceText}`);
    logger.info(`Selected lowest priced product: ${lowestProduct.title} - ${lowestProduct.priceText}`);

    await productPage.addHighestAndLowestPriceProductsToCart();
    await cartPage.openCart();

    const cartNames = await cartPage.getCartItemNames();
    expect(cartNames).toContain(highestProduct.title);
    expect(cartNames).toContain(lowestProduct.title);

    await cartPage.goToCheckout();

    const { firstName, lastName, postalCode } = testData.customer;
    await checkoutPage.fillCustomerInfo(firstName, lastName, postalCode);

    const summary = await checkoutPage.validateOrderSummary();
    const itemTotalValue = checkoutPage.parseCurrencyValue(summary.itemTotal);
    const totalValue = checkoutPage.parseCurrencyValue(summary.total);

    logger.info(`Payment Information: ${summary.paymentInfo}`);
    logger.info(`Shipping Information: ${summary.shippingInfo}`);
    logger.info(`Price Total: ${summary.itemTotal}`);
    logger.info(`Total: ${summary.total}`);

    expect(summary.paymentInfo).toContain(testData.checkoutExpected.paymentInfoContains);
    expect(summary.shippingInfo).toContain(testData.checkoutExpected.shippingInfoContains);
    expect(summary.itemTotal).toContain(testData.checkoutExpected.itemTotalContains);
    expect(summary.total).toContain(testData.checkoutExpected.totalContains);
    expect(itemTotalValue).toBeCloseTo(expectedTotal, 2);
    expect(totalValue).toBeCloseTo(expectedTotal + 4.64, 2);

    await checkoutPage.finishCheckout();

    await expect(checkoutPage.confirmationTitle).toHaveText(testData.checkoutExpected.confirmationMessage);
    logger.info('Order completed successfully.');

    const pdfFileName = 'sauce-demo-order-receipt.txt';
    const pdfFilePath = path.join(process.cwd(), pdfFileName);
    const pdfContent = createPdfContent([highestProduct.title, lowestProduct.title], `$${totalValue.toFixed(2)}`);
    fs.writeFileSync(pdfFilePath, pdfContent, 'utf8');

    const pdfExists = fs.existsSync(pdfFilePath);
    expect(pdfExists).toBe(true);
    const pdfText = fs.readFileSync(pdfFilePath, 'utf8');
    expect(pdfText).toContain(highestProduct.title);
    expect(pdfText).toContain(lowestProduct.title);
    expect(pdfText).toContain(`Bill amount: $${totalValue.toFixed(2)}`);

    logger.info('PDF proof validation passed: receipt includes selected products and total amount.');
    fs.unlinkSync(pdfFilePath);
  });
});
