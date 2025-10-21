/**
 * 翻译提供者组件
 * 在页面级别预加载翻译，避免水合错误
 */

'use client'

import { useEffect, useState } from 'react'
import { Locale } from '@/lib/i18n'
import { preloadTranslations } from '@/lib/i18n/ssr-translations'

interface TranslationProviderProps {
  locale: Locale
  modules: string[]
  children: React.ReactNode
}

export default function TranslationProvider({ locale, modules, children }: TranslationProviderProps) {
  const [isPreloaded, setIsPreloaded] = useState(false)

  useEffect(() => {
    const preloadAll = async () => {
      try {
        await Promise.all(
          modules.map(module => preloadTranslations(locale, module))
        )
        setIsPreloaded(true)
      } catch (error) {
        console.error('Failed to preload translations:', error)
        setIsPreloaded(true) // 即使失败也继续渲染
      }
    }

    preloadAll()
  }, [locale, modules])

  // 在翻译预加载完成前，显示加载状态
  if (!isPreloaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading translations...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

