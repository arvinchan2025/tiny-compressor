'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertWebpToAvifClientProps {
  locale: SupportedLanguage;
}

export default function ConvertWebpToAvifClient({ locale }: ConvertWebpToAvifClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="webp" targetFormat="avif" locale={locale} />;
}