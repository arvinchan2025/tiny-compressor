'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, switchLocalePath, getSupportedLocales } from '@/lib/i18n';
import StandardHeader from '@/components/ui/StandardHeader';
import Footer from '@/components/Footer';

interface StandardPageLayoutProps {
  locale: Locale;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function StandardPageLayout({
  locale,
  children,
  className = '',
  showHeader = true,
  showFooter = true,
}: StandardPageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // 验证语言代码
    const supportedLocalesList = getSupportedLocales();
    if (!supportedLocalesList.includes(newLocale as Locale)) {
      console.warn(`Unsupported locale: ${newLocale}`);
      return;
    }
    
    // 设置语言 cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    // 使用统一的路径处理工具生成新路径
    const newPath = switchLocalePath(pathname, locale, newLocale as Locale);
    
    // 使用 window.location.href 进行页面跳转，确保触发 popstate 事件
    window.location.href = newPath;
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${className}`}>
      {showHeader && (
        <StandardHeader
          currentLocale={locale}
          onLanguageChange={handleLanguageChange}
        />
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer currentLocale={locale} />}
    </div>
  );
}