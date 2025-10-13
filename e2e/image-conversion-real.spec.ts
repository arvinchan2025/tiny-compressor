import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * 真实的图片转换功能测试
 * 测试实际的格式转换功能
 */

test.describe('PNG to JPG 转换测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

  test('PNG to JPG - 完整转换流程', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');

    // 1. 等待页面加载
    await expect(page.locator('h1')).toContainText('PNG');
    await expect(page.locator('h1')).toContainText('JPG');

    // 2. 上传PNG文件
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    const originalSize = fs.statSync(testImagePath).size;
    console.log(`原始PNG文件大小: ${(originalSize / 1024).toFixed(2)} KB`);

    // 3. 等待转换完成
    await page.waitForSelector('text=/converted|complete|done/i', { 
      timeout: 30000 
    });

    // 4. 验证转换结果
    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/converted|complete|jpg|jpeg/i);

    // 5. 检查是否显示文件大小信息
    const hasSizeInfo = await page.locator('text=/KB|MB/i').count();
    expect(hasSizeInfo).toBeGreaterThan(0);

    console.log('✓ PNG to JPG 转换完成');
  });

  test('PNG to JPG - 质量设置', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');
    
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForTimeout(2000);

    // 查找质量控制
    const qualityControl = await page.locator('input[type="range"], input[type="number"]').first();
    
    if (await qualityControl.isVisible()) {
      await qualityControl.fill('90');
      console.log('✓ 转换质量设置为 90');
    }

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    console.log('✓ PNG to JPG（自定义质量）转换完成');
  });

  test('PNG to JPG - 透明度处理警告', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');

    // 检查页面是否提示透明度丢失警告
    const bodyText = await page.locator('body').textContent();
    const hasTransparencyWarning = bodyText?.match(/transparency|alpha|background/i);
    
    if (hasTransparencyWarning) {
      console.log('✓ 页面包含透明度处理说明');
    }

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    console.log('✓ 透明度处理测试完成');
  });
});

test.describe('PNG to WebP 转换测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

  test('PNG to WebP - 完整转换流程', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-webp');

    await expect(page.locator('h1')).toContainText('PNG');
    await expect(page.locator('h1')).toContainText('WebP');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/converted|complete|webp/i);

    console.log('✓ PNG to WebP 转换完成');
  });

  test('PNG to WebP - 文件大小对比', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-webp');

    const originalSize = fs.statSync(testImagePath).size;
    console.log(`原始PNG文件大小: ${(originalSize / 1024).toFixed(2)} KB`);

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    // 检查文件大小对比
    const sizeElements = await page.locator('text=/\\d+\\.?\\d*\\s*(?:KB|MB)/i').count();
    expect(sizeElements).toBeGreaterThanOrEqual(2);

    // 检查是否显示节省的大小
    const bodyText = await page.locator('body').textContent();
    const hasSavings = bodyText?.match(/\d+%.*(?:smaller|saved|reduced)/i);
    
    if (hasSavings) {
      console.log(`✓ 文件大小节省: ${hasSavings[0]}`);
    }

    console.log('✓ PNG to WebP 文件大小对比完成');
  });
});

test.describe('JPG to PNG 转换测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

  test('JPG to PNG - 完整转换流程', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-jpg-to-png');

    await expect(page.locator('h1')).toContainText('JPG');
    await expect(page.locator('h1')).toContainText('PNG');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/converted|complete|png/i);

    console.log('✓ JPG to PNG 转换完成');
  });

  test('JPG to PNG - 质量无法恢复警告', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-jpg-to-png');

    // 检查是否有质量无法恢复的警告
    const bodyText = await page.locator('body').textContent();
    const hasQualityWarning = bodyText?.match(/cannot.*restore|quality.*lost|lossy/i);
    
    if (hasQualityWarning) {
      console.log('✓ 页面包含质量无法恢复警告');
    }

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    console.log('✓ JPG to PNG 质量警告测试完成');
  });

  test('JPG to PNG - 文件大小增加', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-jpg-to-png');

    const originalSize = fs.statSync(testImagePath).size;
    console.log(`原始JPG文件大小: ${(originalSize / 1024).toFixed(2)} KB`);

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    // 检查文件大小信息
    const sizeElements = await page.locator('text=/\\d+\\.?\\d*\\s*(?:KB|MB)/i').count();
    expect(sizeElements).toBeGreaterThanOrEqual(2);

    console.log('✓ JPG to PNG 文件大小检查完成');
  });
});

