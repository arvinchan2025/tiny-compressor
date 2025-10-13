#!/usr/bin/env node
/**
 * 为所有语言添加主题翻译
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'lib', 'i18n', 'translations');

// 主题翻译内容
const themeTranslations = {
  zh: {
    "theme": {
      "light": "浅色",
      "dark": "深色",
      "system": "跟随系统",
      "toggle": "切换主题"
    }
  },
  ja: {
    "theme": {
      "light": "ライト",
      "dark": "ダーク",
      "system": "システム",
      "toggle": "テーマ切替"
    }
  },
  ko: {
    "theme": {
      "light": "라이트",
      "dark": "다크",
      "system": "시스템",
      "toggle": "테마 전환"
    }
  },
  ar: {
    "theme": {
      "light": "فاتح",
      "dark": "داكن",
      "system": "النظام",
      "toggle": "تبديل السمة"
    }
  },
  de: {
    "theme": {
      "light": "Hell",
      "dark": "Dunkel",
      "system": "System",
      "toggle": "Design wechseln"
    }
  },
  es: {
    "theme": {
      "light": "Claro",
      "dark": "Oscuro",
      "system": "Sistema",
      "toggle": "Cambiar tema"
    }
  },
  fr: {
    "theme": {
      "light": "Clair",
      "dark": "Sombre",
      "system": "Système",
      "toggle": "Changer de thème"
    }
  },
  it: {
    "theme": {
      "light": "Chiaro",
      "dark": "Scuro",
      "system": "Sistema",
      "toggle": "Cambia tema"
    }
  },
  pt: {
    "theme": {
      "light": "Claro",
      "dark": "Escuro",
      "system": "Sistema",
      "toggle": "Alternar tema"
    }
  },
  ru: {
    "theme": {
      "light": "Светлая",
      "dark": "Тёмная",
      "system": "Системная",
      "toggle": "Сменить тему"
    }
  }
};

function addThemeToLanguage(lang) {
  const uiJsonPath = path.join(BASE_DIR, lang, 'common', 'ui.json');
  
  if (!fs.existsSync(uiJsonPath)) {
    console.log(`[SKIP] ${lang}/common/ui.json not found`);
    return false;
  }
  
  try {
    // 读取现有文件
    const content = fs.readFileSync(uiJsonPath, 'utf8');
    const data = JSON.parse(content);
    
    // 检查是否已有theme字段
    if (data.theme) {
      console.log(`[SKIP] ${lang}/common/ui.json already has theme field`);
      return false;
    }
    
    // 添加theme字段到开头
    const newData = {
      theme: themeTranslations[lang].theme,
      ...data
    };
    
    // 写回文件
    fs.writeFileSync(uiJsonPath, JSON.stringify(newData, null, 2), 'utf8');
    console.log(`[OK] Added theme to ${lang}/common/ui.json`);
    return true;
  } catch (error) {
    console.log(`[ERROR] Failed to process ${lang}: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('=' .repeat(60));
  console.log('Adding theme translations to all languages');
  console.log('=' .repeat(60));
  console.log('');
  
  const languages = Object.keys(themeTranslations);
  let added = 0;
  
  languages.forEach(lang => {
    if (addThemeToLanguage(lang)) {
      added++;
    }
  });
  
  console.log('');
  console.log('=' .repeat(60));
  console.log(`Theme translations added: ${added}/${languages.length} languages`);
  console.log('=' .repeat(60));
}

main();

