import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openCart() {
    await this.frame.getByRole('button', { name: /Cart|Basket|My cart/i }).first().click();
    await this.page.waitForTimeout(1000);
    await this.frame.locator('text=/cart|checkout/i').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async setQuantity(productIndex: number, quantity: number) {
    const rows = this.frame.locator('.cart-item,.cart-line-item, .product-line');
    if ((await rows.count()) <= productIndex) {
      return;
    }
    const row = rows.nth(productIndex);
    const qtyInput = row.locator('input[type="number"], input.quantity');
    if (await qtyInput.count()) {
      await qtyInput.fill(String(quantity));
      await qtyInput.press('Enter');
    } else {
      const plus = row.getByRole('button', { name: /Increase|Plus|\+/i });
      while (quantity-- > 1) await plus.click().catch(() => {});
    }
  }

  async checkout() {
    await this.frame.getByRole('button', { name: /Checkout|Proceed to checkout|Continue to checkout/i }).first().click();
    await this.page.waitForLoadState('networkidle');
    await this.frame.locator('body').waitFor({ state: 'visible', timeout: 15000 });
  }
}
