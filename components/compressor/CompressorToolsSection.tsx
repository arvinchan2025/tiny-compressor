/**
 * CompressorToolsSection - 压缩器工具选择区域组件
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

interface CompressorToolsSectionProps {
  locale: string;
}

export default function CompressorToolsSection({ locale }: CompressorToolsSectionProps) {
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

  // 压缩工具配置
  const compressorTools = [
    {
      id: 'png',
      title: t('compressor.tools.png.name'),
      subtitle: t('compressorNavigation.tools.png.subtitle'),
      description: t('compressorNavigation.tools.png.description'),
      icon: '🖼️',
      gradient: 'from-blue-500 to-cyan-500',
      href: getFunctionalPagePath('compressor', 'compress-png', locale as any),
      features: getTranslationArray('compressorNavigation.tools.png.features', ['PNG compression', 'Quality control', 'Batch processing']),
      stats: t('compressorNavigation.tools.png.stats'),
      buttonText: t('compressorNavigation.tools.png.buttonText'),
      popular: true
    },
    {
      id: 'jpeg',
      title: t('compressor.tools.jpeg.name'),
      subtitle: t('compressorNavigation.tools.jpeg.subtitle'),
      description: t('compressorNavigation.tools.jpeg.description'),
      icon: '📷',
      gradient: 'from-green-500 to-emerald-500',
      href: getFunctionalPagePath('compressor', 'compress-jpeg', locale as any),
      features: getTranslationArray('compressorNavigation.tools.jpeg.features', ['JPEG compression', 'Quality settings', 'Fast processing']),
      stats: t('compressorNavigation.tools.jpeg.stats'),
      buttonText: t('compressorNavigation.tools.jpeg.buttonText'),
      popular: false
    },
    {
      id: 'webp',
      title: t('compressor.tools.webp.name'),
      subtitle: t('compressorNavigation.tools.webp.subtitle'),
      description: t('compressorNavigation.tools.webp.description'),
      icon: '🌐',
      gradient: 'from-purple-500 to-pink-500',
      href: getFunctionalPagePath('compressor', 'compress-webp', locale as any),
      features: getTranslationArray('compressorNavigation.tools.webp.features', ['WebP compression', 'Modern format', 'Smaller files']),
      stats: t('compressorNavigation.tools.webp.stats'),
      buttonText: t('compressorNavigation.tools.webp.buttonText'),
      popular: false
    },
    {
      id: 'avif',
      title: t('compressor.tools.avif.name'),
      subtitle: t('compressorNavigation.tools.avif.subtitle'),
      description: t('compressorNavigation.tools.avif.description'),
      icon: '🚀',
      gradient: 'from-orange-500 to-red-500',
      href: getFunctionalPagePath('compressor', 'compress-avif', locale as any),
      features: getTranslationArray('compressorNavigation.tools.avif.features', ['AVIF compression', 'Next-gen format', 'Ultra efficient']),
      stats: t('compressorNavigation.tools.avif.stats'),
      buttonText: t('compressorNavigation.tools.avif.buttonText'),
      popular: false
    },
    {
      id: 'gif',
      title: t('compressor.tools.gif.name'),
      subtitle: t('compressorNavigation.tools.gif.subtitle'),
      description: t('compressorNavigation.tools.gif.description'),
      icon: '🎬',
      gradient: 'from-teal-500 to-cyan-500',
      href: getFunctionalPagePath('compressor', 'compress-gif', locale as any),
      features: getTranslationArray('compressorNavigation.tools.gif.features', ['GIF compression', 'Animation support', 'Web optimized']),
      stats: t('compressorNavigation.tools.gif.stats'),
      buttonText: t('compressorNavigation.tools.gif.buttonText'),
      popular: false
    },
    {
      id: 'bmp',
      title: t('compressor.tools.bmp.name'),
      subtitle: t('compressorNavigation.tools.bmp.subtitle'),
      description: t('compressorNavigation.tools.bmp.description'),
      icon: '🖼️',
      gradient: 'from-indigo-500 to-purple-500',
      href: getFunctionalPagePath('compressor', 'compress-bmp', locale as any),
      features: getTranslationArray('compressorNavigation.tools.bmp.features', ['BMP compression', 'Bitmap format', 'Lossless option']),
      stats: t('compressorNavigation.tools.bmp.stats'),
      buttonText: t('compressorNavigation.tools.bmp.buttonText'),
      popular: false
    },
    {
      id: 'pdf',
      title: t('compressor.tools.pdf.name'),
      subtitle: t('compressorNavigation.tools.pdf.subtitle'),
      description: t('compressorNavigation.tools.pdf.description'),
      icon: '📄',
      gradient: 'from-red-500 to-pink-500',
      href: getFunctionalPagePath('compressor', 'compress-pdf', locale as any),
      features: getTranslationArray('compressorNavigation.tools.pdf.features', ['PDF compression', 'Document optimization', 'Metadata removal']),
      stats: t('compressorNavigation.tools.pdf.stats'),
      buttonText: t('compressorNavigation.tools.pdf.buttonText'),
      popular: false
    },
    {
      id: 'video',
      title: t('compressor.tools.video.name'),
      subtitle: t('compressorNavigation.tools.video.subtitle'),
      description: t('compressorNavigation.tools.video.description'),
      icon: '🎥',
      gradient: 'from-yellow-500 to-orange-500',
      href: getFunctionalPagePath('compressor', 'compress-video', locale as any),
      features: getTranslationArray('compressorNavigation.tools.video.features', ['Video compression', 'Multiple formats', 'Quality presets']),
      stats: t('compressorNavigation.tools.video.stats'),
      buttonText: t('compressorNavigation.tools.video.buttonText'),
      popular: false
    }
  ];

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
            {t('compressorNavigation.toolsSection.title') || 'Choose Your Compression Tool'}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('compressorNavigation.toolsSection.subtitle') || 'Professional-grade compression tools for images, documents, and videos. Select the perfect tool for your specific file optimization needs.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {compressorTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl border border-white/30 dark:border-slate-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {tool.popular && (
                <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t('compressorNavigation.labels.popular')}
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
                    {t('compressorNavigation.labels.keyFeatures')}
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
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    {tool.buttonText || 'Get Started'}
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
