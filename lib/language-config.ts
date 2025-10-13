/**
 * 统一语言配置文件
 * 所有语言相关的配置都在这里管理
 */

import type { SupportedLanguage, LanguageInfo } from '@/types/i18n';

// 支持的语言列表 - 统一配置
export const SUPPORTED_LANGUAGES = [
  'en', 'zh', 'es', 'de', 'fr', 'ar', 'ja', 'ko', 'pt', 'ru', 'it'
] as const satisfies readonly SupportedLanguage[];

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// 语言信息配置
export const LANGUAGE_INFO: Record<SupportedLanguage, LanguageInfo> = {
  en: { 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇺🇸', 
    direction: 'ltr', 
    locale: 'en_US' 
  },
  zh: { 
    name: 'Chinese', 
    nativeName: '中文', 
    flag: '🇨🇳', 
    direction: 'ltr', 
    locale: 'zh_CN' 
  },
  es: { 
    name: 'Spanish', 
    nativeName: 'Español', 
    flag: '🇪🇸', 
    direction: 'ltr', 
    locale: 'es_ES' 
  },
  de: { 
    name: 'German', 
    nativeName: 'Deutsch', 
    flag: '🇩🇪', 
    direction: 'ltr', 
    locale: 'de_DE' 
  },
  fr: { 
    name: 'French', 
    nativeName: 'Français', 
    flag: '🇫🇷', 
    direction: 'ltr', 
    locale: 'fr_FR' 
  },
  ar: { 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇸🇦', 
    direction: 'rtl', 
    locale: 'ar_SA' 
  },
  ja: { 
    name: 'Japanese', 
    nativeName: '日本語', 
    flag: '🇯🇵', 
    direction: 'ltr', 
    locale: 'ja_JP' 
  },
  ko: { 
    name: 'Korean', 
    nativeName: '한국어', 
    flag: '🇰🇷', 
    direction: 'ltr', 
    locale: 'ko_KR' 
  },
  pt: { 
    name: 'Portuguese', 
    nativeName: 'Português', 
    flag: '🇵🇹', 
    direction: 'ltr', 
    locale: 'pt_PT' 
  },
  ru: { 
    name: 'Russian', 
    nativeName: 'Русский', 
    flag: '🇷🇺', 
    direction: 'ltr', 
    locale: 'ru_RU' 
  },
  it: { 
    name: 'Italian', 
    nativeName: 'Italiano', 
    flag: '🇮🇹', 
    direction: 'ltr', 
    locale: 'it_IT' 
  }
} as const;

// 语言名称映射 - 用于下拉选择器
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: LANGUAGE_INFO.en.nativeName,
  zh: LANGUAGE_INFO.zh.nativeName,
  es: LANGUAGE_INFO.es.nativeName,
  de: LANGUAGE_INFO.de.nativeName,
  fr: LANGUAGE_INFO.fr.nativeName,
  ar: LANGUAGE_INFO.ar.nativeName,
  ja: LANGUAGE_INFO.ja.nativeName,
  ko: LANGUAGE_INFO.ko.nativeName,
  pt: LANGUAGE_INFO.pt.nativeName,
  ru: LANGUAGE_INFO.ru.nativeName,
  it: LANGUAGE_INFO.it.nativeName
};

// 语言旗帜映射 - 用于UI显示
export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: LANGUAGE_INFO.en.flag,
  zh: LANGUAGE_INFO.zh.flag,
  es: LANGUAGE_INFO.es.flag,
  de: LANGUAGE_INFO.de.flag,
  fr: LANGUAGE_INFO.fr.flag,
  ar: LANGUAGE_INFO.ar.flag,
  ja: LANGUAGE_INFO.ja.flag,
  ko: LANGUAGE_INFO.ko.flag,
  pt: LANGUAGE_INFO.pt.flag,
  ru: LANGUAGE_INFO.ru.flag,
  it: LANGUAGE_INFO.it.flag
};

// 语言选择器选项 - 用于下拉菜单
export const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map(lang => ({
  code: lang,
  name: LANGUAGE_INFO[lang].name,
  nativeName: LANGUAGE_INFO[lang].nativeName,
  flag: LANGUAGE_INFO[lang].flag,
  direction: LANGUAGE_INFO[lang].direction
}));

// 工具函数
export const isRTLLanguage = (locale: SupportedLanguage): boolean => {
  return LANGUAGE_INFO[locale].direction === 'rtl';
};

export const isValidLanguage = (language: string): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
};

export const getLanguageInfo = (locale: SupportedLanguage): LanguageInfo => {
  return LANGUAGE_INFO[locale];
};

// 兼容性别名 - 保持向后兼容
export const SUPPORTED_LOCALES = SUPPORTED_LANGUAGES;
export const locales = SUPPORTED_LANGUAGES;
export const languageInfo = LANGUAGE_INFO;
