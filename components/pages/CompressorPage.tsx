'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import UnifiedCompressorOperation from '@/components/compressor/UnifiedCompressorOperation';
import UnifiedCompressionManager from '@/components/compressor/components/UnifiedCompressionManager';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import StandardContainer from '@/components/ui/StandardContainer';
// import { CompressorFormat } from '@/types/image';

interface CompressorPageProps {
  locale: Locale;
  format: string;
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onCompress: () => void;
  isCompressing: boolean;
  compressionProgress: number;
  compressionStatus: 'idle' | 'processing' | 'completed' | 'error';
  compressionResults: CompressionResult[];
  onDownloadResult: (result: CompressionResult) => void;
  onDownloadAll?: () => void;
  onSettingsChange?: (settings: Partial<CompressionOptions>) => void;
  onReset?: () => void;
  compressionSettings?: CompressionOptions;
  maxFiles: number;
}

export default function CompressorPage({
  locale,
  format,
  imageFiles,
  onFilesSelected,
  onRemoveFile,
  onCompress,
  isCompressing,
  compressionProgress,
  compressionStatus,
  compressionResults,
  onDownloadResult,
  onDownloadAll,
  onSettingsChange,
  onReset,
  compressionSettings,
  maxFiles = 1
}: CompressorPageProps) {
  const { t } = useModuleTranslation(`compressors/${format}`, locale);

  const formatInfo = {
    jpeg: {
      name: 'JPEG',
      extension: 'jpg',
      description: t('formatInfo.description'),
      features: [
        t('features.lossy.title'),
        t('features.small.title'),
        t('features.compatible.title')
      ]
    },
    png: {
      name: 'PNG',
      extension: 'png',
      description: t('formatInfo.description'),
      features: [
        t('features.lossless.title'),
        t('features.transparency.title'),
        t('features.quality.title')
      ]
    },
    webp: {
      name: 'WebP',
      extension: 'webp',
      description: t('formatInfo.description'),
      features: [
        t('features.modern.title'),
        t('features.efficient.title'),
        t('features.supported.title')
      ]
    },
    avif: {
      name: 'AVIF',
      extension: 'avif',
      description: t('formatInfo.description'),
      features: [
        t('features.nextgen.title'),
        t('features.advanced.title'),
        t('features.future.title')
      ]
    },
    gif: {
      name: 'GIF',
      extension: 'gif',
      description: t('formatInfo.description'),
      features: [
        t('features.animation.title'),
        t('features.simple.title'),
        t('features.universal.title')
      ]
    },
    bmp: {
      name: 'BMP',
      extension: 'bmp',
      description: t('formatInfo.description'),
      features: [
        t('features.uncompressed.title'),
        t('features.quality.title'),
        t('features.large.title')
      ]
    }
  };

  const currentFormat = formatInfo[format as keyof typeof formatInfo];

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
                {currentFormat.name} {t('hero.badge')}
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
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors"
              >
                {t('hero.description')}
              </motion.p>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Compression Operation Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="section-subtle py-16"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-4xl mx-auto">
              <UnifiedCompressionManager
                format={format as 'png' | 'jpeg' | 'webp' | 'avif' | 'gif' | 'bmp'}
                locale={locale}
                maxFiles={maxFiles}
                onCompressionComplete={(results) => {
                  // 更新压缩结果
                  if (onDownloadAll) {
                    onDownloadAll();
                  }
                }}
                onError={(error) => {
                  console.error('Compression error:', error);
                }}
              />
            </div>
          </StandardContainer>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="section-default py-12"
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
                  
                  // Skip if translation not found
                  if (title.startsWith('features.items.')) {
                    return null;
                  }
                  
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
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                  {t('technicalPrinciples.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                  {t('technicalPrinciples.description')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[0, 1, 2, 3].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                    className="card-glass p-6"
                  >
                    <div className="text-3xl mb-4">{t(`technicalPrinciples.items.${index}.icon`)}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">
                      {t(`technicalPrinciples.items.${index}.title`)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                      {t(`technicalPrinciples.items.${index}.description`)}
                    </p>
                    <ul className="space-y-2">
                      {[0, 1, 2, 3].map((benefitIdx) => {
                        const benefit = t(`technicalPrinciples.items.${index}.benefits.${benefitIdx}`);
                        return benefit && benefit !== `technicalPrinciples.items.${index}.benefits.${benefitIdx}` ? (
                          <li key={benefitIdx} className="flex items-start text-sm text-gray-600 dark:text-gray-400 transition-colors">
                            <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Use Cases Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="section-alternate py-12"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                  {t('useCases.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                  {t('useCases.description')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                  const title = t(`useCases.items.${index}.title`);
                  // 如果翻译不存在，跳过这个项目
                  if (title === `useCases.items.${index}.title`) return null;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.05 }}
                      className="card-glass p-6 hover:scale-105"
                    >
                      <div className="text-4xl mb-4">{t(`useCases.items.${index}.icon`)}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors">
                        {t(`useCases.items.${index}.description`)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        {t(`useCases.items.${index}.content`)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </StandardContainer>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="section-alternate py-12"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                  {t('faq.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                  {t('faq.description')}
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { key: 'quality', icon: '❓' },
                  { key: 'size', icon: '❓' },
                  { key: 'format', icon: '❓' },
                  { key: 'security', icon: '❓' }
                ].map((faq, index) => (
                  <motion.div
                    key={faq.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                    className="card-glass p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">
                      {t(`faq.items.${index}.question`)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      {t(`faq.items.${index}.answer`)}
                    </p>
                  </motion.div>
                ))}
              </div>
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