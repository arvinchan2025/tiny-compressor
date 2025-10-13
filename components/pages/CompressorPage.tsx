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
  maxFiles = 10
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
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative py-12 bg-gradient-to-b from-gray-50 to-white"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 mb-6"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                {currentFormat.name} {t('hero.badge')}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                {t('hero.title')}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-600"
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
          className="py-12"
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
          className="py-12 bg-white"
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
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('technicalPrinciples.title')}
                </h2>
                <p className="text-sm text-gray-600">
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
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6"
                  >
                    <div className="text-3xl mb-4">{t(`technicalPrinciples.items.${index}.icon`)}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {t(`technicalPrinciples.items.${index}.title`)}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t(`technicalPrinciples.items.${index}.description`)}
                    </p>
                    <ul className="space-y-2">
                      {[0, 1, 2, 3].map((benefitIdx) => {
                        const benefit = t(`technicalPrinciples.items.${index}.benefits.${benefitIdx}`);
                        return benefit && benefit !== `technicalPrinciples.items.${index}.benefits.${benefitIdx}` ? (
                          <li key={benefitIdx} className="flex items-start text-sm text-gray-600">
                            <span className="text-green-500 mr-2">✓</span>
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
          className="py-12 bg-gray-50"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('useCases.title')}
                </h2>
                <p className="text-sm text-gray-600">
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
                      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105"
                    >
                      <div className="text-4xl mb-4">{t(`useCases.items.${index}.icon`)}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {t(`useCases.items.${index}.description`)}
                      </p>
                      <p className="text-sm text-gray-500">
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
          className="py-12 bg-gray-50"
        >
          <StandardContainer variant="content" size="lg" center>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('faq.title')}
                </h2>
                <p className="text-sm text-gray-600">
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
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {t(`faq.items.${index}.question`)}
                    </h3>
                    <p className="text-gray-600">
                      {t(`faq.items.${index}.answer`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </StandardContainer>
        </motion.section>

        {/* Quick Links Section */}
        {t('quickLinks.title') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
            className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50"
          >
            <StandardContainer variant="page" size="lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
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
                })}
              </div>
            </StandardContainer>
          </motion.section>
        )}
      </div>
    </StandardPageLayout>
  );
}