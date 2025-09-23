/**
 * 通用页面布局组件
 * 统一处理页面布局、翻译加载、语言切换等通用逻辑
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { SupportedLanguage } from '@/types/i18n';
import { useTranslationLoader } from '@/hooks/useTranslationLoader';
import { switchLanguage } from '@/lib/language-switch';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  locale: SupportedLanguage;
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export default function PageLayout({
  locale,
  children,
  showHeader = true,
  showFooter = true,
  className = ''
}: PageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<SupportedLanguage>(locale);
  
  // 使用统一的翻译加载 Hook
  const { translations, isLoading, error, t } = useTranslationLoader({
    locale: currentLocale
  });

  // 语言切换处理器
  const handleLanguageChange = (newLocale: string) => {
    // 如果语言相同，不进行切换
    if (newLocale === currentLocale) {
      return;
    }
    
    switchLanguage(newLocale, pathname);
  };

  // 更新当前语言状态
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  // 检查是否为 RTL 语言
  const isRTL = currentLocale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('common.error')}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen hero-gradient ${className}`}
      dir={dir}
    >
      {/* Header */}
      {showHeader && (
        <Header
          currentLocale={currentLocale}
          onLanguageChange={handleLanguageChange}
          translations={translations}
        />
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`flex-1 ${showHeader ? 'pt-20' : ''}`}
      >
        {children}
      </motion.main>

      {/* Footer */}
      {showFooter && (
        <Footer
          currentLocale={currentLocale}
          translations={translations}
        />
      )}
    </div>
  );
}
