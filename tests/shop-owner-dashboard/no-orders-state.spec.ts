// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Owner Dashboard', () => {
  test('Handle shop with no orders', async ({ page }) => {
    // Setup: Create shop owner account with no orders
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
    
    // 1. Verify redirect to /manage
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 2. Verify manage page loads successfully
    await expect(page.getByText('Print Queue')).toBeVisible();
    
    // 3. Verify empty state message appears
    await expect(page.getByText('No active orders')).toBeVisible();
    await expect(page.getByText('New orders will appear here automatically.')).toBeVisible();
    
    // 4. Verify no order cards are displayed
    // Check that the empty state illustration/image is shown
    const emptyStateImage = page.locator('img[alt], img[src*="empty"], img[src*="no-orders"]').first();
    await expect(emptyStateImage).toBeVisible();
  });
});