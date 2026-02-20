// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Navigate from login to signup', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // 2. Verify login page loads
    await expect(page).toHaveURL('http://localhost:3000/login');
    await expect(page.getByText(/Welcome Back|Login/i)).toBeVisible();
    
    // 3. Look for signup link at bottom of form
    const signupLink = page.getByRole('link', { name: /Sign up|Create account/i });
    await expect(signupLink).toBeVisible();
    
    // 4. Click the signup link
    await signupLink.click();
    
    // 5. Verify redirect to /signup
    await expect(page).toHaveURL('http://localhost:3000/signup');
    
    // 6. Verify signup page loads
    await expect(page.getByRole('heading', { name: 'Join CUET Print' })).toBeVisible();
  });
});