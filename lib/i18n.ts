/**
 * 国际化核心模块
 * 统一管理语言配置、翻译加载和类型定义
 */

// 支持的语言类型
export type SupportedLanguage = 'en' | 'zh' | 'es' | 'de' | 'fr' | 'ar';

// 支持的语言列表
export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  'en', 'zh', 'es', 'de', 'fr', 'ar'
] as const;

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// 语言信息配置
export const LANGUAGE_INFO = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', locale: 'en_US' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr', locale: 'zh_CN' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr', locale: 'es_ES' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', locale: 'de_DE' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', locale: 'fr_FR' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', locale: 'ar_SA' }
} as const;

// 翻译接口定义
export interface Translations {
  metadata: {
    title: string;
    description: string;
    keywords: string;
    openGraphTitle: string;
    openGraphDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  nav: {
    features: string;
    about: string;
    language: string;
  };
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
    supportedFormats: string;
    maxSize: string;
    uploadedFiles: string;
    removeFile: string;
    ready: string;
  };
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
    quality: {
      label: string;
      high: string;
      medium: string;
      low: string;
    };
    dimensions: {
      label: string;
      original: string;
      custom: string;
      width: string;
      height: string;
    };
    format: {
      label: string;
      original: string;
      jpg: string;
      png: string;
      webp: string;
    };
    start: string;
    processing: string;
    completed: string;
  };
  results: {
    title: string;
    before: string;
    after: string;
    reduction: string;
    originalSize: string;
    compressedSize: string;
    spaceSaved: string;
    download: string;
    downloadAll: string;
    compressMore: string;
    noResults: string;
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

// 工具函数
export const isRTLLanguage = (locale: SupportedLanguage): boolean => {
  return LANGUAGE_INFO[locale].direction === 'rtl';
};

export const isValidLanguage = (language: string): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
};

export const getLanguageInfo = (locale: SupportedLanguage) => {
  return LANGUAGE_INFO[locale];
};

// 生成hreflang标签
export const generateHreflangTags = (baseUrl: string = 'https://tinycompressor.com') => {
  return SUPPORTED_LANGUAGES.map(lang => ({
    hrefLang: lang,
    href: lang === 'en' ? baseUrl : `${baseUrl}/${lang}`
  }));
};

// 生成alternates配置
export const generateAlternatesConfig = (baseUrl: string = 'https://tinycompressor.com') => {
  const languages: { [key: string]: string } = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    languages[lang] = lang === 'en' ? baseUrl : `${baseUrl}/${lang}`;
  });

  return {
    canonical: baseUrl,
    languages
  };
};

// 生成sitemap URLs
export const generateSitemapUrls = (baseUrl: string = 'https://tinycompressor.com') => {
  const urls: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
  }> = [];
  const currentDate = new Date().toISOString().split('T')[0];

  // 主页
  SUPPORTED_LANGUAGES.forEach(lang => {
    urls.push({
      loc: lang === 'en' ? baseUrl : `${baseUrl}/${lang}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    });
  });

  // 隐私政策
  SUPPORTED_LANGUAGES.forEach(lang => {
    urls.push({
      loc: lang === 'en' ? `${baseUrl}/privacy` : `${baseUrl}/${lang}/privacy`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    });
  });

  // 服务条款
  SUPPORTED_LANGUAGES.forEach(lang => {
    urls.push({
      loc: lang === 'en' ? `${baseUrl}/terms` : `${baseUrl}/${lang}/terms`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    });
  });

  return urls;
};
