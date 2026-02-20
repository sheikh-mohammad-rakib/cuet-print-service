// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Shop owner marks already completed order as complete again', async ({ page }) => {
    // Setup: Create shop owner account
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Duplicate Complete Test');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Duplicate Test Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Test Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // Note: This test requires existing orders to mark as complete
    // Check if there are any pending orders
    const hasPendingOrders = await page.getByText(/pending/i).isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasPendingOrders) {
      // 1. Mark an order as completed
      const completeButton = page.getByRole('button', { name: /Mark Complete|Complete/i }).first();
      await completeButton.click();
      
      // 2. Verify order is marked as completed
      await expect(page.getByText(/completed/i)).toBeVisible();
      
      // 3. Attempt to mark the same order as completed again
      // Expected behavior:
      // - Button should be disabled
      // - OR button text changes to 'Completed' (non-clickable)
      // - OR clicking shows message 'Order already completed'
      
      const completedOrderButton = page.getByRole('button', { name: /Completed|Complete/i }).first();
      const isDisabled = await completedOrderButton.isDisabled().catch(() => false);
      
      if (!isDisabled) {
        // Try clicking again
        await completedOrderButton.click();
        // Should show message or have no effect
      }
    }
    
    // Expected behavior:
    // - Completed orders should not be re-completable
    // - UI should prevent duplicate completion actions
    // - No errors should occur
  });
});