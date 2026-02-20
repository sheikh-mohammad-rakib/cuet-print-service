// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Authenticated student cannot access shop owner routes', async ({ page }) => {
    // Setup: Create and log in as student
    const timestamp = Date.now();
    const studentEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(studentEmail);
    await page.locator('input[type="password"]').fill('StudentPass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    // 1. Verify student is on /dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 2. Attempt to navigate to /manage (shop owner route)
    await page.goto('http://localhost:3000/manage');
    
    // 3. Verify student is redirected back to /dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 4. Attempt to navigate to /settings (shop owner route)
    await page.goto('http://localhost:3000/settings');
    
    // 5. Verify student is redirected back to /dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });
});