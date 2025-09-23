const fs = require('fs');

// 读取英文和中文翻译文件
const en = JSON.parse(fs.readFileSync('lib/translations/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('lib/translations/zh.json', 'utf8'));

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

const enKeys = getKeys(en);
const zhKeys = getKeys(zh);
const missingKeys = enKeys.filter(key => !zhKeys.includes(key));

console.log('中文翻译缺失的键值:');
console.log(`总计缺失: ${missingKeys.length} 键\n`);

// 按类别分组
const categories = {};
missingKeys.forEach(key => {
  const category = key.split('.')[0];
  if (!categories[category]) categories[category] = [];
  categories[category].push(key);
});

Object.entries(categories).forEach(([category, keys]) => {
  console.log(`\n=== ${category.toUpperCase()} (${keys.length} 键) ===`);
  keys.slice(0, 20).forEach(key => {
    const value = getValue(en, key);
    console.log(`${key}: "${value}"`);
  });
  if (keys.length > 20) {
    console.log(`... 还有 ${keys.length - 20} 个键`);
  }
});
