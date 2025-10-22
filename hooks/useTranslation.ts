'use client'

import { useState, useEffect, useMemo } from 'react'
import { Locale, TranslationModule, getLocaleFromPath, supportedLocales, switchLocalePath, getCleanPath } from '@/lib/i18n'
import { translationPathGenerator, isModuleSupported, isLocaleSupported } from '@/lib/i18n/translation-config'

// 检查是否为支持的模块
function isSupportedModule(module: TranslationModule): boolean {
  return isModuleSupported(module as string);
}

// Translation Hook return type
interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => any
  locale: Locale
  isLoading: boolean
  switchLocale: (locale: Locale) => void
  availableLocales: Locale[]
  availableModules: TranslationModule[]
}

// Create translation function
function createTranslationFunction(translations: Record<string, any>, locale: string = 'en'): (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => any {
  return (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }): any => {
    // 如果翻译为空，返回键本身（避免水合错误）
    if (Object.keys(translations).length === 0) {
      return key
    }
    
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // 如果翻译键不匹配，返回键本身
        return key
      }
    }
    
    // If returnObjects is true, return the value as-is (could be object or array)
    if (params?.returnObjects) {
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
    
    // If the found value is an array or other type, return directly
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      return value
    }
    
    return key
  }
}

// 翻译Hook - 使用优化的按需加载
export function useTranslation(module: TranslationModule = 'common/ui', providedLocale?: Locale): UseTranslationReturn {
  // 检查是否为支持的模块
  if (!isSupportedModule(module)) {
    console.warn(`useTranslation: Module '${module}' is not a supported module.`)
    console.warn(`Supported modules: common/ui, common/navigation, home, compressor, converter`)
  }
  
  const [locale, setLocale] = useState<Locale>(providedLocale || 'en')
  const [isLoading, setIsLoading] = useState(true)
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isClient, setIsClient] = useState(false)

  // 验证语言是否支持
  if (!isLocaleSupported(locale)) {
    console.warn(`useTranslation: Locale '${locale}' is not supported. Falling back to 'en'.`)
    setLocale('en')
  }

  // 检测客户端环境
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 翻译缓存
  const translationCache = useMemo(() => new Map<string, any>(), [])

  // 加载翻译数据 - 使用动态导入和缓存
  useEffect(() => {
    // 只在客户端加载翻译，服务器端不加载
    if (typeof window === 'undefined') return
    
    const cacheKey = `${locale}/${module}`
    
    // 检查缓存
    if (translationCache.has(cacheKey)) {
      setTranslations(translationCache.get(cacheKey))
      setIsLoading(false)
      return
    }
    
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        // 动态导入翻译文件
        const translationData = await import(`@/lib/i18n/translations/${locale}/${module}.json`)
        const translations = translationData.default || translationData
        
        // 缓存翻译数据
        translationCache.set(cacheKey, translations)
        setTranslations(translations)
      } catch (error) {
        console.error(`Failed to load translations for ${locale}/${module}:`, error)
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [isClient, locale, module, translationCache])

  // Detect current language (only if no locale provided)
  useEffect(() => {
    if (providedLocale) {
      setLocale(providedLocale)
      return
    }
    
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
    const detectedLocale = getLocaleFromPath(pathname)
    setLocale(detectedLocale)
  }, [providedLocale])

  // Listen for URL changes
  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
      const detectedLocale = getLocaleFromPath(pathname)
      setLocale(detectedLocale)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange)
      return () => window.removeEventListener('popstate', handleRouteChange)
    }
    
    return () => {} // Return cleanup function for all code paths
  }, [])

  // Switch language
  const switchLocale = (newLocale: Locale) => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      
      // Set cookie first to ensure language preference is saved
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
      
      // Use unified path utility to generate new path
      const newPath = switchLocalePath(currentPath, locale, newLocale)
      
      // Navigate to new path
      window.location.href = newPath
    }
  }

  // Create translation function
  const t = useMemo(() => {
    return createTranslationFunction(translations, locale)
  }, [translations, locale])

  return {
    t,
    locale,
    isLoading,
    switchLocale,
    availableLocales: supportedLocales as Locale[],
    availableModules: ['common/ui', 'common/navigation', 'home', 'compressor', 'converter'] as TranslationModule[],
  }
}

// 专门用于支持的翻译模块的Hook - 使用优化的按需加载
export function useStaticTranslation(module: TranslationModule, locale?: Locale): UseTranslationReturn {
  // 强制检查支持的模块
  if (!isSupportedModule(module)) {
    throw new Error(`useStaticTranslation: Module '${module}' is not a supported module.`)
  }
  
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale || 'en')
  const [isLoading, setIsLoading] = useState(true)
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isClient, setIsClient] = useState(false)

  // 检测客户端环境
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 设置语言
  useEffect(() => {
    if (locale) {
      setCurrentLocale(locale)
    } else {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
      const detectedLocale = getLocaleFromPath(pathname)
      setCurrentLocale(detectedLocale)
    }
  }, [locale])

  // 加载翻译数据 - 使用静态导入
  useEffect(() => {
    if (!isClient) return // 只在客户端加载翻译
    
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        // 直接导入翻译文件
        const translationData = await import(`@/lib/i18n/translations/${currentLocale}/${module}.json`)
        setTranslations(translationData.default || translationData)
      } catch (error) {
        console.error(`Failed to load static translations for ${currentLocale}/${module}:`, error)
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [isClient, currentLocale, module])

  // 创建翻译函数
  const t = useMemo(() => {
    return createTranslationFunction(translations, currentLocale)
  }, [translations, currentLocale])

  return {
    t,
    locale: currentLocale,
    isLoading,
    switchLocale: (newLocale: Locale) => {
      setCurrentLocale(newLocale)
    },
    availableLocales: supportedLocales as Locale[],
    availableModules: ['common/ui', 'common/navigation', 'home', 'compressor', 'converter'] as TranslationModule[],
  }
}

// Hook to get all translations (for debugging) - 已弃用，使用新的加载器
export function useAllTranslations() {
  console.warn('useAllTranslations is deprecated. Use the optimized translation loader instead.')
  return {
    translations: {},
    supportedLocales,
    supportedModules: ['common/ui', 'common/navigation', 'home', 'compressor', 'converter'],
  }
}