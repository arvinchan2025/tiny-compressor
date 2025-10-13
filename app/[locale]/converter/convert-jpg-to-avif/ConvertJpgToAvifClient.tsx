'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertJpgToAvifClientProps {
  locale: SupportedLanguage;
}

export default function ConvertJpgToAvifClient({ locale }: ConvertJpgToAvifClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="jpeg" targetFormat="avif" locale={locale} />;
}