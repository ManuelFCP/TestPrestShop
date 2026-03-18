import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { AuthPage } from '../pages/AuthPage';

test('login flow: create account and sign in', async ({ page }) => {
  const auth = new AuthPage(page);
  await auth.gotoStore();

  const email = faker.internet.email();
  const password = `Aa1!${faker.internet.password({ length: 12, memorable: false })}`;

  await auth.registerNewAccount(email, password);
  await expect(page.locator('.user-info a.account, a:has-text("My account")')).toBeVisible({ timeout: 30000 });

  await auth.login(email, password);
  await expect(page.locator('.user-info a.account, a:has-text("My account")')).toBeVisible({ timeout: 30000 });
});
