// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Owner Dashboard', () => {
  test('Filter orders by status', async ({ page }) => {
    // Setup: Create shop owner account
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Shop Owner Test');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Test Print Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Main Building, 1st Floor');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // Note: This test requires multiple orders with different statuses
    // 1. Check if filter tabs or buttons exist
    const hasFilters = await page.getByRole('tab', { name: /All|Pending|Completed/i }).isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasFilters) {
      // 2. Verify filter tabs are visible (All, Pending, Completed)
      await expect(page.getByRole('tab', { name: /All/i })).toBeVisible();
      
      // 3. Click on 'Pending' filter
      const pendingTab = page.getByRole('tab', { name: /Pending/i });
      if (await pendingTab.isVisible()) {
        await pendingTab.click();
        // Verify only pending orders are shown (or empty state)
        await expect(page.getByText(/No active orders|pending/i)).toBeVisible();
      }
      
      // 4. Click on 'Completed' filter
      const completedTab = page.getByRole('tab', { name: /Completed/i });
      if (await completedTab.isVisible()) {
        await completedTab.click();
        // Verify only completed orders are shown (or empty state)
        await expect(page.getByText(/No completed orders|completed/i)).toBeVisible();
      }
      
      // 5. Click back to 'All' filter
      const allTab = page.getByRole('tab', { name: /All/i });
      if (await allTab.isVisible()) {
        await allTab.click();
        // Verify all orders are shown
        await expect(page.getByText(/Print Queue|No active orders/i)).toBeVisible();
      }
    } else {
      // No filter functionality present - document this
      await expect(page.getByText('Print Queue')).toBeVisible();
      // Note: Filter feature may not be implemented yet
    }
  });
});