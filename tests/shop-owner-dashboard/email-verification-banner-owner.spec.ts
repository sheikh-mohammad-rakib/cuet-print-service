// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Owner Dashboard', () => {
  test('Email verification banner for unverified shop owner', async ({ page }) => {
    // Setup: Create shop owner account (unverified by default)
    const timestamp = Date.now();
    const ownerEmail = `owner${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('tab', { name: 'Shop Owner' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Shop Owner Test');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(ownerEmail);
    await page.locator('input[type="password"]').fill('OwnerPass123!');
    await page.getByRole('textbox', { name: 'Mayer Doa Photostat' }).fill('Test Print Shop');
    await page.getByRole('textbox', { name: 'Civil Building, Ground Floor' }).fill('Main Building, 1st Floor');
    await page.getByRole('button', { name: 'Register Shop' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/manage');
    
    // 1. Verify yellow/warning banner is visible
    await expect(page.getByText('Email not verified')).toBeVisible();
    
    // 2. Verify banner message
    await expect(page.getByText('Please verify your email to ensure account security.')).toBeVisible();
    
    // 3. Verify 'Verify Email' button is present
    await expect(page.getByRole('button', { name: 'Verify Email' })).toBeVisible();
    
    // 4. Click the 'Verify Email' button
    await page.getByRole('button', { name: 'Verify Email' }).click();
    
    // 5. Verify toast notification appears
    await expect(page.getByText('Email Sent')).toBeVisible();
  });
});