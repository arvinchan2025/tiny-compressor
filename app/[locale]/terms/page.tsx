import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';

interface TermsPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'Terms of Service - TinyCompressor',
    description: 'Terms of Service for TinyCompressor - Learn about our service terms and conditions.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function TermsPage({ params }: TermsPageProps) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: September 23, 2025
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700 mb-4">
              TinyCompressor provides free online image compression and conversion services. All processing is done locally in your browser.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 mb-4">
              You may use our service for lawful purposes only. Do not upload copyrighted material without permission.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-700 mb-4">
              We strive to maintain high service availability but cannot guarantee uninterrupted access.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TinyCompressor is provided "as is" without warranties. We are not liable for any damages arising from use of our service.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these terms at any time. Continued use of our service constitutes acceptance of updated terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
