// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Student with no shops available sees empty state', async ({ page }) => {
    // Setup: Create student account (assuming no approved shops exist)
    const timestamp = Date.now();
    const studentEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('No Shops Test');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(studentEmail);
    await page.locator('input[type="password"]').fill('StudentPass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Look for shop selector
    const shopSelector = page.getByRole('combobox');
    await expect(shopSelector).toBeVisible();
    
    // 2. Click shop selector
    await shopSelector.click();
    
    // 3. Check if shops are available or empty state is shown
    const hasShops = await page.locator('[role="option"]').first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!hasShops) {
      // Empty state: No shops available
      // Expected behavior:
      // - Empty state message in dropdown
      // - OR "No shops available" message
      // - User cannot proceed without selecting a shop
      
      await expect(page.getByText(/No shops|No available shops/i)).toBeVisible();
    } else {
      // Shops are available (normal state)
      await expect(page.locator('[role="option"]')).toHaveCount(1, { timeout: 1000 });
    }
    
    // Expected behavior when no shops exist:
    // - Clear message that no shops are available
    // - Instructions to check back later
    // - File upload should be disabled/hidden
  });
});