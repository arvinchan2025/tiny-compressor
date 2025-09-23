/**
 * 翻译类型定义和加载器
 * 使用严格 TypeScript 类型
 */

import type { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from './i18n';

// 基础翻译接口
export interface BaseTranslation {
  readonly title: string;
  readonly description: string;
}

// 导航翻译接口
export interface NavTranslation {
  readonly features: string;
  readonly about: string;
  readonly language: string;
  readonly compressor: string;
  readonly converter: string;
  readonly home: string;
  readonly privacy: string;
  readonly terms: string;
}

// 英雄区域翻译接口
export interface HeroTranslation {
  readonly title: string;
  readonly subtitle: string;
  readonly cta: string;
  readonly trustedBy: string;
}

// 上传区域翻译接口
export interface UploadTranslation {
  readonly title: string;
  readonly subtitle: string;
  readonly dragActive: string;
  readonly dragInactive: string;
  readonly dragReject: string;
  readonly supportedFormats: string;
  readonly maxSize: string;
  readonly uploadedFiles: string;
  readonly removeFile: string;
  readonly ready: string;
}

// 压缩设置翻译接口
export interface CompressionTranslation {
  readonly title: string;
  readonly mode: {
    readonly quick: string;
    readonly custom: string;
  };
  readonly quickMode: {
    readonly title: string;
    readonly description: string;
    readonly compress: string;
    readonly formatNote: string;
  };
  readonly customMode: {
    readonly title: string;
    readonly quality: string;
    readonly maxWidth: string;
    readonly maxHeight: string;
    readonly format: string;
    readonly compress: string;
    readonly compressing: string;
    readonly qualityDescription: {
      readonly low: string;
      readonly medium: string;
      readonly high: string;
    };
    readonly sizeDescription: {
      readonly small: string;
      readonly medium: string;
      readonly large: string;
    };
    readonly formatDescription: {
      readonly jpeg: string;
      readonly png: string;
      readonly webp: string;
    };
  };
  readonly quality: {
    readonly label: string;
    readonly high: string;
    readonly medium: string;
    readonly low: string;
  };
  readonly dimensions: {
    readonly label: string;
    readonly original: string;
    readonly custom: string;
    readonly width: string;
    readonly height: string;
  };
  readonly format: {
    readonly label: string;
    readonly original: string;
    readonly jpg: string;
    readonly png: string;
    readonly webp: string;
  };
  readonly start: string;
  readonly processing: string;
  readonly completed: string;
}

// 结果翻译接口
export interface ResultsTranslation {
  readonly title: string;
  readonly before: string;
  readonly after: string;
  readonly reduction: string;
  readonly originalSize: string;
  readonly compressedSize: string;
  readonly spaceSaved: string;
  readonly download: string;
  readonly downloadAll: string;
  readonly compressMore: string;
  readonly noResults: string;
}

// 功能翻译接口
export interface FeaturesTranslation {
  readonly title: string;
  readonly fast: BaseTranslation;
  readonly secure: BaseTranslation;
  readonly quality: BaseTranslation;
  readonly free: BaseTranslation;
}

// 使用场景翻译接口
export interface UseCasesTranslation {
  readonly title: string;
  readonly webDev: BaseTranslation;
  readonly mobile: BaseTranslation;
  readonly social: BaseTranslation;
  readonly email: BaseTranslation;
  readonly storage: BaseTranslation;
  readonly ecommerce: BaseTranslation;
}

// 完美适用翻译接口
export interface PerfectForTranslation {
  readonly title: string;
  readonly webDevelopers: BaseTranslation;
  readonly designers: BaseTranslation;
  readonly socialMedia: BaseTranslation;
  readonly emailAttachments: BaseTranslation;
  readonly ecommerce: BaseTranslation;
  readonly photoStorage: BaseTranslation;
}

// FAQ 翻译接口
export interface FAQTranslation {
  readonly title: string;
  readonly questions: {
    readonly privacy: {
      readonly question: string;
      readonly answer: string;
    };
    readonly fileSize: {
      readonly question: string;
      readonly answer: string;
    };
    readonly compression: {
      readonly question: string;
      readonly answer: string;
    };
    readonly account: {
      readonly question: string;
      readonly answer: string;
    };
    readonly browsers: {
      readonly question: string;
      readonly answer: string;
    };
  };
}

// 格式翻译接口
export interface FormatsTranslation {
  readonly title: string;
  readonly jpeg: BaseTranslation;
  readonly png: BaseTranslation;
  readonly webp: BaseTranslation;
  readonly gif: BaseTranslation;
}

// 转换器翻译接口
export interface ConverterTranslation {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly supportedFormats: string;
  readonly dragDrop: string;
  readonly clickToUpload: string;
  readonly supportedFormatsList: string;
  readonly maxSize: string;
  readonly uploadedFiles: string;
  readonly removeFile: string;
  readonly ready: string;
  readonly converting: string;
  readonly download: string;
  readonly downloadAll: string;
  readonly convertMore: string;
  readonly noResults: string;
  readonly before: string;
  readonly after: string;
  readonly originalSize: string;
  readonly convertedSize: string;
  readonly spaceSaved: string;
  readonly quality: string;
  readonly dimensions: string;
  readonly settings: string;
  readonly reset: string;
  readonly formats: {
    readonly jpg: BaseTranslation;
    readonly png: BaseTranslation;
    readonly webp: BaseTranslation;
    readonly gif: BaseTranslation;
    readonly avif: BaseTranslation;
    readonly heic: BaseTranslation;
    readonly bmp: BaseTranslation;
    readonly tiff: BaseTranslation;
    readonly ico: BaseTranslation;
    readonly svg: BaseTranslation;
  };
  readonly conversions: {
    readonly jpgToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly pngToJpg: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly webpToJpg: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly webpToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly pngToWebp: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly jpgToWebp: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly pngToAvif: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly jpgToAvif: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly webpToAvif: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly heicToJpg: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly heicToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly bmpToJpg: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly bmpToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly tiffToJpg: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly tiffToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly icoToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly svgToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly svgToJpg: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly gifToPng: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
    readonly gifToJpg: {
      readonly title: string;
      readonly description: string;
      readonly seoTitle: string;
      readonly seoDescription: string;
    };
  };
}

// 页脚翻译接口
export interface FooterTranslation {
  readonly description: string;
  readonly quickLinks: string;
  readonly legal: string;
  readonly links: {
    readonly privacy: string;
    readonly terms: string;
  };
  readonly copyright: string;
}

// 工作流程翻译接口
export interface HowItWorksTranslation {
  readonly title: string;
  readonly step1: BaseTranslation;
  readonly step2: BaseTranslation;
  readonly step3: BaseTranslation;
}

// CTA 翻译接口
export interface CTATranslation {
  readonly title: string;
  readonly subtitle: string;
  readonly button: string;
}

// 元数据翻译接口
export interface MetadataTranslation {
  readonly title: string;
  readonly description: string;
  readonly keywords: string;
  readonly openGraphTitle: string;
  readonly openGraphDescription: string;
  readonly twitterTitle: string;
  readonly twitterDescription: string;
}

// 隐私政策翻译接口
export interface PrivacyTranslation {
  readonly title: string;
  readonly lastUpdated: string;
  readonly introduction: BaseTranslation;
  readonly informationCollection: BaseTranslation;
  readonly dataProcessing: BaseTranslation;
  readonly cookies: BaseTranslation;
  readonly thirdParty: BaseTranslation;
  readonly dataSecurity: BaseTranslation;
  readonly changes: BaseTranslation;
  readonly contact: BaseTranslation;
}

// 服务条款翻译接口
export interface TermsTranslation {
  readonly title: string;
  readonly lastUpdated: string;
  readonly acceptance: BaseTranslation;
  readonly description: BaseTranslation;
  readonly userResponsibilities: BaseTranslation;
  readonly limitations: BaseTranslation;
  readonly prohibitedUses: BaseTranslation;
  readonly intellectualProperty: BaseTranslation;
  readonly disclaimer: BaseTranslation;
  readonly limitationLiability: BaseTranslation;
  readonly governingLaw: BaseTranslation;
  readonly changes: BaseTranslation;
  readonly contact: BaseTranslation;
}

// 压缩器翻译接口
export interface CompressorTranslation {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly description: string;
  };
  readonly stats: {
    readonly reduction: { value: string; label: string };
    readonly formats: { value: string; label: string };
    readonly batch: { value: string; label: string };
  };
  readonly upload: {
    readonly title: string;
    readonly subtitle: string;
  };
  readonly howItWorks: {
    readonly title: string;
    readonly subtitle: string;
    readonly steps: {
      readonly upload: { title: string; description: string };
      readonly settings: { title: string; description: string };
      readonly process: { title: string; description: string };
      readonly download: { title: string; description: string };
    };
  };
  readonly notes: {
    readonly title: string;
    readonly subtitle: string;
    readonly items: Array<{
      readonly icon: string;
      readonly title: string;
      readonly content: string;
      readonly type: 'warning' | 'tip' | 'info';
    }>;
  };
  readonly faq: {
    readonly title: string;
    readonly subtitle: string;
    readonly items: Array<{
      readonly question: string;
      readonly answer: string;
    }>;
  };
  readonly formats: {
    readonly jpeg: FormatSpecificTranslation;
    readonly png: FormatSpecificTranslation;
    readonly webp: FormatSpecificTranslation;
    readonly avif: FormatSpecificTranslation;
    readonly gif: FormatSpecificTranslation;
  };
}

