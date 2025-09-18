#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 翻译生成器
class TranslationGenerator {
  constructor() {
    this.baseLanguage = 'en';
    this.translationsDir = path.join(__dirname, '../lib/translations');
    this.templateFile = path.join(this.translationsDir, `${this.baseLanguage}.json`);
  }

  // 生成新语言翻译文件
  generateTranslationFile(language, baseTranslation = null) {
    const base = baseTranslation || this.loadBaseTranslation();
    const newTranslation = this.createTranslationTemplate(base, language);
    
    const filePath = path.join(this.translationsDir, `${language}.json`);
    fs.writeFileSync(filePath, JSON.stringify(newTranslation, null, 2));
    
    console.log(`✅ Generated translation file for ${language}: ${filePath}`);
  }

  // 加载基础翻译
  loadBaseTranslation() {
    try {
      return JSON.parse(fs.readFileSync(this.templateFile, 'utf8'));
    } catch (error) {
      console.error('❌ Failed to load base translation:', error.message);
      process.exit(1);
    }
  }

  // 创建翻译模板
  createTranslationTemplate(baseTranslation, language) {
    const template = JSON.parse(JSON.stringify(baseTranslation));
    
    // 为不同语言添加注释和占位符
    this.addLanguageComments(template, language);
    
    return template;
  }

  // 添加语言注释
  addLanguageComments(obj, language) {
    const languageNames = {
      'en': 'English',
      'zh': 'Chinese',
      'es': 'Spanish',
      'de': 'German',
      'fr': 'French',
      'ja': 'Japanese',
      'ko': 'Korean',
      'pt': 'Portuguese',
      'it': 'Italian',
      'ru': 'Russian',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'id': 'Indonesian',
      'tr': 'Turkish',
      'pl': 'Polish',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish'
    };

    const languageName = languageNames[language] || language;
    
    // 在对象开头添加注释
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          obj[key] = `[${languageName}] ${obj[key]}`;
        } else if (typeof obj[key] === 'object') {
          this.addLanguageComments(obj[key], language);
        }
      });
    }
  }

  // 批量生成翻译文件
  generateAllTranslations() {
    const languages = [
      'fr', 'ja', 'ko', 'pt', 'it', 'ru', 'ar', 'hi', 'th', 'vi',
      'id', 'tr', 'pl', 'nl', 'sv', 'da', 'no', 'fi', 'cs', 'hu'
    ];

    console.log('🚀 Generating translation files...');
    
    languages.forEach(lang => {
      this.generateTranslationFile(lang);
    });

    console.log('✅ All translation files generated!');
  }

  // 验证翻译完整性
  validateTranslations() {
    const files = fs.readdirSync(this.translationsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));

    const baseKeys = this.getTranslationKeys(this.loadBaseTranslation());
    const issues = {};

    files.forEach(lang => {
      if (lang === this.baseLanguage) return;

      try {
        const translation = JSON.parse(
          fs.readFileSync(path.join(this.translationsDir, `${lang}.json`), 'utf8')
        );
        
        const langKeys = this.getTranslationKeys(translation);
        const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
        
        if (missingKeys.length > 0) {
          issues[lang] = missingKeys;
        }
      } catch (error) {
        issues[lang] = [`Failed to load: ${error.message}`];
      }
    });

    if (Object.keys(issues).length > 0) {
      console.log('❌ Translation validation issues found:');
      console.log(JSON.stringify(issues, null, 2));
    } else {
      console.log('✅ All translations are valid!');
    }

    return issues;
  }

  // 获取翻译键
  getTranslationKeys(obj, prefix = '') {
    let keys = [];
    
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(this.getTranslationKeys(obj[key], `${prefix}${key}.`));
      } else {
        keys.push(`${prefix}${key}`);
      }
    }
    
    return keys;
  }
}

// 命令行接口
if (require.main === module) {
  const generator = new TranslationGenerator();
  const command = process.argv[2];
  const language = process.argv[3];

  switch (command) {
    case 'generate':
      if (language) {
        generator.generateTranslationFile(language);
      } else {
        generator.generateAllTranslations();
      }
      break;
    case 'validate':
      generator.validateTranslations();
      break;
    default:
      console.log(`
Usage:
  node translation-generator.js generate [language]  - Generate translation file(s)
  node translation-generator.js validate            - Validate all translations
      `);
  }
}

module.exports = TranslationGenerator;
