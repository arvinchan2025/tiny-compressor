export interface Translations {
  // Navigation
  nav: {
    features: string;
    about: string;
    language: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    trustedBy: string;
  };
  
  // Upload Section
  upload: {
    title: string;
    subtitle: string;
    dragActive: string;
    dragInactive: string;
    dragReject: string;
    supportedFormats: string;
    maxSize: string;
    uploadedFiles: string;
    removeFile: string;
    ready: string;
  };
  
  // Compression Settings
  compression: {
    title: string;
    mode: {
      quick: string;
      custom: string;
    };
    quickMode: {
      title: string;
      description: string;
      compress: string;
      formatNote: string;
    };
    customMode: {
      title: string;
      quality: string;
      maxWidth: string;
      maxHeight: string;
      format: string;
      compress: string;
      compressing: string;
      qualityDescription: {
        low: string;
        medium: string;
        high: string;
      };
      sizeDescription: {
        small: string;
        medium: string;
        large: string;
      };
      formatDescription: {
        jpeg: string;
        png: string;
        webp: string;
      };
    };
  };
  
  // Results Section
  results: {
    title: string;
    originalSize: string;
    compressedSize: string;
    savings: string;
    download: string;
    downloadAll: string;
    compressMore: string;
    compressionRatio: string;
    spaceSaved: string;
  };
  
  // Features Section
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
  
  // How It Works Section
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
  
  // Supported Formats Section
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
  
  // FAQ Section
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
  
  // Use Cases Section
  useCases: {
    title: string;
    webDev: {
      title: string;
      description: string;
    };
    mobile: {
      title: string;
      description: string;
    };
    social: {
      title: string;
      description: string;
    };
    email: {
      title: string;
      description: string;
    };
    storage: {
      title: string;
      description: string;
    };
    ecommerce: {
      title: string;
      description: string;
    };
  };
  
  // Call to Action Section
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  
  // Footer Section
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
  
  // Perfect For Section
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
    ecommerce: {
      title: string;
      description: string;
    };
    photoStorage: {
      title: string;
      description: string;
    };
  };
  
  // Privacy Policy
  privacy: {
    title: string;
    lastUpdated: string;
    introduction: {
      title: string;
      content: string;
    };
    informationCollection: {
      title: string;
      content: string;
    };
    dataProcessing: {
      title: string;
      content: string;
    };
    cookies: {
      title: string;
      content: string;
    };
    thirdParty: {
      title: string;
      content: string;
    };
    dataSecurity: {
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
  
  // Terms of Service
  terms: {
    title: string;
    lastUpdated: string;
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
    limitations: {
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
    disclaimer: {
      title: string;
      content: string;
    };
    limitationLiability: {
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
}

// 动态导入翻译文件
const loadTranslations = async (locale: string): Promise<Translations> => {
  try {
    const translations = await import(`./translations/${locale}.json`);
    return translations.default;
  } catch {
    console.warn(`Failed to load translations for locale: ${locale}`);
    // 回退到英语
    const fallback = await import(`./translations/en.json`);
    return fallback.default;
  }
};

// 翻译缓存
const translationCache = new Map<string, Translations>();

// 获取翻译的异步函数
export const getTranslations = async (locale: string): Promise<Translations> => {
  // 检查缓存
  if (translationCache.has(locale)) {
    return translationCache.get(locale)!;
  }

  try {
    const translations = await loadTranslations(locale);
    translationCache.set(locale, translations);
    return translations;
  } catch {
    console.warn(`Failed to load translations for locale: ${locale}, falling back to English`);
    // 回退到英语
    const fallback = await loadTranslations('en');
    translationCache.set(locale, fallback);
    return fallback;
  }
};

// 同步获取翻译（用于已缓存的翻译）
export const getTranslationsSync = (locale: string): Translations | null => {
  return translationCache.get(locale) || null;
};

// 预加载翻译
export const preloadTranslations = async (locales: string[]): Promise<void> => {
  await Promise.all(
    locales.map(locale => getTranslations(locale))
  );
};

// 清理缓存
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

// 获取嵌套翻译值
export const getNestedTranslation = (translations: Translations, key: string): string => {
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // 返回键名作为fallback
    }
  }
  
  return typeof value === 'string' ? value : key;
};
