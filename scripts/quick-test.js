#!/usr/bin/env node

/**
 * 快速功能测试脚本
 * 验证翻译系统和核心功能是否正常
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

// 测试页面列表
const testPages = [
  { name: 'PNG Compressor (EN)', url: '/en/compressor/compress-png' },
  { name: 'PNG Compressor (ZH)', url: '/zh/compressor/compress-png' },
  { name: 'PNG Compressor (JA)', url: '/ja/compressor/compress-png' },
  { name: 'Translation Debug', url: '/en/translation-test' },
  { name: 'Home Page', url: '/en' },
];

// 测试函数
async function testPage(name, path) {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const isSuccess = res.statusCode === 200;
        const hasContent = data.length > 1000; // 基本内容检查
        const hasError = data.includes('Error') || data.includes('error');
        
        resolve({
          name,
          url: `${BASE_URL}${path}`,
          status: res.statusCode,
          success: isSuccess && hasContent && !hasError,
          size: data.length,
          hasError
        });
      });
    });
    
    req.on('error', () => {
      resolve({
        name,
        url: `${BASE_URL}${path}`,
        status: 'ERROR',
        success: false,
        size: 0,
        hasError: true
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        name,
        url: `${BASE_URL}${path}`,
        status: 'TIMEOUT',
        success: false,
        size: 0,
        hasError: true
      });
    });
  });
}

// 主测试函数
async function runTests() {
  console.log('🧪 快速功能测试开始...\n');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const page of testPages) {
    console.log(`测试: ${page.name}`);
    const result = await testPage(page.name, page.url);
    results.push(result);
    
    const status = result.success ? '✅ 通过' : '❌ 失败';
    console.log(`结果: ${status} (状态: ${result.status}, 大小: ${result.size} 字节)`);
    
    if (!result.success) {
      console.log(`URL: ${result.url}`);
      if (result.hasError) {
        console.log('⚠️  页面可能包含错误信息');
      }
    }
    console.log('');
  }
  
  // 总结
  console.log('='.repeat(60));
  console.log('📊 测试总结:');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`总计: ${total} 个页面`);
  console.log(`通过: ${passed} 个页面`);
  console.log(`失败: ${total - passed} 个页面`);
  console.log(`成功率: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('\n🎉 所有测试通过！系统运行正常。');
  } else {
    console.log('\n⚠️  部分测试失败，请检查失败的页面。');
    
    const failed = results.filter(r => !r.success);
    console.log('\n失败的页面:');
    failed.forEach(f => {
      console.log(`- ${f.name}: ${f.url}`);
    });
  }
  
  console.log('\n💡 手动测试建议:');
  console.log('1. 访问 http://localhost:3001/en/compressor/compress-png');
  console.log('2. 检查页面布局和翻译是否正确');
  console.log('3. 测试文件上传功能');
  console.log('4. 测试多语言切换');
  console.log('5. 检查浏览器控制台是否有错误');
}

// 运行测试
runTests().catch(console.error);



