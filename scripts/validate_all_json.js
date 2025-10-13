#!/usr/bin/env node
/**
 * Validate all JSON translation files
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '..', 'lib', 'i18n', 'translations');

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function findAllJSONFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findAllJSONFiles(fullPath));
    } else if (item.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

console.log('Validating all JSON translation files...\n');

const allFiles = findAllJSONFiles(TRANSLATIONS_DIR);
const invalid = [];

for (const file of allFiles) {
  const result = validateJSON(file);
  if (!result.valid) {
    const relativePath = path.relative(process.cwd(), file);
    invalid.push({ file: relativePath, error: result.error });
    console.log(`❌ ${relativePath}`);
    console.log(`   Error: ${result.error}\n`);
  }
}

console.log('=' * 80);
console.log(`\nTotal files checked: ${allFiles.length}`);
console.log(`Valid files: ${allFiles.length - invalid.length}`);
console.log(`Invalid files: ${invalid.length}`);

if (invalid.length === 0) {
  console.log('\n✅ All JSON files are valid!');
  process.exit(0);
} else {
  console.log(`\n❌ Found ${invalid.length} invalid JSON files`);
  process.exit(1);
}


