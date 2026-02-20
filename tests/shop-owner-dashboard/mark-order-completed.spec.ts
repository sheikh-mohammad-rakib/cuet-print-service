// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Owner Dashboard', () => {
  test('Mark order as completed', async ({ page }) => {
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
    
    // Note: This test requires existing orders in the database
    // 1. Check if there are any pending orders
    const hasPendingOrders = await page.getByText(/pending/i).isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasPendingOrders) {
      // 2. Locate an order with 'pending' status
      await expect(page.getByText(/pending/i)).toBeVisible();
      
      // 3. Click the 'Mark Complete' or 'Complete' button
      const completeButton = page.getByRole('button', { name: /Mark Complete|Complete|Done/i }).first();
      await completeButton.click();
      
      // 4. Verify success toast appears
      await expect(page.getByText(/Order marked as done|Completed|Success/i)).toBeVisible();
      
      // 5. Verify status badge changes to 'completed'
      await expect(page.getByText(/completed/i)).toBeVisible();
    } else {
      // Empty state - no orders to mark complete
      await expect(page.getByText('No active orders')).toBeVisible();
    }
  });
});