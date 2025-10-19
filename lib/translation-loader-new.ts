/**
 * New Translation Loader for Modular Structure
 * Supports loading translations by language and category
 */

import { Locale, TranslationModule } from './i18n'

// 静态翻译模块列表 - 这些模块将在构建时打包
const STATIC_MODULES: TranslationModule[] = [
  'common/navigation',
  'common/ui', 
  'home'
]

// 检查是否为静态模块
function isStaticModule(module: TranslationModule): boolean {
  return STATIC_MODULES.includes(module)
}

// Translation file paths mapping
const translationPaths: Record<TranslationModule, string> = {
  // Common translations
  'common/ui': 'common/ui',
  'common/navigation': 'common/navigation', 
  'common/messages': 'common/messages',
  
  // Page translations
  'home': 'home',
  'footer': 'footer',
  'privacy': 'privacy',
  'terms': 'terms',
  
  // Navigation translations - REMOVED (now using common/navigation)
  // 'compressor': 'compressor',
  // 'converter': 'converter',
  
  // Compressor translations
  'compressors/png': 'compressors/png',
  'compressors/jpeg': 'compressors/jpeg',
  'compressors/webp': 'compressors/webp',
  'compressors/avif': 'compressors/avif',
  'compressors/gif': 'compressors/gif',
  'compressors/bmp': 'compressors/bmp',
  
  // Converter translations
  'converters/png-to-jpg': 'converters/png-to-jpg',
  'converters/png-to-webp': 'converters/png-to-webp',
  'converters/png-to-avif': 'converters/png-to-avif',
  'converters/jpeg-to-png': 'converters/jpeg-to-png',
  'converters/webp-to-png': 'converters/webp-to-png',
  
  // Legacy format translations (for backward compatibility) - REMOVED
  // All formats now use compressors/* or converters/* modules
  
  // Shared translations
  'shared/upload': 'shared/upload',
  'shared/processing': 'shared/processing',
  'shared/download': 'shared/download'
}

// Translation cache
const translationCache = new Map<string, any>()

/**
 * Load static translation from generated file
 */
async function loadStaticTranslation(
  locale: Locale, 
  module: TranslationModule
): Promise<any> {
  try {
    // 动态导入构建时生成的静态翻译
    const { translations } = await import('@/lib/translations/generated')
    
    if (translations[locale] && (translations[locale] as any)[module]) {
      return (translations[locale] as any)[module]
    } else {
      console.warn(`Static translation not found for ${locale}/${module}`)
      return {}
    }
  } catch (error) {
    console.error(`Failed to load static translation ${locale}/${module}:`, error)
    return {}
  }
}

/**
 * Load translation file with hybrid approach (static + dynamic)
 */
export async function loadTranslationFile(
  locale: Locale, 
  module: TranslationModule
): Promise<any> {
  const cacheKey = `${locale}/${module}`
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }
  
  let translation: any = {}
  
  try {
    if (isStaticModule(module)) {
      // 加载静态翻译 (从构建时生成的翻译中获取)
      translation = await loadStaticTranslation(locale, module)
    } else {
      // 加载动态翻译 (从文件系统获取)
      const path = translationPaths[module]
      if (!path) {
        console.warn(`Translation module not found: ${module}`)
        return {}
      }
      
      // Dynamic import based on new structure
      const dynamicTranslation = await import(`./i18n/translations/${locale}/${path}.json`)
      translation = dynamicTranslation.default
    }
    
    // Cache the translation
    translationCache.set(cacheKey, translation)
    
    return translation
  } catch (error) {
    console.error(`Failed to load translation ${locale}/${module}:`, error)
    return {}
  }
}

/**
 * Load multiple translation modules
 */
export async function loadTranslations(
  locale: Locale,
  modules: TranslationModule[]
): Promise<Record<string, any>> {
  const results: Record<string, any> = {}
  
  // Load all modules in parallel
  const promises = modules.map(async (module) => {
    const translation = await loadTranslationFile(locale, module)
    return { module, translation }
  })
  
  const loadedTranslations = await Promise.all(promises)
  
  // Merge translations
  loadedTranslations.forEach(({ module, translation }) => {
    results[module] = translation
  })
  
  return results
}

/**
 * Get translation for specific key path
 */
export function getTranslationValue(
  translations: Record<string, any>,
  keyPath: string,
  params?: Record<string, string | number | boolean | { returnObjects?: boolean }>
): any {
  const keys = keyPath.split('.')
  let value: any = translations
  
  // Navigate through the key path
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return keyPath // Return original key if not found
    }
  }
  
  // Check if returnObjects is requested
  const returnObjects = params && typeof params === 'object' && 'returnObjects' in params && params.returnObjects;
  
  // If returnObjects is true, return the value as-is (could be object or array)
  if (returnObjects) {
    return value;
  }
  
  if (typeof value === 'string') {
    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }
    return value
  }
  
  // If value is not a string and returnObjects is not requested, return keyPath
  return keyPath
}

/**
 * Create translation function for specific module
 */
export function createTranslationFunction(
  locale: Locale,
  module: TranslationModule
) {
  return async (keyPath: string, params?: Record<string, string | number | boolean>) => {
    const translation = await loadTranslationFile(locale, module)
    return getTranslationValue(translation, keyPath, params)
  }
}

/**
 * Preload common translations for better performance
 */
export async function preloadCommonTranslations(locale: Locale) {
  const commonModules: TranslationModule[] = [
    'common/ui',
    'common/navigation',
    'common/messages'
  ]
  
  await loadTranslations(locale, commonModules)
}

/**
 * Clear translation cache (useful for development)
 */
export function clearTranslationCache() {
  translationCache.clear()
}
