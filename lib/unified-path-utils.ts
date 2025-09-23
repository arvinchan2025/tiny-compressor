/**
 * 统一路径处理工具
 * 处理多语言路由和链接生成
 */

import { SupportedLanguage } from '@/types/i18n';

// 支持的语言列表
export const SUPPORTED_LOCALES: SupportedLanguage[] = ['en', 'zh', 'es', 'de', 'fr', 'ar'];
export const DEFAULT_LOCALE: SupportedLanguage = 'en';

/**
 * 路径类型定义
 */
export type PathType = 
  | 'home'
  | 'compressor' 
  | 'converter'
  | 'privacy'
  | 'terms'
  | 'conversion'
  | 'compression';

/**
 * 路径配置
 */
const PATH_CONFIG: Record<PathType, string> = {
  home: '',
  compressor: 'compressor',
  converter: 'converter', 
  privacy: 'privacy',
  terms: 'terms',
  conversion: 'converter',
  compression: 'compressor'
};

/**
 * 统一路径生成器
 * @param pathType 路径类型
 * @param locale 语言
 * @param subPath 子路径（可选）
 * @returns 完整的路径
 */
export function createPath(
  pathType: PathType, 
  locale: SupportedLanguage = DEFAULT_LOCALE,
  subPath?: string
): string {
  const basePath = PATH_CONFIG[pathType];
  
  // 构建完整路径
  let fullPath = basePath;
  if (subPath) {
    fullPath = `${basePath}/${subPath}`;
  }
  
  // 处理语言前缀
  if (locale === DEFAULT_LOCALE) {
    // 英语作为默认语言，不添加语言前缀
    return fullPath === '' ? '/' : `/${fullPath}`;
  } else {
    // 其他语言添加语言前缀
    return fullPath === '' ? `/${locale}` : `/${locale}/${fullPath}`;
  }
}

/**
 * 获取主页路径
 */
export function getHomePath(locale: SupportedLanguage = DEFAULT_LOCALE): string {
  return createPath('home', locale);
}

/**
 * 获取压缩器页面路径
 */
export function getCompressorPath(locale: SupportedLanguage = DEFAULT_LOCALE): string {
  return createPath('compressor', locale);
}

/**
 * 获取转换器页面路径
 */
export function getConverterPath(locale: SupportedLanguage = DEFAULT_LOCALE): string {
  return createPath('converter', locale);
}

/**
 * 获取隐私政策路径
 */
export function getPrivacyPath(locale: SupportedLanguage = DEFAULT_LOCALE): string {
  return createPath('privacy', locale);
}

/**
 * 获取服务条款路径
 */
export function getTermsPath(locale: SupportedLanguage = DEFAULT_LOCALE): string {
  return createPath('terms', locale);
}

/**
 * 获取转换路径（用于特定转换类型）
 */
export function getConversionPath(
  conversion: string, 
  locale: SupportedLanguage = DEFAULT_LOCALE
): string {
  return createPath('conversion', locale, conversion);
}

/**
 * 获取压缩路径（用于特定压缩类型）
 */
export function getCompressionPath(
  compression: string, 
  locale: SupportedLanguage = DEFAULT_LOCALE
): string {
  return createPath('compression', locale, compression);
}

/**
 * 从路径中提取语言
 */
export function extractLocaleFromPath(pathname: string): SupportedLanguage {
  for (const locale of SUPPORTED_LOCALES) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  
  return DEFAULT_LOCALE; // 默认返回英语
}

/**
 * 检查路径是否为当前语言
 */
export function isCurrentLanguagePath(pathname: string, locale: SupportedLanguage): boolean {
  if (locale === DEFAULT_LOCALE) {
    // 英语路径不包含语言前缀
    return !SUPPORTED_LOCALES.some(loc => 
      loc !== DEFAULT_LOCALE && 
      (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`)
    );
  }
  
  return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
}

/**
 * 清理路径（移除语言前缀）
 */
export function cleanPath(pathname: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.substring(locale.length + 1);
    } else if (pathname === `/${locale}`) {
      return '/';
    }
  }
  
  return pathname;
}

/**
 * 获取语言切换路径
 * 为当前页面生成其他语言的路径
 */
export function getLanguageSwitchPath(
  currentPath: string,
  targetLocale: SupportedLanguage
): string {
  const currentLocale = extractLocaleFromPath(currentPath);
  const cleanCurrentPath = cleanPath(currentPath);
  
  // 如果目标语言是英语，移除语言前缀
  if (targetLocale === DEFAULT_LOCALE) {
    return cleanCurrentPath === '/' ? '/' : `/${cleanCurrentPath}`;
  }
  
  // 其他语言添加语言前缀
  return cleanCurrentPath === '/' ? `/${targetLocale}` : `/${targetLocale}${cleanCurrentPath}`;
}

/**
 * 验证路径是否有效
 */
export function isValidPath(pathname: string): boolean {
  // 检查是否为有效的语言路径
  const locale = extractLocaleFromPath(pathname);
  const cleanPathname = cleanPath(pathname);
  
  // 基本路径验证
  const validPaths = ['', 'compressor', 'converter', 'privacy', 'terms'];
  const pathSegments = cleanPathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) return true; // 根路径
  if (pathSegments.length === 1) return validPaths.includes(pathSegments[0] || '');
  
  // 对于子路径，检查第一个段是否为有效路径
  return validPaths.includes(pathSegments[0] || '');
}

/**
 * 获取所有语言的当前页面路径
 */
export function getAllLanguagePaths(currentPath: string): Record<SupportedLanguage, string> {
  const result: Record<string, string> = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    result[locale] = getLanguageSwitchPath(currentPath, locale as SupportedLanguage);
  }
  
  return result as Record<SupportedLanguage, string>;
}

/**
 * 路径工具类
 * 提供链式API进行路径操作
 */
export class PathBuilder {
  private locale: SupportedLanguage;
  private pathType: PathType;
  private subPath?: string;

  constructor(locale: SupportedLanguage = DEFAULT_LOCALE) {
    this.locale = locale;
    this.pathType = 'home';
  }

  /**
   * 设置语言
   */
  setLocale(locale: SupportedLanguage): this {
    this.locale = locale;
    return this;
  }

  /**
   * 设置路径类型
   */
  setPathType(pathType: PathType): this {
    this.pathType = pathType;
    return this;
  }

  /**
   * 设置子路径
   */
  setSubPath(subPath: string): this {
    this.subPath = subPath;
    return this;
  }

  /**
   * 构建路径
   */
  build(): string {
    return createPath(this.pathType, this.locale, this.subPath);
  }

  /**
   * 获取所有语言的路径
   */
  getAllLanguages(): Record<SupportedLanguage, string> {
    const result: Record<string, string> = {};
    
    for (const locale of SUPPORTED_LOCALES) {
      result[locale] = createPath(this.pathType, locale as SupportedLanguage, this.subPath);
    }
    
    return result as Record<SupportedLanguage, string>;
  }
}

/**
 * 创建路径构建器
 */
export function createPathBuilder(locale: SupportedLanguage = DEFAULT_LOCALE): PathBuilder {
  return new PathBuilder(locale);
}
