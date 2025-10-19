'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardButton from '@/components/ui/StandardButton';
import StandardIcon from '@/components/ui/StandardIcon';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import Link from 'next/link';
import { getFunctionalPagePath } from '@/lib/i18n/path-utils';
import ModernCompressorNavigation from '@/components/compressor/ModernCompressorNavigation';
import ModernConverterNavigation from '@/components/converter/ModernConverterNavigation';

interface UnifiedNavigationProps {
  locale: Locale;
  pageType: 'compressor' | 'converter';
}

export default function UnifiedNavigation({ locale, pageType }: UnifiedNavigationProps) {
  const { t } = useTranslation('common/navigation', locale);

  // 如果是compressor页面，使用优化版ModernCompressorNavigation组件
  if (pageType === 'compressor') {
    return <ModernCompressorNavigation locale={locale} />;
  }

  // 如果是converter页面，使用优化版ModernConverterNavigation组件
  if (pageType === 'converter') {
    return <ModernConverterNavigation locale={locale} />;
  }

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const getPageConfig = () => {
    if (pageType === 'compressor') {
      return {
        title: t('compressor.title'),
        subtitle: t('compressor.subtitle'),
        description: t('compressor.description'),
        heroIcon: '🗜️',
        heroGradient: 'from-blue-500 to-purple-600',
        bgGradient: 'from-blue-50 via-white to-purple-50',
        tools: [
          {
            id: 'png',
            name: t('compressor.tools.png.name'),
            description: t('compressor.tools.png.description'),
            path: getFunctionalPagePath('compressor', 'compress-png', locale),
            icon: '🖼️',
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
            features: [
              t('compressor.tools.png.features.0'),
              t('compressor.tools.png.features.1'),
              t('compressor.tools.png.features.2')
            ],
            compression: t('compressor.tools.png.compression')
          },
          {
            id: 'jpeg',
            name: t('compressor.tools.jpeg.name'),
            description: t('compressor.tools.jpeg.description'),
            path: getFunctionalPagePath('compressor', 'compress-jpeg', locale),
            icon: '📷',
            color: 'green',
            gradient: 'from-green-500 to-green-600',
            features: [
              t('compressor.tools.jpeg.features.0'),
              t('compressor.tools.jpeg.features.1'),
              t('compressor.tools.jpeg.features.2')
            ],
            compression: t('compressor.tools.jpeg.compression')
          },
          {
            id: 'webp',
            name: t('compressor.tools.webp.name'),
            description: t('compressor.tools.webp.description'),
            path: getFunctionalPagePath('compressor', 'compress-webp', locale),
            icon: '🌐',
            color: 'purple',
            gradient: 'from-purple-500 to-purple-600',
            features: [
              t('compressor.tools.webp.features.0'),
              t('compressor.tools.webp.features.1'),
              t('compressor.tools.webp.features.2')
            ],
            compression: t('compressor.tools.webp.compression')
          },
          {
            id: 'avif',
            name: t('compressor.tools.avif.name'),
            description: t('compressor.tools.avif.description'),
            path: getFunctionalPagePath('compressor', 'compress-avif', locale),
            icon: '🚀',
            color: 'orange',
            gradient: 'from-orange-500 to-orange-600',
            features: [
              t('compressor.tools.avif.features.0'),
              t('compressor.tools.avif.features.1'),
              t('compressor.tools.avif.features.2')
            ],
            compression: t('compressor.tools.avif.compression')
          },
          {
            id: 'gif',
            name: t('compressor.tools.gif.name'),
            description: t('compressor.tools.gif.description'),
            path: getFunctionalPagePath('compressor', 'compress-gif', locale),
            icon: '🎬',
            color: 'pink',
            gradient: 'from-pink-500 to-pink-600',
            features: [
              t('compressor.tools.gif.features.0'),
              t('compressor.tools.gif.features.1'),
              t('compressor.tools.gif.features.2')
            ],
            compression: t('compressor.tools.gif.compression')
          },
          {
            id: 'bmp',
            name: t('compressor.tools.bmp.name'),
            description: t('compressor.tools.bmp.description'),
            path: getFunctionalPagePath('compressor', 'compress-bmp', locale),
            icon: '🖥️',
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            features: [
              t('compressor.tools.bmp.features.0'),
              t('compressor.tools.bmp.features.1'),
              t('compressor.tools.bmp.features.2')
            ],
            compression: t('compressor.tools.bmp.compression')
          },
          {
            id: 'pdf',
            name: t('compressor.tools.pdf.name'),
            description: t('compressor.tools.pdf.description'),
            path: getFunctionalPagePath('compressor', 'compress-pdf', locale),
            icon: '📄',
            color: 'red',
            gradient: 'from-red-500 to-orange-600',
            features: [
              t('compressor.tools.pdf.features.0'),
              t('compressor.tools.pdf.features.1'),
              t('compressor.tools.pdf.features.2')
            ],
            compression: t('compressor.tools.pdf.compression')
          },
          {
            id: 'video',
            name: t('compressor.tools.video.name'),
            description: t('compressor.tools.video.description'),
            path: getFunctionalPagePath('compressor', 'compress-video', locale),
            icon: '🎥',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-600',
            features: [
              t('compressor.tools.video.features.0'),
              t('compressor.tools.video.features.1'),
              t('compressor.tools.video.features.2')
            ],
            compression: t('compressor.tools.video.compression')
          }
        ],
        features: [
          {
            icon: '⚡',
            title: t('compressor.features.speed.title'),
            description: t('compressor.features.speed.description'),
            details: t('compressor.features.speed.details')
          },
          {
            icon: '🔒',
            title: t('compressor.features.security.title'),
            description: t('compressor.features.security.description'),
            details: t('compressor.features.security.details')
          },
          {
            icon: '🎯',
            title: t('compressor.features.quality.title'),
            description: t('compressor.features.quality.description'),
            details: t('compressor.features.quality.details')
          }
        ],
        stats: [
          { 
            number: t('compressor.stats.processed.number'), 
            label: t('compressor.stats.processed.label'), 
            description: t('compressor.stats.processed.description') 
          },
          { 
            number: t('compressor.stats.reduction.number'), 
            label: t('compressor.stats.reduction.label'), 
            description: t('compressor.stats.reduction.description') 
          },
          { 
            number: t('compressor.stats.formats.number'), 
            label: t('compressor.stats.formats.label'), 
            description: t('compressor.stats.formats.description') 
          }
        ]
      };
    } else {
      return {
        title: t('converter.title'),
        subtitle: t('converter.subtitle'),
        description: t('converter.description'),
        heroIcon: '🔄',
        heroGradient: 'from-green-500 to-blue-600',
        bgGradient: 'from-green-50 via-white to-blue-50',
        tools: [
          {
            id: 'png-to-jpg',
            name: t('converter.tools.pngToJpg.name'),
            description: t('converter.tools.pngToJpg.description'),
            path: getFunctionalPagePath('converter', 'convert-png-to-jpg', locale),
            icon: '📷',
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
            features: [
              t('converter.tools.pngToJpg.features.0'),
              t('converter.tools.pngToJpg.features.1'),
              t('converter.tools.pngToJpg.features.2')
            ],
            conversion: t('converter.tools.pngToJpg.conversion')
          },
          {
            id: 'png-to-webp',
            name: t('converter.tools.pngToWebp.name'),
            description: t('converter.tools.pngToWebp.description'),
            path: getFunctionalPagePath('converter', 'convert-png-to-webp', locale),
            icon: '🌐',
            color: 'green',
            gradient: 'from-green-500 to-green-600',
            features: [
              t('converter.tools.pngToWebp.features.0'),
              t('converter.tools.pngToWebp.features.1'),
              t('converter.tools.pngToWebp.features.2')
            ],
            conversion: t('converter.tools.pngToWebp.conversion')
          },
          {
            id: 'png-to-avif',
            name: t('converter.tools.pngToAvif.name'),
            description: t('converter.tools.pngToAvif.description'),
            path: getFunctionalPagePath('converter', 'convert-png-to-avif', locale),
            icon: '🚀',
            color: 'purple',
            gradient: 'from-purple-500 to-purple-600',
            features: [
              t('converter.tools.pngToAvif.features.0'),
              t('converter.tools.pngToAvif.features.1'),
              t('converter.tools.pngToAvif.features.2')
            ],
            conversion: t('converter.tools.pngToAvif.conversion')
          },
          {
            id: 'jpg-to-png',
            name: t('converter.tools.jpgToPng.name'),
            description: t('converter.tools.jpgToPng.description'),
            path: getFunctionalPagePath('converter', 'convert-jpg-to-png', locale),
            icon: '🖼️',
            color: 'orange',
            gradient: 'from-orange-500 to-orange-600',
            features: [
              t('converter.tools.jpgToPng.features.0'),
              t('converter.tools.jpgToPng.features.1'),
              t('converter.tools.jpgToPng.features.2')
            ],
            conversion: t('converter.tools.jpgToPng.conversion')
          },
          {
            id: 'jpg-to-webp',
            name: t('converter.tools.jpgToWebp.name'),
            description: t('converter.tools.jpgToWebp.description'),
            path: getFunctionalPagePath('converter', 'convert-jpg-to-webp', locale),
            icon: '🔄',
            color: 'pink',
            gradient: 'from-pink-500 to-pink-600',
            features: [
              t('converter.tools.jpgToWebp.features.0'),
              t('converter.tools.jpgToWebp.features.1'),
              t('converter.tools.jpgToWebp.features.2')
            ],
            conversion: t('converter.tools.jpgToWebp.conversion')
          },
          {
            id: 'jpg-to-avif',
            name: t('converter.tools.jpgToAvif.name'),
            description: t('converter.tools.jpgToAvif.description'),
            path: getFunctionalPagePath('converter', 'convert-jpg-to-avif', locale),
            icon: '⚡',
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            features: [
              t('converter.tools.jpgToAvif.features.0'),
              t('converter.tools.jpgToAvif.features.1'),
              t('converter.tools.jpgToAvif.features.2')
            ],
            conversion: t('converter.tools.jpgToAvif.conversion')
          },
          {
            id: 'webp-to-png',
            name: t('converter.tools.webpToPng.name'),
            description: t('converter.tools.webpToPng.description'),
            path: getFunctionalPagePath('converter', 'convert-webp-to-png', locale),
            icon: '🖼️',
            color: 'teal',
            gradient: 'from-teal-500 to-teal-600',
            features: [
              t('converter.tools.webpToPng.features.0'),
              t('converter.tools.webpToPng.features.1'),
              t('converter.tools.webpToPng.features.2')
            ],
            conversion: t('converter.tools.webpToPng.conversion')
          },
          {
            id: 'webp-to-jpg',
            name: t('converter.tools.webpToJpg.name'),
            description: t('converter.tools.webpToJpg.description'),
            path: getFunctionalPagePath('converter', 'convert-webp-to-jpg', locale),
            icon: '📷',
            color: 'cyan',
            gradient: 'from-cyan-500 to-cyan-600',
            features: [
              t('converter.tools.webpToJpg.features.0'),
              t('converter.tools.webpToJpg.features.1'),
              t('converter.tools.webpToJpg.features.2')
            ],
            conversion: t('converter.tools.webpToJpg.conversion')
          },
          {
            id: 'webp-to-avif',
            name: t('converter.tools.webpToAvif.name'),
            description: t('converter.tools.webpToAvif.description'),
            path: getFunctionalPagePath('converter', 'convert-webp-to-avif', locale),
            icon: '🚀',
            color: 'emerald',
            gradient: 'from-emerald-500 to-emerald-600',
            features: [
              t('converter.tools.webpToAvif.features.0'),
              t('converter.tools.webpToAvif.features.1'),
              t('converter.tools.webpToAvif.features.2')
            ],
            conversion: t('converter.tools.webpToAvif.conversion')
          },
          {
            id: 'heic-to-jpg',
            name: t('converter.tools.heicToJpg.name'),
            description: t('converter.tools.heicToJpg.description'),
            path: getFunctionalPagePath('converter', 'convert-heic-to-jpg', locale),
            icon: '📱',
            color: 'rose',
            gradient: 'from-rose-500 to-rose-600',
            features: [
              t('converter.tools.heicToJpg.features.0'),
              t('converter.tools.heicToJpg.features.1'),
              t('converter.tools.heicToJpg.features.2')
            ],
            conversion: t('converter.tools.heicToJpg.conversion')
          }
        ],
        features: [
          {
            icon: '⚡',
            title: t('converter.features.speed.title'),
            description: t('converter.features.speed.description'),
            details: t('converter.features.speed.details')
          },
          {
            icon: '🔒',
            title: t('converter.features.security.title'),
            description: t('converter.features.security.description'),
            details: t('converter.features.security.details')
          },
          {
            icon: '🎯',
            title: t('converter.features.quality.title'),
            description: t('converter.features.quality.description'),
            details: t('converter.features.quality.details')
          }
        ],
        stats: [
          { 
            number: t('converter.stats.converted.number'), 
            label: t('converter.stats.converted.label'), 
            description: t('converter.stats.converted.description') 
          },
          { 
            number: t('converter.stats.formats.number'), 
            label: t('converter.stats.formats.label'), 
            description: t('converter.stats.formats.description') 
          },
          { 
            number: t('converter.stats.quality.number'), 
            label: t('converter.stats.quality.label'), 
            description: t('converter.stats.quality.description') 
          }
        ]
      };
    }
  };

  const config = getPageConfig();

  return (
    <StandardPageLayout locale={locale}>
      <div className="page-base min-h-screen">
        {/* Modern Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Clean Title Design */}
              <motion.h1
                variants={heroVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {config.title}
                </span>
              </motion.h1>

              {/* Refined Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light"
              >
                {config.subtitle}
              </motion.p>

              {/* Modern Stats Grid */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
              >
                {config.stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="inline-flex flex-col items-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Modern Tools Grid Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                {t('tools.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {config.description}
              </p>
            </motion.div>

            <div className={`grid ${pageType === 'compressor' ? 'sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-8 xl:gap-10`}>
              {config.tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={tool.path}>
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:border-transparent hover:shadow-2xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-3 group-hover:scale-[1.02]">
                      {/* Premium Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-8 transition-all duration-500`}></div>
                      
                      {/* Elegant Accent Line */}
                      <div className={`h-1 bg-gradient-to-r ${tool.gradient} group-hover:h-1.5 transition-all duration-300`} />
                      
                      <div className="p-6 flex-1 flex flex-col relative">
                        {/* Professional Icon and Title Layout */}
                        <div className="text-center mb-5">
                          <div className={`inline-flex w-16 h-16 rounded-xl bg-gradient-to-br ${tool.gradient} items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4 relative`}>
                            <span className="text-2xl text-white">{tool.icon}</span>
                            {/* Subtle glow effect */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`}></div>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                            {tool.name}
                          </h3>
                        </div>

                        {/* Refined Description */}
                        <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed text-center text-sm">
                          {tool.description}
                        </p>

                        {/* Minimalist Features Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
                          {tool.features.slice(0, 2).map((feature, featureIndex) => (
                            <span 
                              key={featureIndex} 
                              className="inline-block px-3 py-1.5 bg-gray-50/80 dark:bg-gray-700/40 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200/40 dark:border-gray-600/40 backdrop-blur-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Elegant Bottom Info */}
                        <div className="mt-auto pt-4 border-t border-gray-100/60 dark:border-gray-700/60">
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                              {pageType === 'compressor' 
                                ? (t('compressor.statsLabels.compression') || 'Compression')
                                : (t('converter.statsLabels.speed') || 'Speed')
                              }
                            </div>
                            <div className={`text-base font-bold bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                              {pageType === 'compressor' ? (tool as any).compression : (tool as any).conversion}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Simplified Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                {t('features.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {config.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-lg transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                      <span className="text-3xl text-white">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Original Colors */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-3">
                {t('cta.title')}
              </h2>
              <p className="text-base text-blue-100 mb-6 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <Link href={locale === 'en' ? '/' : `/${locale}`}>
                <button className="inline-flex items-center px-6 py-2.5 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 shadow-lg">
                  <span className="mr-2">←</span>
                  {t('cta.backToHome')}
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}