'use client';

import { useState, useEffect } from 'react';
import { Locale, TranslationModule, getLocaleFromPath } from '@/lib/i18n';
import { loadTranslations, getTranslationValue } from '@/lib/translation-loader-new';

interface UseModuleTranslationEnhancedReturn {
  t: (key: string, params?: Record<string, string | number | boolean>, options?: { returnObjects?: boolean }) => any;
  tAsync: (key: string, params?: Record<string, string | number | boolean>, options?: { returnObjects?: boolean }) => Promise<any>;
  locale: Locale;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}

// 全局缓存
const globalTranslationCache = new Map<string, any>();
const globalLoadingPromises = new Map<string, Promise<void>>();

export function useModuleTranslationEnhanced(module: TranslationModule, initialLocale?: Locale): UseModuleTranslationEnhancedReturn {
  const [locale, setLocale] = useState<Locale>(initialLocale || 'en');
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 从路径检测语言
  useEffect(() => {
    if (!initialLocale) {
      const pathLocale = getLocaleFromPath(window.location.pathname);
      if (pathLocale && pathLocale !== locale) {
        setLocale(pathLocale);
      }
    }
  }, [initialLocale, locale]);

  // 加载翻译模块
  useEffect(() => {
    let isMounted = true;
    const moduleKey = `${locale}-${module}`;

    const loadModule = async () => {
      // 检查缓存
      if (globalTranslationCache.has(moduleKey)) {
        const cachedData = globalTranslationCache.get(moduleKey);
        if (isMounted) {
          setTranslations(cachedData);
          setIsLoading(false);
          setIsReady(true);
        }
        return;
      }

      // 检查是否正在加载
      if (globalLoadingPromises.has(moduleKey)) {
        await globalLoadingPromises.get(moduleKey);
        const cachedData = globalTranslationCache.get(moduleKey);
        if (isMounted) {
          setTranslations(cachedData || {});
          setIsLoading(false);
          setIsReady(true);
        }
        return;
      }

      // 开始加载
      setIsLoading(true);
      setIsReady(false);
      setError(null);

      const loadingPromise = (async () => {
        try {
          console.log(`[useModuleTranslationEnhanced] Loading translations for ${moduleKey}`);
          const loadedTranslations = await loadTranslations(locale, [module]);
          console.log(`[useModuleTranslationEnhanced] Loaded translations:`, loadedTranslations);
          const moduleTranslations = loadedTranslations[module] || {};
          console.log(`[useModuleTranslationEnhanced] Module translations for ${module}:`, moduleTranslations);

          if (isMounted) {
            setTranslations(moduleTranslations);
            globalTranslationCache.set(moduleKey, moduleTranslations);
            setIsLoading(false);
            setIsReady(true);
            console.log(`[useModuleTranslationEnhanced] Successfully loaded and set translations for ${moduleKey}`);
          }
        } catch (err: any) {
          console.error(`[useModuleTranslationEnhanced] Failed to load module ${module} for locale ${locale}:`, err);
          if (isMounted) {
            setError(err);
            setTranslations({}); // 确保 translations 是一个对象
            setIsLoading(false);
            setIsReady(true);
          }
        } finally {
          globalLoadingPromises.delete(moduleKey);
        }
      })();

      globalLoadingPromises.set(moduleKey, loadingPromise);
      await loadingPromise;
    };

    loadModule();

    return () => {
      isMounted = false;
    };
  }, [locale, module]);

  // 同步翻译函数
  const t = (key: string, params?: Record<string, string | number | boolean>, options?: { returnObjects?: boolean }): any => {
    if (!translations) {
      return key; // 返回 key 作为后备
    }
    return getTranslationValue(translations, key, params, options);
  };

  // 异步翻译函数
  const tAsync = async (key: string, params?: Record<string, string | number | boolean>, options?: { returnObjects?: boolean }): Promise<any> => {
    if (translations) {
      return getTranslationValue(translations, key, params, options);
    }

    try {
      const loadedTranslations = await loadTranslations(locale, [module]);
      const moduleTranslations = loadedTranslations[module] || {};
      return getTranslationValue(moduleTranslations, key, params, options);
    } catch (err) {
      return key; // 返回 key 作为后备
    }
  };

  return {
    t,
    tAsync,
    locale,
    isLoading,
    isReady,
    error,
  };
}