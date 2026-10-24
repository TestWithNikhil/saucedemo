import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/basePage';
import logger from '../utils/logger';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = this.page.locator('.cart_item');
    this.checkoutButton = this.page.getByRole('button', { name: /checkout/i });
    this.cartBadge = this.page.locator('.shopping_cart_badge');
  }

  async openCart(): Promise<void> {
    logger.info('Opening cart');
    await this.page.locator('.shopping_cart_link').click();
  }

  async goToCheckout(): Promise<void> {
    logger.info('Proceeding to checkout');
    await this.checkoutButton.click();
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }
}
