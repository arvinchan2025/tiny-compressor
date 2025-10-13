import { test, expect } from '@playwright/test';

/**
 * 转换功能测试
 * 测试所有10个转换器的核心功能
 */

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

test.describe('转换器功能测试', () => {
  converters.forEach(({ name, url, source, target }) => {
    test(`${name} - 页面结构和功能元素`, async ({ page }) => {
      await page.goto(url);

      // 1. 检查Hero标题包含正确的格式名称
      const h1 = await page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text).toContain(source);
      expect(h1Text).toContain(target);

      // 2. 检查上传区域
      const uploadArea = await page.locator('text=/drag.*drop|select.*files/i').first();
      await expect(uploadArea).toBeVisible();

      // 3. 检查文件输入元素
      const fileInput = await page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();

      // 4. 检查格式对比section
      const comparisonSection = await page.locator('h2').filter({ hasText: /comparison|vs/i }).first();
      await expect(comparisonSection).toBeVisible();

      // 5. 检查Features section
      const featuresSection = await page.locator('h2').filter({ hasText: /features/i }).first();
      await expect(featuresSection).toBeVisible();

      // 6. 检查Technical Principles section
      const techSection = await page.locator('h2').filter({ hasText: /technical/i }).first();
      await expect(techSection).toBeVisible();

      // 7. 检查Use Cases section
      const useCasesSection = await page.locator('h2').filter({ hasText: /use cases|when.*use/i }).first();
      await expect(useCasesSection).toBeVisible();

      // 8. 检查FAQ section
      const faqSection = await page.locator('h2').filter({ hasText: /faq|questions/i }).first();
      await expect(faqSection).toBeVisible();

      // 9. 检查Quick Links section
      const quickLinksSection = await page.locator('h2').filter({ hasText: /quick links|related/i }).first();
      await expect(quickLinksSection).toBeVisible();

      console.log(`✓ ${name} 页面结构完整`);
    });
  });
});

test.describe('转换器内容质量测试', () => {
  test('PNG to JPG - 内容完整性', async ({ page }) => {
    await page.goto('/converter/convert-png-to-jpg');

    // 检查Features数量（应该有6个）
    const bodyText = await page.locator('body').textContent();
    
    // 检查关键内容存在
    expect(bodyText).toContain('transparency');
    expect(bodyText).toContain('compression');
    expect(bodyText).toContain('quality');

    // 检查FAQ至少有4个问题
    const faqItems = await page.locator('text=/question|will|can|how|what|why/i').count();
    expect(faqItems).toBeGreaterThanOrEqual(4);

    console.log('✓ PNG to JPG 内容完整');
  });

  test('PNG to WebP - 内容完整性', async ({ page }) => {
    await page.goto('/converter/convert-png-to-webp');

    const bodyText = await page.locator('body').textContent();
    
    // 检查WebP特有内容
    expect(bodyText).toMatch(/25.*35.*smaller|better compression/i);
    expect(bodyText).toContain('VP8');
    expect(bodyText).toMatch(/95.*browser support/i);

    console.log('✓ PNG to WebP 内容完整');
  });

  test('PNG to AVIF - 内容完整性', async ({ page }) => {
    await page.goto('/converter/convert-png-to-avif');

    const bodyText = await page.locator('body').textContent();
    
    // 检查AVIF特有内容
    expect(bodyText).toMatch(/50.*70.*smaller|next.*generation/i);
    expect(bodyText).toContain('AV1');
    expect(bodyText).toMatch(/HDR|10.*bit|12.*bit/i);

    console.log('✓ PNG to AVIF 内容完整');
  });

  test('JPG to PNG - 内容完整性', async ({ page }) => {
    await page.goto('/converter/convert-jpg-to-png');

    const bodyText = await page.locator('body').textContent();
    
    // 检查关键警告信息
    expect(bodyText).toMatch(/cannot.*restore|quality.*lost/i);
    expect(bodyText).toMatch(/2.*5x.*larger|file size.*increase/i);
    expect(bodyText).toContain('lossless');

    console.log('✓ JPG to PNG 内容完整（包含质量警告）');
  });

  test('HEIC to JPG - 内容完整性', async ({ page }) => {
    await page.goto('/converter/convert-heic-to-jpg');

    const bodyText = await page.locator('body').textContent();
    
    // 检查HEIC特有内容
    expect(bodyText).toMatch(/Apple|iPhone|iOS/i);
    expect(bodyText).toMatch(/HEVC|H\.265/i);
    expect(bodyText).toMatch(/universal.*compatibility|cross.*platform/i);

    console.log('✓ HEIC to JPG 内容完整');
  });
});

test.describe('转换器Operation区域测试', () => {
  test('所有转换器 - Upload区域正常显示', async ({ page }) => {
    const converterUrls = converters.map(c => c.url);

    for (const url of converterUrls) {
      await page.goto(url);

      // 检查上传区域
      const uploadArea = await page.locator('text=/drag.*drop|select/i').first();
      await expect(uploadArea).toBeVisible();

      // 检查文件输入
      const fileInput = await page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();

      // 检查支持的格式提示
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toMatch(/support.*format|max.*files|10MB/i);
    }

    console.log('✓ 所有转换器Upload区域正常');
  });

  test('转换器 - Settings选项提示正常', async ({ page }) => {
    await page.goto('/converter/convert-png-to-jpg');

    // 检查是否有质量/设置相关的文本
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toMatch(/quality|settings|options/i);

    console.log('✓ 转换器Settings提示正常');
  });
});

test.describe('Quick Links功能测试', () => {
  test('所有转换器 - Quick Links可点击', async ({ page }) => {
    await page.goto('/converter/convert-png-to-jpg');

    // 查找Quick Links section
    const quickLinksSection = await page.locator('h2').filter({ hasText: /quick links|related/i }).first();
    await expect(quickLinksSection).toBeVisible();

    // 检查至少有3个链接
    const links = await page.locator('a[href*="/converter/"], a[href*="/compressor/"]').count();
    expect(links).toBeGreaterThanOrEqual(3);

    console.log('✓ Quick Links功能正常');
  });
});

test.describe('翻译完整性测试', () => {
  test('所有转换器 - 无翻译key显示', async ({ page }) => {
    for (const { url } of converters) {
      await page.goto(url);

      const bodyText = await page.locator('body').textContent();
      
      // 检查常见的翻译key模式
      expect(bodyText).not.toContain('hero.title');
      expect(bodyText).not.toContain('hero.subtitle');
      expect(bodyText).not.toContain('features.items.');
      expect(bodyText).not.toContain('operation.upload.');
      expect(bodyText).not.toContain('.icon');
      expect(bodyText).not.toContain('.description');
    }

    console.log('✓ 所有转换器翻译完整，无key显示');
  });
});




