import { Translations } from './translations';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  'en', 'zh', 'es', 'de', 'fr'
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// 翻译加载器
class TranslationLoader {
  private cache = new Map<string, Translations>();
  private fallbackLanguage: SupportedLanguage = 'en';

  async loadTranslation(language: SupportedLanguage): Promise<Translations> {
    // 检查缓存
    if (this.cache.has(language)) {
      return this.cache.get(language)!;
    }

    try {
      // 动态导入翻译文件
      const translation = await import(`./translations/${language}.json`);
      const translationData = translation.default || translation;
      
      // 验证翻译完整性
      const validatedTranslation = this.validateTranslation(translationData, language);
      
      // 缓存翻译
      this.cache.set(language, validatedTranslation);
      
      return validatedTranslation;
           } catch {
             console.warn(`Failed to load translation for ${language}, falling back to ${this.fallbackLanguage}`);
      
      // 回退到英语
      if (language !== this.fallbackLanguage) {
        return this.loadTranslation(this.fallbackLanguage);
      }
      
      // 如果连英语都加载失败，返回空翻译
      return this.getEmptyTranslation();
    }
  }

         private validateTranslation(translation: Record<string, unknown>, language: string): Translations {
    // 这里可以添加翻译完整性验证逻辑
    // 检查必需的键是否存在
    const requiredKeys = [
      'nav', 'hero', 'upload', 'compression', 'results', 
      'features', 'howItWorks', 'formats', 'faq', 'useCases', 
      'cta', 'footer', 'perfectFor'
    ];

    for (const key of requiredKeys) {
      if (!translation[key]) {
        console.warn(`Missing required translation key: ${key} for language: ${language}`);
      }
    }

    return translation as unknown as Translations;
  }

  private getEmptyTranslation(): Translations {
    // 返回一个基本的空翻译对象
    return {
      nav: { features: '', about: '', language: '' },
      hero: { title: '', subtitle: '', cta: '', trustedBy: '' },
      upload: { 
        title: '', subtitle: '', dragActive: '', dragInactive: '', 
        dragReject: '', supportedFormats: '', maxSize: '', 
        uploadedFiles: '', removeFile: '', ready: '' 
      },
      compression: { 
        title: '', mode: { quick: '', custom: '' }, 
        quickMode: { title: '', description: '', compress: '', formatNote: '' }, 
        customMode: { 
          title: '', quality: '', maxWidth: '', maxHeight: '', format: '', 
          compress: '', compressing: '', 
          qualityDescription: { low: '', medium: '', high: '' }, 
          sizeDescription: { small: '', medium: '', large: '' }, 
          formatDescription: { jpeg: '', png: '', webp: '' } 
        } 
      },
      results: { 
        title: '', originalSize: '', compressedSize: '', savings: '', 
        download: '', downloadAll: '', compressMore: '', 
        compressionRatio: '', spaceSaved: '' 
      },
      features: { 
        title: '', 
        fast: { title: '', description: '' }, 
        secure: { title: '', description: '' }, 
        quality: { title: '', description: '' }, 
        free: { title: '', description: '' } 
      },
      howItWorks: { 
        title: '', 
        step1: { title: '', description: '' }, 
        step2: { title: '', description: '' }, 
        step3: { title: '', description: '' } 
      },
      formats: { 
        title: '', 
        jpeg: { title: '', description: '' }, 
        png: { title: '', description: '' }, 
        webp: { title: '', description: '' }, 
        gif: { title: '', description: '' } 
      },
      faq: { 
        title: '', 
        questions: { 
          privacy: { question: '', answer: '' }, 
          fileSize: { question: '', answer: '' }, 
          compression: { question: '', answer: '' }, 
          account: { question: '', answer: '' }, 
          browsers: { question: '', answer: '' } 
        } 
      },
      useCases: { 
        title: '', 
        webDev: { title: '', description: '' }, 
        mobile: { title: '', description: '' }, 
        social: { title: '', description: '' }, 
        email: { title: '', description: '' }, 
        storage: { title: '', description: '' }, 
        ecommerce: { title: '', description: '' } 
      },
      cta: { title: '', subtitle: '', button: '' },
      footer: { 
        description: '', quickLinks: '', legal: '', 
        privacy: '', terms: '', copyright: '' 
      },
      perfectFor: { 
        title: '', 
        webDevelopers: { title: '', description: '' }, 
        designers: { title: '', description: '' }, 
        socialMedia: { title: '', description: '' }, 
        emailAttachments: { title: '', description: '' }, 
        ecommerce: { title: '', description: '' }, 
        photoStorage: { title: '', description: '' } 
      },
      privacy: {
        title: '',
        lastUpdated: '',
        introduction: { title: '', content: '' },
        informationCollection: { title: '', content: '' },
        dataProcessing: { title: '', content: '' },
        cookies: { title: '', content: '' },
        thirdParty: { title: '', content: '' },
        dataSecurity: { title: '', content: '' },
        changes: { title: '', content: '' },
        contact: { title: '', content: '' }
      },
      terms: {
        title: '',
        lastUpdated: '',
        acceptance: { title: '', content: '' },
        description: { title: '', content: '' },
        userResponsibilities: { title: '', content: '' },
        limitations: { title: '', content: '' },
        prohibitedUses: { title: '', content: '' },
        intellectualProperty: { title: '', content: '' },
        disclaimer: { title: '', content: '' },
        limitationLiability: { title: '', content: '' },
        governingLaw: { title: '', content: '' },
        changes: { title: '', content: '' },
        contact: { title: '', content: '' }
      }
    };
  }

  // 预加载常用语言
  async preloadCommonLanguages(): Promise<void> {
    const commonLanguages: SupportedLanguage[] = ['en', 'zh', 'es', 'de', 'fr'];
    
    await Promise.all(
      commonLanguages.map(lang => this.loadTranslation(lang))
    );
  }

  // 清理缓存
  clearCache(): void {
    this.cache.clear();
  }
}

export const translationLoader = new TranslationLoader();

// 兼容性函数
export const getTranslations = async (locale: string): Promise<Translations> => {
  const language = locale as SupportedLanguage;
  return translationLoader.loadTranslation(language);
};
