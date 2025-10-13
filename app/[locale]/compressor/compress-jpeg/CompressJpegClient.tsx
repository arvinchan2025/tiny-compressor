'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface CompressJpegClientProps {
  locale: SupportedLanguage;
}

export default function CompressJpegClient({ locale }: CompressJpegClientProps) {
  return (
    <UnifiedClient 
      locale={locale} 
      pageType="compressor"
      format="jpeg"
    />
  );
}