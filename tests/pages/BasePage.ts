import { Page, FrameLocator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly frame: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.frame = page.frameLocator('#framelive');
  }

  async gotoStore() {
    await this.page.goto('https://demo.prestashop.com/#/en/front', { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('#framelive', { state: 'attached', timeout: 20000 });
    await this.page.waitForTimeout(1000);
    const frame = await this.page.frame({ name: 'framelive' });
    if (frame) {
      await frame.waitForSelector('body', { state: 'visible', timeout: 15000 });
    }
  }
}
