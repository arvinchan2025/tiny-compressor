/**
 * 国际化核心模块
 * 使用严格 TypeScript 类型
 */

import type { SupportedLanguage, LanguageInfo } from '../types';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = ['en', 'zh', 'es', 'de', 'fr', 'ar'] as const satisfies readonly SupportedLanguage[];

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// 语言信息配置
export const LANGUAGE_INFO: Record<SupportedLanguage, LanguageInfo> = {
  en: { 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇺🇸', 
    direction: 'ltr', 
    locale: 'en_US' 
  },
  zh: { 
    name: 'Chinese', 
    nativeName: '中文', 
    flag: '🇨🇳', 
    direction: 'ltr', 
    locale: 'zh_CN' 
  },
  es: { 
    name: 'Spanish', 
    nativeName: 'Español', 
    flag: '🇪🇸', 
    direction: 'ltr', 
    locale: 'es_ES' 
  },
  de: { 
    name: 'German', 
    nativeName: 'Deutsch', 
    flag: '🇩🇪', 
    direction: 'ltr', 
    locale: 'de_DE' 
  },
  fr: { 
    name: 'French', 
    nativeName: 'Français', 
    flag: '🇫🇷', 
    direction: 'ltr', 
    locale: 'fr_FR' 
  },
  ar: { 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇸🇦', 
    direction: 'rtl', 
    locale: 'ar_SA' 
  }
} as const;

// 工具函数
export const isRTLLanguage = (locale: SupportedLanguage): boolean => {
  return LANGUAGE_INFO[locale].direction === 'rtl';
};

export const isValidLanguage = (language: string): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
};

export const getLanguageInfo = (locale: SupportedLanguage): LanguageInfo => {
  return LANGUAGE_INFO[locale];
};

// 生成 hreflang 标签
export const generateHreflangTags = (baseUrl: string = 'https://tinycompressor.com') => {
  return SUPPORTED_LANGUAGES.map(lang => ({
    hrefLang: lang,
    href: lang === 'en' ? baseUrl : `${baseUrl}/${lang}`
  }));
};

// 生成 alternates 配置
export const generateAlternatesConfig = (baseUrl: string = 'https://tinycompressor.com') => {
  const languages: Record<string, string> = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    languages[lang] = lang === 'en' ? baseUrl : `${baseUrl}/${lang}`;
  });

  return {
    canonical: baseUrl,
    languages
  };
};

// 生成 sitemap URLs
export const generateSitemapUrls = (baseUrl: string = 'https://tinycompressor.com') => {
  const urls: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
  }> = [];
  const currentDate = '2025-09-23'; // 更新为2025年9月23日

  // 主页
  SUPPORTED_LANGUAGES.forEach(lang => {
    urls.push({
      loc: lang === 'en' ? baseUrl : `${baseUrl}/${lang}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    });
  });

  // 压缩器页面
  SUPPORTED_LANGUAGES.forEach(lang => {
    urls.push({
      loc: lang === 'en' ? `${baseUrl}/compressor` : `${baseUrl}/${lang}/compressor`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    });
  });

  // 转换器页面
  SUPPORTED_LANGUAGES.forEach(lang => {
    urls.push({
      loc: lang === 'en' ? `${baseUrl}/converter` : `${baseUrl}/${lang}/converter`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
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

  // 具体压缩格式页面
  const compressFormats = ['compress-png', 'compress-jpg', 'compress-webp', 'compress-avif', 'compress-gif'];
  SUPPORTED_LANGUAGES.forEach(lang => {
    compressFormats.forEach(format => {
      urls.push({
        loc: lang === 'en' ? `${baseUrl}/${format}` : `${baseUrl}/${lang}/${format}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      });
    });
  });

  // 具体转换格式页面
  const convertFormats = [
    'convert-png-to-jpg', 'convert-jpg-to-png', 'convert-png-to-webp', 'convert-jpg-to-webp',
    'convert-png-to-avif', 'convert-jpg-to-avif', 'convert-webp-to-png', 'convert-webp-to-jpg',
    'convert-avif-to-png', 'convert-avif-to-jpg'
  ];
  SUPPORTED_LANGUAGES.forEach(lang => {
    convertFormats.forEach(format => {
      urls.push({
        loc: lang === 'en' ? `${baseUrl}/${format}` : `${baseUrl}/${lang}/${format}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      });
    });
  });

  return urls;
};

// 导出语言配置
export const locales = SUPPORTED_LANGUAGES;
export const languageInfo = LANGUAGE_INFO;