// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Owner Dashboard', () => {
  test('View incoming orders in real-time', async ({ page }) => {
    // Setup: Create shop owner account with dynamic email
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    // 1. Navigate to signup and create shop owner account
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Shop Owner Test');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Test Print Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Main Building, 1st Floor');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    // 2. Verify redirect to /manage dashboard
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 3. Verify order queue interface is visible
    await expect(page.getByText('Print Queue')).toBeVisible();
    await expect(page.getByText('Manage incoming orders and downloads.')).toBeVisible();
    
    // 4. Verify refresh button exists
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
    
    // 5. Verify empty state when no orders exist
    await expect(page.getByText('No active orders')).toBeVisible();
    await expect(page.getByText('New orders will appear here automatically.')).toBeVisible();
  });
});