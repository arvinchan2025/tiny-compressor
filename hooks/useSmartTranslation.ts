/**
 * useSmartTranslation Hook
 * 智能翻译加载，支持预加载和缓存
 * 零风险，向后兼容，SSR 友好
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { SupportedLanguage } from '@/types/i18n';
import { 
  isCoreModule, 
  getCoreTranslation,
  LAZY_MODULES 
} from '@/lib/translations/core';
import { createTranslationFunction } from '@/lib/i18n/translation-utils';

// 翻译缓存
const translationCache = new Map<string, any>();
const loadingPromises = new Map<string, Promise<any>>();

/**
 * 异步加载翻译模块
 */
async function loadTranslationAsync(
  locale: SupportedLanguage,
  module: string
): Promise<any> {
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
      // 动态导入
      const data = await import(`@/lib/i18n/translations/${locale}/${module}.json`);
      const result = data.default || data;
      translationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Failed to load translation: ${locale}/${module}`, error);
      
      // 尝试英语后备
      if (locale !== 'en') {
        try {
          const fallback = await import(`@/lib/i18n/translations/en/${module}.json`);
          const result = fallback.default || fallback;
          translationCache.set(cacheKey, result);
          return result;
        } catch (fallbackError) {
          console.error(`Failed to load fallback translation: en/${module}`, fallbackError);
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
 * 预加载翻译模块
 */
export function preloadTranslation(locale: SupportedLanguage, module: string): void {
  if (!isCoreModule(module)) {
    loadTranslationAsync(locale, module).catch(() => {
      // 忽略错误，预加载失败不影响功能
    });
  }
}

/**
 * 获取相关模块（用于预加载）
 */
function getRelatedModules(currentModule: string): string[] {
  const related: string[] = [];
  
  if (currentModule.startsWith('compressors/')) {
    // 预加载其他压缩器
    LAZY_MODULES
      .filter(m => m.startsWith('compressors/') && m !== currentModule)
      .slice(0, 2) // 只预加载前2个
      .forEach(m => related.push(m));
  } else if (currentModule.startsWith('converters/')) {
    // 预加载其他转换器
    LAZY_MODULES
      .filter(m => m.startsWith('converters/') && m !== currentModule)
      .slice(0, 2)
      .forEach(m => related.push(m));
  }
  
  return related;
}

interface UseSmartTranslationReturn {
  t: (key: string, params?: Record<string, any>, options?: { returnObjects?: boolean }) => any;
  isLoading: boolean;
  isReady: boolean;
}

/**
 * 智能翻译 Hook
 * 
 * @param module - 翻译模块路径
 * @param locale - 语言代码
 * @returns 翻译函数和加载状态
 * 
 * @example
 * ```tsx
 * const { t, isLoading } = useSmartTranslation('compressors/png', 'en');
 * 
 * if (isLoading) return <LoadingSpinner />;
 * 
 * return <h1>{t('hero.title')}</h1>;
 * ```
 */
export function useSmartTranslation(
  module: string,
  locale: SupportedLanguage
): UseSmartTranslationReturn {
  const [translations, setTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        // 检查是否为核心模块
        if (isCoreModule(module)) {
          // 同步加载核心模块
          const coreData = getCoreTranslation(locale, module);
          if (isMounted) {
            setTranslations(coreData);
          }
        } else {
          // 异步加载其他模块
          setIsLoading(true);
          const data = await loadTranslationAsync(locale, module);
          if (isMounted) {
            setTranslations(data);
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    // 预加载相关模块
    if (isMounted) {
      const relatedModules = getRelatedModules(module);
      relatedModules.forEach(relatedModule => {
        preloadTranslation(locale, relatedModule);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [module, locale]);

  // 翻译函数
  const t = useCallback(
    (key: string, params?: Record<string, any>, options?: { returnObjects?: boolean }) => {
      return createTranslationFunction(translations)(key, params, options);
    },
    [translations]
  );

  return {
    t,
    isLoading,
    isReady: !isLoading && translations !== null
  };
}

/**
 * 获取缓存统计
 */
export function getTranslationCacheStats() {
  return {
    cached: translationCache.size,
    loading: loadingPromises.size,
    keys: Array.from(translationCache.keys())
  };
}

/**
 * 清除缓存
 */
export function clearTranslationCache(locale?: SupportedLanguage): void {
  if (locale) {
    const keysToDelete: string[] = [];
    translationCache.forEach((_, key) => {
      if (key.startsWith(`${locale}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => translationCache.delete(key));
  } else {
    translationCache.clear();
  }
}


