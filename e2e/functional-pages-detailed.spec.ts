import { test, expect } from '@playwright/test';

/**
 * 功能页详细测试
 * 测试每个压缩器和转换器页面的核心功能
 */

// 压缩器页面配置
const compressors = [
  { format: 'png', name: 'PNG', url: '/compressor/compress-png' },
  { format: 'jpeg', name: 'JPEG', url: '/compressor/compress-jpeg' },
  { format: 'webp', name: 'WebP', url: '/compressor/compress-webp' },
  { format: 'avif', name: 'AVIF', url: '/compressor/compress-avif' },
  { format: 'gif', name: 'GIF', url: '/compressor/compress-gif' },
  { format: 'bmp', name: 'BMP', url: '/compressor/compress-bmp' },
];

// 转换器页面配置
const converters = [
  { name: 'PNG to JPG', url: '/converter/convert-png-to-jpg', source: 'PNG', target: 'JPG' },
  { name: 'PNG to WebP', url: '/converter/convert-png-to-webp', source: 'PNG', target: 'WebP' },
  { name: 'PNG to AVIF', url: '/converter/convert-png-to-avif', source: 'PNG', target: 'AVIF' },
  { name: 'JPG to PNG', url: '/converter/convert-jpg-to-png', source: 'JPG', target: 'PNG' },
  { name: 'JPG to WebP', url: '/converter/convert-jpg-to-webp', source: 'JPG', target: 'WebP' },
  { name: 'JPG to AVIF', url: '/converter/convert-jpg-to-avif', source: 'JPG', target: 'AVIF' },
  { name: 'WebP to PNG', url: '/converter/convert-webp-to-png', source: 'WebP', target: 'PNG' },
  { name: 'WebP to JPG', url: '/converter/convert-webp-to-jpg', source: 'WebP', target: 'JPG' },
  { name: 'WebP to AVIF', url: '/converter/convert-webp-to-avif', source: 'WebP', target: 'AVIF' },
  { name: 'HEIC to JPG', url: '/converter/convert-heic-to-jpg', source: 'HEIC', target: 'JPG' },
];

test.describe('压缩器页面测试', () => {
  compressors.forEach(({ format, name, url }) => {
    test(`${name}压缩器 - 完整性检查`, async ({ page }) => {
      await page.goto(url);

      // 1. Hero Section
      const h1 = await page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text).toContain(name);

      // 2. Operation Section - 文件上传区域
      const uploadArea = await page.locator('text=/drag.*drop|select.*files/i').first();
      await expect(uploadArea).toBeVisible();

      // 3. Features Section
      const featuresTitle = await page.locator('h2').filter({ hasText: /features/i }).first();
      await expect(featuresTitle).toBeVisible();
      
      // 检查至少有6个feature items
      const featureCards = await page.locator('div').filter({ 
        has: page.locator('text=/lossless|quality|fast|secure|batch|free/i')
      }).count();
      expect(featureCards).toBeGreaterThanOrEqual(6);

      // 4. Technical Principles Section
      const techTitle = await page.locator('h2').filter({ hasText: /technical/i }).first();
      await expect(techTitle).toBeVisible();

      // 5. Use Cases Section
      const useCasesTitle = await page.locator('h2').filter({ hasText: /use cases|when.*use/i }).first();
      await expect(useCasesTitle).toBeVisible();

      // 6. FAQ Section
      const faqTitle = await page.locator('h2').filter({ hasText: /faq|questions/i }).first();
      await expect(faqTitle).toBeVisible();

      // 7. Quick Links Section
      const quickLinksTitle = await page.locator('h2').filter({ hasText: /quick links|related/i }).first();
      await expect(quickLinksTitle).toBeVisible();
    });
  });
});

