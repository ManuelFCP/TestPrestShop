import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('language change updates interface text', async ({ page }) => {
  const home = new HomePage(page);
  await home.gotoStore();

  await home.changeLanguage('Français');
  await expect(home.frame.locator('#_desktop_language_selector')).toContainText('Français', { ignoreCase: true, timeout: 20000 });

  await home.changeLanguage('English');
  await expect(home.frame.locator('#_desktop_language_selector')).toContainText('English', { ignoreCase: true, timeout: 20000 });
});
