'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertWebpToPngClientProps {
  locale: SupportedLanguage;
}

export default function ConvertWebpToPngClient({ locale }: ConvertWebpToPngClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="webp" targetFormat="png" locale={locale} />;
}