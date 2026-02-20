// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Student login with valid credentials', async ({ page }) => {
    // First create a test student account
    const timestamp = Date.now();
    const testEmail = `logintest${timestamp}@cuet.ac.bd`;
    const testPassword = 'SecurePass123!';
    
    // Setup: Create student account
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    // Wait for success and logout
    await expect(page.getByText('Account created successfully.')).toBeVisible();
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // 1. Navigate to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');
    
    // Verify login page loaded
    await expect(page.getByRole('heading', { name: 'CUET Print Service' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Student', selected: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
    
    // 2. Fill in 'Student Email' with test email
    await page.getByRole('textbox', { name: 'Student Email' }).fill(testEmail);
    
    // 3. Fill in 'Password' with test password
    await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);
    
    // 4. Click the 'Login as Student' button
    await page.getByRole('button', { name: 'Login as Student' }).click();
    
    // Verify redirect (toast may not always appear)
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });
});