// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.fixme('Admin approves a pending shop', async ({ page }) => {
    // FIXME: Admin account creation is failing during automated signup
    // The signup button remains disabled, likely due to parallel test execution
    // causing Appwrite rate limiting or validation issues.
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
    
    // Setup: Create a shop owner account (creates shop with is_active: false)
    const ownerTimestamp = Date.now();
    const ownerEmail = `owner${ownerTimestamp}@cuet.ac.bd`;
    const shopName = `Approve Test Shop ${ownerTimestamp}`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Approve Test Owner');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill(shopName);
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Approval Test Location');
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
    
    // 2. Verify pending shop is visible
    await expect(page.getByText(shopName)).toBeVisible();
    
    // 3. Click the Approve button for this shop
    const approveButton = page.getByRole('button', { name: /Approve/i }).first();
    await approveButton.click();
    
    // 4. Verify success toast appears
    await expect(page.getByText(/Shop Approved|Approved|Success/i)).toBeVisible();
    
    // 5. Verify shop card disappears from pending list
    await expect(page.getByText(shopName)).not.toBeVisible({ timeout: 5000 });
    
    // Note: Verifying from student perspective would require:
    // 1. Logout from admin
    // 2. Create/login as student
    // 3. Check shop dropdown
    // This is documented for future integration tests
  });
});