'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import StandardContainer from '@/components/ui/StandardContainer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CTAQuickLinks from '@/components/shared/CTAQuickLinks';

// 动态加载压缩组件，避免影响首屏
const SingleFileVideoCompressor = dynamic(
  () => import('@/components/compressor/SingleFileVideoCompressor'),
  { 
    ssr: false,
    loading: () => (
      <div className="card-glass p-12">
        <LoadingSpinner />
      </div>
    )
  }
);

const SimpleVideoCompressor = dynamic(
  () => import('@/components/compressor/SimpleVideoCompressor'),
  { 
    ssr: false,
    loading: () => (
      <div className="card-glass p-12">
        <LoadingSpinner />
      </div>
    )
  }
);

interface VideoCompressorPageProps {
  locale: Locale;
}

export default function VideoCompressorPage({ locale }: VideoCompressorPageProps) {
  const { t, isLoading } = useTranslation('compressors/video' as any, locale as any);
  
  return (
    <StandardPageLayout locale={locale}>
      <div className="page-base min-h-screen">
        {/* Hero Section - 简化版，只保留标题和副标题 */}
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
                    {isLoading ? 'Video Compressor' : t('hero.title')}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  {isLoading 
                    ? 'Professional video compression to reduce file sizes while maintaining quality'
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
                      5+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Formats
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
                      &lt;10s
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
        
        {/* Operation Area */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="section-default"
        >
          <StandardContainer variant="content" size="md" center>
            <SimpleVideoCompressor locale={locale} />
          </StandardContainer>
        </motion.section>
        
        {/* Features Section */}
        {t('features.title') && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {isLoading ? 'Video Compression Features' : t('features.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {isLoading 
                    ? 'Professional video compression with advanced algorithms and quality optimization'
                    : t('features.subtitle')
                  }
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const features = t('features.items', { returnObjects: true });
                  const featuresArray = Array.isArray(features) ? features : [];
                  return featuresArray.map((feature: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="card-glass p-6 text-center group hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-3">
                      {feature.icon === 'zap' && '⚡'}
                      {feature.icon === 'shield' && '🛡️'}
                      {feature.icon === 'sliders' && '🎛️'}
                      {feature.icon === 'gauge' && '📊'}
                      {feature.icon === 'file-video' && '🎬'}
                      {feature.icon === 'download' && '⬇️'}
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                  ));
                })()}
              </div>
            </motion.section>
          </StandardContainer>
        )}
        
        {/* Technical Principles Section */}
        {(t('technicalPrinciples.title') || isLoading) && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {isLoading ? 'How Video Compression Works' : t('technicalPrinciples.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {isLoading 
                    ? 'Advanced compression algorithms that reduce file size while maintaining quality'
                    : t('technicalPrinciples.subtitle')
                  }
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const items = t('technicalPrinciples.items', { returnObjects: true });
                  const itemsArray = Array.isArray(items) ? items : [];
                  return itemsArray.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                  >
                    <div className="text-3xl mb-3">
                      {item.icon === 'cpu' && '💻'}
                      {item.icon === 'image' && '🖼️'}
                      {item.icon === 'settings' && '⚙️'}
                      {item.icon === 'volume-2' && '🔊'}
                      {item.icon === 'layers' && '📚'}
                      {item.icon === 'lock' && '🔒'}
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  ));
                })()}
              </div>
            </motion.section>
          </StandardContainer>
        )}
        
        {/* Use Cases Section */}
        {(t('useCases.title') || isLoading) && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {isLoading ? 'Video Compression Use Cases' : t('useCases.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {isLoading 
                    ? 'Common scenarios where video compression is essential'
                    : t('useCases.subtitle')
                  }
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const useCases = t('useCases.items', { returnObjects: true });
                  const useCasesArray = Array.isArray(useCases) ? useCases : [];
                  return useCasesArray.map((useCase: any, index: number) => (
                  <div
                    key={index}
                    className="card-glass p-6"
                  >
                    <div className="text-3xl mb-3">
                      {useCase.icon === 'share-2' && '📤'}
                      {useCase.icon === 'mail' && '✉️'}
                      {useCase.icon === 'smartphone' && '📱'}
                      {useCase.icon === 'cloud' && '☁️'}
                      {useCase.icon === 'globe' && '🌐'}
                      {useCase.icon === 'users' && '👥'}
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {useCase.description}
                    </p>
                  </div>
                  ));
                })()}
              </div>
            </motion.section>
          </StandardContainer>
        )}
        
        {/* FAQ Section */}
        {(t('faq.title') || isLoading) && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {isLoading ? 'Frequently Asked Questions' : t('faq.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {isLoading 
                    ? 'Common questions about video compression and our video compressor tool'
                    : t('faq.subtitle')
                  }
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-4">
                {(() => {
                  const faqItems = t('faq.items', { returnObjects: true });
                  const faqItemsArray = Array.isArray(faqItems) ? faqItems : [];
                  return faqItemsArray.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="card-glass p-6"
                  >
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      {item.question}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.answer}
                    </p>
                  </div>
                  ));
                })()}
              </div>
            </motion.section>
          </StandardContainer>
        )}

        {/* CTA Quick Links Section */}
        {t('quickLinks.title') && (
          <div className="relative z-10 mt-20">
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

