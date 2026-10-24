import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/basePage';
import logger from '../utils/logger';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly totalLabel: Locator;
  readonly totalPrice: Locator;
  readonly summaryTotal: Locator;
  readonly confirmationTitle: Locator;
  readonly downloadPdfButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = this.page.locator('[data-test="firstName"]');
    this.lastNameInput = this.page.locator('[data-test="lastName"]');
    this.postalCodeInput = this.page.locator('[data-test="postalCode"]');
    this.continueButton = this.page.getByRole('button', { name: /continue/i });
    this.finishButton = this.page.getByRole('button', { name: /finish/i });
    this.paymentInfo = this.page.locator('.summary_value_label').nth(0);
    this.shippingInfo = this.page.locator('.summary_value_label').nth(1);
    this.totalLabel = this.page.locator('.summary_total_label');
    this.totalPrice = this.page.locator('.summary_subtotal_label');
    this.summaryTotal = this.page.locator('.summary_total_label');
    this.confirmationTitle = this.page.locator('.complete-header');
    this.downloadPdfButton = this.page.getByRole('button', { name: /download pdf/i });
  }

  parseCurrencyValue(value: string): number {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parsed = Number.parseFloat(cleanValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    logger.info(`Filling checkout information: ${firstName} ${lastName} ${postalCode}`);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishCheckout(): Promise<void> {
    logger.info('Submitting order');
    await this.finishButton.click();
    await this.confirmationTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getPaymentInfo(): Promise<string> {
    return (await this.paymentInfo.textContent())?.trim() ?? '';
  }

  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfo.textContent())?.trim() ?? '';
  }

  async getItemTotal(): Promise<string> {
    return (await this.totalPrice.textContent())?.trim() ?? '';
  }

  async getTotal(): Promise<string> {
    return (await this.summaryTotal.textContent())?.trim() ?? '';
  }

  async getItemTotalValue(): Promise<number> {
    return this.parseCurrencyValue(await this.getItemTotal());
  }

  async getTotalValue(): Promise<number> {
    return this.parseCurrencyValue(await this.getTotal());
  }

  async validateOrderSummary(): Promise<{ paymentInfo: string; shippingInfo: string; itemTotal: string; total: string }> {
    const paymentInfo = await this.getPaymentInfo();
    const shippingInfo = await this.getShippingInfo();
    const itemTotal = await this.getItemTotal();
    const total = await this.getTotal();

    return { paymentInfo, shippingInfo, itemTotal, total };
  }

  async downloadOrderPdfIfAvailable(): Promise<boolean> {
    const isVisible = await this.downloadPdfButton.isVisible().catch(() => false);

    if (!isVisible) {
      logger.info('PDF download button is not available on this checkout page.');
      return false;
    }

    try {
      const [download] = await Promise.all([
        this.page.waitForEvent('download', { timeout: 15000 }),
        this.downloadPdfButton.click(),
      ]);

      logger.info(`Downloaded PDF order receipt: ${download.suggestedFilename()}`);
      return true;
    } catch (error) {
      logger.warn(`PDF download was requested but did not complete: ${(error as Error).message}`);
      return false;
    }
  }
}
