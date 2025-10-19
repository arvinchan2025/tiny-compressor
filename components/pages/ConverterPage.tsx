'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import { ImageFile } from '@/types/image';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardButton from '@/components/ui/StandardButton';
import StandardIcon from '@/components/ui/StandardIcon';
import Link from 'next/link';
import { getNavigationPagePath } from '@/lib/i18n/path-utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CTAQuickLinks from '@/components/shared/CTAQuickLinks';

// 懒加载转换管理器组件
const UnifiedConversionManager = dynamic(
  () => import('@/components/converter/components/UnifiedConversionManager'),
  {
    loading: () => (
      <div className="card-glass p-8">
        <LoadingSpinner />
      </div>
    ),
    ssr: false
  }
);

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
  const { t, isLoading } = useTranslation(`converters/${conversionModule}`, locale);

  if (isLoading) {
    return (
      <StandardPageLayout locale={locale}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
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
          className="relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          
          <StandardContainer variant="content" size="xl" center className="relative z-10">
            <div className="text-center pt-20 pb-16">
              {/* Main Headline */}
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t('hero.title') || `${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} Converter`}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  {t('hero.subtitle') || `Professional format conversion to transform your images with quality preservation`}
                </p>
              </div>

              {/* Stats Badge */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                      10+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Formats
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
                      100%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Quality
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className="text-3xl font-bold mb-2 text-purple-600 dark:text-purple-400">
                      100%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Free
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className="text-3xl font-bold mb-2 text-orange-600 dark:text-orange-400">
                      &lt;1s
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Speed
                    </div>
                  </div>
                </div>
              </div>
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {t('comparison.title') || `${sourceFormat.toUpperCase()} vs ${targetFormat.toUpperCase()} Format Comparison`}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('comparison.subtitle') || 'Understanding the differences between these formats'}
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
                    {t(`comparison.${sourceFormat}.description`) || `${sourceFormat.toUpperCase()} format description`}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300 transition-colors">
                      <StandardIcon name="check" size="sm" className="mr-2 text-green-500 dark:text-green-400" />
                      {t(`comparison.${sourceFormat}.features.${index}`) || `Feature ${index + 1}`}
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
                    {t(`comparison.${targetFormat}.description`) || `${targetFormat.toUpperCase()} format description`}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300 transition-colors">
                      <StandardIcon name="check" size="sm" className="mr-2 text-green-500 dark:text-green-400" />
                      {t(`comparison.${targetFormat}.features.${index}`) || `Feature ${index + 1}`}
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {t('features.title') || `${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} Conversion Features`}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('features.description') || 'Why convert for better quality and features'}
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {t('technicalPrinciples.title') || `How ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} Conversion Works`}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('technicalPrinciples.description') || 'Understanding the technical process of conversion'}
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('useCases.title') || `When & How to Convert ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}`}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('useCases.description') || 'Common scenarios and best practices for conversion'}
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t('faq.title') || 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('faq.description') || 'Common questions about conversion'}
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
        <CTAQuickLinks
          title={t('quickLinks.title') || 'Related Tools'}
          description={t('quickLinks.description') || 'Explore more conversion and compression tools'}
          items={(() => {
            const defaultIcons = ['📷', '🌐', '⚡', '🎬', '🖼️', '🔄'];
            const quickLinksItems = t('quickLinks.items', { returnObjects: true });

            if (Array.isArray(quickLinksItems)) {
              return quickLinksItems.filter(item => item && item.title).map((item, index) => ({
                title: item.title,
                description: item.description,
                url: item.url,
                icon: item.icon || defaultIcons[index] || '🔧'
              }));
            }

            return Array.from({ length: 6 }, (_, index) => {
              const title = t(`quickLinks.items.${index}.title`);
              const description = t(`quickLinks.items.${index}.description`);
              const url = t(`quickLinks.items.${index}.url`);

              return {
                title,
                description,
                url,
                icon: defaultIcons[index] || '🔧'
              };
            }).filter(item => item.title && !item.title.includes('quickLinks.items'));
          })()}
          maxItems={6}
        />

      </div>
    </StandardPageLayout>
  );
}


