'use client'

import { useState, useEffect, useMemo } from 'react'
import { Locale, TranslationModule, getLocaleFromPath } from '@/lib/i18n'
import { loadTranslations, getTranslationValue, preloadCommonTranslations } from '@/lib/translation-loader-new'

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

// Translation Hook return type
interface UseTranslationReturn {
  t: (module: TranslationModule, key: string, params?: Record<string, string | number | boolean>) => Promise<string>
  tSync: (translations: Record<string, any>, module: TranslationModule, key: string, params?: Record<string, string | number | boolean>) => string
  locale: Locale
  isLoading: boolean
  switchLocale: (locale: Locale) => void
  availableLocales: Locale[]
  loadedModules: Set<TranslationModule>
  preloadModule: (module: TranslationModule) => Promise<void>
}

// Translation state interface
interface TranslationState {
  translations: Record<string, any>
  loadedModules: Set<TranslationModule>
  isLoading: boolean
}

/**
 * New Translation Hook with modular loading
 */
export function useTranslationNew(initialModules: TranslationModule[] = []): UseTranslationReturn {
  const [locale, setLocale] = useState<Locale>('en')
  const [translationState, setTranslationState] = useState<TranslationState>({
    translations: {},
    loadedModules: new Set(),
    isLoading: false
  })

  // Get locale from path on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathLocale = getLocaleFromPath(window.location.pathname)
      if (pathLocale && pathLocale !== locale) {
        setLocale(pathLocale)
      }
    }
  }, [])

  // Load initial modules
  useEffect(() => {
    if (initialModules.length > 0) {
      loadModules(initialModules)
    }
  }, [locale, initialModules.join(',')])

  // Preload common translations
  useEffect(() => {
    preloadCommonTranslations(locale)
  }, [locale])

  const loadModules = async (modules: TranslationModule[]) => {
    const newModules = modules.filter(module => !translationState.loadedModules.has(module))
    
    if (newModules.length === 0) return

    setTranslationState(prev => ({ ...prev, isLoading: true }))

    try {
      // 分离静态和动态模块
      const staticModules = newModules.filter(isStaticModule)
      const dynamicModules = newModules.filter(module => !isStaticModule(module))
      
      let newTranslations: Record<string, any> = {}
      
      // 加载静态模块 (同步加载，从构建时生成的翻译中获取)
      if (staticModules.length > 0) {
        const staticTranslations = await loadStaticTranslations(locale, staticModules)
        newTranslations = { ...newTranslations, ...staticTranslations }
      }
      
      // 加载动态模块 (异步加载，按需从文件系统获取)
      if (dynamicModules.length > 0) {
        const dynamicTranslations = await loadTranslations(locale, dynamicModules)
        newTranslations = { ...newTranslations, ...dynamicTranslations }
      }
      
      setTranslationState(prev => ({
        translations: { ...prev.translations, ...newTranslations },
        loadedModules: new Set([...prev.loadedModules, ...newModules]),
        isLoading: false
      }))
    } catch (error) {
      console.error('Failed to load translations:', error)
      setTranslationState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const preloadModule = async (module: TranslationModule) => {
    if (translationState.loadedModules.has(module)) return
    await loadModules([module])
  }

  // Async translation function
  const t = async (
    module: TranslationModule, 
    key: string, 
    params?: Record<string, string | number | boolean>
  ): Promise<string> => {
    // Load module if not already loaded
    if (!translationState.loadedModules.has(module)) {
      await preloadModule(module)
    }

    const translation = translationState.translations[module] || {}
    return getTranslationValue(translation, key, params)
  }

  // Sync translation function (for already loaded modules)
  const tSync = (
    translations: Record<string, any>,
    module: TranslationModule, 
    key: string, 
    params?: Record<string, string | number | boolean>
  ): string => {
    // Check if translations object exists and has the module
    if (!translations || !translations[module]) {
      return key // Return key as fallback if module not loaded
    }
    const translation = translations[module]
    return getTranslationValue(translation, key, params)
  }

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    // Clear loaded translations when switching locale
    setTranslationState({
      translations: {},
      loadedModules: new Set(),
      isLoading: false
    })
  }

  const availableLocales: Locale[] = ['en', 'zh', 'es', 'de', 'fr', 'ar', 'ja', 'ko', 'pt', 'ru', 'it']

  return {
    t,
    tSync,
    translations: translationState.translations,
    locale,
    isLoading: translationState.isLoading,
    switchLocale,
    availableLocales,
    loadedModules: translationState.loadedModules,
    preloadModule
  }
}

