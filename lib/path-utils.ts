/**
 * 路径工具函数
 * 用于生成多语言路径
 * 
 * @deprecated 请使用 lib/unified-path-utils.ts 中的新API
 * 此文件保留用于向后兼容
 */

import { SupportedLanguage } from '@/types/i18n';
import {
  getHomePath as newGetHomePath,
  getCompressorPath as newGetCompressorPath,
  getConverterPath as newGetConverterPath,
  getConversionPath as newGetConversionPath,
  getCompressionPath as newGetCompressionPath,
  getPrivacyPath as newGetPrivacyPath,
  getTermsPath as newGetTermsPath,
  isCurrentLanguagePath as newIsCurrentLanguagePath,
  extractLocaleFromPath as newExtractLocaleFromPath,
  cleanPath as newCleanPath
} from './unified-path-utils';

/**
 * 获取主页路径
 * @deprecated 请使用 unified-path-utils 中的 getHomePath
 */
export const getHomePath = (locale: SupportedLanguage): string => {
  return newGetHomePath(locale);
};

/**
 * 获取压缩器页面路径
 * @deprecated 请使用 unified-path-utils 中的 getCompressorPath
 */
export const getCompressorPath = (locale: SupportedLanguage): string => {
  return newGetCompressorPath(locale);
};

/**
 * 获取转换器页面路径
 * @deprecated 请使用 unified-path-utils 中的 getConverterPath
 */
export const getConverterPath = (locale: SupportedLanguage): string => {
  return newGetConverterPath(locale);
};

/**
 * 获取转换路径（用于特定转换类型）
 * @deprecated 请使用 unified-path-utils 中的 getConversionPath
 */
export const getConversionPath = (conversion: string, locale: SupportedLanguage): string => {
  return newGetConversionPath(conversion, locale);
};

/**
 * 获取压缩路径（用于特定压缩类型）
 * @deprecated 请使用 unified-path-utils 中的 getCompressionPath
 */
export const getCompressionPath = (compression: string, locale: SupportedLanguage): string => {
  return newGetCompressionPath(compression, locale);
};

/**
 * 获取隐私政策路径
 * @deprecated 请使用 unified-path-utils 中的 getPrivacyPath
 */
export const getPrivacyPath = (locale: SupportedLanguage): string => {
  return newGetPrivacyPath(locale);
};

/**
 * 获取服务条款路径
 * @deprecated 请使用 unified-path-utils 中的 getTermsPath
 */
export const getTermsPath = (locale: SupportedLanguage): string => {
  return newGetTermsPath(locale);
};

/**
 * 检查路径是否为当前语言
 * @deprecated 请使用 unified-path-utils 中的 isCurrentLanguagePath
 */
export const isCurrentLanguagePath = (pathname: string, locale: SupportedLanguage): boolean => {
  return newIsCurrentLanguagePath(pathname, locale);
};

/**
 * 从路径中提取语言
 * @deprecated 请使用 unified-path-utils 中的 extractLocaleFromPath
 */
export const extractLocaleFromPath = (pathname: string): SupportedLanguage => {
  return newExtractLocaleFromPath(pathname);
};

/**
 * 清理路径（移除语言前缀）
 * @deprecated 请使用 unified-path-utils 中的 cleanPath
 */
export const cleanPath = (pathname: string): string => {
  return newCleanPath(pathname);
};