// 格式特定翻译接口
export interface FormatSpecificTranslation {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly settings: {
    readonly title: string;
    readonly [key: string]: string;
  };
  readonly steps: Array<{
    readonly step: string;
    readonly title: string;
    readonly description: string;
    readonly icon: string;
  }>;
  readonly notes: Array<{
    readonly icon: string;
    readonly title: string;
    readonly content: string;
    readonly type: 'warning' | 'tip' | 'info';
  }>;
  readonly faq: Array<{
    readonly question: string;
    readonly answer: string;
  }>;
}

// 格式特定翻译接口
export interface FormatTranslation {
  readonly hero: {
    readonly icon: string;
    readonly title: string;
    readonly subtitle: string;
    readonly description: string;
    readonly gradient: string;
  };
  readonly stats: Array<{
    readonly value: string;
    readonly label: string;
    readonly color: string;
  }>;
  readonly howItWorks: {
    readonly title: string;
    readonly subtitle: string;
    readonly steps: Array<{
      readonly step: string;
      readonly title: string;
      readonly description: string;
      readonly icon: string;
    }>;
  };
  readonly notes: {
    readonly title: string;
    readonly subtitle: string;
    readonly items: Array<{
      readonly icon: string;
      readonly title: string;
      readonly content: string;
      readonly type: 'warning' | 'tip' | 'info';
    }>;
  };
  readonly faq: {
    readonly title: string;
    readonly subtitle: string;
    readonly items: Array<{
      readonly question: string;
      readonly answer: string;
    }>;
  };
}

