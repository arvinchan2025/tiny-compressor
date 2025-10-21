/**
 * 简化版 useTranslation Hook
 * 移除复杂的 fallback 逻辑，专注于翻译加载
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Locale, TranslationModule } from '@/lib/i18n'
import { generateFallback } from '@/lib/i18n/fallback-system'

interface UseTranslationV2Return {
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => any
  locale: Locale
  isLoading: boolean
  switchLocale: (locale: Locale) => void
  availableLocales: Locale[]
  availableModules: TranslationModule[]
}

export function useTranslationV2(module: TranslationModule = 'common/ui', providedLocale?: Locale): UseTranslationV2Return {
  const [locale, setLocale] = useState<Locale>(providedLocale || 'en')
  const [isLoading, setIsLoading] = useState(true)
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isClient, setIsClient] = useState(false)

  // 检测客户端环境
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 加载翻译数据
  useEffect(() => {
    if (!isClient) return
    
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        const translationData = await import(`@/lib/i18n/translations/${locale}/${module}.json`)
        setTranslations(translationData.default || translationData)
      } catch (error) {
        console.error(`Failed to load translations for ${locale}/${module}:`, error)
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [isClient, locale, module])

  // 简化的翻译函数
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }): any => {
      // 如果翻译为空，使用 fallback 系统
      if (Object.keys(translations).length === 0) {
        return generateFallback(key, module)
      }
      
      // 查找翻译
      const keys = key.split('.')
      let value: any = translations
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          // 翻译键不匹配，使用 fallback 系统
          return generateFallback(key, module)
        }
      }
      
      // 处理参数替换
      if (typeof value === 'string' && params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
      }
      
      // 处理对象返回
      if (params?.returnObjects) {
        return value
      }
      
      return value
    }
  }, [translations, module])

  // 切换语言
  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  return {
    t,
    locale,
    isLoading,
    switchLocale,
    availableLocales: ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'pt', 'ru', 'ar'],
    availableModules: ['common/ui', 'common/navigation', 'home', 'compressor', 'converter']
  }
}

