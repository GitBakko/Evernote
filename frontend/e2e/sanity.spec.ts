import { test, expect } from '@playwright/test';

test('local sanity check', async ({ page }) => {
  await page.goto('/');
  // Check for title or something basic
  // The app title is "Notiq" based on previous curl
  await expect(page).toHaveTitle(/Notiq/);
});
