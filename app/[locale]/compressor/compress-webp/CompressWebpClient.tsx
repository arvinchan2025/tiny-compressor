'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface CompressWebpClientProps {
  locale: SupportedLanguage;
}

export default function CompressWebpClient({ locale }: CompressWebpClientProps) {
  return (
    <UnifiedClient 
      locale={locale} 
      pageType="compressor"
      format="webp"
    />
  );
}