// 'use client';

import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardFooter from './ui/StandardFooter';
import {loadServerTranslations} from "@/lib/i18n/ssr-optimization";

interface FooterProps {
  currentLocale: Locale;
}

export default async function Footer({ currentLocale = 'en' }: FooterProps) {
  // const { t, isLoading } = useTranslation('footer');
  //
  // if (isLoading) {
  //   return (
  //     <footer className="bg-slate-900 text-white">
  //       <div className="py-8 text-center">
  //         <div className="animate-pulse">Loading footer...</div>
  //       </div>
  //     </footer>
  //   );
  // }
  const translations = await loadServerTranslations('footer', currentLocale);

  return (
    <StandardFooter
      translations={translations}
      currentLocale={currentLocale}
    />
  );
}