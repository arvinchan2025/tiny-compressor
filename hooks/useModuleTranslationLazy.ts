/**
 * useModuleTranslationLazy Hook
 * 优化版的模块翻译 Hook，支持按需加载
 * 用于替代 useModuleTranslation，显著减少初始 bundle 大小
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { SupportedLanguage } from '@/types/i18n';
import { loadTranslation } from '@/lib/i18n/lazy-translation-loader';

interface UseModuleTranslationLazyReturn {
  t: (key: string, params?: Record<string, any>, options?: { returnObjects?: boolean }) => any;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}

/**
 * 懒加载模块翻译 Hook
 * 
 * @param module - 翻译模块路径（例如 "compressors/png", "converters/png-to-jpg"）
 * @param locale - 语言代码
 * @returns 翻译函数和加载状态
 * 
 * @example
 * ```tsx
 * const { t, isLoading } = useModuleTranslationLazy('compressors/png', 'en');
 * 
 * if (isLoading) return <LoadingSpinner />;
 * 
 * return <h1>{t('hero.title')}</h1>;
 * ```
 */
export function useModuleTranslationLazy(
  module: string,
  locale: SupportedLanguage
): UseModuleTranslationLazyReturn {
  const [translations, setTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载翻译
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await loadTranslation(locale, module);

        if (isMounted) {
          setTranslations(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load translation'));
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [locale, module]);

  // 翻译函数
  const t = useCallback(
    (key: string, params?: Record<string, any>, options?: { returnObjects?: boolean }) => {
      if (!translations) {
        return key;
      }

      // 解析嵌套键（例如 "hero.title"）
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // 键不存在，返回键本身
          return key;
        }
      }

      // 如果请求返回对象
      if (options?.returnObjects) {
        return value;
      }

      // 如果值不是字符串，返回原值（可能是数组或对象）
      if (typeof value !== 'string') {
        return value;
      }

      // 替换参数
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }

      return value;
    },
    [translations]
  );

  return {
    t,
    isLoading,
    isReady: !isLoading && !error && translations !== null,
    error
  };
}

/**
 * 兼容旧版 useModuleTranslation 的别名
 */
export const useModuleTranslation = useModuleTranslationLazy;