/**
 * Simplified hook for specific module
 */
export function useModuleTranslation(module: TranslationModule, providedLocale?: Locale) {
  // 直接使用 generated.ts 中的翻译，不依赖 useTranslationNew
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  
  // 获取 locale：优先使用传入的，否则从 URL 获取
  const locale = useMemo(() => {
    if (providedLocale) return providedLocale
    if (typeof window !== 'undefined') {
      return getLocaleFromPath(window.location.pathname) || 'en'
    }
    return 'en'
  }, [providedLocale])
  
  // 加载翻译
  useEffect(() => {
    const loadModuleTranslations = async () => {
      setIsLoading(true)
      try {
        // 从 generated.ts 加载翻译
        const { translations: allTranslations } = await import('@/lib/translations/generated')
        
        if (allTranslations[locale] && allTranslations[locale][module]) {
          setTranslations({ [module]: allTranslations[locale][module] })
        } else {
          console.warn(`Translation not found for ${locale}/${module}`)
          setTranslations({})
        }
      } catch (error) {
        console.error(`Failed to load translation ${locale}/${module}:`, error)
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }
    
    loadModuleTranslations()
  }, [locale, module])
  
  const moduleT = useMemo(() => {
    return (key: string, params?: Record<string, string | number | boolean> | { returnObjects?: boolean }) => {
      // Check if translations object exists and module is loaded
      if (!translations || !translations[module]) {
        return key
      }
      return getTranslationValue(translations[module], key, params)
    }
  }, [translations, module])

  return {
    t: moduleT,
    isLoading,
    preloadModule: async () => {} // 不需要预加载，因为已经从 generated.ts 加载了
  }
}

/**
 * Hook for UI translations (common/ui module)
 */
export function useUITranslation(locale?: Locale) {
  return useModuleTranslation('common/ui', locale)
}

/**
 * Hook for navigation translations (common/navigation module)
 */
export function useNavigationTranslation(locale?: Locale) {
  return useModuleTranslation('common/navigation', locale)
}

/**
 * Hook for PNG compressor translations
 */
export function usePngCompressorTranslation(locale?: Locale) {
  return useModuleTranslation('compressors/png', locale)
}

/**
 * Hook for PNG to JPG converter translations
 */
export function usePngToJpgTranslation(locale?: Locale) {
  return useModuleTranslation('converters/png-to-jpg', locale)
}

/**
 * Hook for PNG to WebP converter translations
 */
export function usePngToWebpTranslation(locale?: Locale) {
  return useModuleTranslation('converters/png-to-webp', locale)
}

/**
 * Hook for PNG to AVIF converter translations
 */
export function usePngToAvifTranslation(locale?: Locale) {
  return useModuleTranslation('converters/png-to-avif', locale)
}

/**
 * Hook for JPEG compressor translations
 */
export function useJpegCompressorTranslation(locale?: Locale) {
  return useModuleTranslation('compressors/jpeg', locale)
}

/**
 * Hook for WebP compressor translations
 */
export function useWebpCompressorTranslation(locale?: Locale) {
  return useModuleTranslation('compressors/webp', locale)
}

/**
 * Hook for AVIF compressor translations
 */
export function useAvifCompressorTranslation(locale?: Locale) {
  return useModuleTranslation('compressors/avif', locale)
}

/**
 * Hook for GIF compressor translations
 */
export function useGifCompressorTranslation(locale?: Locale) {
  return useModuleTranslation('compressors/gif', locale)
}

/**
 * Hook for BMP compressor translations
 */
export function useBmpCompressorTranslation(locale?: Locale) {
  return useModuleTranslation('compressors/bmp', locale)
}

/**
 * 加载静态翻译模块 (从构建时生成的翻译中获取)
 */
async function loadStaticTranslations(locale: Locale, modules: TranslationModule[]): Promise<Record<string, any>> {
  try {
    // 动态导入构建时生成的静态翻译
    const { translations } = await import('@/lib/translations/generated')
    
    const result: Record<string, any> = {}
    
    for (const module of modules) {
      if (translations[locale] && translations[locale][module]) {
        result[module] = translations[locale][module]
      } else {
        console.warn(`Static translation not found for ${locale}/${module}`)
        result[module] = {}
      }
    }
    
    return result
  } catch (error) {
    console.error('Failed to load static translations:', error)
    return {}
  }
}
