/**
 * useModuleTranslationOptimized Hook
 * 优化的模块翻译 Hook，集成智能预加载
 * 向后兼容，零风险，SSR 友好
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Locale, TranslationModule, getLocaleFromPath } from '@/lib/i18n';
import { loadTranslations, getTranslationValue, preloadCommonTranslations } from '@/lib/translation-loader-new';
import { preloadTranslation } from '@/hooks/useSmartTranslation';
import { isCoreModule, LAZY_MODULES } from '@/lib/translations/core';

// 静态翻译模块列表 - 这些模块将在构建时打包
const STATIC_MODULES: TranslationModule[] = [
  'common/navigation',
  'common/ui', 
  'home'
];

// 检查是否为静态模块
function isStaticModule(module: TranslationModule): boolean {
  return STATIC_MODULES.includes(module);
}

// Translation Hook return type
interface UseModuleTranslationOptimizedReturn {
  t: (module: TranslationModule, key: string, params?: Record<string, string | number | boolean>) => Promise<string>;
  tSync: (translations: Record<string, any>, module: TranslationModule, key: string, params?: Record<string, string | number | boolean>) => string;
  locale: Locale;
  isLoading: boolean;
  switchLocale: (locale: Locale) => void;
  availableLocales: Locale[];
  loadedModules: Set<TranslationModule>;
  preloadModule: (module: TranslationModule) => Promise<void>;
}

// 全局缓存
const globalTranslationsCache: Map<string, Record<string, any>> = new Map();
const globalLoadingPromises: Map<string, Promise<void>> = new Map();

/**
 * 获取相关模块（用于预加载）
 */
function getRelatedModules(currentModule: TranslationModule): TranslationModule[] {
  const related: TranslationModule[] = [];
  
  if (currentModule.startsWith('compressors/')) {
    // 预加载其他压缩器
    LAZY_MODULES
      .filter(m => m.startsWith('compressors/') && m !== currentModule)
      .slice(0, 2) // 只预加载前2个
      .forEach(m => related.push(m as TranslationModule));
  } else if (currentModule.startsWith('converters/')) {
    // 预加载其他转换器
    LAZY_MODULES
      .filter(m => m.startsWith('converters/') && m !== currentModule)
      .slice(0, 2)
      .forEach(m => related.push(m as TranslationModule));
  }
  
  return related;
}

/**
 * 优化的模块翻译 Hook
 * 
 * @param initialModules - 初始加载的模块
 * @returns 翻译函数和状态
 * 
 * @example
 * ```tsx
 * const { t, isLoading } = useModuleTranslationOptimized(['compressors/png']);
 * 
 * const title = await t('compressors/png', 'hero.title');
 * ```
 */
export function useModuleTranslationOptimized(
  initialModules: TranslationModule[] = []
): UseModuleTranslationOptimizedReturn {
  const [locale, setLocale] = useState<Locale>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTranslations, setCurrentTranslations] = useState<Record<string, any>>({});
  const [loadedModules, setLoadedModules] = useState<Set<TranslationModule>>(new Set());

  // 初始化 locale 从路径
  useEffect(() => {
    const pathLocale = getLocaleFromPath(window.location.pathname);
    if (pathLocale && pathLocale !== locale) {
      setLocale(pathLocale);
    }
  }, []);

  const loadModule = async (module: TranslationModule): Promise<void> => {
    const moduleKey = `${locale}-${module}`;
    
    if (loadedModules.has(module) || globalLoadingPromises.has(moduleKey)) {
      return globalLoadingPromises.get(moduleKey);
    }

    const loadingPromise = (async () => {
      setIsLoading(true);
      try {
        // 检查是否为核心模块
        if (isCoreModule(module)) {
          // 核心模块已经通过 generated.ts 加载
          const coreData = globalTranslationsCache.get(moduleKey);
          if (coreData) {
            setCurrentTranslations(prev => ({
              ...prev,
              [module]: coreData,
            }));
            setLoadedModules(prev => new Set(prev).add(module));
          }
        } else {
          // 动态加载模块
          const moduleTranslations = await loadTranslations(locale, [module]);
          globalTranslationsCache.set(moduleKey, moduleTranslations[module]);
          setCurrentTranslations(prev => ({
            ...prev,
            [module]: moduleTranslations[module],
          }));
          setLoadedModules(prev => new Set(prev).add(module));
        }
      } catch (error) {
        console.error(`Failed to load module ${module} for locale ${locale}:`, error);
      } finally {
        setIsLoading(false);
        globalLoadingPromises.delete(moduleKey);
      }
    })();

    globalLoadingPromises.set(moduleKey, loadingPromise);
    return loadingPromise;
  };

  // 加载初始模块
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      
      // 预加载常用翻译
      await preloadCommonTranslations(locale);
      
      // 加载初始模块
      const promises = initialModules.map(module => loadModule(module));
      await Promise.all(promises);
      
      setIsLoading(false);
    };

    if (initialModules.length > 0) {
      loadInitial();
    } else {
      setIsLoading(false);
    }
  }, [locale, initialModules]);

  // 预加载相关模块
  useEffect(() => {
    if (initialModules.length > 0) {
      initialModules.forEach(module => {
        const relatedModules = getRelatedModules(module);
        relatedModules.forEach(relatedModule => {
          preloadTranslation(locale as any, relatedModule);
        });
      });
    }
  }, [initialModules, locale]);

  const t = async (
    module: TranslationModule,
    key: string,
    params?: Record<string, string | number | boolean>
  ): Promise<string> => {
    // 确保模块已加载
    if (!loadedModules.has(module)) {
      await loadModule(module);
    }

    const moduleTranslations = currentTranslations[module];
    if (!moduleTranslations) {
      return key; // 返回 key 作为后备
    }

    return getTranslationValue(moduleTranslations, key, params);
  };

  const tSync = (
    translations: Record<string, any>,
    module: TranslationModule,
    key: string,
    params?: Record<string, string | number | boolean>
  ): string => {
    return getTranslationValue(translations, key, params);
  };

  const switchLocale = (newLocale: Locale): void => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      // 清除当前翻译和已加载模块
      setCurrentTranslations({});
      setLoadedModules(new Set());
      setIsLoading(true);
    }
  };

  const preloadModule = async (module: TranslationModule): Promise<void> => {
    await loadModule(module);
  };

  const availableLocales: Locale[] = ['en', 'zh', 'es', 'de', 'fr', 'ar', 'ja', 'ko', 'pt', 'ru', 'it'];

  return {
    t,
    tSync,
    locale,
    isLoading,
    switchLocale,
    availableLocales,
    loadedModules,
    preloadModule,
  };
}


