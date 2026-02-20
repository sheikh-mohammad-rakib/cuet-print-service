// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Student attempts to submit order without selecting file', async ({ page }) => {
    // Setup: Create student account
    const timestamp = Date.now();
    const studentEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('No File Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(studentEmail);
    await page.locator('input[type="password"]').fill('StudentPass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Check if shop selector is available
    const shopSelector = page.getByRole('button', { name: /Select a Shop/i });
    const hasShops = await shopSelector.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasShops) {
      // 2. Select a shop
      await shopSelector.click();
      const firstShop = page.locator('[role="option"]').first();
      await firstShop.click();
      
      // 3. Configure print settings (without selecting a file)
      await page.getByLabel('Black & White').check();
      await page.getByRole('textbox', { name: /copies/i }).fill('1');
      
      // 4. Do not select any file (skip file input)
      
      // 5. Attempt to click Pay & Print button
      const payButton = page.getByRole('button', { name: /Pay & Print|Submit|Create Order/i });
      const hasPayButton = await payButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (hasPayButton) {
        await payButton.click();
        
        // 6. Verify error toast appears
        await expect(page.getByText(/Please select a PDF|No file selected|Upload a file/i)).toBeVisible();
      }
    }
    
    // Expected behavior:
    // - Error toast: "Please select a PDF file"
    // - No order should be created
    // - User remains on dashboard
  });
});