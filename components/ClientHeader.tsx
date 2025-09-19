'use client';

import Header from './Header';

interface ClientHeaderProps {
  currentLanguage: string;
}

export default function ClientHeader({ currentLanguage }: ClientHeaderProps) {
  const handleLanguageChange = (language: string) => {
    // 语言切换逻辑将在客户端处理
    window.location.href = language === 'en' ? '/' : `/${language}`;
  };

  return (
    <Header 
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    />
  );
}
