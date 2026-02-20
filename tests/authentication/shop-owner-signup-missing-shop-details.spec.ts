// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Shop owner signup with missing shop details', async ({ page }) => {
    // 1. Navigate to http://localhost:3000/signup
    await page.goto('http://localhost:3000/signup');
    
    // 2. Click on the 'Shop Owner' tab
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    
    // Verify tab switched
    await expect(page.getByRole('tab', { name: 'Shop Owner', selected: true })).toBeVisible();
    
    // 3. Fill in basic fields only
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Owner Name');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill('owner2@cuet.ac.bd');
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    
    // 4. Leave 'Shop Name' and 'Location' fields empty (no action needed)
    
    // 5. Click the 'Register Shop' button
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    // Verify error toast appears
    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('Shop Name and Location are required')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/signup');
  });
});