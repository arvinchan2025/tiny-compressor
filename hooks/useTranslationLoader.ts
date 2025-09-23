/**
 * 通用翻译加载 Hook
 * 统一处理翻译加载、缓存和错误处理
 */

import { useState, useEffect } from 'react';

interface UseTranslationLoaderOptions {
  locale: string;
  fallbackLocale?: string;
  enableCache?: boolean;
}

interface UseTranslationLoaderReturn {
  translations: any;
  isLoading: boolean;
  error: string | null;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// 翻译缓存
const translationCache = new Map<string, any>();

export function useTranslationLoader({
  locale,
  fallbackLocale = 'en',
  enableCache = true
}: UseTranslationLoaderOptions): UseTranslationLoaderReturn {
  const [translations, setTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 翻译函数
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations) return key;
    
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // 参数替换
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value || key;
  };

  // 加载翻译
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 检查缓存
        if (enableCache && translationCache.has(locale)) {
          setTranslations(translationCache.get(locale));
          setIsLoading(false);
          return;
        }

        // 加载翻译
        const response = await fetch(`/api/translations/${locale}`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
          if (enableCache) {
            translationCache.set(locale, data);
          }
        } else {
          throw new Error(`Failed to load translations for ${locale}`);
        }
      } catch (err) {
        console.error(`Failed to load translations for ${locale}:`, err);
        
        // 尝试回退语言
        if (locale !== fallbackLocale) {
          try {
            const fallbackResponse = await fetch(`/api/translations/${fallbackLocale}`);
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              setTranslations(fallbackData);
              if (enableCache) {
                translationCache.set(locale, fallbackData);
              }
              return;
            }
          } catch (fallbackErr) {
            console.error(`Failed to load fallback translations:`, fallbackErr);
          }
        }
        
        // 使用硬编码回退
        setTranslations(getFallbackTranslations());
        setError(`Translation loading failed, using fallback`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale, fallbackLocale, enableCache]);

  return {
    translations,
    isLoading,
    error,
    t
  };
}

// 硬编码回退翻译
function getFallbackTranslations() {
  return {
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      success: 'Success',
      failed: 'Failed',
      warning: 'Warning',
      info: 'Info'
    },
    nav: {
      home: 'Home',
      compressor: 'Compressor',
      converter: 'Converter',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    },
    footer: {
      description: 'TinyCompressor - The best free online image compression tool',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      links: {
        home: 'Home',
        compressor: 'Compressor',
        converter: 'Converter',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },
      features: {
        free: '100% Free',
        freeDesc: 'No hidden costs or subscriptions',
        secure: 'Secure & Private',
        secureDesc: 'Files processed locally in your browser',
        fast: 'Lightning Fast',
        fastDesc: 'Optimized for speed and performance'
      },
      copyright: '© 2025 TinyCompressor. All rights reserved.',
      madeWith: 'Made with',
      forDevelopers: 'for developers',
      freeOpenSource: 'Free & Open Source'
    },
    meta: {
      title: 'TinyCompressor - Free Image Compression Tool',
      description: 'Compress images instantly without losing quality. Free online image compression tool.',
      keywords: 'image compression, compress images, free online tool, image optimizer'
    }
  };
}

// 清除翻译缓存
export function clearTranslationCache(): void {
  translationCache.clear();
}

// 预加载翻译
export async function preloadTranslations(locales: string[]): Promise<void> {
  const promises = locales.map(async (locale) => {
    try {
      const response = await fetch(`/api/translations/${locale}`);
      if (response.ok) {
        const data = await response.json();
        translationCache.set(locale, data);
      }
    } catch (error) {
      console.error(`Failed to preload translations for ${locale}:`, error);
    }
  });
  
  await Promise.all(promises);
}

