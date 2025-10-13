'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslation';
import designSystem from '@/lib/design-system';
import Image from 'next/image';

interface ModernCompressorPageProps {
  format: string;
  locale: Locale;
}

export default function ModernCompressorPage({ format, locale }: ModernCompressorPageProps) {
  const { t } = useModuleTranslation(`compressors/${format}`, locale);

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

  // 格式信息
  const formatInfo = {
    png: {
      name: 'PNG',
      extension: 'png',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      icon: '🖼️',
      description: 'Lossless compression with transparency support'
    },
    jpeg: {
      name: 'JPEG',
      extension: 'jpg',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      icon: '📸',
      description: 'High-quality compression for photographs'
    },
    webp: {
      name: 'WebP',
      extension: 'webp',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      icon: '🌐',
      description: 'Modern format with superior compression'
    },
    avif: {
      name: 'AVIF',
      extension: 'avif',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      icon: '🚀',
      description: 'Next-generation format with advanced compression'
    },
    gif: {
      name: 'GIF',
      extension: 'gif',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      icon: '🎬',
      description: 'Animation support with lossless compression'
    },
    bmp: {
      name: 'BMP',
      extension: 'bmp',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      icon: '📁',
      description: 'Uncompressed bitmap format'
    }
  };

  const currentFormat = formatInfo[format as keyof typeof formatInfo] || formatInfo.png;

  // 特性数据
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized algorithms for the fastest compression speeds',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'All processing happens in your browser - your files never leave your device',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: '🎯',
      title: 'Precision Control',
      description: 'Advanced settings for professional-quality results',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: '📊',
      title: 'Real-time Preview',
      description: 'See compression results before downloading',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: '📦',
      title: 'Batch Processing',
      description: 'Compress multiple files at once',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: '💰',
      title: '100% Free',
      description: 'No hidden costs, no subscriptions, no limits',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    }
  ];

  // 技术原理
  const technicalPrinciples = [
    {
      title: 'Advanced Algorithms',
      description: 'State-of-the-art compression algorithms optimized for each format',
      icon: '🧠'
    },
    {
      title: 'Quality Preservation',
      description: 'Maintains visual quality while reducing file size',
      icon: '🎨'
    },
    {
      title: 'Format Optimization',
      description: 'Format-specific optimizations for best results',
      icon: '⚙️'
    },
    {
      title: 'Browser Processing',
      description: 'Client-side processing for maximum privacy and speed',
      icon: '🌐'
    }
  ];

  // 使用场景
  const useCases = [
    {
      title: 'Web Development',
      description: 'Optimize images for faster website loading',
      icon: '🌐',
      benefits: ['Faster page loads', 'Better SEO', 'Reduced bandwidth']
    },
    {
      title: 'E-commerce',
      description: 'Compress product images without losing quality',
      icon: '🛒',
      benefits: ['Better user experience', 'Reduced storage costs', 'Faster checkout']
    },
    {
      title: 'Social Media',
      description: 'Optimize images for social media platforms',
      icon: '📱',
      benefits: ['Faster uploads', 'Better engagement', 'Reduced data usage']
    },
    {
      title: 'Professional Photography',
      description: 'Archive photos with optimal compression',
      icon: '📸',
      benefits: ['Smaller archives', 'Faster backups', 'Better organization']
    }
  ];

  // 最佳实践
  const bestPractices = [
    {
      title: 'Choose the Right Format',
      description: 'Select the optimal format for your use case',
      tip: 'PNG for graphics with transparency, JPEG for photos, WebP for web use'
    },
    {
      title: 'Optimize Settings',
      description: 'Adjust quality settings based on your needs',
      tip: 'Higher quality for print, lower quality for web display'
    },
    {
      title: 'Batch Processing',
      description: 'Process multiple images at once for efficiency',
      tip: 'Use consistent settings for uniform results'
    },
    {
      title: 'Preview Results',
      description: 'Always preview before downloading',
      tip: 'Compare original and compressed versions'
    }
  ];

  // FAQ数据
  const faqs = [
    {
      question: `What is ${currentFormat.name} compression?`,
      answer: `${currentFormat.name} compression reduces file size while maintaining image quality using advanced algorithms.`
    },
    {
      question: 'How much can I compress my images?',
      answer: 'Compression ratios vary by format and content, but typically range from 30-90% size reduction.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all processing happens in your browser. Your files never leave your device.'
    },
    {
      question: 'What file sizes are supported?',
      answer: 'We support files up to 50MB. For larger files, consider splitting them into smaller batches.'
    },
    {
      question: 'Can I compress multiple files at once?',
      answer: 'Yes, our batch processing feature allows you to compress multiple files simultaneously.'
    },
    {
      question: 'Will compression affect image quality?',
      answer: 'Our algorithms are designed to minimize quality loss while maximizing compression efficiency.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${currentFormat.color} opacity-20 dark:opacity-15 rounded-full blur-3xl transition-opacity`} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Format Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/95 dark:bg-gray-850/95 backdrop-blur-md border-2 border-blue-200 dark:border-blue-700/50 rounded-full text-lg font-semibold mb-8 shadow-lg transition-all"
            >
              <span className="text-2xl">{currentFormat.icon}</span>
              <span className="text-gray-900 dark:text-white transition-colors">
                {currentFormat.name} Compressor
              </span>
              <span className={`w-2 h-2 bg-gradient-to-r ${currentFormat.color} rounded-full animate-pulse`} />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6 leading-tight"
            >
              {t('hero.title') || `${currentFormat.name} Image Compressor`}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors"
            >
              {t('hero.description') || `Professional ${currentFormat.name} compression tool. Reduce file sizes by up to 90% while maintaining quality. Fast, secure, and completely free.`}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <motion.button
                className={`group relative px-8 py-4 bg-gradient-to-r ${currentFormat.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start Compressing</span>
                <div className={`absolute inset-0 bg-gradient-to-r ${currentFormat.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.button>
              
              <motion.button
                className="group px-8 py-4 bg-white dark:bg-gray-850 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-subtle py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Why Choose Our {currentFormat.name} Compressor?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Advanced compression technology with user-friendly features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card-solid rounded-2xl p-8 transform hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} dark:bg-white/5 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Principles Section */}
      <section className="section-alternate py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Technical Excellence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Built on advanced compression algorithms and modern web technologies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="card-solid rounded-2xl p-6">
                  <div className="text-4xl mb-4">{principle.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-default py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Perfect for Every Use Case
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              From web development to professional photography
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start mb-6">
                    <div className="text-4xl mr-4">{useCase.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 transition-colors">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300 transition-colors">
                        <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-2" />
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

      {/* Best Practices Section */}
      <section className="section-alternate py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Best Practices
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Tips and tricks for optimal compression results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">
                    {practice.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                    {practice.description}
                  </p>
                  <div className="bg-blue-50/80 dark:bg-blue-500/10 backdrop-blur-sm border border-blue-200/50 dark:border-blue-500/20 rounded-lg p-4 transition-colors">
                    <p className="text-blue-900 dark:text-blue-200 text-sm font-medium transition-colors">
                      💡 {practice.tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-default py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors">
              Everything you need to know about {currentFormat.name} compression
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-r ${currentFormat.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Compress Your {currentFormat.name} Images?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start compressing your {currentFormat.name} images now. Fast, secure, and completely free!
            </p>
            <motion.button
              className="px-8 py-4 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Compressing Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
