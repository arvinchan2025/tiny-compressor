'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface CompressAvifClientProps {
  locale: SupportedLanguage;
}

export default function CompressAvifClient({ locale }: CompressAvifClientProps) {
  return (
    <UnifiedClient 
      locale={locale} 
      pageType="compressor"
      format="avif"
    />
  );
}