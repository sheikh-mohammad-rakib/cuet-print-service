// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Shop owner login with valid credentials', async ({ page }) => {
    // Setup: Create shop owner account first
    const timestamp = Date.now();
    const testEmail = `shopowner${timestamp}@cuet.ac.bd`;
    const testPassword = 'OwnerPass123!';
    
    // 1. Create a shop owner account
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Test Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Test Building');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    // Wait for redirect to manage page
    await expect(page).toHaveURL(/.*\/manage/);
    
    // 2. Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // 3. Navigate to login page (happens automatically after logout)
    await expect(page).toHaveURL('http://localhost:3000/login');
    await expect(page.getByRole('heading', { name: 'CUET Print Service' })).toBeVisible();
    
    // 4. Click Shop Owner tab
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    
    // Verify the Shop Owner tab is active
    await expect(page.getByRole('tab', { name: 'Shop Owner', selected: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login to Dashboard' })).toBeVisible();
    
    // 5. Fill in credentials
    await page.getByRole('textbox', { name: 'Shop Email' }).fill(testEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);
    
    // 6. Login and verify redirect to /manage
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    
    // Verify success and redirect
    await expect(page.getByText('Logged in successfully.')).toBeVisible();
    await expect(page).toHaveURL(/.*\/manage/);
    await expect(page.getByRole('heading', { name: 'Print Queue' })).toBeVisible();
  });
});