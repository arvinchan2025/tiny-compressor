/**
 * 服务端渲染优化
 * 在服务端预加载翻译，避免水合错误
 */

import { Locale } from "../i18n";

export type TranslationValue =
  | string
  | number
  | boolean
  | null
  | TranslationValue[]
  | {
      [key: string]: TranslationValue;
    };

export type Dictionary = Record<string, TranslationValue>;

// 服务端翻译缓存
const serverTranslationsCache = new Map<string, Record<string, any>>()

// 服务端加载翻译
export async function loadServerTranslations(module: string, locale: Locale): Promise<Record<string, any>> {
  const cacheKey = `${locale}/${module}`
  
  if (serverTranslationsCache.has(cacheKey)) {
    return serverTranslationsCache.get(cacheKey)!
  }
  
  try {
    const data = await import(`@/lib/i18n/translations/${locale}/${module}.json`)
    const translations = data.default || data
    serverTranslationsCache.set(cacheKey, translations)
    return translations
  } catch (error) {
    console.warn(`Failed to load server translations for ${cacheKey}:`, error)
    return {}
  }
}

// 获取服务端翻译
export function getServerTranslations(locale: Locale, module: string): Record<string, any> {
  const cacheKey = `${locale}/${module}`
  return serverTranslationsCache.get(cacheKey) || {}
}

// 清理缓存
export function clearServerTranslationsCache() {
  serverTranslationsCache.clear()
}

function getValue(
  dictionary: Dictionary,
  key: string
): TranslationValue | undefined {
  return key.split('.').reduce<TranslationValue | undefined>(
    (current, part) => {
      if (
        current === null ||
        typeof current !== 'object' ||
        Array.isArray(current)
      ) {
        return undefined;
      }

      return current[part];
    },
    dictionary
  );
}

export function createTranslator(dictionary: Dictionary) {
  // 获取字符串翻译
  const t = (
    key: string,
    params?: Record<string, string | number>
  ): string => {
    const value = getValue(dictionary, key);

    if (typeof value !== 'string') {
      return key;
    }

    let result = value;

    if (params) {
      Object.entries(params).forEach(([name, replacement]) => {
        result = result.replace(
          new RegExp(
            `{{${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}}}`,
            'g'
          ),
          String(replacement)
        );
      });
    }

    return result;
  };

  // 获取数组、对象、数字、布尔值等
  const getTranslation = <T extends TranslationValue>(
    key: string
  ): T | undefined => {
    return getValue(dictionary, key) as T | undefined;
  };

  return {
    t,
    getTranslation,
  };
}
