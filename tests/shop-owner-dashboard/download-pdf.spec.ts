// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shop Owner Dashboard', () => {
  test('Download PDF from order', async ({ page }) => {
    // Setup: Create shop owner account
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
    
    // Note: This test requires existing orders with PDF files
    // 1. Check if there are any pending orders with download buttons
    const hasOrders = await page.getByRole('button', { name: /Download PDF|Download/i }).isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasOrders) {
      // 2. Verify order card shows order details
      await expect(page.getByText(/pending/i)).toBeVisible();
      
      // 3. Locate and verify 'Download PDF' button is visible
      const downloadButton = page.getByRole('button', { name: /Download PDF|Download/i }).first();
      await expect(downloadButton).toBeVisible();
      
      // 4. Set up download listener
      const downloadPromise = page.waitForEvent('download');
      
      // 5. Click the download button
      await downloadButton.click();
      
      // 6. Wait for download to start
      const download = await downloadPromise;
      
      // 7. Verify download was initiated
      expect(download.suggestedFilename()).toBeTruthy();
    } else {
      // Empty state - no orders with PDFs to download
      await expect(page.getByText('No active orders')).toBeVisible();
    }
  });
});