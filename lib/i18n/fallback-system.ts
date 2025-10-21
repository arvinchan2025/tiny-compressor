/**
 * 分层 Fallback 系统
 * 将 fallback 逻辑从 useTranslation 中分离出来
 */

export interface FallbackConfig {
  [key: string]: string | object | any[]
}

// 通用 fallback 配置
const COMMON_FALLBACKS: FallbackConfig = {
  'hero.title': 'TinyCompressor',
  'hero.subtitle': 'Free Online Image Compression and Conversion Tools',
  'hero.quickActions.compressFiles': 'Compress Files',
  'hero.quickActions.convertFormats': 'Convert Formats',
  'hero.description': 'Compress your images online with our advanced compression technology',
  'formatInfo.description': 'High-quality image format with advanced compression features',
  'features.title': 'Key Features',
  'features.description': 'Why choose our compression tool',
  'useCases.title': 'Use Cases',
  'useCases.description': 'Perfect for various image compression needs',
}

// 页面特定的 fallback 配置
const PAGE_FALLBACKS: Record<string, FallbackConfig> = {
  'compressors/png': {
    'hero.title': 'PNG Compressor',
    'hero.description': 'Compress PNG images online with advanced compression technology',
    'formatInfo.description': 'PNG (Portable Network Graphics) is a raster graphics file format that supports lossless data compression and transparency.',
  },
  'compressors/jpeg': {
    'hero.title': 'JPEG Compressor',
    'hero.description': 'Compress JPEG images online with advanced compression technology',
    'formatInfo.description': 'JPEG is a commonly used method of lossy compression for digital images.',
  },
  'home': {
    'heroStats': [
      { number: '90%', label: 'Size Reduction', color: 'blue' },
      { number: '16+', label: 'Formats', color: 'green' },
      { number: '100%', label: 'Free', color: 'purple' },
      { number: '<1s', label: 'Processing', color: 'orange' }
    ]
  }
}

// 智能 fallback 生成器
export function generateFallback(key: string, module: string): any {
  // 1. 首先检查页面特定的 fallback
  if (PAGE_FALLBACKS[module] && PAGE_FALLBACKS[module][key]) {
    return PAGE_FALLBACKS[module][key]
  }
  
  // 2. 检查通用 fallback
  if (COMMON_FALLBACKS[key]) {
    return COMMON_FALLBACKS[key]
  }
  
  // 3. 智能生成 fallback
  if (key.includes('title')) {
    return 'Title'
  }
  if (key.includes('description')) {
    return 'Description'
  }
  if (key.includes('button') || key.includes('cta')) {
    return 'Button'
  }
  if (key.includes('items') && key.includes('.')) {
    return []
  }
  
  // 4. 最后返回原始键
  return key
}

// 批量生成 fallback
export function generateFallbacks(keys: string[], module: string): Record<string, any> {
  const fallbacks: Record<string, any> = {}
  keys.forEach(key => {
    fallbacks[key] = generateFallback(key, module)
  })
  return fallbacks
}

