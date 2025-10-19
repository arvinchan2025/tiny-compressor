/**
 * ConverterToolsSection - 转换器工具选择区域组件
 * 
 * 性能优化版本：
 * - 延迟渲染，等待翻译加载完成
 * - 简化动画，减少渲染复杂度
 * - 按需加载，提升首屏性能
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';
import Link from 'next/link';
import { getFunctionalPagePath } from '@/lib/i18n/path-utils';

interface ConverterToolsSectionProps {
  locale: string;
}

export default function ConverterToolsSection({ locale }: ConverterToolsSectionProps) {
  const { t } = useTranslation('common/navigation' as any, locale as any);

  // 安全的翻译获取函数
  const getTranslationArray = (key: string, fallback: string[] = []): string[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // 转换工具配置
  // 获取转换器工具数据
  const converterToolsData = getTranslationArray('converterNavigation.tools', [
    {
      id: 'png-to-jpg',
      title: 'PNG to JPG',
      subtitle: 'Convert with quality',
      description: 'Convert PNG images to JPG format with intelligent quality optimization',
      icon: '📷',
      gradient: 'from-blue-500 to-green-500',
      features: ['PNG', 'JPG', 'Quality control'],
      stats: 'Perfect quality',
      popular: true
    },
    {
      id: 'png-to-webp',
      title: 'PNG to WebP',
      subtitle: 'Modern format',
      description: 'Convert PNG images to modern WebP format for better web performance',
      icon: '🌐',
      gradient: 'from-blue-500 to-purple-500',
      features: ['PNG', 'WebP', 'Web optimized'],
      stats: 'Up to 90% smaller',
      popular: false
    },
    {
      id: 'png-to-avif',
      title: 'PNG to AVIF',
      subtitle: 'Next-gen format',
      description: 'Convert PNG images to ultra-modern AVIF format with superior compression',
      icon: '🚀',
      gradient: 'from-blue-500 to-orange-500',
      features: ['PNG', 'AVIF', 'Ultra compression'],
      stats: 'Up to 95% smaller',
      popular: false
    },
    {
      id: 'jpg-to-png',
      title: 'JPG to PNG',
      subtitle: 'Add transparency',
      description: 'Convert JPG images to PNG format with background removal capability',
      icon: '🖼️',
      gradient: 'from-green-500 to-blue-500',
      features: ['JPG', 'PNG', 'Transparency'],
      stats: 'Lossless quality',
      popular: false
    },
    {
      id: 'jpg-to-webp',
      title: 'JPG to WebP',
      subtitle: 'Web optimization',
      description: 'Convert JPG images to WebP format for better web performance',
      icon: '🌐',
      gradient: 'from-green-500 to-purple-500',
      features: ['JPG', 'WebP', 'Web optimized'],
      stats: 'Up to 85% smaller',
      popular: false
    },
    {
      id: 'jpg-to-avif',
      title: 'JPG to AVIF',
      subtitle: 'Ultra compression',
      description: 'Convert JPG images to AVIF format with superior compression ratios',
      icon: '🚀',
      gradient: 'from-green-500 to-orange-500',
      features: ['JPG', 'AVIF', 'Ultra compression'],
      stats: 'Up to 90% smaller',
      popular: false
    },
    {
      id: 'webp-to-png',
      title: 'WebP to PNG',
      subtitle: 'Universal format',
      description: 'Convert WebP images to PNG format for maximum compatibility',
      icon: '🖼️',
      gradient: 'from-purple-500 to-blue-500',
      features: ['WebP', 'PNG', 'Universal'],
      stats: 'Full compatibility',
      popular: false
    },
    {
      id: 'webp-to-jpg',
      title: 'WebP to JPG',
      subtitle: 'Legacy support',
      description: 'Convert WebP images to JPG format for older browser support',
      icon: '📷',
      gradient: 'from-purple-500 to-green-500',
      features: ['WebP', 'JPG', 'Legacy support'],
      stats: 'Browser compatible',
      popular: false
    },
    {
      id: 'webp-to-avif',
      title: 'WebP to AVIF',
      subtitle: 'Next generation',
      description: 'Convert WebP images to AVIF format for even better compression',
      icon: '🚀',
      gradient: 'from-purple-500 to-orange-500',
      features: ['WebP', 'AVIF', 'Next-gen'],
      stats: 'Up to 80% smaller',
      popular: false
    },
    {
      id: 'heic-to-jpg',
      title: 'HEIC to JPG',
      subtitle: 'iOS compatibility',
      description: 'Convert HEIC images from iOS devices to JPG format for universal compatibility',
      icon: '📱',
      gradient: 'from-pink-500 to-green-500',
      features: ['HEIC', 'JPG', 'iOS support'],
      stats: 'Universal format',
      popular: false
    }
  ]);

  // 转换为带有href的工具数组，确保翻译正确应用
  const converterTools = converterToolsData.map((tool: any) => ({
    ...tool,
    // 确保title和subtitle使用翻译数据，如果没有则使用回退值
    title: tool.title || tool.id.replace('-', ' ').replace('-', ' to ').toUpperCase(),
    subtitle: tool.subtitle || 'Format conversion',
    href: getFunctionalPagePath('converter', `convert-${tool.id.replace('-to-', '-to-')}`, locale as any)
  }));

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <StandardContainer variant="content" size="xl" center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('converterNavigation.sections.toolsSection.title') || 'Choose Your Conversion Tool'}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('converterNavigation.sections.toolsSection.subtitle') || 'Professional-grade format conversion tools for images and documents. Select the perfect tool for your specific conversion needs.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {converterTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl border border-white/30 dark:border-slate-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {tool.popular && (
                <span className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t('converterNavigation.labels.popular')}
                </span>
              )}
              <header className="text-center mb-6 flex-shrink-0">
                <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${tool.gradient} rounded-full items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl">{tool.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  {tool.subtitle}
                </p>
                <p className="text-slate-700 dark:text-slate-400 text-base leading-relaxed">
                  {tool.description}
                </p>
              </header>

              <div className="flex-grow flex flex-col justify-between">
                {/* Features */}
                <div className="mb-6 text-center">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t('converterNavigation.labels.keyFeatures')}
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tool.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {tool.stats}
                  </p>
                </div>

                {/* CTA Button */}
                <Link href={tool.href} className="block">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold text-center hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    {t('converterNavigation.sections.cta.buttons.convertNow')}
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}
