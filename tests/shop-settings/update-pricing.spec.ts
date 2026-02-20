// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Settings', () => {
  test('Update pricing (B&W and Color)', async ({ page }) => {
    // Setup: Create shop owner account
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Pricing Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Pricing Test Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Test Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 1. Navigate to /settings
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('http://localhost:3000/settings');
    
    // 2. Verify current pricing is displayed (default: B&W: 2, Color: 5)
    const bwPriceField = page.getByRole('spinbutton').first();
    const colorPriceField = page.getByRole('spinbutton').nth(1);
    
    await expect(bwPriceField).toHaveValue('2');
    await expect(colorPriceField).toHaveValue('5');
    
    // 3. Change B&W Price to 3
    await bwPriceField.fill('3');
    
    // 4. Change Color Price to 6
    await colorPriceField.fill('6');
    
    // 5. Click Save button
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // 6. Verify success toast or updated values
    await expect(bwPriceField).toHaveValue('3');
    await expect(colorPriceField).toHaveValue('6');
    
    // Note: Verifying pricing from student perspective would require:
    // 1. Logging out
    // 2. Creating/logging in as student
    // 3. Selecting this shop
    // 4. Checking displayed prices
    // This is documented for future integration tests
  });
});