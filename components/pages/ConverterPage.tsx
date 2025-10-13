'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import UnifiedConversionManager from '@/components/converter/components/UnifiedConversionManager';
import { ImageFile } from '@/types/image';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardButton from '@/components/ui/StandardButton';
import StandardIcon from '@/components/ui/StandardIcon';
import Link from 'next/link';
import { getNavigationPagePath } from '@/lib/i18n/path-utils';

interface ConverterPageProps {
  locale: Locale;
  sourceFormat: string;
  targetFormat: string;
  maxFiles?: number;
}

export default function ConverterPage({
  locale,
  sourceFormat,
  targetFormat,
  maxFiles = 10
}: ConverterPageProps) {
  const conversionModule = `${sourceFormat}-to-${targetFormat}`;
  const { t, isLoading } = useModuleTranslation(`converters/${conversionModule}`, locale);

  if (isLoading) {
    return (
      <StandardPageLayout locale={locale}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout locale={locale}>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12 bg-gradient-to-b from-gray-50 to-white"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('hero.subtitle')}
              </p>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Main Operation Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-8"
        >
          <StandardContainer variant="page" size="lg">
            <UnifiedConversionManager
              sourceFormat={sourceFormat}
              targetFormat={targetFormat}
              locale={locale}
              maxFiles={maxFiles}
              onConversionComplete={(results) => {
                // 转换完成回调
                console.log('Conversion completed:', results);
              }}
              onError={(error) => {
                console.error('Conversion error:', error);
              }}
            />
          </StandardContainer>
        </motion.section>

        {/* Format Comparison Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-16 bg-white/50"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('comparison.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('comparison.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {sourceFormat.toUpperCase()}
                  </h3>
                  <p className="text-gray-600">
                    {t(`comparison.${sourceFormat}.description`)}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <StandardIcon name="check" size="sm" className="mr-2 text-green-500" />
                      {t(`comparison.${sourceFormat}.features.${index}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {targetFormat.toUpperCase()}
                  </h3>
                  <p className="text-gray-600">
                    {t(`comparison.${targetFormat}.description`)}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <StandardIcon name="check" size="sm" className="mr-2 text-green-500" />
                      {t(`comparison.${targetFormat}.features.${index}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-12 bg-gray-50"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {t('features.title')}
                </h2>
                <p className="text-base text-gray-600">
                  {t('features.description')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 12 }).map((_, index) => {
                  const title = t(`features.items.${index}.title`);
                  const description = t(`features.items.${index}.description`);
                  const icon = t(`features.items.${index}.icon`);
                  
                  if (title.startsWith('features.items.')) return null;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="text-3xl mb-4">{icon || '✓'}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {title}
                      </h3>
                      <p className="text-gray-600">
                        {description}
                      </p>
                    </motion.div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Technical Principles Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-12"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {t('technicalPrinciples.title')}
                </h2>
                <p className="text-base text-gray-600">
                  {t('technicalPrinciples.description')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, index) => {
                  const title = t(`technicalPrinciples.items.${index}.title`);
                  const description = t(`technicalPrinciples.items.${index}.description`);
                  const icon = t(`technicalPrinciples.items.${index}.icon`);
                  
                  if (title.startsWith('technicalPrinciples.items.')) return null;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6"
                    >
                      <div className="text-3xl mb-4">{icon || '🔧'}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {description}
                      </p>
                      <ul className="space-y-2">
                        {Array.from({ length: 4 }).map((_, benefitIndex) => {
                          const benefit = t(`technicalPrinciples.items.${index}.benefits.${benefitIndex}`);
                          if (benefit.startsWith('technicalPrinciples.items.')) return null;
                          return (
                            <li key={benefitIndex} className="flex items-start text-sm text-gray-700">
                              <span className="text-green-500 mr-2">✓</span>
                              <span>{benefit}</span>
                            </li>
                          );
                        }).filter(Boolean)}
                      </ul>
                    </motion.div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Use Cases Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="py-16 bg-white/50"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('useCases.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('useCases.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }, (_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <StandardIcon name="image" size="md" className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t(`useCases.items.${index}.title`)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t(`useCases.items.${index}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </StandardContainer>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="py-12"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('faq.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('faq.description')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {Array.from({ length: 10 }, (_, index) => {
                const question = t(`faq.items.${index}.question`);
                if (question.startsWith('faq.items.')) return null;
                
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t(`faq.items.${index}.question`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(`faq.items.${index}.answer`)}
                  </p>
                </motion.div>
                );
              }).filter(Boolean)}
            </div>
          </StandardContainer>
        </motion.section>

        {/* Quick Links Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('quickLinks.title')}
              </h2>
              <p className="text-gray-600">
                {t('quickLinks.description')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 6 }, (_, index) => {
                const itemTitle = t(`quickLinks.items.${index}.title`);
                const itemDescription = t(`quickLinks.items.${index}.description`);
                const itemUrl = t(`quickLinks.items.${index}.url`);
                
                if (!itemTitle || itemTitle.includes('quickLinks.items')) return null;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.4 + index * 0.1 }}
                  >
                    <Link href={itemUrl || '#'}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {itemTitle}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {itemDescription}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              }).filter(Boolean)}
            </div>
          </StandardContainer>
        </motion.section>

      </div>
    </StandardPageLayout>
  );
}


