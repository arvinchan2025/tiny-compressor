import { test, expect } from '@playwright/test';

/**
 * 全站页面冒烟测试
 * 确保所有页面能正常加载，无JavaScript错误，翻译正常显示
 */

// 所有需要测试的页面
const pages = {
  home: '/',
  
  // 导航页
  compressorNav: '/compressor',
  converterNav: '/converter',
  
  // 压缩器功能页（6个）
  compressPng: '/compressor/compress-png',
  compressJpeg: '/compressor/compress-jpeg',
  compressWebp: '/compressor/compress-webp',
  compressAvif: '/compressor/compress-avif',
  compressGif: '/compressor/compress-gif',
  compressBmp: '/compressor/compress-bmp',
  
  // 转换器功能页（10个）
  pngToJpg: '/converter/convert-png-to-jpg',
  pngToWebp: '/converter/convert-png-to-webp',
  pngToAvif: '/converter/convert-png-to-avif',
  jpgToPng: '/converter/convert-jpg-to-png',
  jpgToWebp: '/converter/convert-jpg-to-webp',
  jpgToAvif: '/converter/convert-jpg-to-avif',
  webpToPng: '/converter/convert-webp-to-png',
  webpToJpg: '/converter/convert-webp-to-jpg',
  webpToAvif: '/converter/convert-webp-to-avif',
  heicToJpg: '/converter/convert-heic-to-jpg',
};

test.describe('全站页面冒烟测试', () => {
  // 测试每个页面
  Object.entries(pages).forEach(([name, url]) => {
    test(`${name} - 页面加载正常`, async ({ page }) => {
      // 监听控制台错误
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // 监听页面错误
      const pageErrors: Error[] = [];
      page.on('pageerror', (error) => {
        pageErrors.push(error);
      });

      // 访问页面
      const response = await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // 1. 检查HTTP状态
      expect(response?.status()).toBe(200);

      // 2. 检查页面标题存在
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);

      // 3. 检查没有JavaScript错误
      expect(pageErrors.length).toBe(0);
      
      // 4. 检查没有严重的控制台错误
      const criticalErrors = consoleErrors.filter(err => 
        err.includes('SyntaxError') || 
        err.includes('ReferenceError') ||
        err.includes('TypeError')
      );
      expect(criticalErrors.length).toBe(0);

      // 5. 检查主要内容元素存在
      const h1 = await page.locator('h1').first();
      await expect(h1).toBeVisible();

      // 6. 检查没有显示翻译key（如 "hero.title"）
      const h1Text = await h1.textContent();
      expect(h1Text).not.toContain('hero.');
      expect(h1Text).not.toContain('features.');
      expect(h1Text).not.toContain('operation.');
    });
  });
});

test.describe('导航页特定测试', () => {
  test('Compressor导航页 - 显示6个工具', async ({ page }) => {
    await page.goto('/compressor');
    
    // 检查工具卡片数量
    const toolCards = await page.locator('a[href*="/compressor/compress-"]').count();
    expect(toolCards).toBe(6);
    
    // 检查每个工具链接可点击
    const links = [
      '/compressor/compress-png',
      '/compressor/compress-jpeg',
      '/compressor/compress-webp',
      '/compressor/compress-avif',
      '/compressor/compress-gif',
      '/compressor/compress-bmp',
    ];
    
    for (const link of links) {
      const linkElement = await page.locator(`a[href="${link}"]`).first();
      await expect(linkElement).toBeVisible();
    }
  });

  test('Converter导航页 - 显示10个工具', async ({ page }) => {
    await page.goto('/converter');
    
    // 检查工具卡片数量
    const toolCards = await page.locator('a[href*="/converter/convert-"]').count();
    expect(toolCards).toBe(10);
    
    // 检查每个工具链接可点击
    const links = [
      '/converter/convert-png-to-jpg',
      '/converter/convert-png-to-webp',
      '/converter/convert-png-to-avif',
      '/converter/convert-jpg-to-png',
      '/converter/convert-jpg-to-webp',
      '/converter/convert-jpg-to-avif',
      '/converter/convert-webp-to-png',
      '/converter/convert-webp-to-jpg',
      '/converter/convert-webp-to-avif',
      '/converter/convert-heic-to-jpg',
    ];
    
    for (const link of links) {
      const linkElement = await page.locator(`a[href="${link}"]`).first();
      await expect(linkElement).toBeVisible();
    }
  });
});

