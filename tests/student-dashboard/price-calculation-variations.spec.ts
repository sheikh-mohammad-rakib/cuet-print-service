// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test('Price calculation for different configurations', async ({ page }) => {
    // Setup: Create student account
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Select a shop from the dropdown
    await page.getByRole('combobox').click();
    const firstShop = page.locator('[role="option"]').first();
    await firstShop.click();
    
    // 2. Select 'Black & White' color mode
    await page.getByLabel('Black & White').check();
    
    // 3. Set number of copies to 1
    await page.getByRole('textbox', { name: /copies/i }).clear();
    await page.getByRole('textbox', { name: /copies/i }).fill('1');
    
    // 4. Verify initial price (assuming default ৳2.00 for B&W single-sided)
    await expect(page.getByText(/৳2\.00|৳ 2\.00/)).toBeVisible();
    
    // 5. Change to 'Color' mode
    await page.getByLabel('Color').check();
    
    // 6. Verify price changes (assuming ৳10.00 for Color)
    await expect(page.getByText(/৳10\.00|৳ 10\.00/)).toBeVisible();
    
    // 7. Change copies to 5
    await page.getByRole('textbox', { name: /copies/i }).clear();
    await page.getByRole('textbox', { name: /copies/i }).fill('5');
    
    // 8. Verify total price = 5 × ৳10.00 = ৳50.00
    await expect(page.getByText(/৳50\.00|৳ 50\.00/)).toBeVisible();
    
    // 9. Change back to 'Black & White'
    await page.getByLabel('Black & White').check();
    
    // 10. Verify price updates to 5 × ৳2.00 = ৳10.00
    await expect(page.getByText(/৳10\.00|৳ 10\.00/)).toBeVisible();
  });
});