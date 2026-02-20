// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.fixme('Admin views pending shop approvals', async ({ page }) => {
    // FIXME: Admin account creation is failing during automated signup
    // The signup button remains disabled during parallel test execution
    // Workaround: Manually create admin account with email: u2009023@student.cuet.ac.bd
    
    // Use the actual hardcoded admin email from ADMIN_EMAILS constant
    const adminEmail = 'u2009023@student.cuet.ac.bd';
    const adminPassword = 'AdminPass123!';
    
    // Try to log in first (admin account may already exist)
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'Student Email' }).fill(adminEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.getByRole('button', { name: /Login/i }).first().click();
    
    // Wait a moment to see if login succeeds
    await page.waitForTimeout(1000);
    
    // If login failed (still on login page), create the account
    if (page.url().includes('/login')) {
      await page.goto('http://localhost:3000/signup');
      await page.getByRole('textbox', { name: 'John Doe' }).fill('Admin User');
      await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(adminEmail);
      await page.locator('input[type="password"]').fill(adminPassword);
      await page.getByRole('button', { name: 'Sign Up as Student' }).click();
      await expect(page).toHaveURL('http://localhost:3000/dashboard');
      
      // Logout after creating account
      await page.getByRole('button', { name: 'Logout' }).click();
      await expect(page).toHaveURL('http://localhost:3000/login');
      
      // Now log in
      await page.getByRole('textbox', { name: 'Student Email' }).fill(adminEmail);
      await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
      await page.getByRole('button', { name: /Login/i }).first().click();
    }
    
    // Wait for successful login
    await expect(page).toHaveURL('http://localhost:3000/admin-panel');
    
    // Logout to create shop owner
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // Clear session for shop owner signup
    await page.evaluate(() => localStorage.clear());
    
    // Setup: Create a shop owner (creates pending shop with is_active: false)
    const ownerTimestamp = Date.now();
    const ownerEmail = `owner${ownerTimestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Pending Shop Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Pending Test Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Pending Location');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // 1. Log in as admin
    await page.getByRole('textbox', { name: 'Student Email' }).fill(adminEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.getByRole('button', { name: /Login/i }).first().click();
    
    // Wait for successful login and navigate to admin panel
    await expect(page).toHaveURL('http://localhost:3000/admin-panel');
    
    // 3. Verify admin panel loads
    await expect(page.getByText(/Pending Approvals|Admin Panel/i)).toBeVisible();
    
    // 4. Verify pending shops are displayed
    await expect(page.getByText('Pending Test Shop')).toBeVisible();
    await expect(page.getByText('Pending Location')).toBeVisible();
    
    // 5. Verify shop card shows details
    await expect(page.getByText(/B&W|Color/i)).toBeVisible();
    
    // 6. Verify Approve button is visible
    await expect(page.getByRole('button', { name: /Approve/i })).toBeVisible();
  });
});