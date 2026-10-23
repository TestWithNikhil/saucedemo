import { Page } from '@playwright/test';
import logger from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) {
  }

  async navigateTo(url: string): Promise<void> {
    logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
    logger.info(`Navigation completed: ${url}`);
  }

}   
