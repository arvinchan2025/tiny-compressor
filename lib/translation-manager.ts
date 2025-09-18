import { SUPPORTED_LANGUAGES, SupportedLanguage } from './translation-loader';

export type { SupportedLanguage };

// 动态导入JSON翻译文件
const loadTranslations = async (locale: string) => {
  try {
    const translations = await import(`./translations/${locale}.json`);
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`);
    // 回退到英语
    const fallback = await import(`./translations/en.json`);
    return fallback.default;
  }
};

// 翻译状态管理
export class TranslationManager {
  private static instance: TranslationManager;
  private currentLanguage: SupportedLanguage = 'en';
  private translations: Map<SupportedLanguage, any> = new Map();
  private listeners: Set<(language: SupportedLanguage) => void> = new Set();
  private loadingPromises: Map<SupportedLanguage, Promise<any>> = new Map();

  static getInstance(): TranslationManager {
    if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager();
    }
    return TranslationManager.instance;
  }

  // 设置当前语言
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    this.notifyListeners();
  }

  // 获取当前语言
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  // 获取翻译（同步版本，用于已加载的翻译）
  getTranslation(key: string, language?: SupportedLanguage): string {
    const lang = language || this.currentLanguage;
    const translation = this.translations.get(lang);
    
    if (!translation) {
      console.warn(`Translation not found for language: ${lang}`);
      return key; // 返回键名作为fallback
    }

    return this.getNestedValue(translation, key) || key;
  }

  // 异步获取翻译（确保翻译已加载）
  async getTranslationAsync(key: string, language?: SupportedLanguage): Promise<string> {
    const lang = language || this.currentLanguage;
    
    // 确保翻译已加载
    await this.ensureTranslationsLoaded(lang);
    
    const translation = this.translations.get(lang);
    if (!translation) {
      console.warn(`Translation not found for language: ${lang}`);
      return key;
    }

    return this.getNestedValue(translation, key) || key;
  }

  // 确保翻译已加载
  private async ensureTranslationsLoaded(language: SupportedLanguage): Promise<void> {
    if (this.translations.has(language)) {
      return;
    }

    if (!this.loadingPromises.has(language)) {
      this.loadingPromises.set(language, loadTranslations(language));
    }

    const translations = await this.loadingPromises.get(language);
    this.translations.set(language, translations);
  }

  // 获取嵌套值
  private getNestedValue(obj: any, path: string): string | undefined {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // 注册语言变化监听器
  onLanguageChange(callback: (language: SupportedLanguage) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // 通知监听器
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  // 检查翻译完整性
  validateTranslations(): { [key: string]: string[] } {
    const issues: { [key: string]: string[] } = {};
    
    SUPPORTED_LANGUAGES.forEach(lang => {
      const translation = this.translations.get(lang);
      if (!translation) {
        issues[lang] = ['Translation file not found'];
        return;
      }

      const missingKeys = this.findMissingKeys(translation);
      if (missingKeys.length > 0) {
        issues[lang] = missingKeys;
      }
    });

    return issues;
  }

  // 查找缺失的键
  private findMissingKeys(translation: any, prefix = ''): string[] {
    const missingKeys: string[] = [];
    
    // 这里可以定义必需的键结构
    const requiredKeys = [
      'nav.features', 'nav.about', 'nav.language',
      'hero.title', 'hero.subtitle', 'hero.cta',
      'upload.title', 'upload.subtitle',
      // ... 更多必需的键
    ];

    requiredKeys.forEach(key => {
      if (!this.getNestedValue(translation, key)) {
        missingKeys.push(prefix + key);
      }
    });

    return missingKeys;
  }
}

export const translationManager = TranslationManager.getInstance();
