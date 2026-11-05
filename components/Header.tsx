// 'use client';

import { SupportedLanguage } from '@/types/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardHeader from './ui/StandardHeader';
import {loadServerTranslations} from "@/lib/i18n/ssr-optimization";

interface HeaderProps {
  currentLocale: SupportedLanguage;
  // onLanguageChange: (locale: string) => void;
}

export default async function Header({ currentLocale }: HeaderProps) {
  const translations = await loadServerTranslations('common/navigation', currentLocale);
  return (
    <StandardHeader 
      translations={translations}
      currentLocale={currentLocale}
      // onLanguageChange={onLanguageChange || (() => {})}
    />
  );
}
