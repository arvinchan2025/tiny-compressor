'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import UnifiedCompressorOperation from '@/components/compressor/UnifiedCompressorOperation';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import StandardContainer from '@/components/ui/StandardContainer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CTAQuickLinks from '@/components/shared/CTAQuickLinks';
// import { CompressorFormat } from '@/types/image';

// 懒加载压缩管理器组件（较大的组件）
const UnifiedCompressionManager = dynamic(
  () => import('@/components/compressor/components/UnifiedCompressionManager'),
  {
    loading: () => (
      <div className="card-glass p-8">
        <LoadingSpinner />
      </div>
    ),
    ssr: false
  }
);

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
  const { t, isLoading: translationLoading } = useTranslation(`compressors/${format}`, locale);

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
                    {t('hero.title')}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  {t('hero.description')}
                </p>
              </div>

              {/* Stats Badge */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                      90%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Size Reduction
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
                      6+
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
                      &lt;3s
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Processing
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="relative z-10">
            <CTAQuickLinks
              title={t('quickLinks.title')}
              description={t('quickLinks.description')}
              items={(() => {
                // 定义默认的图标映射
                const defaultIcons = ['📷', '🌐', '⚡', '🎬', '🖼️', '🔄'];
                
                // 尝试获取完整的 quickLinks.items 数组
                const quickLinksItems = t('quickLinks.items', { returnObjects: true });
                
                // 如果成功获取到数组，直接使用
                if (Array.isArray(quickLinksItems)) {
                  return quickLinksItems.filter(item => item && item.title).map((item, index) => ({
                    title: item.title,
                    description: item.description,
                    url: item.url,
                    icon: item.icon || defaultIcons[index] || '🔧'
                  }));
                }
                
                // 否则使用原来的逐个获取方法，并添加默认图标
                return Array.from({ length: 6 }, (_, index) => {
                  const title = t(`quickLinks.items.${index}.title`);
                  const description = t(`quickLinks.items.${index}.description`);
                  const url = t(`quickLinks.items.${index}.url`);
                  const icon = t(`quickLinks.items.${index}.icon`);
                  
                  return {
                    title,
                    description,
                    url,
                    icon: icon || defaultIcons[index] || '🔧'
                  };
                }).filter(item => item.title && !item.title.includes('quickLinks.items'));
              })()}
              maxItems={6}
            />
          </div>
        )}
      </div>
    </StandardPageLayout>
  );
}