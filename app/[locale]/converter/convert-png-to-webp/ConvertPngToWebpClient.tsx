'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertPngToWebpClientProps {
  locale: SupportedLanguage;
}

export default function ConvertPngToWebpClient({ locale }: ConvertPngToWebpClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="png" targetFormat="webp" locale={locale} />;
}