import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async search(term: string) {
    const searchBox = this.frame.locator('input[placeholder="Search our catalog"], input[placeholder*=Search], input[aria-label*=Search]').first();
    await searchBox.waitFor({ state: 'visible', timeout: 20000 });
    await searchBox.fill(term);
    await searchBox.press('Enter');
    await this.frame.locator('text=/Search results|Showing|Products/i').first().waitFor({ state: 'visible', timeout: 20000 });
  }

  async changeLanguage(language: string) {
    const langBtn = this.frame.getByRole('button', { name: /Language dropdown|English|Français|Español/i }).first();
    if (await langBtn.count()) {
      await langBtn.click();
    }
    const option = this.frame.getByRole('link', { name: new RegExp(language, 'i') }).first();
    if (await option.count()) {
      await option.click();
    } else {
      await this.frame.locator(`text=/${language}/i`).first().click().catch(() => {});
    }
    await this.frame.locator('#_desktop_logo, #_desktop_user_info').first().waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoClothesWomen() {
    await this.frame.getByRole('link', { name: /Clothes/i }).first().click();
    await this.frame.locator('h1').first().waitFor({ state: 'visible', timeout: 15000 });
    const women = this.frame.getByRole('link', { name: /Women/i }).first();
    if (await women.count()) {
      await women.click();
    }
    await this.frame.locator('h1').first().waitFor({ state: 'visible', timeout: 15000 });
  }
}
