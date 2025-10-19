/**
 * ModernCompressorPage - 现代化压缩器页面组件
 * 
 * 这是一个完整的、现代化的压缩器页面组件
 * 支持所有图像格式的压缩，具有统一的现代化设计
 * 使用增强的翻译系统，支持懒加载和多语言
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import StandardContainer from '@/components/ui/StandardContainer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CTAQuickLinks from '@/components/shared/CTAQuickLinks';

// 懒加载压缩管理器组件 - LCP优化版本
const UnifiedCompressionManager = dynamic(
  () => import('@/components/compressor/components/UnifiedCompressionManager'),
  {
    loading: () => (
      <div className="card-glass p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-text-secondary">Loading compression tool...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

interface ModernCompressorPageProps {
  locale: string;
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

export default function ModernCompressorPage({
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
  maxFiles
}: ModernCompressorPageProps) {
  // 使用原来的翻译 Hook
  const { t, isLoading: translationLoading } = useTranslation(
    `compressors/${format}` as any,
    locale as Locale
  );

  // 关键内容优先渲染 - 不等待翻译加载
  // 翻译加载状态只影响非关键内容

  // 渲染主要内容
  return (
    <>
      <StandardPageLayout locale={locale}>
        <div className="page-base min-h-screen">
          {/* Hero Section - LCP优化版本 */}
          <section className="relative">
            {/* 极简背景 - 减少渲染复杂度 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950" />
            
            <StandardContainer variant="content" size="xl" center className="relative z-10">
              <div className="text-center pt-20 pb-16">
                {/* Main Headline - 关键内容优先渲染 */}
                <div className="mb-12">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {translationLoading ? `${format.toUpperCase()} Compressor` : t('hero.title')}
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                    {translationLoading 
                      ? 'Professional image compression to reduce file sizes while maintaining quality' 
                      : t('hero.subtitle')
                    }
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
          </section>

          {/* Compression Operation Section */}
          <div className="section-subtle py-16">
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
          </div>

          {/* Features Section - 延迟渲染直到翻译加载完成 */}
          {!translationLoading && (
            <div className="section-default py-12">
              <StandardContainer variant="content" size="lg" center>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                      {t('features.title')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                        <div key={index} className="card-glass p-6">
                          <div className="text-3xl mb-4">{icon || '✓'}</div>
                          <h3 className="text-xl font-semibold text-text-primary mb-2">
                            {title}
                          </h3>
                          <p className="text-text-secondary">
                            {description}
                          </p>
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                </div>
              </StandardContainer>
            </div>
          )}

          {/* FAQ Section - 延迟渲染直到翻译加载完成 */}
          {!translationLoading && (
            <div className="section-subtle py-12">
              <StandardContainer variant="content" size="lg" center>
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                      {t('faq.title')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      {t('faq.description')}
                    </p>
                  </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 8 }).map((_, index) => {
                    const question = t(`faq.items.${index}.question`);
                    const answer = t(`faq.items.${index}.answer`);
                    
                    if (question.startsWith('faq.items.')) {
                      return null;
                    }
                    
                    return (
                      <div key={index} className="card-glass p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-3">
                          {question}
                        </h3>
                        <p className="text-text-secondary">
                          {answer}
                        </p>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
            </StandardContainer>
            </div>
          )}

          {/* Use Cases Section - 延迟渲染直到翻译加载完成 */}
          {!translationLoading && (
          <div className="section-default py-12">
            <StandardContainer variant="content" size="lg" center>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    {t('useCases.title')}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {t('useCases.description')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => {
                    const title = t(`useCases.items.${index}.title`);
                    const description = t(`useCases.items.${index}.description`);
                    const icon = t(`useCases.items.${index}.icon`);
                    
                    if (title.startsWith('useCases.items.')) {
                      return null;
                    }
                    
                    return (
                      <div key={index} className="card-glass p-6 hover:scale-105 transition-transform">
                        <div className="text-4xl mb-4">{icon || '📁'}</div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          {title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                          {description}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {t(`useCases.items.${index}.content`)}
                        </p>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
            </StandardContainer>
          </div>
          )}

          {/* Technical Principles Section - 延迟渲染直到翻译加载完成 */}
          {!translationLoading && (
          <div className="section-subtle py-12">
            <StandardContainer variant="content" size="lg" center>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    {t('technicalPrinciples.title')}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {t('technicalPrinciples.description')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const title = t(`technicalPrinciples.items.${index}.title`);
                    const description = t(`technicalPrinciples.items.${index}.description`);
                    
                    if (title.startsWith('technicalPrinciples.items.')) {
                      return null;
                    }
                    
                    return (
                      <div key={index} className="card-glass p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-3">
                          {title}
                        </h3>
                        <p className="text-text-secondary">
                          {description}
                        </p>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
            </StandardContainer>
          </div>
          )}

          {/* Quick Links Section - CTA Style - 延迟渲染直到翻译加载完成 */}
          {!translationLoading && (
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
    </>
  );
}