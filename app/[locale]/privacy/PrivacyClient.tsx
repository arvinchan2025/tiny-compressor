'use client';

import { SupportedLanguage } from '@/types/i18n';
import { useTranslation } from '@/hooks/useTranslation';

interface PrivacyClientProps {
  locale: SupportedLanguage;
}

export default function PrivacyClient({ locale }: PrivacyClientProps) {
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
          {t('privacy.title', 'Privacy Policy')}
        </h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            {t('privacy.lastUpdated', 'Last updated: September 23, 2025')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('privacy.sections.dataProcessing.title', 'Data Processing')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('privacy.sections.dataProcessing.content', 'TinyCompressor processes all images locally in your browser. We do not upload, store, or collect any of your image data on our servers.')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('privacy.sections.informationWeCollect.title', 'Information We Collect')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('privacy.sections.informationWeCollect.content', 'We may collect anonymous usage statistics to improve our service, but no personal information or image data is collected.')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('privacy.sections.cookies.title', 'Cookies')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('privacy.sections.cookies.content', 'We use essential cookies only for basic functionality. No tracking or analytics cookies are used.')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('privacy.sections.contact.title', 'Contact')}
          </h2>
          <p className="text-gray-700">
            {t('privacy.sections.contact.content', 'If you have any questions about this Privacy Policy, please contact us.')}
          </p>
        </div>
      </div>
    </div>
  );
}
