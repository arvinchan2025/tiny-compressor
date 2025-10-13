'use client';

import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardFooter from './ui/StandardFooter';

interface FooterProps {
  currentLocale: Locale;
}

export default function Footer({ currentLocale = 'en' }: FooterProps) {
  const { t, isLoading } = useTranslation('footer');

  if (isLoading) {
    return (
      <footer className="bg-slate-900 text-white">
        <div className="py-8 text-center">
          <div className="animate-pulse">Loading footer...</div>
        </div>
      </footer>
    );
  }

  return (
    <StandardFooter
      currentLocale={currentLocale}
    />
  );
}