// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Login with invalid credentials', async ({ page }) => {
    // 1. Navigate to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');
    
    // Verify login page loaded
    await expect(page.getByRole('heading', { name: 'CUET Print Service' })).toBeVisible();
    
    // 2. Fill in 'Student Email' with 'wronguser@cuet.ac.bd'
    await page.getByRole('textbox', { name: 'Student Email' }).fill('wronguser@cuet.ac.bd');
    
    // 3. Fill in 'Password' with 'WrongPassword123'
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123');
    
    // 4. Click the 'Login as Student' button
    await page.getByRole('button', { name: 'Login as Student' }).click();
    
    // Verify error toast appears with proper messages
    await expect(page.getByText('Login Failed')).toBeVisible();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});