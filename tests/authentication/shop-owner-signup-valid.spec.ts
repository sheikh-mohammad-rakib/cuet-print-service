// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Shop owner signup with complete information', async ({ page }) => {
    // Generate unique email for this test run
    const timestamp = Date.now();
    const uniqueEmail = `owner${timestamp}@cuet.ac.bd`;
    
    // 1. Navigate to http://localhost:3000/signup
    await page.goto('http://localhost:3000/signup');
    
    // 2. Click on the 'Shop Owner' tab
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    
    // Verify the Shop Owner tab is active and additional fields appear
    await expect(page.getByRole('tab', { name: 'Shop Owner', selected: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register Shop' })).toBeVisible();
    
    // 3. Fill in 'Full Name' with 'Owner Name'
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Owner Name');
    
    // 4. Fill in 'Email' with unique email
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(uniqueEmail);
    
    // 5. Fill in 'Password' with 'OwnerPass123!'
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    
    // 6. Fill in 'Shop Name' with 'Mayer Doa Photostat'
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Mayer Doa Photostat');
    
    // 7. Fill in 'Location' with 'Civil Building, Ground Floor'
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Civil Building, Ground Floor');
    
    // 8. Click the 'Register Shop' button
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    // Verify success toast and redirect to manage page
    await expect(page.getByText('Welcome!')).toBeVisible();
    await expect(page.getByText('Account created successfully.')).toBeVisible();
    await expect(page).toHaveURL(/.*\/manage/);
  });
});
