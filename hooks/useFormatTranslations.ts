/**
 * 格式特定翻译Hook
 * 提供统一的翻译加载和访问接口
 */

import { useState, useEffect } from 'react';
import { SupportedLanguage } from '@/types/i18n';

interface FormatTranslations {
  title?: string;
  subtitle?: string;
  description?: string;
  settings?: Record<string, string>;
  steps?: Array<{
    step: string;
    title: string;
    description: string;
    icon: string;
  }>;
  notes?: Array<{
    icon: string;
    title: string;
    content: string;
    type: 'warning' | 'tip' | 'info';
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export function useFormatTranslations(
  locale: SupportedLanguage,
  format: 'jpeg' | 'png' | 'webp' | 'avif' | 'gif'
) {
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { getTranslations } = await import('@/lib/translations');
        const trans = await getTranslations(locale);
        setTranslations(trans);
      } catch (err) {
        console.error('Failed to load translations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load translations');
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  const formatTranslations: FormatTranslations = translations?.compressor?.formats?.[format] || {};
  
  const getTranslation = (key: string, fallback: string = ''): string => {
    const value = formatTranslations[key as keyof FormatTranslations];
  return typeof value === 'string' ? value : fallback;
  };

  const getSettingsTranslation = (key: string, fallback: string = ''): string => {
    return formatTranslations.settings?.[key] || fallback;
  };

  return {
    translations: formatTranslations,
    loading,
    error,
    getTranslation,
    getSettingsTranslation,
    // 便捷访问器
    title: getTranslation('title'),
    subtitle: getTranslation('subtitle'),
    description: getTranslation('description'),
    steps: formatTranslations.steps || [],
    notes: formatTranslations.notes || [],
    faq: formatTranslations.faq || [],
  };
}

