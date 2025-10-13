'use client'

import { useState, useEffect, useMemo } from 'react'
import { Locale, TranslationModule, getLocaleFromPath, supportedLocales, switchLocalePath, getCleanPath } from '@/lib/i18n'

// Import generated translation data
import { translations, supportedModules } from '@/lib/translations/generated'

// 静态翻译模块列表 - 这些模块将在构建时打包
const STATIC_MODULES: TranslationModule[] = [
  'common/navigation',
  'common/ui', 
  'home',
  'footer'
]

// 检查是否为静态模块
function isStaticModule(module: TranslationModule): boolean {
  return STATIC_MODULES.includes(module)
}

// Translation Hook return type
interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number | boolean>) => any
  locale: Locale
  isLoading: boolean
  switchLocale: (locale: Locale) => void
  availableLocales: Locale[]
  availableModules: TranslationModule[]
}

// Create translation function
function createTranslationFunction(translations: Record<string, any>): (key: string, params?: Record<string, string | number | boolean>) => any {
  return (key: string, params?: Record<string, string | number | boolean>): any => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // If translation not found, return original key
      }
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

// 静态翻译Hook - 专门处理静态模块
export function useTranslation(module: TranslationModule = 'common/ui', providedLocale?: Locale): UseTranslationReturn {
  // 检查是否为静态模块
  if (!isStaticModule(module)) {
    console.warn(`useTranslation: Module '${module}' is not a static module. Consider using useTranslationNew for dynamic modules.`)
  }
  
  const [locale, setLocale] = useState<Locale>(providedLocale || 'en')
  const [isLoading, setIsLoading] = useState(!providedLocale)

  // Detect current language (only if no locale provided)
  useEffect(() => {
    if (providedLocale) {
      setLocale(providedLocale)
      setIsLoading(false)
      return
    }
    
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
    const detectedLocale = getLocaleFromPath(pathname)
    setLocale(detectedLocale)
    setIsLoading(false)
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

  // Use useMemo for performance optimization
  const currentTranslations = useMemo(() => {
    return (translations as any)[locale]?.[module] || {}
  }, [locale, module])

  // Create translation function
  const t = useMemo(() => {
    return createTranslationFunction(currentTranslations)
  }, [currentTranslations])

  return {
    t,
    locale,
    isLoading,
    switchLocale,
    availableLocales: supportedLocales as Locale[],
    availableModules: supportedModules as TranslationModule[],
  }
}

// 专门用于静态翻译模块的Hook
export function useStaticTranslation(module: TranslationModule, locale?: Locale): UseTranslationReturn {
  // 强制检查静态模块
  if (!isStaticModule(module)) {
    throw new Error(`useStaticTranslation: Module '${module}' is not a static module. Use useTranslationNew for dynamic modules.`)
  }
  
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale || 'en')
  const [isLoading, setIsLoading] = useState(true)

  // 设置语言
  useEffect(() => {
    if (locale) {
      setCurrentLocale(locale)
    } else {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
      const detectedLocale = getLocaleFromPath(pathname)
      setCurrentLocale(detectedLocale)
    }
    setIsLoading(false)
  }, [locale])

  // 获取静态翻译
  const currentTranslations = useMemo(() => {
    return (translations as any)[currentLocale]?.[module] || {}
  }, [currentLocale, module])

  // 创建翻译函数
  const t = useMemo(() => {
    return createTranslationFunction(currentTranslations)
  }, [currentTranslations])

  return {
    t,
    locale: currentLocale,
    isLoading,
    switchLocale: (newLocale: Locale) => {
      setCurrentLocale(newLocale)
    },
    availableLocales: supportedLocales as Locale[],
    availableModules: STATIC_MODULES as TranslationModule[],
  }
}

// Hook to get all translations (for debugging)
export function useAllTranslations() {
  return {
    translations,
    supportedLocales,
    supportedModules,
  }
}