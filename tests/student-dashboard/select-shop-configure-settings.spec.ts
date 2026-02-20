// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test('Select a shop and configure print settings', async ({ page }) => {
    // Setup: Create student and login
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Open the shop dropdown
    await page.getByRole('combobox').click();
    
    // 2. Select a shop (if available)
    // Note: This assumes at least one shop exists in the database
    const shopOption = page.locator('[role="option"]').first();
    if (await shopOption.isVisible()) {
      await shopOption.click();
    }
    
    // 3. Select 'Color' print mode
    await page.getByRole('radio', { name: /Color/ }).click();
    await expect(page.getByRole('radio', { name: /Color/, checked: true })).toBeVisible();
    
    // 4. Select number of copies
    await page.getByRole('button').filter({ hasText: /1/ }).click();
    // Select 3 copies from dropdown
    const copiesOption = page.getByText('3', { exact: true });
    if (await copiesOption.isVisible()) {
      await copiesOption.click();
    }
    
    // Verify print configuration options are available
    await expect(page.getByText('Color Mode')).toBeVisible();
    await expect(page.getByText('Number of Copies')).toBeVisible();
  });
});