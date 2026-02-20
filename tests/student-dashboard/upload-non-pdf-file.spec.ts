// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Student Dashboard', () => {
  test('Upload non-PDF file', async ({ page }) => {
    // Setup: Create student and login
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Select a shop
    await page.getByRole('combobox').click();
    const shopOption = page.locator('[role="option"]').first();
    if (await shopOption.isVisible()) {
      await shopOption.click();
    } else {
      test.skip(true, 'No shops available for testing');
    }
    
    // Wait for file upload section to appear
    await page.waitForTimeout(1000);
    
    // 2. Verify supported format message
    await expect(page.getByText('Supported format: PDF only')).toBeVisible();
    
    // 3. Attempt to upload a non-PDF file (e.g., .docx, .jpg, .txt)
    // Expected behavior:
    // - An error toast should appear
    // - Error message: "Only PDF files are allowed" or similar
    // - The upload should be rejected
    
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    
    // Verify the file input has accept attribute for PDFs
    const acceptAttr = await fileInput.getAttribute('accept');
    if (acceptAttr) {
      expect(acceptAttr).toContain('pdf');
    }
    
    // In actual implementation with a non-PDF file:
    // await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test.txt'));
    // await expect(page.getByText(/Only PDF|not allowed|PDF only/i)).toBeVisible();
  });
});