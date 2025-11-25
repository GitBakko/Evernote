import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.describe('Authentication Flow', () => {
  
  test('should register a new user', async ({ page }) => {
    const email = `test-register-${uuidv4()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    await page.goto('/register');
    await page.fill('input[type="text"]', name);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to notes (home)
    await expect(page).toHaveURL(/\/notes/);
  });

  test('should login with the registered user', async ({ page }) => {
    const email = `test-login-${uuidv4()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    // Register first to create the user
    await page.goto('/register');
    await page.fill('input[type="text"]', name);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/notes/);

    // Logout (if possible) or clear cookies/storage to test login
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);

    // Now Login
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to notes
    await expect(page).toHaveURL(/\/notes/);
    
    // Check if user name is displayed in sidebar
    await expect(page.locator('text=Test User')).toBeVisible();
  });
});
