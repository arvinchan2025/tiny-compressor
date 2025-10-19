/**
 * Hybrid Translation Loader
 * 混合模式：支持现有的 generated.ts 和新的懒加载
 * 允许渐进式迁移，向后兼容
 */

import { SupportedLanguage } from '@/types/i18n';

// 懒加载缓存
const lazyCache = new Map<string, any>();
const loadingPromises = new Map<string, Promise<any>>();

/**
 * 懒加载单个翻译模块
 */
export async function loadTranslationModule(
  locale: SupportedLanguage,
  module: string
): Promise<any> {
  const cacheKey = `${locale}:${module}`;
  
  // 检查缓存
  if (lazyCache.has(cacheKey)) {
    return lazyCache.get(cacheKey);
  }
  
  // 检查是否正在加载
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }
  
  // 创建加载 Promise
  const loadPromise = (async () => {
    try {
      // 动态导入
      const data = await import(`@/lib/i18n/translations/${locale}/${module}.json`);
      const result = data.default || data;
      lazyCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Failed to load ${locale}/${module}:`, error);
      
      // 尝试英语后备
      if (locale !== 'en') {
        try {
          const fallback = await import(`@/lib/i18n/translations/en/${module}.json`);
          const result = fallback.default || fallback;
          lazyCache.set(cacheKey, result);
          return result;
        } catch {
          return {};
        }
      }
      
      return {};
    } finally {
      loadingPromises.delete(cacheKey);
    }
  })();
  
  loadingPromises.set(cacheKey, loadPromise);
  return loadPromise;
}

/**
 * 预加载翻译模块（不阻塞）
 */
export function preloadTranslationModule(locale: SupportedLanguage, module: string): void {
  loadTranslationModule(locale, module).catch(() => {
    // 忽略错误
  });
}

/**
 * 批量预加载
 */
export function preloadTranslationModules(locale: SupportedLanguage, modules: string[]): void {
  modules.forEach(module => preloadTranslationModule(locale, module));
}

/**
 * 获取缓存统计
 */
export function getTranslationCacheStats() {
  return {
    cached: lazyCache.size,
    loading: loadingPromises.size,
    keys: Array.from(lazyCache.keys())
  };
}

/**
 * 清除缓存
 */
export function clearTranslationCache(locale?: SupportedLanguage): void {
  if (locale) {
    const keysToDelete: string[] = [];
    lazyCache.forEach((_, key) => {
      if (key.startsWith(`${locale}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => lazyCache.delete(key));
  } else {
    lazyCache.clear();
  }
}



