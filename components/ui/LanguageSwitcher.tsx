'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SupportedLanguage } from '@/types/i18n';
import { getAllLanguagePaths } from '@/lib/i18n';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, LANGUAGE_FLAGS } from '@/lib/language-config';
import StandardIcon from './StandardIcon';

interface LanguageSwitcherProps {
  currentLocale: SupportedLanguage;
  translations: any;
  className: string;
}

// 使用统一的语言配置

export default function LanguageSwitcher({ 
  currentLocale, 
  translations,
  className = '' 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const allLanguagePaths = getAllLanguagePaths(pathname);
  
  const t = (key: string) => {
    if (!translations) return key;
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value[k];
    }
    return value || key;
  };

  const handleLanguageChange = (locale: SupportedLanguage) => {
    const newPath = allLanguagePaths[locale];
    window.location.href = newPath;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        aria-label={t('nav.language') || 'Select Language'}
      >
        <span className="text-lg">{LANGUAGE_FLAGS[currentLocale]}</span>
        <span>{LANGUAGE_NAMES[currentLocale]}</span>
        <StandardIcon 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size="sm" 
          className="text-gray-500" 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((locale: SupportedLanguage) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors duration-200 ${
                  locale === currentLocale ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{LANGUAGE_FLAGS[locale as SupportedLanguage]}</span>
                <span className="flex-1">{LANGUAGE_NAMES[locale as SupportedLanguage]}</span>
                {locale === currentLocale && (
                  <StandardIcon name="check" size="sm" className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
