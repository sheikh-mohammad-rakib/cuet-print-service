// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Forgot password flow initiation', async ({ page }) => {
    // 1. Navigate to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');
    await expect(page.getByRole('heading', { name: 'CUET Print Service' })).toBeVisible();
    
    // 2. Click the 'Forgot password?' link
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    
    // 3. Verify redirect to forgot password page
    await expect(page).toHaveURL('http://localhost:3000/forgot-password');
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    await expect(page.getByText('Enter your email to receive a password reset link')).toBeVisible();
    
    // 4. Fill in the email field with 'student1@cuet.ac.bd'
    await page.getByRole('textbox', { name: 'Email Address' }).fill('student1@cuet.ac.bd');
    
    // 5. Click the 'Send Recovery Email' button
    await page.getByRole('button', { name: 'Send Recovery Email' }).click();
    
    // Verify success message
    await expect(page.getByRole('heading', { name: 'Email Sent' })).toBeVisible();
    await expect(page.getByText('Password recovery email sent!')).toBeVisible();
  });
});