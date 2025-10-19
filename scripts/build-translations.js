#!/usr/bin/env node
/**
 * Build Translations Script
 * 
 * 这个脚本会自动读取所有翻译 JSON 文件并生成 generated.ts
 * 确保开发时和构建时翻译都是最新的
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '..', 'lib', 'i18n', 'translations');
const OUTPUT_FILE = path.join(__dirname, '..', 'lib', 'translations', 'generated.ts');

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'de', 'fr', 'ar', 'ja', 'ko', 'pt', 'ru', 'it'];

console.log('🔨 Building translations from JSON files...');

/**
 * 递归读取目录中的所有 JSON 文件
 */
function readTranslationsRecursive(dir, locale, basePath = '') {
  const result = {};
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归读取子目录
      const subTranslations = readTranslationsRecursive(fullPath, locale, basePath ? `${basePath}/${item}` : item);
      Object.assign(result, subTranslations);
    } else if (item.endsWith('.json') && !item.includes('optimized') && !item.includes('backup')) {
      // 读取 JSON 文件
      const moduleName = basePath ? `${basePath}/${item.replace('.json', '')}` : item.replace('.json', '');
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(content);
        result[moduleName] = data;
      } catch (error) {
        console.warn(`⚠️  Failed to parse ${locale}/${moduleName}: ${error.message}`);
      }
    }
  }

  return result;
}

/**
 * 生成 TypeScript 文件内容
 */
function generateTypeScriptContent(allTranslations) {
  const timestamp = new Date().toISOString();
  
  // 获取所有支持的模块
  const supportedModules = [];
  const firstLocale = Object.keys(allTranslations)[0];
  if (firstLocale && allTranslations[firstLocale]) {
    supportedModules.push(...Object.keys(allTranslations[firstLocale]));
  }
  
  let content = `// Auto-generated translation file\n`;
  content += `// Do not modify this file manually\n`;
  content += `// Generated at: ${timestamp}\n\n`;
  content += `export const translations = `;
  
  // 使用更安全的JSON序列化方式
  try {
    const jsonString = JSON.stringify(allTranslations, null, 2);
    content += jsonString;
  } catch (error) {
    console.error('❌ Failed to stringify translations:', error.message);
    // 如果失败，尝试逐个语言序列化
    content += '{\n';
    const locales = Object.keys(allTranslations);
    for (let i = 0; i < locales.length; i++) {
      const locale = locales[i];
      content += `  "${locale}": `;
      try {
        content += JSON.stringify(allTranslations[locale], null, 2);
      } catch (localeError) {
        console.error(`❌ Failed to stringify ${locale}:`, localeError.message);
        content += '{}';
      }
      if (i < locales.length - 1) {
        content += ',';
      }
      content += '\n';
    }
    content += '}';
  }
  
  content += `\n\n`;
  content += `export const supportedModules = `;
  content += JSON.stringify(supportedModules, null, 2);
  content += `\n`;

  return content;
}

/**
 * 主函数
 */
function buildTranslations() {
  const allTranslations = {};

  // 遍历所有语言
  for (const locale of LOCALES) {
    const localePath = path.join(TRANSLATIONS_DIR, locale);
    
    if (!fs.existsSync(localePath)) {
      console.warn(`⚠️  Locale directory not found: ${locale}`);
      continue;
    }

    console.log(`📖 Reading ${locale} translations...`);
    allTranslations[locale] = readTranslationsRecursive(localePath, locale);
    
    const moduleCount = Object.keys(allTranslations[locale]).length;
    console.log(`   ✓ Loaded ${moduleCount} modules for ${locale}`);
    
    // 调试信息：检查compressorNavigation.tools
    if (allTranslations[locale]['common/navigation'] && allTranslations[locale]['common/navigation'].compressorNavigation) {
      const hasTools = 'tools' in allTranslations[locale]['common/navigation'].compressorNavigation;
      const hasSections = 'sections' in allTranslations[locale]['common/navigation'].compressorNavigation;
      const hasToolsSection = 'toolsSection' in allTranslations[locale]['common/navigation'].compressorNavigation;
      console.log(`   🔍 compressorNavigation: tools=${hasTools}, sections=${hasSections}, toolsSection=${hasToolsSection}`);
    }
  }

  // 生成 TypeScript 文件
  console.log('\n📝 Generating TypeScript file...');
  const tsContent = generateTypeScriptContent(allTranslations);
  
  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
  
  // 统计信息
  const fileSize = (tsContent.length / 1024).toFixed(2);
  const lineCount = tsContent.split('\n').length;
  
  console.log(`\n✅ Translation file generated successfully!`);
  console.log(`   Location: lib/translations/generated.ts`);
  console.log(`   Size: ${fileSize} KB`);
  console.log(`   Lines: ${lineCount}`);
  console.log(`   Locales: ${LOCALES.length}`);
  
  // 显示每个语言的模块数
  console.log(`\n📊 Modules per locale:`);
  for (const locale of LOCALES) {
    const count = Object.keys(allTranslations[locale] || {}).length;
    console.log(`   ${locale}: ${count} modules`);
  }
}

// 运行构建
try {
  buildTranslations();
  process.exit(0);
} catch (error) {
  console.error('\n❌ Failed to build translations:', error.message);
  console.error(error.stack);
  process.exit(1);
}