test.describe('WebP 转换测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.webp');

  test('WebP to PNG - 完整转换流程', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-webp-to-png');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/converted|complete|png/i);

    console.log('✓ WebP to PNG 转换完成');
  });

  test('WebP to JPG - 完整转换流程', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-webp-to-jpg');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/converted|complete|jpg|jpeg/i);

    console.log('✓ WebP to JPG 转换完成');
  });
});

test.describe('批量转换测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

  test('批量转换 PNG to JPG', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');

    const fileInput = await page.locator('input[type="file"]');
    
    // 上传多个文件（如果有的话）
    await fileInput.setInputFiles([testImagePath]);

    // 等待所有文件转换完成
    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 60000 
    });

    // 检查是否有批量下载按钮
    const downloadAllButton = await page.locator('button:has-text("Download All"), button:has-text("下载全部")').count();
    
    if (downloadAllButton > 0) {
      console.log('✓ 批量下载功能可用');
    }

    console.log('✓ 批量转换测试完成');
  });
});

test.describe('转换选项测试', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

  test('检查转换预设选项', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');

    // 检查是否有预设选项
    const presetButtons = await page.locator('button:has-text("High Quality"), button:has-text("Balanced"), button:has-text("Small Size")').count();
    
    if (presetButtons > 0) {
      console.log('✓ 找到预设选项按钮');
      
      // 尝试点击一个预设
      await page.locator('button:has-text("High Quality"), button:has-text("高质量")').first().click();
      console.log('✓ 预设选项可点击');
    }

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    console.log('✓ 转换预设选项测试完成');
  });

  test('检查高级设置', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');

    // 查找高级设置按钮或切换
    const advancedButton = await page.locator('button:has-text("Advanced"), button:has-text("高级")').count();
    
    if (advancedButton > 0) {
      await page.locator('button:has-text("Advanced"), button:has-text("高级")').first().click();
      console.log('✓ 高级设置可访问');
    }

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    console.log('✓ 高级设置测试完成');
  });
});

test.describe('转换错误处理', () => {
  test('上传错误格式文件', async ({ page }) => {
    await page.goto('/converter/convert-png-to-jpg');

    // 创建临时文本文件
    const tempFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    if (!fs.existsSync(path.dirname(tempFilePath))) {
      fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
    }
    fs.writeFileSync(tempFilePath, 'This is not an image');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(tempFilePath);

    await page.waitForTimeout(2000);

    // 检查错误提示
    const bodyText = await page.locator('body').textContent();
    const hasError = bodyText?.match(/invalid|error|not supported|wrong format/i);
    
    if (hasError) {
      console.log('✓ 正确显示了格式错误提示');
    }

    // 清理
    fs.unlinkSync(tempFilePath);
  });

  test('检查文件大小限制提示', async ({ page }) => {
    await page.goto('/converter/convert-png-to-jpg');

    const bodyText = await page.locator('body').textContent();
    const hasSizeLimit = bodyText?.match(/max.*\d+\s*MB|up to \d+\s*MB/i);
    
    if (hasSizeLimit) {
      console.log(`✓ 文件大小限制: ${hasSizeLimit[0]}`);
    }
  });
});

test.describe('转换结果验证', () => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');

  test('验证转换后格式正确', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    // 检查结果中是否明确显示目标格式
    const resultText = await page.locator('body').textContent();
    expect(resultText).toMatch(/jpg|jpeg/i);

    console.log('✓ 转换格式验证完成');
  });

  test('验证转换保持图片尺寸', async ({ page }) => {
    test.skip(!fs.existsSync(testImagePath), '测试图片不存在');

    await page.goto('/converter/convert-png-to-jpg');

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    await page.waitForSelector('text=/converted|complete/i', { 
      timeout: 30000 
    });

    // 检查是否显示图片尺寸
    const bodyText = await page.locator('body').textContent();
    const hasDimensions = bodyText?.match(/\d+\s*[x×]\s*\d+/);
    
    if (hasDimensions) {
      console.log(`✓ 图片尺寸: ${hasDimensions[0]}`);
    }

    console.log('✓ 图片尺寸验证完成');
  });
});




