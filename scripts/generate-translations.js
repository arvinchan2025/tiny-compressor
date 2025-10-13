#!/usr/bin/env node
/**
 * Translation Generation Script
 * 
 * This script checks if the generated translation file exists.
 * The actual translation files are managed manually in lib/i18n/translations/
 * and the generated file (lib/translations/generated.ts) is already created.
 */

const fs = require('fs');
const path = require('path');

const GENERATED_FILE = path.join(__dirname, '..', 'lib', 'translations', 'generated.ts');

console.log('Checking translation files...');

if (fs.existsSync(GENERATED_FILE)) {
  console.log('✅ Generated translation file exists');
  console.log('   Location: lib/translations/generated.ts');
  console.log('   All translation files are ready for build');
  process.exit(0);
} else {
  console.error('❌ Generated translation file not found!');
  console.error('   Expected: lib/translations/generated.ts');
  console.error('   Please ensure translation files are properly generated');
  process.exit(1);
}


