import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goToLoginModal() {
    const signInLink = this.frame.locator('.user-info a, [data-link-action="display-login-form"], a:has-text("Sign in")').first();
    await signInLink.waitFor({ state: 'visible', timeout: 30000 });
    await signInLink.click();

    const emailInput = this.frame.locator('input[name="email"], #field-email').first();
    await emailInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async registerNewAccount(email: string, password: string, firstName = 'Test', lastName = 'User') {
    await this.goToLoginModal();
    const context = this.page;
    const createLink = context.getByRole('link', { name: /Create account|Create one here|No account/i }).first();
    if (await createLink.count()) {
      await createLink.click();
      await context.waitForLoadState('domcontentloaded');
    }

    const firstNameInput = context.locator('input[name="firstname"], input[name="firstName"], #field-firstname, [placeholder*="First name"]');
    const lastNameInput = context.locator('input[name="lastname"], input[name="lastName"], #field-lastname, [placeholder*="Last name"]');
    const emailInput = context.locator('input[name="email"], #field-email, [placeholder*="Email"]');
    const passwordInput = context.locator('input[name="password"], #field-password, [placeholder*="Password"], [type="password"]');

    await firstNameInput.first().fill(firstName).catch(() => {});
    await lastNameInput.first().fill(lastName).catch(() => {});
    await emailInput.first().fill(email);
    await passwordInput.first().fill(password);

    await context.locator('input[name="customer_privacy"]').check().catch(() => {});
    await context.locator('input[name="psgdpr"]').check().catch(() => {});

    const submitButton = context.locator('button:has-text("Save"), button:has-text("Register"), button:has-text("Create account"), button:has-text("Sign up")').first();
    await submitButton.click();

    await context.locator('text=/My account|Welcome|Account created|You are logged in|Your account/').first().waitFor({ state: 'visible', timeout: 30000 }).catch(async () => {
      await context.locator('text=/Sign out|Sign in|My profile|Account/').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
    });
  }

  async login(email: string, password: string) {
    await this.goToLoginModal();
    const context = this.frame;

    const emailInput = context.locator('input[name="email"], #field-email').first();
    await emailInput.waitFor({ state: 'visible', timeout: 20000 });
    await emailInput.fill(email);

    const passInput = context.locator('input[name="password"], #field-password').first();
    await passInput.waitFor({ state: 'visible', timeout: 20000 });
    await passInput.fill(password);

    const signInButton = context.locator('#submit-login, [data-link-action="sign-in"], button:has-text("Sign in"), button:has-text("Log in")').first();
    await signInButton.waitFor({ state: 'visible', timeout: 20000 });
    await signInButton.click();

    await this.page.locator('text=/Sign out|My account|Account|Welcome/').first().waitFor({ state: 'visible', timeout: 30000 });
  }
}
