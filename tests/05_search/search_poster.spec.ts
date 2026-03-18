import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('search poster and purchase third result', async ({ page }) => {
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const checkout = new CheckoutPage(page);

  await home.gotoStore();
  await home.search('poster');

  await product.chooseThirdFromSearch();
  await product.addToCartFromProduct();

  await checkout.openCart();
  await checkout.proceedCheckout();
  await checkout.completeAddressStep();
  await checkout.completeShippingStep();
  await checkout.completePaymentStep();

  await expect(checkout.frame.locator('text=/Order confirmation|Thank you|Your order/i')).toBeVisible({ timeout: 30000 });
});
