'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertJpgToPngClientProps {
  locale: SupportedLanguage;
}

export default function ConvertJpgToPngClient({ locale }: ConvertJpgToPngClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="jpg" targetFormat="png" locale={locale} />;
}