import { test, expect } from '@playwright/test';

/**
 * 快速冒烟测试 - 5分钟内完成
 * 测试关键页面和核心功能
 */

test.describe('快速冒烟测试', () => {
  test('Home页面加载正常', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href*="/compressor"]')).toBeVisible();
    await expect(page.locator('a[href*="/converter"]')).toBeVisible();
  });

  test('Compressor导航页加载正常', async ({ page }) => {
    await page.goto('/compressor');
    await expect(page.locator('h1')).toBeVisible();
    
    // 检查6个压缩器链接
    const links = await page.locator('a[href*="/compressor/compress-"]').count();
    expect(links).toBe(6);
  });

  test('Converter导航页加载正常', async ({ page }) => {
    await page.goto('/converter');
    await expect(page.locator('h1')).toBeVisible();
    
    // 检查10个转换器链接
    const links = await page.locator('a[href*="/converter/convert-"]').count();
    expect(links).toBe(10);
  });

  test('PNG压缩器页面加载正常', async ({ page }) => {
    await page.goto('/compressor/compress-png');
    
    // 检查关键元素
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=/drag.*drop/i')).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /features/i })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /faq/i })).toBeVisible();
  });

  test('PNG to JPG转换器页面加载正常', async ({ page }) => {
    await page.goto('/converter/convert-png-to-jpg');
    
    // 检查关键元素
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=/drag.*drop/i')).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /comparison/i })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /features/i })).toBeVisible();
  });

  test('所有关键页面无JavaScript错误', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    const criticalPages = [
      '/',
      '/compressor',
      '/converter',
      '/compressor/compress-png',
      '/converter/convert-png-to-jpg',
    ];

    for (const url of criticalPages) {
      await page.goto(url, { waitUntil: 'networkidle' });
    }

    expect(errors.length).toBe(0);
  });

  test('所有关键页面无翻译key显示', async ({ page }) => {
    const criticalPages = [
      '/',
      '/compressor',
      '/converter',
      '/compressor/compress-png',
      '/converter/convert-png-to-jpg',
    ];

    for (const url of criticalPages) {
      await page.goto(url);
      const bodyText = await page.locator('body').textContent();
      
      // 不应该包含翻译key模式
      expect(bodyText).not.toMatch(/\w+\.\w+\.\w+/); // 如 "hero.title.something"
      expect(bodyText).not.toContain('items.');
    }
  });
});




