/**
 * 分析翻译文件大小
 * 帮助理解优化潜力
 */

const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '../lib/i18n/translations');
const languages = ['en', 'zh', 'es', 'de', 'fr', 'ar', 'ja', 'ko', 'pt', 'ru', 'it'];

console.log('📊 Translation Files Analysis\n');
console.log('='.repeat(80));

let totalSize = 0;
const languageSizes = {};
const moduleSizes = {};

// 分析每种语言
languages.forEach(lang => {
  const langDir = path.join(translationsDir, lang);
  
  if (!fs.existsSync(langDir)) {
    console.log(`⚠️  ${lang}: Directory not found`);
    return;
  }
  
  let langSize = 0;
  const modules = [];
  
  // 递归读取所有 JSON 文件
  function scanDir(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath, prefix ? `${prefix}/${item}` : item);
      } else if (item.endsWith('.json')) {
        const size = stat.size;
        const moduleName = prefix ? `${prefix}/${item.replace('.json', '')}` : item.replace('.json', '');
        
        langSize += size;
        modules.push({ name: moduleName, size });
        
        // 记录模块大小
        if (!moduleSizes[moduleName]) {
          moduleSizes[moduleName] = 0;
        }
        moduleSizes[moduleName] += size;
      }
    });
  }
  
  scanDir(langDir);
  
  languageSizes[lang] = { size: langSize, modules: modules.length };
  totalSize += langSize;
  
  console.log(`${lang.toUpperCase()}: ${(langSize / 1024).toFixed(2)} KB (${modules.length} modules)`);
});

console.log('='.repeat(80));
console.log(`\n📦 Total Size: ${(totalSize / 1024).toFixed(2)} KB (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
console.log(`📊 Average per language: ${(totalSize / languages.length / 1024).toFixed(2)} KB`);

// 显示最大的模块
console.log('\n🔍 Top 10 Largest Modules (across all languages):\n');
const sortedModules = Object.entries(moduleSizes)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

sortedModules.forEach(([module, size], index) => {
  console.log(`${index + 1}. ${module}: ${(size / 1024).toFixed(2)} KB`);
});

// 计算优化潜力
console.log('\n💡 Optimization Potential:\n');
console.log(`Current: All ${(totalSize / 1024 / 1024).toFixed(2)} MB loaded upfront`);
console.log(`Optimized (1 language): ~${(totalSize / languages.length / 1024).toFixed(2)} KB per language`);
console.log(`Savings: ~${((totalSize - totalSize / languages.length) / 1024 / 1024).toFixed(2)} MB (-${((1 - 1/languages.length) * 100).toFixed(1)}%)`);

// 按需加载估算
const avgModuleSize = totalSize / Object.keys(moduleSizes).length;
console.log(`\nWith lazy loading (1 language, 3 modules on initial load):`);
console.log(`Initial load: ~${(avgModuleSize * 3 / 1024).toFixed(2)} KB`);
console.log(`Savings vs current: ~${((totalSize - avgModuleSize * 3) / 1024 / 1024).toFixed(2)} MB (-${((1 - avgModuleSize * 3 / totalSize) * 100).toFixed(1)}%)`);

console.log('\n' + '='.repeat(80));



