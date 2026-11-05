/**
 * ToolsSection - 工具展示区域组件
 *
 * 性能优化版本：
 * - 延迟渲染，等待翻译加载完成
 * - 动画优化，减少渲染复杂度
 * - 按需加载，提升首屏性能
 */

// 'use client';

import React from 'react';
import {motion} from 'framer-motion';
import StandardContainer from '@/components/ui/StandardContainer';
import {getLocalizedPath} from "@/lib/i18n";
import {useTranslation} from "@/hooks/useTranslation";

interface Tool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  href: string;
  features: string[];
  stats: string;
  popular: boolean;
}

interface ToolsSectionProps {
  t: (key: string, options?: any) => string;
}

export default function ToolsSection({locale, translator}: any) {
  const { t, getTranslation } = translator;
  const tools = [
    {
      id: 'images',
      title: t('toolCategories.images.title'),
      subtitle: t('toolCategories.images.subtitle'),
      description: t('toolCategories.images.description'),
      icon: t('toolCategories.images.icon') || '🗜️',
      gradient: 'from-blue-500 to-cyan-500',
      href: getLocalizedPath('/compressor', locale),
      features: getTranslation('toolCategories.images.features'),
      stats: t('toolCategories.images.stats') || 'Up to 95% reduction',
      popular: true
    },
    {
      id: 'conversion',
      title: t('toolCategories.conversion.title') || 'Format Conversion',
      subtitle: t('toolCategories.conversion.subtitle') || 'Transform file types',
      description: t('toolCategories.conversion.description') || 'Convert between different image formats',
      icon: t('toolCategories.conversion.icon') || '🔄',
      gradient: 'from-purple-500 to-pink-500',
      href: getLocalizedPath('/converter', locale),
      features: getTranslation('toolCategories.conversion.features'),
      stats: t('toolCategories.conversion.stats'),
      popular: false
    },
    {
      id: 'pdf',
      title: t('toolCategories.pdf.title') || 'PDF Compression',
      subtitle: t('toolCategories.pdf.subtitle') || 'Reduce documents',
      description: t('toolCategories.pdf.description') || 'Reduce PDF file sizes with advanced compression',
      icon: t('toolCategories.pdf.icon') || '📄',
      gradient: 'from-emerald-500 to-teal-500',
      href: getLocalizedPath('/compressor/compress-pdf', locale),
      features: getTranslation('toolCategories.pdf.features'),
      stats: t('toolCategories.pdf.stats'),
      popular: false
    },
    {
      id: 'video',
      title: t('toolCategories.video.title') || 'Video Processing',
      subtitle: t('toolCategories.video.subtitle') || 'Optimize videos',
      description: t('toolCategories.video.description') || 'Compress video files with FFmpeg technology',
      icon: t('toolCategories.video.icon') || '🎬',
      gradient: 'from-orange-500 to-red-500',
      href: getLocalizedPath('/compressor/compress-video', locale),
      features: getTranslation('toolCategories.video.features'),
      stats: t('toolCategories.video.stats'),
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <StandardContainer variant="content" size="xl" center>
        <div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6 }}
          // viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('sections.chooseTool.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('sections.chooseTool.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              // initial={{opacity: 0, y: 30}}
              // whileInView={{opacity: 1, y: 0}}
              // transition={{duration: 0.6, delay: index * 0.1}}
              // viewport={{once: true}}
              className="group"
            >
              <div
                className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Popular Badge */}
                {tool.popular && (
                  <div
                    className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t('labels.mostPopular')}
                  </div>
                )}

                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}/>

                {/* Header */}
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {tool.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.features.map((feature: string, featureIndex: number) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mb-6">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      Performance
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {tool.stats}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6">
                    <a
                      href={tool.href}
                      className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="relative z-10">
                        Get Started
                      </span>
                      <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300"
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}
