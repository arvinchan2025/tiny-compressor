'use client';

import UnifiedClient from '@/components/UnifiedClient';
import { SupportedLanguage } from '@/types/i18n';

interface ConvertJpgToWebpClientProps {
  locale: SupportedLanguage;
}

export default function ConvertJpgToWebpClient({ locale }: ConvertJpgToWebpClientProps) {
  return <UnifiedClient pageType="converter" sourceFormat="jpeg" targetFormat="webp" locale={locale} />;
}