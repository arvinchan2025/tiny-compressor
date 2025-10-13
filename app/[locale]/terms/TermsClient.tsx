'use client';

import { SupportedLanguage } from '@/types/i18n';
import { useTranslation } from '@/hooks/useTranslation';

interface TermsClientProps {
  locale: SupportedLanguage;
}

export default function TermsClient({ locale }: TermsClientProps) {
  const { t, isLoading } = useTranslation('common');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('terms.title', 'Terms of Service')}
        </h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            {t('terms.lastUpdated', 'Last updated: September 23, 2025')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('terms.sections.serviceDescription.title', 'Service Description')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('terms.sections.serviceDescription.content', 'TinyCompressor provides free online image compression and conversion services. All processing is done locally in your browser.')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('terms.sections.acceptableUse.title', 'Acceptable Use')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('terms.sections.acceptableUse.content', 'You may use our service for lawful purposes only. Do not upload copyrighted material without permission.')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('terms.sections.serviceAvailability.title', 'Service Availability')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('terms.sections.serviceAvailability.content', 'We strive to maintain high service availability but cannot guarantee uninterrupted access.')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('terms.sections.limitationOfLiability.title', 'Limitation of Liability')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('terms.sections.limitationOfLiability.content', 'TinyCompressor is provided "as is" without warranties. We are not liable for any damages arising from use of our service.')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('terms.sections.changesToTerms.title', 'Changes to Terms')}
          </h2>
          <p className="text-gray-700">
            {t('terms.sections.changesToTerms.content', 'We may update these terms at any time. Continued use of our service constitutes acceptance of updated terms.')}
          </p>
        </div>
      </div>
    </div>
  );
}
