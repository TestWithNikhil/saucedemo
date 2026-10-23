import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/basePage';
import logger from '../utils/logger';

export type ProductInfo = {
  title: string;
  price: number;
  priceText: string;
  addToCartButton: Locator;
};

export class ProductPage extends BasePage {
  readonly productItems: Locator;
  readonly productTitle: Locator;
  readonly productDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = this.page.locator('[data-test="inventory-item"]');
    this.productTitle = this.page.locator('[data-test="product-title"]');
    this.productDescription = this.page.locator('[data-test="product-description"]');
  }

  async waitForProducts(): Promise<void> {
    await this.productItems.first().waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Inventory products are visible');
  }

  async getAllProducts(): Promise<ProductInfo[]> {
    await this.waitForProducts();
    const items = await this.productItems.all();
    const products: ProductInfo[] = [];

    for (const item of items) {
      const title = (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() ?? '';
      const priceText = (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() ?? '';
      const price = Number(priceText.replace(/[^0-9.]/g, '')) || 0;

      products.push({
        title,
        price,
        priceText,
        addToCartButton: item.getByRole('button', { name: /add to cart/i }),
      });
    }

    logger.info(`Found ${products.length} products on the inventory page.`);
    return products;
  }

  async getHighestPriceProduct(): Promise<ProductInfo> {
    const products = await this.getAllProducts();
    const highest = products.reduce((max, current) => (current.price > max.price ? current : max), products[0]);
    logger.info(`Highest priced product: ${highest.title} at ${highest.priceText}`);
    return highest;
  }

  async getLowestPriceProduct(): Promise<ProductInfo> {
    const products = await this.getAllProducts();
    const lowest = products.reduce((min, current) => (current.price < min.price ? current : min), products[0]);
    logger.info(`Lowest priced product: ${lowest.title} at ${lowest.priceText}`);
    return lowest;
  }

  async addHighestPriceProductToCart(): Promise<ProductInfo> {
    const product = await this.getHighestPriceProduct();
    await product.addToCartButton.click();
    logger.info(`Added highest price product to cart: ${product.title}`);
    return product;
  }

  async addLowestPriceProductToCart(): Promise<ProductInfo> {
    const product = await this.getLowestPriceProduct();
    await product.addToCartButton.click();
    logger.info(`Added lowest price product to cart: ${product.title}`);
    return product;
  }

  async addHighestAndLowestPriceProductsToCart(): Promise<{ highest: ProductInfo; lowest: ProductInfo }> {
    const highest = await this.getHighestPriceProduct();
    const lowest = await this.getLowestPriceProduct();

    await highest.addToCartButton.click();
    await lowest.addToCartButton.click();

    logger.info(`Added both highest and lowest price products to cart: ${highest.title} and ${lowest.title}`);
    return { highest, lowest };
  }
}