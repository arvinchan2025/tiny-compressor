'use client';

import { useState } from 'react';
import { SupportedLanguage } from '@/types/i18n';
import CompressorPageLayout from '@/components/layout/CompressorPageLayout';
import { useFormatTranslations } from '@/hooks/useFormatTranslations';

interface WebpCompressorNewProps {
  locale: SupportedLanguage;
}

export default function WebpCompressorNew({ locale }: WebpCompressorNewProps) {
  const { loading } = useFormatTranslations(locale, 'webp');
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <CompressorPageLayout
      locale={locale}
      format="webp"
    >
      {null}
    </CompressorPageLayout>
  );
}
