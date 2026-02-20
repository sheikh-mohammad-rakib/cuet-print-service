// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Email Verification', () => {
  test('Send verification email from student dashboard', async ({ page }) => {
    // 1. Create a new student account (unverified by default)
    const timestamp = Date.now();
    const studentEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Verification Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(studentEmail);
    await page.locator('input[type="password"]').fill('StudentPass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    // 2. Verify student is logged in and on /dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 3. Verify verification banner is visible
    await expect(page.getByText('Email not verified')).toBeVisible();
    
    // 4. Locate and verify 'Verify Email' button exists
    const verifyButton = page.getByRole('button', { name: 'Verify Email' });
    await expect(verifyButton).toBeVisible();
    
    // 5. Click the 'Verify Email' button
    await verifyButton.click();
    
    // 6. Verify toast notification appears
    await expect(page.getByText('Email Sent')).toBeVisible();
    
    // Note: Actual email sending would require email service integration
    // This test verifies the UI flow and success notification
  });
});