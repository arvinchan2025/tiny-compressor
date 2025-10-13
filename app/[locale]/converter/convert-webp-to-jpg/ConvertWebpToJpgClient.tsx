'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertWebpToJpgClientProps {
  locale: SupportedLanguage;
}

export default function ConvertWebpToJpgClient({ locale }: ConvertWebpToJpgClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="webp" targetFormat="jpg" locale={locale} />;
}