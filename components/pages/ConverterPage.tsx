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
      <div className="page-base min-h-screen">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-default py-12"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">
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
          className="section-subtle py-16"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
                {t('comparison.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
                {t('comparison.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="card-glass p-6"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                    {sourceFormat.toUpperCase()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    {t(`comparison.${sourceFormat}.description`)}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300 transition-colors">
                      <StandardIcon name="check" size="sm" className="mr-2 text-green-500 dark:text-green-400" />
                      {t(`comparison.${sourceFormat}.features.${index}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="card-glass p-6"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                    {targetFormat.toUpperCase()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    {t(`comparison.${targetFormat}.description`)}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300 transition-colors">
                      <StandardIcon name="check" size="sm" className="mr-2 text-green-500 dark:text-green-400" />
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
          className="section-alternate py-12"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors">
                  {t('features.title')}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 transition-colors">
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
                      className="card-glass p-6"
                    >
                      <div className="text-3xl mb-4">{icon || '✓'}</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                        {title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 transition-colors">
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
          className="section-default py-12"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors">
                  {t('technicalPrinciples.title')}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 transition-colors">
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
                    className="card-glass p-6"
                  >
                    <div className="text-3xl mb-4">{icon || '🔧'}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                      {description}
                    </p>
                    <ul className="space-y-2">
                      {Array.from({ length: 4 }).map((_, benefitIndex) => {
                        const benefit = t(`technicalPrinciples.items.${index}.benefits.${benefitIndex}`);
                        if (benefit.startsWith('technicalPrinciples.items.')) return null;
                        return (
                          <li key={benefitIndex} className="flex items-start text-sm text-gray-700 dark:text-gray-300 transition-colors">
                            <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
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
          className="section-subtle py-16"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
                {t('useCases.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
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
                  className="card-glass p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                      <StandardIcon name="image" size="md" className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                        {t(`useCases.items.${index}.title`)}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
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
          className="section-alternate py-12"
        >
          <StandardContainer variant="page" size="lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
                {t('faq.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
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
                  className="card-glass p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">
                    {t(`faq.items.${index}.question`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                    {t(`faq.items.${index}.answer`)}
                  </p>
                </motion.div>
                );
              }).filter(Boolean)}
            </div>
          </StandardContainer>
        </motion.section>

        {/* Quick Links Section - CTA Style */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 relative overflow-hidden transition-colors"
        >
          {/* Background Decorative Layers */}
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent" />
          </div>
          
          <StandardContainer variant="page" size="lg" className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('quickLinks.title')}
              </h2>
              <p className="text-blue-100 dark:text-blue-200 transition-colors">
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
                      <div className="card-cta p-6 h-full group">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {itemTitle}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
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


