// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Settings', () => {
  test('Update shop name and location', async ({ page }) => {
    // Setup: Create shop owner account
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Settings Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Original Shop Name');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Original Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 1. Navigate to /settings
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('http://localhost:3000/settings');
    
    // 2. Verify form fields are pre-filled with current shop data
    const shopNameField = page.getByRole('textbox').first();
    const locationField = page.getByRole('textbox').nth(1);
    
    await expect(shopNameField).toHaveValue('Original Shop Name');
    await expect(locationField).toHaveValue('Original Location');
    
    // 3. Update shop name
    await shopNameField.fill('Updated Shop Name');
    
    // 4. Update location
    await locationField.fill('New Building, 2nd Floor');
    
    // 5. Click Save button
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Wait for save to complete
    await page.waitForTimeout(1000);
    
    // 6. Verify changes are saved
    await expect(shopNameField).toHaveValue('Updated Shop Name');
    await expect(locationField).toHaveValue('New Building, 2nd Floor');
    
    // 7. Refresh page to verify persistence
    await page.reload();
    
    // 8. Verify updated values still present after refresh
    await expect(page.getByRole('textbox').first()).toHaveValue('Updated Shop Name');
    await expect(page.getByRole('textbox').nth(1)).toHaveValue('New Building, 2nd Floor');
  });
});