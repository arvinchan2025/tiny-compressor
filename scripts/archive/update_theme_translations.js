#!/usr/bin/env node
/**
 * 更新主题翻译 - 添加followingSystem键
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'lib', 'i18n', 'translations');

// 新增的翻译键
const followingSystemTranslations = {
  zh: "跟随系统中",
  ja: "システムに従う",
  ko: "시스템 따르기",
  ar: "متابعة النظام",
  de: "Folgt dem System",
  es: "Siguiendo el sistema",
  fr: "Suit le système",
  it: "Segue il sistema",
  pt: "Seguindo o sistema",
  ru: "Следует системе"
};

function updateLanguage(lang) {
  const uiJsonPath = path.join(BASE_DIR, lang, 'common', 'ui.json');
  
  if (!fs.existsSync(uiJsonPath)) {
    console.log(`[SKIP] ${lang}/common/ui.json not found`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(uiJsonPath, 'utf8');
    const data = JSON.parse(content);
    
    if (!data.theme) {
      console.log(`[SKIP] ${lang}/common/ui.json has no theme field`);
      return false;
    }
    
    if (data.theme.followingSystem) {
      console.log(`[SKIP] ${lang} already has followingSystem`);
      return false;
    }
    
    // 添加followingSystem键
    data.theme.followingSystem = followingSystemTranslations[lang];
    
    fs.writeFileSync(uiJsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[OK] Updated ${lang}/common/ui.json`);
    return true;
  } catch (error) {
    console.log(`[ERROR] Failed to process ${lang}: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('Updating theme translations...\n');
  
  const languages = Object.keys(followingSystemTranslations);
  let updated = 0;
  
  languages.forEach(lang => {
    if (updateLanguage(lang)) {
      updated++;
    }
  });
  
  console.log(`\nUpdated: ${updated}/${languages.length} languages`);
}

main();

