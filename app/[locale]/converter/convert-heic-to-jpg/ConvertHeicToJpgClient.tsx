'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertHeicToJpgClientProps {
  locale: SupportedLanguage;
}

export default function ConvertHeicToJpgClient({ locale }: ConvertHeicToJpgClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="heic" targetFormat="jpg" locale={locale} />;
}