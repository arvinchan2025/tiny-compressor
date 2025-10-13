// Simplified internationalization system - based on color-block-jam
export type Locale = 'en' | 'zh' | 'es' | 'de' | 'fr' | 'ar' | 'ja' | 'ko' | 'pt' | 'ru' | 'it'
export type TranslationModule = 
  | 'common/ui'           // 通用UI组件翻译
  | 'common/navigation'   // 导航翻译
  | 'common/messages'     // 通用消息翻译
  | 'home' 
  | 'footer' 
  | 'privacy' 
  | 'terms'
  // 'compressor' and 'converter' modules removed - now using common/navigation
  | 'compressors/png'     // PNG压缩器
  | 'compressors/jpeg'    // JPEG压缩器
  | 'compressors/webp'    // WebP压缩器
  | 'compressors/avif'    // AVIF压缩器
  | 'compressors/gif'     // GIF压缩器
  | 'compressors/bmp'     // BMP压缩器
  | 'converters/png-to-jpg'    // PNG转JPG
  | 'converters/png-to-webp'   // PNG转WebP
  | 'converters/png-to-avif'   // PNG转AVIF
  | 'converters/jpeg-to-png'   // JPEG转PNG
  | 'converters/webp-to-png'   // WebP转PNG
  | 'shared/upload'       // 文件上传共享翻译
  | 'shared/processing'   // 处理状态共享翻译
  | 'shared/download'     // 下载共享翻译
  | `compressors/${string}` // 动态压缩器模块
  | `converters/${string}`  // 动态转换器模块

// Default language
export const defaultLocale: Locale = 'en'

// Supported languages list
export const supportedLocales: Locale[] = ['en', 'zh', 'es', 'de', 'fr', 'ar', 'ja', 'ko', 'pt', 'ru', 'it']

// Language display names
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية'
}

// Language flags
export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  es: '🇪🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  ja: '🇯🇵',
  ko: '🇰🇷',
  ar: '🇸🇦'
}

// Compatibility list
export const locales = supportedLocales

// Re-export unified path utilities
export {
  getLocaleFromPath,
  getCleanPath,
  getLocalizedPath,
  isCurrentLanguagePath,
  removeLocalePrefix,
  addLocalePrefix,
  switchLocalePath,
  isMissingLocale,
  getSupportedLocales,
  isValidLocale
} from './i18n/path-utils'

// Check if locale is RTL
export function isRTL(locale: Locale): boolean {
  return locale === 'ar'
}

// Get language info
export function getLanguageInfo(locale: Locale) {
  return {
    name: localeNames[locale],
    nativeName: localeNames[locale],
    flag: localeFlags[locale],
    direction: isRTL(locale) ? 'rtl' : 'ltr',
    locale: locale
  }
}