// 完整翻译接口
export interface Translations {
  readonly metadata: MetadataTranslation;
  readonly nav: NavTranslation;
  readonly hero: HeroTranslation;
  readonly upload: UploadTranslation;
  readonly compression: CompressionTranslation;
  readonly results: ResultsTranslation;
  readonly features: FeaturesTranslation;
  readonly useCases: UseCasesTranslation;
  readonly perfectFor: PerfectForTranslation;
  readonly faq: FAQTranslation;
  readonly formats: FormatsTranslation;
  readonly converter: ConverterTranslation;
  readonly footer: FooterTranslation;
  readonly howItWorks: HowItWorksTranslation;
  readonly cta: CTATranslation;
  readonly privacy: PrivacyTranslation;
  readonly terms: TermsTranslation;
  readonly compressor: CompressorTranslation;
}

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

// 格式特定翻译缓存
const formatTranslationCache = new Map<string, Record<string, FormatTranslation>>();

// 获取格式特定翻译
export const getFormatTranslations = async (format: string, locale: SupportedLanguage): Promise<FormatTranslation | null> => {
  try {
    // 检查缓存
    const cacheKey = `${format}_${locale}`;
    if (formatTranslationCache.has(cacheKey)) {
      const cached = formatTranslationCache.get(cacheKey);
      return cached?.[locale] || null;
    }

    // 动态加载格式翻译
    const formatTranslations = await import(`./translations/format-translations`);
    const translationKey = `${format}Translations` as keyof typeof formatTranslations;
    const translations = formatTranslations[translationKey] as Record<string, FormatTranslation> | undefined;
    
    if (!translations || !translations[locale]) {
      console.warn(`No translations found for format ${format} and locale ${locale}`);
      return null;
    }

    // 缓存翻译
    formatTranslationCache.set(cacheKey, translations);
    
    return translations[locale];
  } catch (error) {
    console.error(`Failed to load format translations for ${format}/${locale}:`, error);
    return null;
  }
};

// 清理格式翻译缓存
export const clearFormatTranslationCache = (): void => {
  formatTranslationCache.clear();
};