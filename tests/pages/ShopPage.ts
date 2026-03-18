import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async setLanguage(language: string) {
    const langButton = this.frame.locator('button:has-text("English"), button:has-text("Français"), button:has-text("Español")').first();
    if (await langButton.count()) {
      await langButton.click();
    }
    const langCandidate = this.frame.locator(`text=/.*${language}.*/i`).first();
    if (await langCandidate.count()) {
      await langCandidate.click();
    }
    await this.page.waitForTimeout(1500);
    await this.frame.locator('body').waitFor({ state: 'visible', timeout: 15000 });
  }

  async searchForTerm(term: string) {
    const searchBox = this.frame.getByRole('textbox', { name: /Search/i }).first();
    await searchBox.waitFor({ state: 'visible', timeout: 15000 });
    await searchBox.fill(term);
    await searchBox.press('Enter');
    await this.page.waitForTimeout(1500);
    await this.frame.locator('text=/Search results|Showing|Products|No results/i').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async navigateToWomenClothes() {
    const categoryMenu = this.frame.locator('a:has-text("Clothes"), a:has-text("Women"), button:has-text("Clothes"), button:has-text("Women")').first();
    await categoryMenu.waitFor({ state: 'visible', timeout: 15000 });
    await categoryMenu.click();
    await this.page.waitForTimeout(1500);
    const womenCategory = this.frame.locator('a:has-text("Women"), button:has-text("Women")').first();
    if (await womenCategory.count()) {
      await womenCategory.click();
    }
    await this.frame.locator('h1').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async addProductByIndex(index: number, quantity = 1) {
    const cards = this.frame.locator('article, .product-miniature, .product-item');
    await cards.nth(index).waitFor({ state: 'visible', timeout: 15000 });
    await cards.nth(index).getByRole('button', { name: /Add to cart|Add to basket|Buy now/i }).first().click();
    await this.page.waitForTimeout(1200);
    for (let i = 1; i < quantity; i++) {
      await this.frame.getByRole('button', { name: /Increase quantity|Plus|\+/i }).first().click().catch(() => {});
    }
    await this.frame.getByRole('button', { name: /Continue shopping|Continue/i }).first().click({ timeout: 8000 }).catch(() => {});
  }

  async buyProductAtIndex(index: number, quantity = 1) {
    await this.addProductByIndex(index, quantity);
  }
}
