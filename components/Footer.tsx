'use client';

import { SupportedLanguage } from '@/types/i18n';
import StandardFooter from './ui/StandardFooter';

interface FooterProps {
  translations: any;
  currentLocale?: SupportedLanguage;
}

export default function Footer({ translations, currentLocale = 'en' }: FooterProps) {
  return (
    <StandardFooter
      translations={translations}
      currentLocale={currentLocale}
    />
  );
}