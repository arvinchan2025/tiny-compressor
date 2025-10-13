'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface CompressGifClientProps {
  locale: SupportedLanguage;
}

export default function CompressGifClient({ locale }: CompressGifClientProps) {
  return <UnifiedClient pageType="compressor" format="gif" locale={locale} />;
}
