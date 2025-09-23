'use client';

import { SupportedLanguage } from '@/types/i18n';
import StandardHeader from './ui/StandardHeader';

interface HeaderProps {
  currentLocale: SupportedLanguage;
  onLanguageChange: (locale: string) => void;
  translations?: any;
}

export default function Header({ currentLocale, onLanguageChange, translations }: HeaderProps) {
  return (
    <StandardHeader
      currentLocale={currentLocale}
      onLanguageChange={onLanguageChange}
      translations={translations}
    />
  );
}