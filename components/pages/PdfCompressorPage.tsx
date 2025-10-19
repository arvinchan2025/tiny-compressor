'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import StandardContainer from '@/components/ui/StandardContainer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CTAQuickLinks from '@/components/shared/CTAQuickLinks';

// 懒加载 PDF 压缩器组件
const SingleFilePdfCompressor = dynamic(
  () => import('@/components/compressor/SingleFilePdfCompressor'),
  {
    loading: () => (
      <div className="card-glass p-12">
        <LoadingSpinner />
      </div>
    ),
    ssr: false // PDF 压缩是纯客户端功能
  }
);

interface PdfCompressorPageProps {
  locale: Locale;
}

export default function PdfCompressorPage({ locale }: PdfCompressorPageProps) {
  const { t, isLoading } = useTranslation('compressors/pdf' as any, locale as any);

  return (
    <StandardPageLayout locale={locale}>
      <div className="page-base min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
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
                    {isLoading ? 'PDF Compressor' : t('hero.title')}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  {isLoading 
                    ? 'Professional PDF compression to reduce file sizes while maintaining quality and readability'
                    : t('hero.subtitle')
                  }
                </p>
              </div>

              {/* Stats Badge */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                      85%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Size Reduction
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
                      &lt;5s
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Processing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </StandardContainer>
        </section>

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
                {isLoading ? 'PDF Format Features' : t('features.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {isLoading ? 'Why PDF is the universal standard for document sharing' : t('features.description')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(() => {
                const features = t('features.items', { returnObjects: true });
                const featuresArray = Array.isArray(features) ? features : [];
                return featuresArray.map((feature: any, index: number) => (
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
                ));
              })()}
            </motion.div>
          </StandardContainer>
        </motion.section>

        {/* Technical Principles Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="section-subtle relative py-16"
          data-technical-principles-section
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
              >
                {isLoading ? 'How PDF Compression Works' : t('technicalPrinciples.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {isLoading 
                  ? 'Understanding the technical principles behind PDF compression helps you optimize documents effectively.'
                  : t('technicalPrinciples.description')
                }
              </motion.p>
            </div>

            <div className="space-y-8">
              {(() => {
                const items = t('technicalPrinciples.items', { returnObjects: true });
                const itemsArray = Array.isArray(items) ? items : [];
                return itemsArray.map((item: any, index: number) => (
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
                        {(item.benefits && Array.isArray(item.benefits) ? item.benefits : []).map((benefit: string, benefitIndex: number) => (
                          <li key={benefitIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-blue-500 dark:text-blue-400 mt-1">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
                ));
              })()}
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
                {isLoading ? 'When & How to Use PDF Compression' : t('useCases.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {isLoading ? 'Common scenarios and best practices for PDF compression' : t('useCases.description')}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(() => {
                const useCases = t('useCases.items', { returnObjects: true });
                const useCasesArray = Array.isArray(useCases) ? useCases : [];
                return useCasesArray.map((item: any, index: number) => (
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
                ));
              })()}
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
                {isLoading ? 'Frequently Asked Questions' : t('faq.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {isLoading 
                  ? 'Common questions about PDF compression and our PDF compressor tool.'
                  : t('faq.description')
                }
              </motion.p>
            </div>

            <div className="space-y-6">
              {(() => {
                const faqItems = t('faq.items', { returnObjects: true });
                const faqItemsArray = Array.isArray(faqItems) ? faqItems : [];
                return faqItemsArray.map((item: any, index: number) => (
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
                ));
              })()}
            </div>
          </StandardContainer>
        </motion.section>

        {/* CTA Quick Links Section */}
        {t('quickLinks.title') && (
          <div className="relative z-10">
            <CTAQuickLinks
              title={t('quickLinks.title')}
              description={t('quickLinks.description')}
              items={(() => {
                const quickLinks = t('quickLinks.items', { returnObjects: true });
                const quickLinksArray = Array.isArray(quickLinks) ? quickLinks : [];
                return quickLinksArray.map((link: any) => ({
                  title: link.title || '',
                  description: link.description || '',
                  url: link.url || '#',
                  icon: link.icon || ''
                })).filter(item => item.title && !item.title.includes('quickLinks.items'));
              })()}
              maxItems={6}
            />
          </div>
        )}
      </div>
    </StandardPageLayout>
  );
}