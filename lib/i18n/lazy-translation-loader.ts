/**
 * Lazy Translation Loader
 * 按需加载翻译文件，显著减少初始 bundle 大小
 */

import { SupportedLanguage } from '@/types/i18n';

// 翻译缓存
const translationCache = new Map<string, any>();

// 正在加载的 Promise 缓存（避免重复加载）
const loadingPromises = new Map<string, Promise<any>>();

/**
 * 动态导入翻译模块
 */
async function importTranslation(locale: SupportedLanguage, module: string): Promise<any> {
  // 构建缓存键
  const cacheKey = `${locale}:${module}`;
  
  // 检查缓存
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  // 检查是否正在加载
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }
  
  // 创建加载 Promise
  const loadPromise = (async () => {
    try {
      // 动态导入翻译文件
      const translation = await import(`@/lib/i18n/translations/${locale}/${module}.json`);
      const data = translation.default || translation;
      
      // 存入缓存
      translationCache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error(`Failed to load translation: ${locale}/${module}`, error);
      
      // 失败时尝试加载英语作为后备
      if (locale !== 'en') {
        try {
          const fallback = await import(`@/lib/i18n/translations/en/${module}.json`);
          const data = fallback.default || fallback;
          translationCache.set(cacheKey, data);
          return data;
        } catch (fallbackError) {
          console.error(`Failed to load fallback translation: en/${module}`, fallbackError);
          return {};
        }
      }
      
      return {};
    } finally {
      // 清理 loading promise
      loadingPromises.delete(cacheKey);
    }
  })();
  
  // 存储 loading promise
  loadingPromises.set(cacheKey, loadPromise);
  
  return loadPromise;
}

/**
 * 批量加载多个翻译模块
 */
export async function loadTranslations(
  locale: SupportedLanguage,
  modules: string[]
): Promise<Record<string, any>> {
  const results = await Promise.all(
    modules.map(module => importTranslation(locale, module))
  );
  
  const translations: Record<string, any> = {};
  modules.forEach((module, index) => {
    translations[module] = results[index];
  });
  
  return translations;
}

/**
 * 加载单个翻译模块
 */
export async function loadTranslation(
  locale: SupportedLanguage,
  module: string
): Promise<any> {
  return importTranslation(locale, module);
}

/**
 * 预加载翻译模块（用于优化）
 */
export function preloadTranslation(locale: SupportedLanguage, module: string): void {
  // 不等待结果，只是触发加载
  importTranslation(locale, module).catch(() => {
    // 忽略错误，预加载失败不影响功能
  });
}

/**
 * 预加载多个翻译模块
 */
export function preloadTranslations(locale: SupportedLanguage, modules: string[]): void {
  modules.forEach(module => preloadTranslation(locale, module));
}

/**
 * 清除翻译缓存（用于语言切换）
 */
export function clearTranslationCache(locale?: SupportedLanguage): void {
  if (locale) {
    // 清除特定语言的缓存
    const keysToDelete: string[] = [];
    translationCache.forEach((_, key) => {
      if (key.startsWith(`${locale}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => translationCache.delete(key));
  } else {
    // 清除所有缓存
    translationCache.clear();
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return {
    size: translationCache.size,
    keys: Array.from(translationCache.keys()),
    loadingCount: loadingPromises.size
  };
}



