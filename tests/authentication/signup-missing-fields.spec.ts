// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Signup with missing required fields', async ({ page }) => {
    // 1. Navigate to http://localhost:3000/signup
    await page.goto('http://localhost:3000/signup');
    
    // Verify signup page loaded
    await expect(page.getByRole('heading', { name: 'Join CUET Print' })).toBeVisible();
    
    // 2. Fill in only the 'Email' field with 'incomplete@cuet.ac.bd'
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill('incomplete@cuet.ac.bd');
    
    // 3. Click the 'Sign Up as Student' button
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    // 4. Verify error toast appears
    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('Please fill in all basic fields')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/signup');
  });
});