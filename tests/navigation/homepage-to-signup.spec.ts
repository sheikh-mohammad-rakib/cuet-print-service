// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Navigate from homepage to signup', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('http://localhost:3000/');
    
    // 2. Verify homepage loads
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // 3. Look for Sign Up button in header
    const signupButton = page.getByRole('link', { name: 'Sign Up' }).first();
    await expect(signupButton).toBeVisible();
    
    // 4. Click the Sign Up button
    await signupButton.click();
    
    // 5. Verify redirect to /signup
    await expect(page).toHaveURL('http://localhost:3000/signup');
    
    // 6. Verify signup page loads successfully
    await expect(page.getByRole('heading', { name: 'Join CUET Print' })).toBeVisible();
  });
});