// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test('Email verification banner display for unverified student', async ({ page }) => {
    // Setup: Create student account (unverified by default)
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Observe the dashboard page
    // 2. Verify yellow/warning banner is visible
    await expect(page.getByText('Email not verified')).toBeVisible();
    
    // 3. Verify banner message
    await expect(page.getByText('Please verify your email address to ensure full account access')).toBeVisible();
    
    // 4. Verify 'Verify Email' button is visible
    await expect(page.getByRole('button', { name: 'Verify Email' })).toBeVisible();
    
    // 5. Click the 'Verify Email' button
    await page.getByRole('button', { name: 'Verify Email' }).click();
    
    // 6. Verify toast notification appears
    await expect(page.getByText('Email Sent')).toBeVisible();
  });
});