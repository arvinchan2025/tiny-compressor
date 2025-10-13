/**
 * 翻译系统配置
 */

import { SUPPORTED_LANGUAGES } from '../language-config';

/**
 * 是否启用新翻译系统
 * 可以通过环境变量 USE_NEW_TRANSLATIONS 控制
 */
export const USE_NEW_TRANSLATIONS = process.env['USE_NEW_TRANSLATIONS'] === 'true'

/**
 * 翻译系统配置
 */
export const TRANSLATION_CONFIG = {
  // 是否启用新翻译系统
  useNewTranslations: USE_NEW_TRANSLATIONS,
  
  // 默认语言
  defaultLocale: 'en',
  
  // 支持的语言列表
  supportedLocales: SUPPORTED_LANGUAGES,
  
  // 缓存配置
  cache: {
    // 内存缓存最大大小
    maxSize: 100,
    // 缓存过期时间（毫秒）
    ttl: 3600000, // 1小时
  },
  
  // API配置
  api: {
    // 基础路径
    basePath: '/api/translations',
    // 超时时间（毫秒）
    timeout: 5000,
  },
  
  // 预加载配置
  preload: {
    // 是否启用预加载
    enabled: true,
    // 预加载的模块
    modules: ['common', 'home'],
  }
} as const

/**
 * 检查是否应该使用新翻译系统
 * @returns 是否使用新翻译系统
 */
export function shouldUseNewTranslations(): boolean {
  return TRANSLATION_CONFIG.useNewTranslations
}

/**
 * 获取翻译API路径
 * @param locale 语言代码
 * @param module 模块名称
 * @returns API路径
 */
export function getTranslationApiPath(locale: string, module: string): string {
  return `${TRANSLATION_CONFIG.api.basePath}/${locale}/${module}`
}

/**
 * 检查语言是否支持
 * @param locale 语言代码
 * @returns 是否支持
 */
export function isLocaleSupported(locale: string): boolean {
  return TRANSLATION_CONFIG.supportedLocales.includes(locale as any)
}

/**
 * 获取默认语言
 * @returns 默认语言代码
 */
export function getDefaultLocale(): string {
  return TRANSLATION_CONFIG.defaultLocale
}


