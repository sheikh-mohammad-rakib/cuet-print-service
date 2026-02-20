// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Authenticated shop owner cannot access student routes', async ({ page }) => {
    // Setup: Create and log in as shop owner
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Test Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Test Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    // 1. Verify owner is on /manage
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 2. Attempt to navigate to /dashboard (student route)
    await page.goto('http://localhost:3000/dashboard');
    
    // 3. Verify owner is redirected back to /manage
    await expect(page).toHaveURL('http://localhost:3000/manage');
  });
});