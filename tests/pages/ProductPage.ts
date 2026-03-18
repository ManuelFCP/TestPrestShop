import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async addProductByIndex(index: number, quantity = 1) {
    const products = this.frame.locator('.product-miniature');
    await expect(products).toHaveCount({ min: index + 1 }, { timeout: 30000 });

    const targetProduct = products.nth(index);
    await targetProduct.scrollIntoViewIfNeeded();
    await targetProduct.locator('img').first().click();

    const addBtn = this.frame.locator('button[data-button-action="add-to-cart"]');
    await addBtn.waitFor({ state: 'visible', timeout: 30000 });
    await addBtn.click({ force: true });
    return true;
  }

  async chooseThirdFromSearch() {
    const cards = this.frame.locator('article, .product-miniature, .product-item');
    await cards.nth(2).waitFor({ state: 'visible', timeout: 20000 });
    await cards.nth(2).click();
    await this.frame.locator('text=/Add to cart|Add to basket|Buy now/i').first().waitFor({ state: 'visible', timeout: 20000 });
  }

  async addToCartFromProduct() {
    await this.frame.getByRole('button', { name: /Add to cart|Buy now|Add to basket/i }).first().click();
    await this.frame.locator('text=/Continue shopping|Proceed to checkout/i').first().waitFor({ state: 'visible', timeout: 20000 });
  }
}
