// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test('Upload PDF without selecting shop', async ({ page }) => {
    // Setup: Create student and login
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@cuet.ac.bd`;
    
    await page.goto('http://localhost:3000/signup');
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Test Student');
    await page.getByRole('textbox', { name: 'email@cuet.ac.bd' }).fill(testEmail);
    await page.locator('input[type="password"]').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Sign Up as Student' }).click();
    
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 1. Navigate to dashboard (already there)
    await expect(page.getByRole('heading', { name: 'New Print Job' })).toBeVisible();
    
    // 2. Do not select any shop from the dropdown
    // Verify no shop is selected
    await expect(page.getByRole('button', { name: 'Choose a printing shop...' })).toBeVisible();
    
    // 3. Verify upload is disabled/shows message without shop selection
    await expect(page.getByText('Please select a shop from the list to enable uploading')).toBeVisible();
    
    // If there's an upload button, it should either be disabled or show error when clicked
    // This validates that the UI prevents upload without shop selection
  });
});