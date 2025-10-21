/**
 * 服务端渲染优化
 * 在服务端预加载翻译，避免水合错误
 */

import { Locale } from './index'

// 服务端翻译缓存
const serverTranslationsCache = new Map<string, Record<string, any>>()

// 服务端加载翻译
export async function loadServerTranslations(locale: Locale, module: string): Promise<Record<string, any>> {
  const cacheKey = `${locale}/${module}`
  
  if (serverTranslationsCache.has(cacheKey)) {
    return serverTranslationsCache.get(cacheKey)!
  }
  
  try {
    const data = await import(`@/lib/i18n/translations/${locale}/${module}.json`)
    const translations = data.default || data
    serverTranslationsCache.set(cacheKey, translations)
    return translations
  } catch (error) {
    console.warn(`Failed to load server translations for ${cacheKey}:`, error)
    return {}
  }
}

// 获取服务端翻译
export function getServerTranslations(locale: Locale, module: string): Record<string, any> {
  const cacheKey = `${locale}/${module}`
  return serverTranslationsCache.get(cacheKey) || {}
}

// 清理缓存
export function clearServerTranslationsCache() {
  serverTranslationsCache.clear()
}

