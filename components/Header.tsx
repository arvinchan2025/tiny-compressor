'use client';

import { SupportedLanguage } from '@/types/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardHeader from './ui/StandardHeader';

interface HeaderProps {
  currentLocale: SupportedLanguage;
  onLanguageChange: (locale: string) => void;
}

export default function Header({ currentLocale, onLanguageChange }: HeaderProps) {
  return (
    <StandardHeader 
      currentLocale={currentLocale}
      onLanguageChange={onLanguageChange || (() => {})}
    />
  );
}
