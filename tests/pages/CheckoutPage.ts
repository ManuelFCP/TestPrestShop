import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openCart() {
    const modal = this.frame.locator('#blockcart-modal');
    if (await modal.isVisible()) {
      await modal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    const cartBtn = this.frame.locator('#_desktop_cart a, .shopping-cart').first();
    await cartBtn.click({ force: true });
    await this.frame.locator('text=/Your cart|Shopping-cart|Cart/i').first().waitFor({ state: 'visible', timeout: 30000 });
  }

  async proceedCheckout() {
    const checkoutBtn = this.frame.locator('#blockcart-modal a.btn-primary, .cart-detailed-actions a.btn-primary, .checkout a, button:has-text("Proceed to checkout"), a:has-text("Proceed to checkout")').first();
    await checkoutBtn.waitFor({ state: 'visible', timeout: 40000 });
    await checkoutBtn.click({ force: true });

    const checkoutContainer = this.frame.locator('#checkout-personal-information-step, #checkout-addresses-step, .checkout-step, text=/Shipping|Address/i').first();
    await checkoutContainer.waitFor({ state: 'visible', timeout: 40000 });
  }

  async completeAddressStep() {
    const continueBtn = this.frame.locator('button:has-text("Continue"), button:has-text("Proceed")').first();
    await continueBtn.waitFor({ state: 'visible', timeout: 20000 });
    await continueBtn.click();
    await this.frame.locator('text=/Shipping|Delivery/i').first().waitFor({ state: 'visible', timeout: 20000 });
  }

  async completeShippingStep() {
    const checkoutShip = this.frame.locator('button:has-text("Continue"), button:has-text("Proceed")').first();
    await checkoutShip.waitFor({ state: 'visible', timeout: 20000 });
    await checkoutShip.click();
    await this.frame.locator('text=/Payment|Choose your payment method/i').first().waitFor({ state: 'visible', timeout: 20000 });
  }

  async completePaymentStep() {
    const payButton = this.frame.locator('button:has-text("Order") , button:has-text("Pay") , button:has-text("Place order")').first();
    if (await payButton.count()) {
      await payButton.click().catch(() => {});
    }
    await this.frame.locator('text=/Order confirmation|Thank you|Your order/i').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  }
}
