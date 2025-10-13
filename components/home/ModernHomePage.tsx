'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { getNavigationPagePath } from '@/lib/i18n/path-utils';
import designSystem from '@/lib/design-system';

interface ModernHomePageProps {
  locale: Locale;
}

export default function ModernHomePage({ locale }: ModernHomePageProps) {
  const { t } = useTranslation('home', locale);

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

  // 真实的技术统计数据
  const techStats = [
    {
      number: '15M+',
      label: t('hero.stats.sizeReduction') || 'Images Processed',
      description: t('hero.stats.sizeReduction') || 'Monthly average',
      icon: '📊'
    },
    {
      number: '99.9%',
      label: t('hero.stats.reliability') || 'Uptime',
      description: t('hero.stats.reliability') || 'Reliable service',
      icon: '⚡'
    },
    {
      number: '16',
      label: t('hero.stats.supportedFormats') || 'Supported Formats',
      description: t('hero.stats.supportedFormats') || 'All major types',
      icon: '🖼️'
    },
    {
      number: '90%',
      label: t('hero.stats.sizeReduction') || 'Size Reduction',
      description: t('hero.stats.sizeReduction') || 'Average compression',
      icon: '🗜️'
    }
  ];

  // 工具详细数据
  const tools = [
    {
      title: t('tools.compressor.title') || 'Image Compressor',
      description: t('tools.compressor.description') || 'Reduce file sizes while maintaining quality with our advanced compression algorithms',
      button: t('tools.compressor.button') || 'Start Compressing',
      link: getNavigationPagePath('compressor', locale),
      icon: '🗜️',
      gradient: 'from-blue-500 to-blue-600',
      features: t('tools.compressor.features') || [
        'PNG, JPG, WebP, AVIF, GIF, BMP support',
        'Batch processing for multiple files',
        'Advanced quality control',
        'Real-time preview and comparison'
      ],
      stats: {
        compression: t('tools.compressor.stats.compression') || 'Up to 90%',
        formats: t('tools.compressor.stats.formats') || '6+ formats',
        processing: t('tools.compressor.stats.processing') || '< 3 seconds'
      },
      useCases: [
        'Website optimization',
        'Email attachments',
        'Social media posts',
        'Print materials'
      ]
    },
    {
      title: t('tools.converter.title') || 'Image Converter',
      description: t('tools.converter.description') || 'Convert between different image formats with precision and speed',
      button: t('tools.converter.button') || 'Start Converting',
      link: getNavigationPagePath('converter', locale),
      icon: '🔄',
      gradient: 'from-purple-500 to-purple-600',
      features: t('tools.converter.features') || [
        'Format conversion between 10+ formats',
        'Quality preservation algorithms',
        'Batch processing capabilities',
        'Multiple output format options'
      ],
      stats: {
        formats: t('tools.converter.stats.formats') || '10+ formats',
        quality: t('tools.converter.stats.quality') || 'Lossless',
        speed: t('tools.converter.stats.speed') || 'Instant'
      },
      useCases: [
        'Web development',
        'Photo editing',
        'Document conversion',
        'Cross-platform compatibility'
      ]
    }
  ];

  // 核心特性
  const coreFeatures = [
    {
      icon: '🔒',
      title: t('features.secure.title') || 'Privacy First',
      description: t('features.secure.description') || 'All processing happens locally in your browser - your files never leave your device',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      details: t('features.secure.description') || 'Client-side processing ensures complete privacy and security'
    },
    {
      icon: '⚡',
      title: t('features.fast.title') || 'Lightning Fast',
      description: t('features.fast.description') || 'Optimized algorithms powered by WebAssembly for the fastest processing speeds',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      details: t('features.fast.description') || 'Process images up to 10x faster than traditional tools'
    },
    {
      icon: '💰',
      title: t('features.free.title') || '100% Free',
      description: t('features.free.description') || 'No hidden costs, no subscriptions, no limits - completely free forever',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      details: t('features.free.description') || 'Open source and ad-free experience'
    },
    {
      icon: '🎯',
      title: t('features.quality.title') || 'Professional Quality',
      description: t('features.quality.description') || 'Advanced algorithms ensure optimal results for both casual users and professionals',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      details: t('features.quality.description') || 'Used by developers, designers, and businesses worldwide'
    },
    {
      icon: '🌍',
      title: t('features.global.title') || 'Global Accessibility',
      description: t('features.global.description') || 'Available in 11 languages with responsive design for all devices',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      details: t('features.global.description') || 'Supporting users in 150+ countries'
    },
    {
      icon: '📱',
      title: t('features.mobile.title') || 'Mobile Optimized',
      description: t('features.mobile.description') || 'Perfect experience across all devices with touch-friendly interface',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      details: t('features.mobile.description') || 'Responsive design optimized for mobile, tablet, and desktop'
    }
  ];

  // 使用场景
  const useCasesData = t('useCases.categories') || [];
  const useCases = useCasesData.length > 0 ? useCasesData.slice(0, 4).map((cat: any, idx: number) => ({
    category: cat.title,
    icon: cat.icon,
    description: cat.description,
    benefits: [],
    color: ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600', 'from-orange-500 to-orange-600'][idx]
  })) : [
    {
      category: 'Web Development',
      icon: '💻',
      description: 'Optimize images for faster website loading',
      benefits: [],
      color: 'from-blue-500 to-blue-600'
    }
  ];

  // 工作原理
  const howItWorksData = t('howItWorks.steps') || [];
  const howItWorks = howItWorksData.length > 0 ? howItWorksData.map((step: any, idx: number) => ({
    step: `0${idx + 1}`,
    title: step.title,
    description: step.description,
    icon: ['📤', '⚙️', '💾'][idx],
    details: step.details
  })) : [
    {
      step: '01',
      title: 'Upload Images',
      description: 'Drag & drop or click to upload your images.',
      icon: '📤',
      details: 'Supports all major formats'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Minimal Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 mb-6"
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
              {t('hero.subtitle') || 'Free Online Image Tools'}
            </motion.div>

            {/* Clean Title */}
            <motion.h1
              variants={heroVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              {t('hero.title') || 'TinyCompressor'}
            </motion.h1>

            {/* Clean Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              {t('hero.description') || 'Professional image compression and conversion tools. Reduce file sizes by up to 90% while maintaining quality. Fast, secure, and completely free.'}
            </motion.p>

            {/* Simplified CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8"
            >
              <a
                href={getNavigationPagePath('compressor', locale)}
                className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <span className="mr-2">🗜️</span>
                {t('hero.getStarted') || 'Start Compressing'}
              </a>
              
              <a
                href={getNavigationPagePath('converter', locale)}
                className="inline-flex items-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                {t('hero.learnMore') || 'Try Converter'}
              </a>
            </motion.div>

            {/* Compact Stats */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-6 px-6 py-3 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              {techStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('tools.title') || 'Choose Your Tool'}
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {t('tools.subtitle') || 'Professional-grade tools for all your image processing needs'}
              </p>
            </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <a href={tool.link}>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                    {/* Top Accent Bar */}
                    <div className={`h-0.5 bg-gradient-to-r ${tool.gradient}`} />
                    
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Icon and Title */}
                        <div className="flex items-center mb-3">
                          <span className="text-4xl mr-3">{tool.icon}</span>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tool.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-base text-gray-600 mb-4">
                          {tool.description}
                        </p>

                        {/* Features Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tool.features.map((feature, featureIndex) => (
                            <span 
                              key={featureIndex} 
                              className="inline-block px-2 py-1 bg-gray-50 text-xs text-gray-600 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 pt-3 mt-auto border-t border-gray-100">
                          {Object.entries(tool.stats).map(([key, value]) => {
                            const statLabels: Record<string, string> = {
                              'compression': t('tools.statsLabels.compression') || '圧縮率',
                              'formats': t('tools.statsLabels.formats') || 'フォーマット',
                              'processing': t('tools.statsLabels.processing') || '処理速度',
                              'quality': t('tools.statsLabels.quality') || '品質',
                              'speed': t('tools.statsLabels.speed') || '速度'
                            };
                            return (
                              <div key={key} className="text-center">
                                <div className="text-base font-bold text-gray-900">{value}</div>
                                <div className="text-xs text-gray-500">{statLabels[key] || key}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('features.title') || 'Why Choose TinyCompressor?'}
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {t('features.subtitle') || 'Advanced image processing technology with user-friendly features'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 h-full">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{feature.icon}</span>
                      <h3 className="text-base font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('howItWorks.title') || 'How It Works'}
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {t('howItWorks.subtitle') || 'Simple, fast, and secure image processing in three easy steps'}
              </p>
            </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="text-sm font-bold text-blue-600 mb-2">{step.step}</div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('useCases.title') || 'Perfect for Every Use Case'}
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {t('useCases.subtitle') || 'From web development to social media, optimize images for any purpose'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 h-full">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{useCase.icon}</span>
                      <h3 className="text-base font-semibold text-gray-900">
                        {useCase.category}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {useCase.description}
                    </p>
                    <div className="space-y-1.5">
                      {useCase.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center text-xs text-gray-500">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* CTA Section - Gradient Background */}
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
              {t('cta.title') || 'Ready to Optimize Your Images?'}
            </h2>
            <p className="text-base text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('cta.description') || 'Join millions of users who trust TinyCompressor for their image processing needs. Start optimizing your images today!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getNavigationPagePath('compressor', locale)}
                className="inline-flex items-center px-6 py-2.5 bg-white text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
              >
                <span className="mr-2">🗜️</span>
                {t('cta.getStarted') || 'Start Compressing'}
              </a>
              <a
                href={getNavigationPagePath('converter', locale)}
                className="inline-flex items-center px-6 py-2.5 border-2 border-white text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                {t('cta.learnMore') || 'Try Converter'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}