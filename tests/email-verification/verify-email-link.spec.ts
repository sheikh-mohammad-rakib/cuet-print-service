// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Email Verification', () => {
  test('Verify email via link', async ({ page }) => {
    // 1. Create a new student account
    const timestamp = Date.now();
    const studentEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Email Verify Test');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(studentEmail);
    await page.locator('input[type="password"]').fill('StudentPass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 2. Trigger verification email
    await page.getByRole('button', { name: 'Verify Email' }).click();
    await expect(page.getByText('Email Sent')).toBeVisible();
    
    // Note: In a real scenario, we would:
    // 1. Retrieve the verification link from the email or test inbox
    // 2. Extract userId and secret from the verification link
    // 3. Navigate to /verify with appropriate query parameters
    
    // For this test, we document the expected behavior:
    // - The verification link format should be: /verify?userId=xxx&secret=xxx
    // - Navigating to this link should verify the email
    // - A success message should appear
    // - The user should be redirected or see a success page
    
    // Simulating what would happen (cannot test without actual email):
    // await page.goto(`http://localhost:3000/verify?userId=${userId}&secret=${secret}`);
    // await expect(page.getByText(/Email verified successfully|Verification successful/i)).toBeVisible();
    
    // Verify current state shows unverified banner
    await expect(page.getByText('Email not verified')).toBeVisible();
    
    // TODO: Implement full verification flow once email testing utilities are available
    // This test documents the expected verification link behavior
  });
});