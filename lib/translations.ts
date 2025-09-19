/**
 * 翻译加载器
 * 简化的翻译加载和管理系统
 */

import { Translations, SupportedLanguage, SUPPORTED_LANGUAGES } from './i18n';

// 翻译缓存
const translationCache = new Map<string, Translations>();

// 动态导入翻译文件
const loadTranslationFile = async (language: SupportedLanguage): Promise<Translations> => {
  try {
    const translation = await import(`./translations/${language}.json`);
    return translation.default || translation;
  } catch (error) {
    console.error(`Failed to load translation for ${language}:`, error);
    // 回退到英语
    if (language !== 'en') {
      return loadTranslationFile('en');
    }
    throw error;
  }
};

// 获取翻译
export const getTranslations = async (locale: string): Promise<Translations> => {
  const language = locale as SupportedLanguage;
  
  // 验证语言代码
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Unsupported language: ${locale}, falling back to English`);
    return getTranslations('en');
  }
  
  // 检查缓存
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  try {
    // 加载翻译
    const translations = await loadTranslationFile(language);
    
    // 验证翻译对象
    if (!translations || typeof translations !== 'object') {
      throw new Error(`Invalid translation object for ${language}`);
    }
    
    // 缓存翻译
    translationCache.set(language, translations);
    
    return translations;
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
    // 如果当前不是英语，尝试加载英语
    if (language !== 'en') {
      return getTranslations('en');
    }
    throw error;
  }
};

// 预加载所有翻译
export const preloadTranslations = async (): Promise<void> => {
  const loadPromises = SUPPORTED_LANGUAGES.map(lang => getTranslations(lang));
  await Promise.all(loadPromises);
};

// 清理缓存
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

// 导出别名
export const loadTranslations = getTranslations;
