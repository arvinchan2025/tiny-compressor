'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import StandardContainer from '@/components/ui/StandardContainer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
  const { t, isLoading } = useModuleTranslation('compressors/video', locale);
  
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
                Video {t('hero.badge')}
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
                className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {t('hero.subtitle')}
              </motion.p>
            </div>
          </StandardContainer>
        </motion.section>
        
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
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('features.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('features.subtitle')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(t('features.items', { returnObjects: true }) as any[]).map((feature: any, index: number) => (
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
                ))}
              </div>
            </motion.section>
          </StandardContainer>
        )}
        
        {/* Technical Principles Section */}
        {t('technicalPrinciples.title') && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('technicalPrinciples.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('technicalPrinciples.subtitle')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(t('technicalPrinciples.items', { returnObjects: true }) as any[]).map((item: any, index: number) => (
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
                ))}
              </div>
            </motion.section>
          </StandardContainer>
        )}
        
        {/* Use Cases Section */}
        {t('useCases.title') && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('useCases.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('useCases.subtitle')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(t('useCases.items', { returnObjects: true }) as any[]).map((useCase: any, index: number) => (
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
                ))}
              </div>
            </motion.section>
          </StandardContainer>
        )}
        
        {/* FAQ Section */}
        {t('faq.title') && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('faq.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('faq.subtitle')}
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-4">
                {(t('faq.items', { returnObjects: true }) as any[]).map((item: any, index: number) => (
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
                ))}
              </div>
            </motion.section>
          </StandardContainer>
        )}
        
        {/* Quick Links Section */}
        {t('quickLinks.title') && (
          <StandardContainer variant="page" size="lg" center={true} className="mt-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700 relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
              
              <div className="relative z-10 px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {t('quickLinks.title')}
                  </h2>
                  <p className="text-white/90">
                    {t('quickLinks.description')}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {(t('quickLinks.items', { returnObjects: true }) as any[]).map((link: any, index: number) => {
                    if (!link.title || link.title.includes('quickLinks.items')) return null;
                    
                    return (
                      <a
                        key={index}
                        href={link.url || '#'}
                        className="card-cta p-6 group"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                          {link.description}
                        </p>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          </StandardContainer>
        )}
      </div>
    </StandardPageLayout>
  );
}

