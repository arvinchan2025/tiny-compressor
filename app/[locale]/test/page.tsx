'use client';

import { useRouter } from 'next/navigation';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/translations';

export default function TestPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const router = useRouter();
  const translations = getTranslations(locale);
  
  return (
    <div className="min-h-screen gradient-bg">
      <ClientHeader 
        currentLanguage={locale}
        translations={translations}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Language Route Test</h1>
          <p className="text-xl mb-8">Current locale: <span className="font-bold text-primary-600">{locale}</span></p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Logo Click Test</h2>
            <p className="text-gray-600 mb-4">
              Click the logo in the header to return to homepage
            </p>
            <p className="text-sm text-gray-500">
              {locale === 'en' ? 'Should navigate to /' : 'Should navigate to /zh'}
            </p>
          </div>
          
          <div className="space-x-4">
            <button 
              onClick={() => router.push(locale === 'en' ? '/' : '/zh')}
              className="btn-primary"
            >
              {locale === 'en' ? 'Go to Homepage' : '返回主页'}
            </button>
            <a href={locale === 'en' ? '/en/test' : '/zh/test'} className="btn-secondary">
              {locale === 'en' ? 'English Test' : '中文测试'}
            </a>
          </div>
        </div>
      </div>
      
      <Footer translations={translations} locale={locale} />
    </div>
  );
}
