// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Special characters in shop name and location', async ({ page }) => {
    // 1. Create shop owner account with special characters in shop details
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    const shopNameWithSpecialChars = "Shop #1 & Co. (Main) - 'Print'";
    const locationWithSpecialChars = "Building @123, Floor #2 - Section (A)";
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Special Chars Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill(shopNameWithSpecialChars);
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill(locationWithSpecialChars);
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    // 2. Verify shop is created successfully
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 3. Navigate to settings to verify special characters are stored correctly
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('http://localhost:3000/settings');
    
    // 4. Verify shop name and location display correctly with special characters
    await expect(page.getByRole('textbox').first()).toHaveValue(shopNameWithSpecialChars);
    await expect(page.getByRole('textbox').nth(1)).toHaveValue(locationWithSpecialChars);
    
    // Expected behavior:
    // - Shop should be created successfully
    // - Special characters should be properly escaped and stored
    // - Shop name should display correctly in all contexts
    // - No SQL injection or XSS vulnerabilities
    
    // TODO: Test from student perspective
    // - Login as admin, approve shop
    // - Login as student
    // - Verify shop appears in dropdown with correct special characters
  });
});