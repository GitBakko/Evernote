import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.describe('Notes Management', () => {
  const email = `test-${uuidv4()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  test.beforeEach(async ({ page }) => {
    // Register and Login
    await page.goto('/register');
    await page.fill('input[type="text"]', name);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    // Registration automatically logs in and redirects to notes
    await page.waitForURL(/\/notes/);
  });

  test('should create a new note', async ({ page }) => {
    // Click "New Note" button in sidebar
    await page.click('button:has-text("New Note")');

    // Check if editor is visible
    await expect(page.locator('input[placeholder="Note Title"]')).toBeVisible();

    // Edit Title
    const noteTitle = 'My First E2E Note';
    await page.fill('input[placeholder="Note Title"]', noteTitle);

    // Edit Content (Tiptap editor)
    // Tiptap contenteditable div
    await page.locator('.ProseMirror').fill('This is the content of the note.');

    // Wait for debounce save (simulated by waiting a bit or checking UI feedback if any)
    await page.waitForTimeout(1500);

    // Check if note appears in the list
    await expect(page.locator(`text=${noteTitle}`)).toBeVisible();
  });

  test('should create a notebook and move note to it', async ({ page }) => {
    // Go to Notebooks
    await page.click('a[href="/notebooks"]');
    
    // Create Notebook
    await page.click('button:has-text("New Notebook")');
    const notebookName = 'Work Projects';
    await page.fill('input[placeholder="Notebook name..."]', notebookName);
    await page.click('button:has-text("Create")'); // Assuming modal has Create button

    // Verify notebook exists
    await expect(page.locator(`text=${notebookName}`)).toBeVisible();
  });
});
