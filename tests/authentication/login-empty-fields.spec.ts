// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Login with empty fields', async ({ page }) => {
    // 1. Navigate to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');
    
    // Verify login page loaded
    await expect(page.getByRole('heading', { name: 'CUET Print Service' })).toBeVisible();
    
    // 2. Leave both email and password fields empty (no action needed)
    
    // 3. Click the 'Login as Student' button
    await page.getByRole('button', { name: 'Login as Student' }).click();
    
    // Verify error toast appears
    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('Please fill in all fields')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});