test.describe('功能页特定测试', () => {
  test('压缩器功能页 - 包含所有必需sections', async ({ page }) => {
    await page.goto('/compressor/compress-png');
    
    // 检查必需的sections
    await expect(page.locator('h1')).toBeVisible(); // Hero
    await expect(page.locator('h2').filter({ hasText: /features/i }).first()).toBeVisible(); // Features
    await expect(page.locator('h2').filter({ hasText: /technical/i }).first()).toBeVisible(); // Technical Principles
    await expect(page.locator('h2').filter({ hasText: /use cases/i }).first()).toBeVisible(); // Use Cases
    await expect(page.locator('h2').filter({ hasText: /faq/i }).first()).toBeVisible(); // FAQ
  });

  test('转换器功能页 - 包含所有必需sections', async ({ page }) => {
    await page.goto('/converter/convert-png-to-jpg');
    
    // 检查必需的sections
    await expect(page.locator('h1')).toBeVisible(); // Hero
    await expect(page.locator('h2').filter({ hasText: /comparison/i }).first()).toBeVisible(); // Comparison
    await expect(page.locator('h2').filter({ hasText: /features/i }).first()).toBeVisible(); // Features
    await expect(page.locator('h2').filter({ hasText: /technical/i }).first()).toBeVisible(); // Technical Principles
    await expect(page.locator('h2').filter({ hasText: /use cases/i }).first()).toBeVisible(); // Use Cases
    await expect(page.locator('h2').filter({ hasText: /faq/i }).first()).toBeVisible(); // FAQ
  });
});

test.describe('UI一致性测试', () => {
  test('所有页面使用统一的Hero字体大小', async ({ page }) => {
    const pagesToTest = [
      '/',
      '/compressor',
      '/converter',
      '/compressor/compress-png',
      '/converter/convert-png-to-jpg',
    ];

    for (const url of pagesToTest) {
      await page.goto(url);
      const h1 = await page.locator('h1').first();
      
      // 检查h1存在且可见
      await expect(h1).toBeVisible();
      
      // 检查字体大小类（应该包含text-4xl或text-5xl）
      const className = await h1.getAttribute('class');
      expect(className).toMatch(/text-(4xl|5xl)/);
    }
  });

  test('所有导航页CTA Section使用渐变背景', async ({ page }) => {
    const navPages = ['/compressor', '/converter'];

    for (const url of navPages) {
      await page.goto(url);
      
      // 检查CTA section存在
      const ctaSection = await page.locator('section').filter({ 
        has: page.locator('h2').filter({ hasText: /ready|start|get/i })
      }).first();
      
      await expect(ctaSection).toBeVisible();
      
      // 检查渐变背景类
      const className = await ctaSection.getAttribute('class');
      expect(className).toContain('bg-gradient-to-r');
    }
  });
});

test.describe('翻译完整性测试', () => {
  test('所有页面没有显示翻译key', async ({ page }) => {
    const pagesToTest = Object.values(pages);

    for (const url of pagesToTest) {
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // 获取页面文本内容
      const bodyText = await page.locator('body').textContent();
      
      // 检查是否包含翻译key模式
      expect(bodyText).not.toContain('hero.title');
      expect(bodyText).not.toContain('hero.subtitle');
      expect(bodyText).not.toContain('features.items.');
      expect(bodyText).not.toContain('operation.upload.');
      expect(bodyText).not.toContain('technicalPrinciples.items.');
      expect(bodyText).not.toContain('useCases.items.');
      expect(bodyText).not.toContain('faq.items.');
    }
  });
});




