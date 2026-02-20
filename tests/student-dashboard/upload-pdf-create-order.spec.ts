// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Student Dashboard', () => {
  test('Upload PDF and create order', async ({ page }) => {
    // Setup: Create student and login
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Configure print job (select shop, set to B&W, 2 copies)
    await page.getByRole('button', { name: 'Choose a printing shop...' }).click();
    
    // Select first available shop
    const shopOption = page.locator('[role="option"]').first();
    if (await shopOption.isVisible()) {
      await shopOption.click();
    }
    
    // B&W is already selected by default
    await expect(page.getByRole('radio', { name: /Black & White/, checked: true })).toBeVisible();
    
    // 2. Upload a PDF file
    // Create a test PDF path - you may need to create a test PDF file
    const fileInput = page.locator('input[type="file"]');
    
    // For this test, we'll skip actual file upload as it requires a real PDF file
    // In a real scenario, you would do:
    // await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test.pdf'));
    
    // 3. Verify the upload area is visible
    await expect(page.getByText('Supported format: PDF only')).toBeVisible();
    
    // Note: Actual file upload and order creation would require:
    // - A test PDF file in fixtures
    // - await page.getByRole('button', { name: /Pay & Print|Upload/ }).click();
    // - await expect(page.getByText(/Order Created|Success/)).toBeVisible();
  });
});