test.describe('转换器页面测试', () => {
  converters.forEach(({ name, url, source, target }) => {
    test(`${name}转换器 - 完整性检查`, async ({ page }) => {
      await page.goto(url);

      // 1. Hero Section
      const h1 = await page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text).toContain(source);
      expect(h1Text).toContain(target);

      // 2. Operation Section - 文件上传区域
      const uploadArea = await page.locator('text=/drag.*drop|select.*files/i').first();
      await expect(uploadArea).toBeVisible();

      // 3. Comparison Section
      const comparisonTitle = await page.locator('h2').filter({ hasText: /comparison|vs/i }).first();
      await expect(comparisonTitle).toBeVisible();

      // 4. Features Section
      const featuresTitle = await page.locator('h2').filter({ hasText: /features/i }).first();
      await expect(featuresTitle).toBeVisible();

      // 5. Technical Principles Section
      const techTitle = await page.locator('h2').filter({ hasText: /technical/i }).first();
      await expect(techTitle).toBeVisible();

      // 6. Use Cases Section
      const useCasesTitle = await page.locator('h2').filter({ hasText: /use cases|when.*use/i }).first();
      await expect(useCasesTitle).toBeVisible();

      // 7. FAQ Section
      const faqTitle = await page.locator('h2').filter({ hasText: /faq|questions/i }).first();
      await expect(faqTitle).toBeVisible();

      // 8. Quick Links Section
      const quickLinksTitle = await page.locator('h2').filter({ hasText: /quick links|related/i }).first();
      await expect(quickLinksTitle).toBeVisible();
    });
  });
});

test.describe('UI一致性详细测试', () => {
  test('所有页面Hero Section样式一致', async ({ page }) => {
    const pagesToTest = [
      '/compressor',
      '/converter',
      '/compressor/compress-png',
      '/converter/convert-png-to-jpg',
    ];

    for (const url of pagesToTest) {
      await page.goto(url);
      
      // 检查Hero section背景
      const heroSection = await page.locator('section').first();
      const className = await heroSection.getAttribute('class');
      expect(className).toContain('bg-gradient-to-b');
      expect(className).toContain('from-gray-50');
    }
  });

  test('所有导航页工具卡片样式一致', async ({ page }) => {
    const navPages = ['/compressor', '/converter'];

    for (const url of navPages) {
      await page.goto(url);
      
      // 检查卡片样式
      const firstCard = await page.locator('a[href*="/compress-"], a[href*="/convert-"]').first();
      await expect(firstCard).toBeVisible();
      
      // 检查卡片有边框和圆角
      const cardDiv = await firstCard.locator('> div').first();
      const className = await cardDiv.getAttribute('class');
      expect(className).toContain('border');
      expect(className).toContain('rounded-lg');
    }
  });

  test('所有页面Section标题字体一致', async ({ page }) => {
    const pagesToTest = [
      '/compressor',
      '/converter',
      '/compressor/compress-png',
      '/converter/convert-png-to-jpg',
    ];

    for (const url of pagesToTest) {
      await page.goto(url);
      
      // 获取所有h2标题（排除h1）
      const h2Elements = await page.locator('h2').all();
      
      for (const h2 of h2Elements) {
        const className = await h2.getAttribute('class');
        // 应该包含text-2xl或text-3xl
        expect(className).toMatch(/text-(2xl|3xl)/);
      }
    }
  });
});

test.describe('性能测试', () => {
  test('所有页面加载时间 < 5秒', async ({ page }) => {
    const pagesToTest = [
      '/',
      '/compressor',
      '/converter',
      '/compressor/compress-png',
      '/converter/convert-png-to-jpg',
    ];

    for (const url of pagesToTest) {
      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
      console.log(`${url} 加载时间: ${loadTime}ms`);
    }
  });
});

test.describe('响应式测试', () => {
  test('移动端 - 导航页正常显示', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/converter');
    
    // 检查标题可见
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // 检查工具卡片可见（应该是单列布局）
    const firstCard = await page.locator('a[href*="/convert-"]').first();
    await expect(firstCard).toBeVisible();
  });

  test('平板端 - 导航页正常显示', async ({ page }) => {
    // 设置平板端视口
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/compressor');
    
    // 检查标题可见
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // 检查工具卡片可见（应该是2列布局）
    const cards = await page.locator('a[href*="/compress-"]').all();
    expect(cards.length).toBe(6);
  });
});

