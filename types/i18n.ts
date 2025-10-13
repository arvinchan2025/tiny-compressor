/**
 * 基于 next-intl 的国际化类型定义
 * 提供类型安全的翻译键和参数
 */

// 支持的语言类型
export type SupportedLanguage = 'en' | 'zh' | 'es' | 'de' | 'fr' | 'ar' | 'ja' | 'ko' | 'pt' | 'ru' | 'it';

// 语言信息接口
export interface LanguageInfo {
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  locale: string;
}

// 翻译键类型定义
export interface TranslationKeys {
  // 通用翻译
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    finish: string;
    success: string;
    failed: string;
    warning: string;
    info: string;
  };

  // 导航
  nav: {
    home: string;
    compressor: string;
    converter: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
  };

  // 页脚
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    links: {
      privacy: string;
      terms: string;
    };
    copyright: string;
  };

  // 元数据
  meta: {
    title: string;
    description: string;
    keywords: string;
  };

  // 主页翻译
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
      trustedBy: string;
    };
    upload: {
      title: string;
      subtitle: string;
      dragActive: string;
      dragInactive: string;
      dragReject: string;
      removeFile: string;
      ready: string;
      supportedFormats: string;
      maxSize: string;
      clickToUpload: string;
    };
    compression: {
      title: string;
      quickMode: {
        title: string;
        description: string;
        compress: string;
      };
      customMode: {
        title: string;
        description: string;
        compress: string;
        quality: string;
        qualityDescription: string;
        size: string;
        sizeDescription: string;
      };
    };
    formats: {
      title: string;
      jpeg: {
        title: string;
        description: string;
      };
      png: {
        title: string;
        description: string;
      };
      webp: {
        title: string;
        description: string;
      };
      gif: {
        title: string;
        description: string;
      };
    };
    features: {
      title: string;
      fast: {
        title: string;
        description: string;
      };
      secure: {
        title: string;
        description: string;
      };
      quality: {
        title: string;
        description: string;
      };
      free: {
        title: string;
        description: string;
      };
    };
    howItWorks: {
      title: string;
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
    };
    perfectFor: {
      title: string;
      webDevelopers: {
        title: string;
        description: string;
      };
      designers: {
        title: string;
        description: string;
      };
      socialMedia: {
        title: string;
        description: string;
      };
      emailAttachments: {
        title: string;
        description: string;
      };
      photoStorage: {
        title: string;
        description: string;
      };
      ecommerce: {
        title: string;
        description: string;
      };
    };
    results: {
      title: string;
      before: string;
      after: string;
      reduction: string;
      originalSize: string;
      compressedSize: string;
      savings: string;
      download: string;
      downloadAll: string;
      compressMore: string;
      compressionRatio: string;
      spaceSaved: string;
      noResults: string;
    };
    faq: {
      title: string;
      questions: {
        privacy: {
          question: string;
          answer: string;
        };
        fileSize: {
          question: string;
          answer: string;
        };
        compression: {
          question: string;
          answer: string;
        };
        account: {
          question: string;
          answer: string;
        };
        browsers: {
          question: string;
          answer: string;
        };
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };

  // 转换器翻译
  converter: {
    title: string;
    subtitle: string;
    description: string;
    supportedFormats: string;
    conversions: {
      jpgToPng: {
        title: string;
        description: string;
      };
      pngToJpg: {
        title: string;
        description: string;
      };
      webpToJpg: {
        title: string;
        description: string;
      };
      webpToPng: {
        title: string;
        description: string;
      };
      pngToWebp: {
        title: string;
        description: string;
      };
      jpgToWebp: {
        title: string;
        description: string;
      };
    };
  };

  // 隐私政策翻译
  privacy: {
    title: string;
    lastUpdated: string;
    sections: {
      introduction: {
        title: string;
        content: string;
      };
      informationWeCollect: {
        title: string;
        content: string;
      };
      howWeUseInformation: {
        title: string;
        content: string;
      };
      informationSharing: {
        title: string;
        content: string;
      };
      dataSecurity: {
        title: string;
        content: string;
      };
      cookies: {
        title: string;
        content: string;
      };
      thirdPartyServices: {
        title: string;
        content: string;
      };
      childrenPrivacy: {
        title: string;
        content: string;
      };
      changesToPrivacyPolicy: {
        title: string;
        content: string;
      };
      contactUs: {
        title: string;
        content: string;
      };
    };
  };

  // 服务条款翻译
  terms: {
    title: string;
    lastUpdated: string;
    sections: {
      acceptance: {
        title: string;
        content: string;
      };
      description: {
        title: string;
        content: string;
      };
      userResponsibilities: {
        title: string;
        content: string;
      };
      prohibitedUses: {
        title: string;
        content: string;
      };
      intellectualProperty: {
        title: string;
        content: string;
      };
      privacy: {
        title: string;
        content: string;
      };
      disclaimers: {
        title: string;
        content: string;
      };
      limitationOfLiability: {
        title: string;
        content: string;
      };
      indemnification: {
        title: string;
        content: string;
      };
      termination: {
        title: string;
        content: string;
      };
      governingLaw: {
        title: string;
        content: string;
      };
      changes: {
        title: string;
        content: string;
      };
      contact: {
        title: string;
        content: string;
      };
    };
  };
}

// 翻译参数类型
export type TranslationParams = Record<string, string | number>;

// 翻译函数类型
export type TranslationFunction = (key: string, params?: TranslationParams) => string;

