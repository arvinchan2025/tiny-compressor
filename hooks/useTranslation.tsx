import { useState, useEffect, useCallback } from 'react';
import { translationManager, SupportedLanguage } from '@/lib/translation-manager';

// 翻译Hook
export function useTranslation(language?: SupportedLanguage) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    language || translationManager.getCurrentLanguage()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 切换语言
  const changeLanguage = useCallback(async (newLanguage: SupportedLanguage) => {
    if (newLanguage === currentLanguage) return;

    setIsLoading(true);
    setError(null);

    try {
      // 这里可以添加异步加载翻译的逻辑
      translationManager.setLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
    } catch (err) {
      setError(`Failed to load translation for ${newLanguage}`);
      console.error('Translation loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  // 获取翻译文本
  const t = useCallback((key: string, fallback?: string) => {
    const translation = translationManager.getTranslation(key, currentLanguage);
    
    // 如果翻译不存在，返回fallback或键名
    if (translation === key && fallback) {
      return fallback;
    }
    
    return translation;
  }, [currentLanguage]);

  // 监听语言变化
  useEffect(() => {
    const unsubscribe = translationManager.onLanguageChange((lang) => {
      setCurrentLanguage(lang);
    });

    return unsubscribe;
  }, []);

  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading,
    error,
    // 便捷方法
    isEnglish: currentLanguage === 'en',
    isChinese: currentLanguage === 'zh',
    isSpanish: currentLanguage === 'es',
    isGerman: currentLanguage === 'de',
  };
}

// 翻译组件
export function TranslationText({ 
  key, 
  fallback, 
  className,
  children 
}: { 
  key: string; 
  fallback?: string; 
  className?: string;
  children?: (text: string) => React.ReactNode;
}) {
  const { t } = useTranslation();
  const text = t(key, fallback);

  if (children) {
    return <>{children(text)}</>;
  }

  return <span className={className}>{text}</span>;
}

// 语言切换Hook
export function useLanguageSwitcher() {
  const { currentLanguage, changeLanguage, isLoading } = useTranslation();

  const switchToLanguage = useCallback(async (language: SupportedLanguage) => {
    await changeLanguage(language);
  }, [changeLanguage]);

  return {
    currentLanguage,
    switchToLanguage,
    isLoading,
  };
}
