import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';

interface PrivacyPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'Privacy Policy - TinyCompressor',
    description: 'Privacy Policy for TinyCompressor - Learn how we protect your data and privacy.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: September 23, 2025
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Processing</h2>
            <p className="text-gray-700 mb-4">
              TinyCompressor processes all images locally in your browser. We do not upload, store, or collect any of your image data on our servers.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We may collect anonymous usage statistics to improve our service, but no personal information or image data is collected.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use essential cookies only for basic functionality. No tracking or analytics cookies are used.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
