/**
 * useLazyTranslation Hook
 * 支持按需加载的翻译 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { SupportedLanguage } from '@/types/i18n';
import { loadTranslation, preloadTranslation } from '@/lib/i18n/lazy-translation-loader';

interface UseLazyTranslationOptions {
  locale: SupportedLanguage;
  module: string;
  preload?: string[]; // 预加载的其他模块
}

interface UseLazyTranslationReturn {
  t: (key: string, params?: Record<string, any>, options?: { returnObjects?: boolean }) => any;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}

export function useLazyTranslation({
  locale,
  module,
  preload = []
}: UseLazyTranslationOptions): UseLazyTranslationReturn {
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

        // 加载主模块
        const data = await loadTranslation(locale, module);

        if (isMounted) {
          setTranslations(data);
          setIsLoading(false);
        }

        // 预加载其他模块（不阻塞）
        if (preload.length > 0) {
          preload.forEach(mod => preloadTranslation(locale, mod));
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
  }, [locale, module, preload]);

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
          return key; // 键不存在，返回键本身
        }
      }

      // 如果请求返回对象
      if (options?.returnObjects) {
        return value;
      }

      // 如果值不是字符串，返回键
      if (typeof value !== 'string') {
        return key;
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
 * 多模块翻译 Hook
 */
export function useMultiModuleTranslation(
  locale: SupportedLanguage,
  modules: string[]
): UseLazyTranslationReturn {
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const results = await Promise.all(
          modules.map(module => loadTranslation(locale, module))
        );

        if (isMounted) {
          const data: Record<string, any> = {};
          modules.forEach((module, index) => {
            data[module] = results[index];
          });
          setTranslations(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load translations'));
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [locale, modules.join(',')]);

  const t = useCallback(
    (key: string, params?: Record<string, any>, options?: { returnObjects?: boolean }) => {
      // 解析模块前缀（例如 "common:header.title"）
      const [modulePrefix, ...keyParts] = key.split(':');
      const actualKey = keyParts.length > 0 ? keyParts.join(':') : modulePrefix;
      const module = keyParts.length > 0 ? modulePrefix : modules[0];

      if (!translations[module]) {
        return key;
      }

      // 解析嵌套键
      const keys = actualKey.split('.');
      let value: any = translations[module];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }

      if (options?.returnObjects) {
        return value;
      }

      if (typeof value !== 'string') {
        return key;
      }

      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }

      return value;
    },
    [translations, modules]
  );

  return {
    t,
    isLoading,
    isReady: !isLoading && !error && Object.keys(translations).length > 0,
    error
  };
}



