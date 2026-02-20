// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Student signup with valid credentials', async ({ page }) => {
    // Generate unique email for this test run
    const timestamp = Date.now();
    const uniqueEmail = `student${timestamp}@cuet.ac.bd`;
    
    // 1. Navigate to http://localhost:3000/signup
    await page.goto('http://localhost:3000/signup');
    
    // Verify the signup page loaded successfully
    await expect(page.getByRole('heading', { name: 'Join CUET Print' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Student', selected: true })).toBeVisible();
    
    // 2. Fill in the 'Full Name' field with 'John Doe'
    await page.getByRole('textbox', { name: 'John Doe' }).fill('John Doe');
    
    // 3. Fill in the 'Email' field with unique email
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(uniqueEmail);
    
    // 4. Fill in the 'Password' field with 'SecurePass123!'
    await page.locator('input[type="password"]').fill('SecurePass123!');
    
    // 5. Click the 'Sign Up as Student' button
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    // Verify success toast and redirect
    await expect(page.getByText('Welcome!')).toBeVisible();
    await expect(page.getByText('Account created successfully.')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });
});
