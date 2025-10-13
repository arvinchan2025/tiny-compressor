'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertPngToJpgClientProps {
  locale: SupportedLanguage;
}

export default function ConvertPngToJpgClient({ locale }: ConvertPngToJpgClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="png" targetFormat="jpg" locale={locale} />;
}