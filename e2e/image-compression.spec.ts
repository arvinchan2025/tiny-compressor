import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Image Compression', () => {
  test('should upload and compress images', async ({ page }) => {
    await page.goto('/');
    
    // Create a test image file
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
    
    // Upload file
    const fileInput = page.getByRole('button', { name: /upload/i });
    await fileInput.setInputFiles(testImagePath);
    
    // Wait for file to be processed
    await expect(page.getByText(/uploaded files/i)).toBeVisible();
    
    // Check if compression settings are available
    await expect(page.getByText(/compression settings/i)).toBeVisible();
    
    // Start compression
    const compressButton = page.getByRole('button', { name: /compress/i });
    await compressButton.click();
    
    // Wait for processing to complete
    await expect(page.getByText(/processing/i)).toBeVisible();
    
    // Wait for results
    await expect(page.getByText(/completed/i)).toBeVisible({ timeout: 10000 });
  });

  test('should handle drag and drop upload', async ({ page }) => {
    await page.goto('/');
    
    // Get the drop zone
    const dropZone = page.getByText(/drag and drop/i);
    
    // Create a test file
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
    
    // Simulate drag and drop
    await dropZone.dispatchEvent('dragenter');
    await dropZone.dispatchEvent('dragover');
    
    // Set files on the drop zone
    await dropZone.setInputFiles(testImagePath);
    
    // Wait for file to be processed
    await expect(page.getByText(/uploaded files/i)).toBeVisible();
  });

  test('should switch between quick and custom modes', async ({ page }) => {
    await page.goto('/');
    
    // Check default mode
    await expect(page.getByText(/quick mode/i)).toBeVisible();
    
    // Switch to custom mode
    const customModeButton = page.getByRole('button', { name: /custom mode/i });
    await customModeButton.click();
    
    // Check if custom settings are visible
    await expect(page.getByText(/quality/i)).toBeVisible();
    await expect(page.getByText(/dimensions/i)).toBeVisible();
    await expect(page.getByText(/format/i)).toBeVisible();
    
    // Switch back to quick mode
    const quickModeButton = page.getByRole('button', { name: /quick mode/i });
    await quickModeButton.click();
    
    // Check if custom settings are hidden
    await expect(page.getByText(/quality/i)).not.toBeVisible();
  });

  test('should adjust compression quality', async ({ page }) => {
    await page.goto('/');
    
    // Switch to custom mode
    const customModeButton = page.getByRole('button', { name: /custom mode/i });
    await customModeButton.click();
    
    // Find quality slider
    const qualitySlider = page.getByRole('slider', { name: /quality/i });
    
    // Adjust quality
    await qualitySlider.fill('50');
    
    // Check if value is updated
    await expect(page.getByText('50%')).toBeVisible();
  });

  test('should change output format', async ({ page }) => {
    await page.goto('/');
    
    // Switch to custom mode
    const customModeButton = page.getByRole('button', { name: /custom mode/i });
    await customModeButton.click();
    
    // Find format selector
    const formatSelect = page.getByRole('combobox', { name: /format/i });
    
    // Change format to PNG
    await formatSelect.selectOption('png');
    
    // Verify format is changed
    await expect(formatSelect).toHaveValue('png');
  });

  test('should handle multiple file upload', async ({ page }) => {
    await page.goto('/');
    
    // Create multiple test files
    const testImage1 = path.join(__dirname, 'fixtures', 'test-image1.jpg');
    const testImage2 = path.join(__dirname, 'fixtures', 'test-image2.jpg');
    
    // Upload multiple files
    const fileInput = page.getByRole('button', { name: /upload/i });
    await fileInput.setInputFiles([testImage1, testImage2]);
    
    // Wait for files to be processed
    await expect(page.getByText(/uploaded files/i)).toBeVisible();
    await expect(page.getByText('2')).toBeVisible();
  });

  test('should display compression results', async ({ page }) => {
    await page.goto('/');
    
    // Upload and compress an image
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
    const fileInput = page.getByRole('button', { name: /upload/i });
    await fileInput.setInputFiles(testImagePath);
    
    const compressButton = page.getByRole('button', { name: /compress/i });
    await compressButton.click();
    
    // Wait for results
    await expect(page.getByText(/completed/i)).toBeVisible({ timeout: 10000 });
    
    // Check if results are displayed
    await expect(page.getByText(/compression ratio/i)).toBeVisible();
    await expect(page.getByText(/download/i)).toBeVisible();
  });

  test('should download compressed images', async ({ page }) => {
    await page.goto('/');
    
    // Upload and compress an image
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
    const fileInput = page.getByRole('button', { name: /upload/i });
    await fileInput.setInputFiles(testImagePath);
    
    const compressButton = page.getByRole('button', { name: /compress/i });
    await compressButton.click();
    
    // Wait for results
    await expect(page.getByText(/completed/i)).toBeVisible({ timeout: 10000 });
    
    // Click download button
    const downloadButton = page.getByRole('button', { name: /download/i });
    await downloadButton.click();
    
    // Check if download starts (this will depend on the browser's download behavior)
    // In a real test, you might want to check the download folder or use a different approach
  });
});


