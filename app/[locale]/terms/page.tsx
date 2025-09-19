'use client';

import { useState, useEffect } from 'react';
import { FileText, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { getTranslations, Translations } from '@/lib/translations';

export default function TermsOfService({ params }: { params: { locale: string } }) {
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
        <link rel="alternate" hrefLang="en" href="https://tinycompressor.com/terms" />
        <link rel="alternate" hrefLang="zh" href="https://tinycompressor.com/zh/terms" />
        <link rel="alternate" hrefLang="es" href="https://tinycompressor.com/es/terms" />
        <link rel="alternate" hrefLang="de" href="https://tinycompressor.com/de/terms" />
        <link rel="alternate" hrefLang="fr" href="https://tinycompressor.com/fr/terms" />
        <link rel="alternate" hrefLang="x-default" href="https://tinycompressor.com/terms" />
      </head>
      
      <ClientHeader 
        currentLanguage={locale}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-primary-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">{translations.terms.title}</h1>
            </div>
            <p className="text-gray-600 text-lg">{translations.terms.lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Acceptance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-3" />
                {translations.terms.acceptance.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.acceptance.content}</p>
            </section>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-primary-600 mr-3" />
                {translations.terms.description.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.description.content}</p>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-primary-600 mr-3" />
                {translations.terms.userResponsibilities.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.userResponsibilities.content}</p>
            </section>

            {/* Limitations */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-primary-600 mr-3" />
                {translations.terms.limitations.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.limitations.content}</p>
            </section>

            {/* Prohibited Uses */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-6 h-6 text-primary-600 mr-3" />
                {translations.terms.prohibitedUses.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.prohibitedUses.content}</p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.terms.intellectualProperty.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.intellectualProperty.content}</p>
            </section>

            {/* Disclaimer */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.terms.disclaimer.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.disclaimer.content}</p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.terms.limitationLiability.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.limitationLiability.content}</p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.terms.governingLaw.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.governingLaw.content}</p>
            </section>

            {/* Changes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.terms.changes.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.changes.content}</p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.terms.contact.title}</h2>
              <p className="text-gray-700 leading-relaxed">{translations.terms.contact.content}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer translations={translations} locale={locale} />
    </div>
  );
}