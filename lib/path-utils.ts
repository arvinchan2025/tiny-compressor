/**
 * 路径工具函数
 * 用于生成多语言路径
 */

import { SupportedLanguage } from '@/types/i18n';

/**
 * 获取主页路径
 */
export const getHomePath = (locale: SupportedLanguage): string => {
  return locale === 'en' ? '/' : `/${locale}`;
};

/**
 * 获取压缩器页面路径
 */
export const getCompressorPath = (locale: SupportedLanguage): string => {
  return locale === 'en' ? '/compressor' : `/${locale}/compressor`;
};

/**
 * 获取转换器页面路径
 */
export const getConverterPath = (locale: SupportedLanguage): string => {
  return locale === 'en' ? '/converter' : `/${locale}/converter`;
};

/**
 * 获取转换路径（用于特定转换类型）
 */
export const getConversionPath = (conversion: string, locale: SupportedLanguage): string => {
  const basePath = locale === 'en' ? '/converter' : `/${locale}/converter`;
  return `${basePath}/${conversion}`;
};

/**
 * 获取压缩路径（用于特定压缩类型）
 */
export const getCompressionPath = (compression: string, locale: SupportedLanguage): string => {
  const basePath = locale === 'en' ? '/compressor' : `/${locale}/compressor`;
  return `${basePath}/${compression}`;
};

/**
 * 获取隐私政策路径
 */
export const getPrivacyPath = (locale: SupportedLanguage): string => {
  return locale === 'en' ? '/privacy' : `/${locale}/privacy`;
};

/**
 * 获取服务条款路径
 */
export const getTermsPath = (locale: SupportedLanguage): string => {
  return locale === 'en' ? '/terms' : `/${locale}/terms`;
};

/**
 * 检查路径是否为当前语言
 */
export const isCurrentLanguagePath = (pathname: string, locale: SupportedLanguage): boolean => {
  if (locale === 'en') {
    return !pathname.startsWith('/zh/') && 
           !pathname.startsWith('/es/') && 
           !pathname.startsWith('/de/') && 
           !pathname.startsWith('/fr/') && 
           !pathname.startsWith('/ar/');
  }
  return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
};

/**
 * 从路径中提取语言
 */
export const extractLocaleFromPath = (pathname: string): SupportedLanguage => {
  const supportedLocales: SupportedLanguage[] = ['en', 'zh', 'es', 'de', 'fr', 'ar'];
  
  for (const locale of supportedLocales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  
  return 'en'; // 默认返回英语
};

/**
 * 清理路径（移除语言前缀）
 */
export const cleanPath = (pathname: string): string => {
  const supportedLocales: SupportedLanguage[] = ['en', 'zh', 'es', 'de', 'fr', 'ar'];
  
  for (const locale of supportedLocales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.substring(locale.length + 1);
    } else if (pathname === `/${locale}`) {
      return '/';
    }
  }
  
  return pathname;
};