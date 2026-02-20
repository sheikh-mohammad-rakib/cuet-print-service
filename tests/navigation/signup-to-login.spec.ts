// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Navigate from signup to login', async ({ page }) => {
    // 1. Navigate to signup page
    await page.goto('http://localhost:3000/signup');
    
    // 2. Verify signup page loads
    await expect(page).toHaveURL('http://localhost:3000/signup');
    await expect(page.getByText(/Join CUET Print/i)).toBeVisible();
    
    // 3. Look for login link in 'Already have an account? Login'
    const loginLink = page.getByRole('link', { name: /Login/i });
    await expect(loginLink).toBeVisible();
    
    // 4. Click the Login link
    await loginLink.click();
    
    // 5. Verify redirect to /login
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // 6. Verify login page loads
    await expect(page.getByText(/Welcome Back|Login/i)).toBeVisible();
  });
});