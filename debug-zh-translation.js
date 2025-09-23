const fs = require('fs');

try {
  const zh = JSON.parse(fs.readFileSync('lib/translations/zh.json', 'utf8'));
  
  console.log('中文翻译文件结构分析:');
  
  // 检查是否有converter部分
  if (zh.converter) {
    console.log('✓ converter 部分存在');
    if (zh.converter.hero) {
      console.log('✓ converter.hero 部分存在');
      console.log('  converter.hero 键:', Object.keys(zh.converter.hero));
    } else {
      console.log('✗ converter.hero 部分缺失');
    }
    
    if (zh.converter.settings) {
      console.log('✓ converter.settings 部分存在');
    } else {
      console.log('✗ converter.settings 部分缺失');
    }
  } else {
    console.log('✗ converter 部分缺失');
  }
  
  // 检查是否有compressor部分
  if (zh.compressor) {
    console.log('✓ compressor 部分存在');
    if (zh.compressor.hero) {
      console.log('✓ compressor.hero 部分存在');
      console.log('  compressor.hero 键:', Object.keys(zh.compressor.hero));
    } else {
      console.log('✗ compressor.hero 部分缺失');
    }
  } else {
    console.log('✗ compressor 部分缺失');
  }
  
  // 统计总键数
  function countKeys(obj, prefix = '') {
    let count = 0;
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        count += countKeys(obj[key], prefix ? `${prefix}.${key}` : key);
      } else {
        count++;
      }
    }
    return count;
  }
  
  console.log(`\n中文翻译总键数: ${countKeys(zh)}`);
  
} catch (error) {
  console.log('错误:', error.message);
}
