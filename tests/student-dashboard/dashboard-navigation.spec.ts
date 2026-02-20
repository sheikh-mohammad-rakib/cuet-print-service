// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test('Navigate to different sections from student dashboard', async ({ page }) => {
    // Setup: Create student account
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Verify user is on student dashboard
    await expect(page.getByText(/Welcome|Student Dashboard/i)).toBeVisible();
    
    // 2. Check if navigation links or header is visible
    // Note: Navigation structure may vary - checking common patterns
    const navigation = page.locator('nav, header, [role="navigation"]');
    await expect(navigation).toBeVisible();
    
    // 3. Click on 'Dashboard' or 'Home' link if available (should stay on /dashboard)
    const dashboardLink = page.getByRole('link', { name: /Dashboard|Home/i }).first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await expect(page).toHaveURL(/\/dashboard/);
    }
    
    // 4. Look for 'Settings' or 'Profile' link
    const settingsLink = page.getByRole('link', { name: /Settings|Profile|Account/i }).first();
    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      // Should navigate to settings/profile page
      await expect(page).toHaveURL(/\/settings|\/profile|\/account/);
      
      // Navigate back to dashboard
      await page.goto('http://localhost:3000/dashboard');
    }
    
    // 5. Verify dashboard content is accessible after navigation
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.getByRole('combobox')).toBeVisible();
  });
});