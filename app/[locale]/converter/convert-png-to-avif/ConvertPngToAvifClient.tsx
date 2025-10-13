'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertPngToAvifClientProps {
  locale: SupportedLanguage;
}

export default function ConvertPngToAvifClient({ locale }: ConvertPngToAvifClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="png" targetFormat="avif" locale={locale} />;
}