// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Logout functionality', async ({ page }) => {
    // Setup: Create and log in as student
    const timestamp = Date.now();
    const studentEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Logout Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(studentEmail);
    await page.locator('input[type="password"]').fill('StudentPass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    // 1. Verify user is authenticated and on dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 2. Look for logout button in navigation/header
    const logoutButton = page.getByRole('button', { name: /Logout|Sign Out/i });
    await expect(logoutButton).toBeVisible();
    
    // 3. Click the logout button
    await logoutButton.click();
    
    // 4. Verify redirect to /login or homepage
    await expect(page).toHaveURL(/\/login|\/$/);
    
    // 5. Verify session is cleared by attempting to access protected route
    await page.goto('http://localhost:3000/dashboard');
    
    // 6. Verify redirect to login (session is cleared)
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});