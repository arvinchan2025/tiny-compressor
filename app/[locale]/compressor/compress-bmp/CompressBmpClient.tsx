'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface CompressBmpClientProps {
  locale: SupportedLanguage;
}

export default function CompressBmpClient({ locale }: CompressBmpClientProps) {
  return <UnifiedClient pageType="compressor" format="bmp" locale={locale} />;
}


