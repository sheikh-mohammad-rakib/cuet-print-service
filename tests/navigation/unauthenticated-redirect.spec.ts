// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('Unauthenticated user redirected to login', async ({ page }) => {
    // 1. Ensure no user is logged in (use a fresh browser context)
    // Playwright already provides isolated contexts by default
    
    // 2. Attempt to navigate to /dashboard (protected student route)
    await page.goto('http://localhost:3000/dashboard');
    
    // 3. Verify redirect to /login
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // 4. Attempt to navigate to /manage (protected owner route)
    await page.goto('http://localhost:3000/manage');
    
    // 5. Verify redirect to /login
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // 6. Attempt to navigate to /settings (protected owner route)
    await page.goto('http://localhost:3000/settings');
    
    // 7. Verify redirect to /login
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // 8. Attempt to navigate to /admin-panel (protected admin route)
    await page.goto('http://localhost:3000/admin-panel');
    
    // 9. Verify redirect to /login
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});