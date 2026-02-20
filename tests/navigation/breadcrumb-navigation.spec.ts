// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Breadcrumb or back navigation works correctly', async ({ page }) => {
    // Setup: Create and log in as shop owner
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Navigation Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Navigation Test Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Test Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    // 1. Verify owner is on /manage
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 2. Navigate to /settings
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('http://localhost:3000/settings');
    
    // 3. Use browser back button to return to /manage
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 4. Use browser forward button to return to /settings
    await page.goForward();
    await expect(page).toHaveURL('http://localhost:3000/settings');
    
    // 5. Click Queue/Manage link in navigation
    await page.getByRole('link', { name: /Queue|Manage/i }).click();
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 6. Verify navigation is working correctly
    await expect(page.getByText('Print Queue')).toBeVisible();
  });
});