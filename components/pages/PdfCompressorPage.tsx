'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import StandardContainer from '@/components/ui/StandardContainer';
import SingleFilePdfCompressor from '@/components/compressor/SingleFilePdfCompressor';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PdfCompressorPageProps {
  locale: Locale;
}

export default function PdfCompressorPage({ locale }: PdfCompressorPageProps) {
  const { t, isLoading } = useModuleTranslation('compressors/pdf', locale);

  // 调试：检查翻译加载
  React.useEffect(() => {
    console.log('=== PdfCompressorPage Debug ===');
    console.log('locale:', locale);
    console.log('isLoading:', isLoading);
    
    // 测试字符串翻译
    const titleTest = t('features.title');
    console.log('features.title:', titleTest);
    console.log('Type:', typeof titleTest);
    
    // 测试数组翻译
    const itemsTest = t('features.items', { returnObjects: true });
    console.log('features.items (with returnObjects):', itemsTest);
    console.log('Type:', typeof itemsTest);
    console.log('Is Array:', Array.isArray(itemsTest));
    console.log('Length:', itemsTest?.length);
    console.log('Has .map():', typeof itemsTest?.map === 'function');
    
    if (!Array.isArray(itemsTest)) {
      console.error('❌ features.items 不是数组！实际返回:', itemsTest);
    }
  }, [t, isLoading, locale]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <StandardPageLayout locale={locale}>
      <div className="page-base min-h-screen">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-default relative py-16"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-white/95 dark:bg-gray-850/95 backdrop-blur-md border-2 border-blue-200 dark:border-blue-700/50 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-8 shadow-lg transition-all"
              >
                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                PDF {t('hero.badge')}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6"
              >
                {t('hero.title')}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                {t('hero.description')}
              </motion.p>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Compressor Component */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="section-default relative py-16"
          data-compressor-component
        >
          <StandardContainer variant="content" size="lg" center>
            <SingleFilePdfCompressor locale={locale} />
          </StandardContainer>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="section-default relative py-16"
          data-features-section
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
              >
                {t('features.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {t('features.description')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(t('features.items', { returnObjects: true }) as any[]).map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </StandardContainer>
        </motion.section>

        {/* Technical Principles Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="section-subtle relative py-16"
          data-technical-section
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
              >
                {t('technicalPrinciples.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {t('technicalPrinciples.description')}
              </motion.p>
            </div>

            <div className="space-y-8">
              {(t('technicalPrinciples.items', { returnObjects: true }) as any[]).map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
                  className="bg-white dark:bg-gray-850 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      <ul className="space-y-2">
                        {item.benefits.map((benefit: string, benefitIndex: number) => (
                          <li key={benefitIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-blue-500 dark:text-blue-400 mt-1">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </StandardContainer>
        </motion.section>

        {/* Use Cases Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="section-default relative py-16"
          data-use-cases-section
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.9 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
              >
                {t('useCases.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {t('useCases.description')}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(t('useCases.items', { returnObjects: true }) as any[]).map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.1 + index * 0.1 }}
                  className="bg-white dark:bg-gray-850 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </StandardContainer>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="section-subtle relative py-16"
          data-faq-section
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.3 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
              >
                {t('faq.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {t('faq.description')}
              </motion.p>
            </div>

            <div className="space-y-6">
              {(t('faq.items', { returnObjects: true }) as any[]).map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.5 + index * 0.05 }}
                  className="bg-white dark:bg-gray-850 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </StandardContainer>
        </motion.section>

        {/* Quick Links Section - CTA Style */}
        {t('quickLinks.title') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
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
                      transition={{ duration: 0.6, delay: 2.6 + index * 0.1 }}
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
                })}
              </div>
            </StandardContainer>
          </motion.section>
        )}
      </div>
    </StandardPageLayout>
  );
}
