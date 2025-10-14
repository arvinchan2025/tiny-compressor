#!/usr/bin/env node
/**
 * Watch Translations Script
 * 
 * 监听翻译 JSON 文件的变化，自动重新生成 generated.ts
 * 用于开发环境，确保翻译实时更新
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const TRANSLATIONS_DIR = path.join(__dirname, '..', 'lib', 'i18n', 'translations');
const BUILD_SCRIPT = path.join(__dirname, 'build-translations.js');

console.log('👀 Watching translation files for changes...');
console.log(`📁 Watching: ${TRANSLATIONS_DIR}`);

let buildTimeout = null;
let isBuilding = false;

/**
 * 执行构建
 */
function buildTranslations() {
  if (isBuilding) {
    console.log('⏳ Build already in progress, skipping...');
    return;
  }

  isBuilding = true;
  console.log('\n🔄 Translation files changed, rebuilding...');
  
  exec(`node "${BUILD_SCRIPT}"`, (error, stdout, stderr) => {
    isBuilding = false;
    
    if (error) {
      console.error('❌ Build failed:', error.message);
      return;
    }
    
    if (stderr) {
      console.error('stderr:', stderr);
    }
    
    // 只输出关键信息，不输出完整的构建日志
    const lines = stdout.split('\n');
    const successLine = lines.find(line => line.includes('✅'));
    const sizeLine = lines.find(line => line.includes('Size:'));
    const linesLine = lines.find(line => line.includes('Lines:'));
    
    if (successLine) {
      console.log(successLine);
      if (sizeLine) console.log('  ', sizeLine.trim());
      if (linesLine) console.log('  ', linesLine.trim());
    }
    
    console.log('👀 Watching for changes...\n');
  });
}

/**
 * 防抖处理：延迟执行，避免频繁构建
 */
function debouncedBuild() {
  if (buildTimeout) {
    clearTimeout(buildTimeout);
  }
  
  buildTimeout = setTimeout(() => {
    buildTranslations();
  }, 300); // 300ms 防抖
}

/**
 * 监听文件变化
 */
function watchTranslations() {
  // 初始构建
  console.log('🔨 Initial build...');
  buildTranslations();

  // 监听所有语言目录
  fs.watch(TRANSLATIONS_DIR, { recursive: true }, (eventType, filename) => {
    // 只处理 .json 文件的变化
    if (filename && filename.endsWith('.json') && !filename.includes('backup')) {
      console.log(`📝 ${eventType}: ${filename}`);
      debouncedBuild();
    }
  });

  console.log('\n✅ Watcher started successfully');
  console.log('💡 Edit any .json file in lib/i18n/translations/ to trigger rebuild\n');
}

// 启动监听
try {
  watchTranslations();
} catch (error) {
  console.error('❌ Failed to start watcher:', error.message);
  process.exit(1);
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping translation watcher...');
  process.exit(0);
});

