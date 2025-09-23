const fs = require('fs');

// 读取所有翻译文件
const languages = ['en', 'zh', 'ar', 'de', 'es', 'fr'];
const translations = {};

languages.forEach(lang => {
  try {
    const content = fs.readFileSync(`lib/translations/${lang}.json`, 'utf8');
    translations[lang] = JSON.parse(content);
  } catch (error) {
    console.log(`Error reading ${lang}.json:`, error.message);
    translations[lang] = {};
  }
});

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => current?.[key], obj);
}

const enKeys = getKeys(translations.en);
console.log('=== 翻译完整性分析 ===');
console.log(`英语参考键数量: ${enKeys.length}`);

console.log('\n=== 各语言完成度统计 ===');
languages.forEach(lang => {
  if (lang === 'en') return;
  
  const langKeys = getKeys(translations[lang]);
  const missingKeys = enKeys.filter(key => !langKeys.includes(key));
  const extraKeys = langKeys.filter(key => !enKeys.includes(key));
  
  console.log(`\n${lang.toUpperCase()}:`);
  console.log(`  总键数: ${langKeys.length}`);
  console.log(`  缺失键数: ${missingKeys.length}`);
  console.log(`  额外键数: ${extraKeys.length}`);
  console.log(`  完成度: ${((langKeys.length / enKeys.length) * 100).toFixed(1)}%`);
  
  // 按类别分组缺失的键
  const categories = {};
  missingKeys.forEach(key => {
    const category = key.split('.')[0];
    if (!categories[category]) categories[category] = [];
    categories[category].push(key);
  });
  
  console.log('  缺失类别统计:');
  Object.entries(categories)
    .sort(([,a], [,b]) => b.length - a.length)
    .forEach(([category, keys]) => {
      console.log(`    ${category}: ${keys.length} 键`);
    });
});

// 分析每个类别的优先级
console.log('\n=== 优先级分析 ===');
const allMissing = {};
languages.slice(1).forEach(lang => {
  const langKeys = getKeys(translations[lang]);
  const missingKeys = enKeys.filter(key => !langKeys.includes(key));
  
  missingKeys.forEach(key => {
    const category = key.split('.')[0];
    if (!allMissing[category]) allMissing[category] = 0;
    allMissing[category]++;
  });
});

console.log('各类别缺失键数统计 (按优先级排序):');
Object.entries(allMissing)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    const priority = count >= 4 ? '高' : count >= 2 ? '中' : '低';
    console.log(`  ${category}: ${count} 语言缺失 (${priority}优先级)`);
  });
