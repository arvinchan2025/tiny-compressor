/**
 * 统一的语言路径处理工具
 * 所有语言路径相关的逻辑都应该使用这个工具
 */

import {Locale, supportedLocales, defaultLocale} from '../i18n';
import {get} from "react-hook-form";

function getPathLocale(pathname: string): Locale | null {
  if(!pathname) return null
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  if (!firstSegment || !isValidLocale(firstSegment)) {
    return null;
  }

  return firstSegment;
}

/**
 * 从路径中提取语言代码
 * @param pathname 路径名，如 "/zh/compressor" 或 "/compressor"
 * @returns 语言代码，如果路径中没有语言前缀则返回默认语言
 */
export function getLocaleFromPath(pathname: string): Locale {
  // const pathSegments = pathname.split('/').filter(Boolean);
  //
  // if (pathSegments.length > 0 && supportedLocales.includes(pathSegments[0] as Locale)) {
  //   return pathSegments[0] as Locale;
  // }
  //
  return getPathLocale(pathname) ?? defaultLocale;
}

/**
 * 获取不含语言前缀的干净路径
 * @param pathname 原始路径，如 "/zh/compressor" 或 "/compressor"
 * @returns 干净路径，如 "/compressor"
 */
export function getCleanPath(pathname: string): string {
  const locale = getPathLocale(pathname);

  if (!locale) {
    return pathname || '/';
  }

  return pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/';
  //
  // const locale = getLocaleFromPath(pathname);
  //
  // if (locale === defaultLocale) {
  //   return pathname;
  // }
  //
  // return pathname.replace(`/${locale}`, '') || '/';
}

/**
 * 为指定语言生成本地化路径
 * @param pathname 原始路径，如 "/compressor"
 * @param locale 目标语言
 * @returns 本地化路径，如 "/zh/compressor" 或 "/compressor"（英语）
 */
export function getLocalizedPath(pathname: string, locale: Locale): string {
  const cleanPath = getCleanPath(pathname);

  if (locale === defaultLocale) {
    return cleanPath;
  }

  return `/${locale}${cleanPath}`;
}

/**
 * 检查路径是否包含指定语言的前缀
 * @param pathname 路径名
 * @param locale 要检查的语言
 * @returns 是否包含该语言前缀
 */
export function isCurrentLanguagePath(pathname: string, locale: Locale): boolean {
  return getLocaleFromPath(pathname) === locale;
  // if (locale === defaultLocale) {
  //   // 英语路径不包含语言前缀
  //   return !supportedLocales.some(lang => lang !== defaultLocale && pathname.startsWith(`/${lang}`));
  // }
  //
  // return pathname.startsWith(`/${locale}`);
}

/**
 * 移除当前语言前缀，获取干净路径
 * @param pathname 原始路径
 * @param currentLocale 当前语言
 * @returns 移除语言前缀后的干净路径
 */
export function removeLocalePrefix(pathname: string, currentLocale: Locale): string {
  // 如果路径以当前语言前缀开头，移除它, 判断路径解析出来的语言是否为指定语言。英语没有显式前缀时，也属于英语路径
  const pathLocale = getPathLocale(pathname);

  if (pathLocale !== currentLocale) {
    return pathname || '/';
  }

  return pathname.replace(
    new RegExp(`^/${currentLocale}(?=/|$)`),
    ''
  ) || '/';
  // if (pathname.startsWith(`/${currentLocale}/`) || pathname === `/${currentLocale}`) {
  //   return pathname.replace(`/${currentLocale}`, '') || '/';
  // }
  //
  // // 否则返回原路径
  // return pathname;
}

/**
 * 添加语言前缀到路径
 * @param cleanPath 不含语言前缀的干净路径
 * @param locale 目标语言
 * @returns 添加语言前缀后的路径
 */
export function addLocalePrefix(cleanPath: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return cleanPath;
  }

  return `/${locale}${cleanPath}`;
}

/**
 * 切换语言时生成新的URL路径
 * @param currentPath 当前路径
 * @param currentLocale 当前语言
 * @param newLocale 新语言
 * @returns 新语言的路径
 */
export function switchLocalePath(currentPath: string, currentLocale: Locale, newLocale: Locale): string {
  const cleanPath = removeLocalePrefix(currentPath, currentLocale);
  return addLocalePrefix(cleanPath, newLocale);
}

/**
 * 检查路径是否缺少语言前缀
 * @param pathname 路径名
 * @returns 是否缺少语言前缀
 */
export function isMissingLocale(pathname: string): boolean {
  return getPathLocale(pathname) === null
  // return supportedLocales.every(
  //   (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  // );
}

/**
 * 获取所有支持的语言代码列表
 * @returns 支持的语言代码数组
 */
export function getSupportedLocales(): Locale[] {
  return [...supportedLocales];
}

/**
 * 验证语言代码是否有效
 * @param locale 要验证的语言代码
 * @returns 是否为有效的语言代码
 */
export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

/**
 * 生成导航链接路径（英语环境下不带语言前缀）
 * @param cleanPath 不含语言前缀的干净路径，如 "/compressor/compress-png"
 * @param locale 当前语言
 * @returns 导航链接路径，英语返回 "/compressor/compress-png"，其他语言返回 "/zh/compressor/compress-png"
 */
export function getNavigationPath(cleanPath: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return cleanPath;
  }

  return `/${locale}${cleanPath}`;
}

/**
 * 生成功能页面路径（英语环境下不带语言前缀）
 * @param pageType 页面类型，如 "compressor" 或 "converter"
 * @param format 格式，如 "png" 或 "png-to-jpg"
 * @param locale 当前语言
 * @returns 功能页面路径
 */
export function getFunctionalPagePath(pageType: string, format: string, locale: Locale): string {
  const cleanPath = `/${pageType}/${format}`;
  return getNavigationPath(cleanPath, locale);
}

/**
 * 生成导航页面路径（英语环境下不带语言前缀）
 * @param pageType 页面类型，如 "compressor" 或 "converter"
 * @param locale 当前语言
 * @returns 导航页面路径
 */
export function getNavigationPagePath(pageType: string, locale: Locale): string {
  const cleanPath = `/${pageType}`;
  return getNavigationPath(cleanPath, locale);
}
