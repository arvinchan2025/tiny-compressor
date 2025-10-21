#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing all caches...');

// 清除Next.js缓存
const nextCacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCacheDir)) {
  console.log('🗑️  Removing .next directory...');
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
}

// 清除node_modules/.cache
const nodeModulesCacheDir = path.join(process.cwd(), 'node_modules', '.cache');
if (fs.existsSync(nodeModulesCacheDir)) {
  console.log('🗑️  Removing node_modules/.cache directory...');
  fs.rmSync(nodeModulesCacheDir, { recursive: true, force: true });
}

// 清除TypeScript构建缓存
const tsBuildInfo = path.join(process.cwd(), 'tsconfig.tsbuildinfo');
if (fs.existsSync(tsBuildInfo)) {
  console.log('🗑️  Removing tsconfig.tsbuildinfo...');
  fs.unlinkSync(tsBuildInfo);
}

// 翻译系统现在使用模块化文件，无需清除generated.ts

console.log('✅ Cache cleared successfully!');
console.log('💡 You can now run "npm run dev" to start fresh.');
