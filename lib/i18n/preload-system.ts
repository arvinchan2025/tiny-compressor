/**
 * 翻译预加载系统
 * 在服务器端渲染时预加载关键翻译
 */

import { Locale } from './index'

interface PreloadConfig {
  modules: string[]
  priority: 'high' | 'medium' | 'low'
}

// 预加载配置
const PRELOAD_CONFIG: Record<string, PreloadConfig> = {
  'home': {
    modules: ['common/ui', 'common/navigation', 'home'],
    priority: 'high'
  },
  'compressor': {
    modules: ['common/ui', 'common/navigation', 'compressors/png', 'compressors/jpeg'],
    priority: 'high'
  },
  'converter': {
    modules: ['common/ui', 'common/navigation', 'converters/jpg-to-png'],
    priority: 'medium'
  }
}

// 预加载翻译数据
export async function preloadTranslations(locale: Locale, pageType: string): Promise<Record<string, any>> {
  const config = PRELOAD_CONFIG[pageType]
  if (!config) return {}
  
  const translations: Record<string, any> = {}
  
  for (const moduleName of config.modules) {
    try {
      const data = await import(`@/lib/i18n/translations/${locale}/${moduleName}.json`)
      translations[moduleName] = data.default || data
    } catch (error) {
      console.warn(`Failed to preload ${locale}/${moduleName}:`, error)
      translations[moduleName] = {}
    }
  }
  
  return translations
}

// 获取页面类型
export function getPageType(pathname: string): string {
  if (pathname.includes('/compressor/')) return 'compressor'
  if (pathname.includes('/converter/')) return 'converter'
  if (pathname === '/' || pathname.match(/^\/[a-z]{2}$/)) return 'home'
  return 'common'
}

