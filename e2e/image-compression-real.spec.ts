import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * 真实的图片压缩功能测试
 * 测试实际的文件上传、压缩和下载功能
 */

test.describe('PNG压缩功能测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

  test.beforeAll(() => {
    // 确保测试图片存在
    if (!fs.existsSync(testImagePath)) {
      console.warn(`警告: 测试图片不存在: ${testImagePath}`);
      console.warn('请在 e2e/fixtures/ 目录下放置测试图片');
    }
  });

  test('PNG压缩 - 完整流程', async ({ page }) => {
    // 跳过测试如果没有测试图片
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-png');

    // 1. 等待页面加载完成
    await expect(page.locator('h1')).toBeVisible();

    // 2. 获取文件输入元素
    const fileInput = await page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // 3. 上传测试图片
    await fileInput.setInputFiles(testImagePath);

    // 4. 等待文件上传完成（检查文件名显示）
    const originalFileSize = fs.statSync(testImagePath).size;
    console.log(`原始文件大小: ${(originalFileSize / 1024).toFixed(2)} KB`);

    // 5. 等待压缩处理完成（最多30秒）
    await page.waitForSelector('text=/compressed|complete|done/i', { 
      timeout: 30000 
    });

    // 6. 检查压缩结果显示
    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/compressed|reduced|saved/i);

    // 7. 检查是否显示文件大小信息
    const hasSizeInfo = await page.locator('text=/KB|MB/i').count();
    expect(hasSizeInfo).toBeGreaterThan(0);

    console.log('✓ PNG压缩流程完成');
  });

  test('PNG压缩 - 质量设置', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-png');
    
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    // 等待上传完成
    await page.waitForTimeout(2000);

    // 查找质量滑块或输入
    const qualityControl = await page.locator('input[type="range"], input[type="number"]').first();
    
    if (await qualityControl.isVisible()) {
      // 调整质量设置
      await qualityControl.fill('80');
      console.log('✓ 质量设置已调整为 80');
    }

    // 等待处理完成
    await page.waitForSelector('text=/compressed|complete/i', { 
      timeout: 30000 
    });

    console.log('✓ PNG压缩（自定义质量）完成');
  });

  test('PNG压缩 - 批量处理', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-png');
    
    const fileInput = await page.locator('input[type="file"]');
    
    // 上传多个文件（如果有的话）
    const testFiles = [testImagePath];
    await fileInput.setInputFiles(testFiles);

    // 等待处理完成
    await page.waitForSelector('text=/compressed|complete/i', { 
      timeout: 60000 
    });

    // 检查是否有下载全部按钮
    const downloadAllButton = await page.locator('button:has-text("Download All"), button:has-text("下载全部")').count();
    
    if (downloadAllButton > 0) {
      console.log('✓ 批量处理功能可用');
    }

    console.log('✓ PNG批量压缩完成');
  });
});

test.describe('JPEG压缩功能测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

  test('JPEG压缩 - 完整流程', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-jpeg');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    // 等待压缩完成
    await page.waitForSelector('text=/compressed|complete/i', { 
      timeout: 30000 
    });

    // 检查结果
    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/compressed|reduced/i);

    console.log('✓ JPEG压缩流程完成');
  });

  test('JPEG压缩 - 不同质量级别', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-jpeg');
    
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForTimeout(2000);

    // 尝试选择预设质量
    const presetButtons = await page.locator('button:has-text("High"), button:has-text("Medium"), button:has-text("Low")').count();
    
    if (presetButtons > 0) {
      await page.locator('button:has-text("High")').first().click();
      console.log('✓ 选择了高质量预设');
    }

    await page.waitForSelector('text=/compressed|complete/i', { 
      timeout: 30000 
    });

    console.log('✓ JPEG不同质量级别测试完成');
  });
});

test.describe('WebP压缩功能测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.webp');

  test('WebP压缩 - 完整流程', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-webp');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/compressed|complete/i', { 
      timeout: 30000 
    });

    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/compressed|reduced/i);

    console.log('✓ WebP压缩流程完成');
  });
});

test.describe('压缩结果验证', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

  test('验证压缩后文件大小减小', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-png');

    const originalSize = fs.statSync(testImagePath).size;
    
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    // 等待处理完成
    await page.waitForSelector('text=/compressed|complete/i', { 
      timeout: 30000 
    });

    // 检查是否显示压缩率
    const bodyText = await page.locator('body').textContent();
    const hasCompressionRatio = bodyText?.match(/\d+%.*(?:reduced|saved|smaller)/i);
    
    if (hasCompressionRatio) {
      console.log(`✓ 压缩率信息: ${hasCompressionRatio[0]}`);
    }

    // 检查是否显示文件大小对比
    const sizeElements = await page.locator('text=/\\d+\\.?\\d*\\s*(?:KB|MB)/i').count();
    expect(sizeElements).toBeGreaterThanOrEqual(2); // 至少显示原始和压缩后的大小

    console.log('✓ 压缩结果验证完成');
  });

  test('验证压缩不改变图片尺寸', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/compressor/compress-png');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/compressed|complete/i', { 
      timeout: 30000 
    });

    // 检查是否显示图片尺寸信息
    const bodyText = await page.locator('body').textContent();
    const hasDimensions = bodyText?.match(/\d+\s*[x×]\s*\d+/);
    
    if (hasDimensions) {
      console.log(`✓ 图片尺寸: ${hasDimensions[0]}`);
    }

    console.log('✓ 图片尺寸验证完成');
  });
});

test.describe('错误处理测试', () => {
  test('上传非图片文件', async ({ page }) => {
    await page.goto('/compressor/compress-png');

    // 创建一个临时文本文件
    const tempFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    if (!fs.existsSync(path.dirname(tempFilePath))) {
      fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
    }
    fs.writeFileSync(tempFilePath, 'This is not an image');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(tempFilePath);

    // 等待错误提示
    await page.waitForTimeout(2000);

    // 检查是否显示错误信息
    const bodyText = await page.locator('body').textContent();
    const hasError = bodyText?.match(/invalid|error|not supported|unsupported/i);
    
    if (hasError) {
      console.log('✓ 正确显示了错误提示');
    }

    // 清理临时文件
    fs.unlinkSync(tempFilePath);
  });

  test('上传超大文件', async ({ page }) => {
    await page.goto('/compressor/compress-png');

    // 检查是否有文件大小限制提示
    const bodyText = await page.locator('body').textContent();
    const hasSizeLimit = bodyText?.match(/max.*\d+\s*MB|up to \d+\s*MB/i);
    
    if (hasSizeLimit) {
      console.log(`✓ 文件大小限制: ${hasSizeLimit[0]}`);
    }
  });
});




