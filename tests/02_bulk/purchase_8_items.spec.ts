import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('bulk purchase 8 items with two products', async ({ page }) => {
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const checkout = new CheckoutPage(page);

  await home.gotoStore();
  await home.search('dress');

  await product.addProductByIndex(0, 5);
  await product.addProductByIndex(1, 3);

  await checkout.openCart();
  await checkout.proceedCheckout();
  await checkout.completeAddressStep();
  await checkout.completeShippingStep();
  await checkout.completePaymentStep();

  await expect(checkout.frame.locator('text=/Order confirmation|Thank you|Your order/i')).toBeVisible({ timeout: 30000 });
});
