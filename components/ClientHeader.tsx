'use client';

import Header from './Header';
import { Translations } from '@/lib/translations';

interface ClientHeaderProps {
  translations: Translations;
  currentLanguage: string;
}

export default function ClientHeader({ translations, currentLanguage }: ClientHeaderProps) {
  const handleLanguageChange = (language: string) => {
    // 语言切换逻辑将在客户端处理
    window.location.href = language === 'en' ? '/' : `/${language}`;
  };

  return (
    <Header 
      translations={translations}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    />
  );
}
