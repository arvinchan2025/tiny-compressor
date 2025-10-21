/**
 * 服务端翻译预加载
 * 在服务端预加载翻译，避免水合错误
 */

import { Locale } from './index'

// 服务端翻译缓存
const serverTranslations = new Map<string, Record<string, any>>()

// 预加载翻译
export async function preloadTranslations(locale: Locale, module: string): Promise<Record<string, any>> {
  const cacheKey = `${locale}/${module}`
  
  if (serverTranslations.has(cacheKey)) {
    return serverTranslations.get(cacheKey)!
  }
  
  try {
    const data = await import(`@/lib/i18n/translations/${locale}/${module}.json`)
    const translations = data.default || data
    serverTranslations.set(cacheKey, translations)
    return translations
  } catch (error) {
    console.warn(`Failed to preload translations for ${cacheKey}:`, error)
    return {}
  }
}

// 获取预加载的翻译
export function getPreloadedTranslations(locale: Locale, module: string): Record<string, any> {
  const cacheKey = `${locale}/${module}`
  return serverTranslations.get(cacheKey) || {}
}

// 检查翻译是否已预加载
export function hasPreloadedTranslations(locale: Locale, module: string): boolean {
  const cacheKey = `${locale}/${module}`
  return serverTranslations.has(cacheKey)
}

