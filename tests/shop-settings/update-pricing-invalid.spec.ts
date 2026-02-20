// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Settings', () => {
  test('Update pricing with invalid values', async ({ page }) => {
    // Setup: Create shop owner account
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Invalid Price Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Invalid Price Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Test Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 1. Navigate to /settings
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('http://localhost:3000/settings');
    
    // 2. Locate B&W Price field
    const bwPriceField = page.getByRole('spinbutton').first();
    
    // 3. Enter a negative value (e.g., '-5')
    await bwPriceField.fill('-5');
    
    // 4. Click Save button
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // 5. Verify error handling
    // Expected behaviors:
    // - Error toast appears indicating invalid price
    // - OR: HTML5 validation prevents submission
    // - OR: Field shows validation error message
    
    // Check if error toast appears
    const hasErrorToast = await page.getByText(/invalid|error/i).isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasErrorToast) {
      await expect(page.getByText(/invalid|error/i)).toBeVisible();
    } else {
      // If no error toast, HTML5 validation should prevent negative values
      // Verify that spinbutton doesn't accept negative values or has min="0" attribute
      const minValue = await bwPriceField.getAttribute('min');
      expect(minValue).toBe('0');
    }
  });
});