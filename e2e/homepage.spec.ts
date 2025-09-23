import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/TinyCompressor/);
    
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /compress images/i })).toBeVisible();
  });

  test('should display language switcher', async ({ page }) => {
    await page.goto('/');
    
    // Check if language switcher is present
    const languageSwitcher = page.getByRole('button', { name: /language/i });
    await expect(languageSwitcher).toBeVisible();
  });

  test('should switch languages', async ({ page }) => {
    await page.goto('/');
    
    // Click on language switcher
    const languageSwitcher = page.getByRole('button', { name: /language/i });
    await languageSwitcher.click();
    
    // Check if language options are visible
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('中文')).toBeVisible();
    await expect(page.getByText('Español')).toBeVisible();
    await expect(page.getByText('Deutsch')).toBeVisible();
    await expect(page.getByText('Français')).toBeVisible();
    await expect(page.getByText('العربية')).toBeVisible();
  });

  test('should display file upload area', async ({ page }) => {
    await page.goto('/');
    
    // Check if upload area is visible
    const uploadArea = page.getByText(/drag and drop/i);
    await expect(uploadArea).toBeVisible();
  });

  test('should display compression settings', async ({ page }) => {
    await page.goto('/');
    
    // Check if compression settings are visible
    await expect(page.getByText(/compression settings/i)).toBeVisible();
    await expect(page.getByText(/quick mode/i)).toBeVisible();
    await expect(page.getByText(/custom mode/i)).toBeVisible();
  });

  test('should display supported formats', async ({ page }) => {
    await page.goto('/');
    
    // Check if supported formats are listed
    await expect(page.getByText(/supported formats/i)).toBeVisible();
    await expect(page.getByText(/jpeg/i)).toBeVisible();
    await expect(page.getByText(/png/i)).toBeVisible();
    await expect(page.getByText(/webp/i)).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to FAQ section
    await page.getByText(/frequently asked questions/i).scrollIntoViewIfNeeded();
    
    // Check if FAQ items are visible
    await expect(page.getByText(/how does image compression work/i)).toBeVisible();
    await expect(page.getByText(/what file formats are supported/i)).toBeVisible();
  });

  test('should display footer links', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    
    // Check if footer links are visible
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible();
  });
});


