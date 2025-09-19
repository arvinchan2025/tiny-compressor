'use client';

import { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/translations';
import { Translations } from '@/lib/i18n';

export default function PrivacyPolicy({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const trans = await getTranslations(locale);
        setTranslations(trans);
      } catch (error) {
        console.error('Failed to load translations:', error);
        const fallback = await getTranslations('en');
        setTranslations(fallback);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTranslations();
  }, [locale]);

  if (isLoading || !translations) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen gradient-bg">
      {/* hreflang标签 */}
      <head>
        <link rel="alternate" hrefLang="en" href="https://tinycompressor.com/privacy" />
        <link rel="alternate" hrefLang="zh" href="https://tinycompressor.com/zh/privacy" />
        <link rel="alternate" hrefLang="es" href="https://tinycompressor.com/es/privacy" />
        <link rel="alternate" hrefLang="de" href="https://tinycompressor.com/de/privacy" />
        <link rel="alternate" hrefLang="fr" href="https://tinycompressor.com/fr/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://tinycompressor.com/privacy" />
      </head>
      
      <Header 
        currentLanguage={locale} 
        onLanguageChange={(lang) => {
          window.location.href = lang === 'en' ? '/privacy' : `/${lang}/privacy`;
        }} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-primary-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">{translations.privacy.title}</h1>
            </div>
            <p className="text-gray-600 text-lg">{translations.privacy.lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-primary-600 mr-3" />
                {translations.privacy.introduction.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.introduction.content}</p>
            </section>

            {/* Information Collection */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 text-primary-600 mr-3" />
                {translations.privacy.informationCollection.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.informationCollection.content}</p>
            </section>

            {/* Data Processing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 text-primary-600 mr-3" />
                {translations.privacy.dataProcessing.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.dataProcessing.content}</p>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 text-primary-600 mr-3" />
                {translations.privacy.cookies.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.cookies.content}</p>
            </section>

            {/* Third Party */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 text-primary-600 mr-3" />
                {translations.privacy.thirdParty.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.thirdParty.content}</p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-primary-600 mr-3" />
                {translations.privacy.dataSecurity.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.dataSecurity.content}</p>
            </section>

            {/* Changes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.privacy.changes.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.changes.content}</p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.privacy.contact.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.privacy.contact.content}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer translations={translations} locale={locale} />
    </div>
  );
}