// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('Non-admin user cannot access admin panel', async ({ page }) => {
    // Setup: Create a regular student account (non-admin email)
    const timestamp = Date.now();
    const studentEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Regular Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(studentEmail);
    await page.locator('input[type="password"]').fill('StudentPass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    // 1. Verify student is logged in
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 2. Attempt to navigate to /admin-panel directly
    await page.goto('http://localhost:3000/admin-panel');
    
    // 3. Verify user is redirected away from admin panel
    // Expected: Redirect to /dashboard or access denied
    await expect(page).not.toHaveURL('http://localhost:3000/admin-panel');
    await expect(page).toHaveURL(/\/dashboard|\/login/);
    
    // Alternative test with shop owner
    // Log out the student first by clearing Appwrite's localStorage session
    await page.evaluate(() => localStorage.clear());
    
    const ownerTimestamp = Date.now();
    const ownerEmail = `owner${ownerTimestamp}@cuet.ac.bd`;
    
    // Create shop owner account
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Regular Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Regular Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Regular Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // Attempt to access admin panel as shop owner
    await page.goto('http://localhost:3000/admin-panel');
    
    // Verify owner is also redirected away
    await expect(page).not.toHaveURL('http://localhost:3000/admin-panel');
    await expect(page).toHaveURL(/\/manage|\/login/);
  });
});