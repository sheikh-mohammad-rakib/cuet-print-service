// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Settings', () => {
  test('Toggle shop online/offline status', async ({ page }) => {
    // Setup: Create shop owner account
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Status Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Status Test Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Test Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 1. Navigate to /settings
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('http://localhost:3000/settings');
    
    // 2. Locate the online/offline toggle switch
    const toggleSwitch = page.getByRole('switch');
    
    // 3. Check current state (should be checked/ON by default)
    await expect(toggleSwitch).toBeChecked();
    await expect(page.getByText('Your shop is currently OPEN.')).toBeVisible();
    
    // 4. Click toggle to turn it OFF
    await toggleSwitch.click();
    
    // 5. Verify toggle state changed to OFF
    await expect(toggleSwitch).not.toBeChecked();
    
    // 6. Click Save button
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // 7. Verify status is saved as offline
    await expect(toggleSwitch).not.toBeChecked();
    
    // Note: Verifying from student perspective (shop appears as offline/disabled)
    // would require additional test setup with student account
  });
});