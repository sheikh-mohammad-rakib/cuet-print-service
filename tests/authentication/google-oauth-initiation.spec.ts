// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Google OAuth login initiation', async ({ page, context }) => {
    // 1. Navigate to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');
    
    // Verify login page loaded and Google button is visible
    await expect(page.getByRole('heading', { name: 'CUET Print Service' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
    
    // 2. Click the 'Continue with Google' button
    // Note: This will open a popup to Google's OAuth page
    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Continue with Google' }).click();
    
    // 3. Verify the popup opened to Google OAuth
    const popup = await popupPromise;
    await popup.waitForLoadState();
    
    // Verify URL contains Google accounts domain
    expect(popup.url()).toMatch(/accounts\.google\.com|cloud\.appwrite\.io/);
    
    // Close the popup for cleanup
    await popup.close();
  });
});