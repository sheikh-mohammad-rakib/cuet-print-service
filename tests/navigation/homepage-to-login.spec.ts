// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Navigate from homepage to login', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('http://localhost:3000/');
    
    // 2. Verify homepage loads
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // 3. Look for Login button in header
    const loginButton = page.getByRole('link', { name: /Login|Sign In/i });
    await expect(loginButton).toBeVisible();
    
    // 4. Click the Login button
    await loginButton.click();
    
    // 5. Verify redirect to /login
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // 6. Verify login page loads successfully
    await expect(page.getByText(/Welcome Back|Login/i)).toBeVisible();
  });
});