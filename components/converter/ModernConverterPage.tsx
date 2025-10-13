'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslation';
import designSystem from '@/lib/design-system';

interface ModernConverterPageProps {
  sourceFormat: string;
  targetFormat: string;
  locale: Locale;
}

export default function ModernConverterPage({ sourceFormat, targetFormat, locale }: ModernConverterPageProps) {
  const { t } = useModuleTranslation(`converters/${sourceFormat}-to-${targetFormat}`, locale);

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
    png: { name: 'PNG', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', icon: '🖼️' },
    jpg: { name: 'JPEG', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', icon: '📸' },
    jpeg: { name: 'JPEG', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', icon: '📸' },
    webp: { name: 'WebP', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', icon: '🌐' },
    avif: { name: 'AVIF', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', icon: '🚀' },
    gif: { name: 'GIF', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', icon: '🎬' },
    bmp: { name: 'BMP', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50', icon: '📁' },
    heic: { name: 'HEIC', color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50', icon: '📱' }
  };

  const sourceFormatInfo = formatInfo[sourceFormat as keyof typeof formatInfo] || formatInfo.png;
  const targetFormatInfo = formatInfo[targetFormat as keyof typeof formatInfo] || formatInfo.jpg;

  // 特性数据
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Convert images in seconds with our optimized algorithms',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'All conversion happens in your browser - your files never leave your device',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: '🎯',
      title: 'Quality Preservation',
      description: 'Maintain image quality during format conversion',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: '📦',
      title: 'Batch Processing',
      description: 'Convert multiple files at once for efficiency',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: '🌍',
      title: 'Universal Compatibility',
      description: 'Support for all major image formats',
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

  // 转换优势
  const conversionBenefits = [
    {
      title: 'Format Compatibility',
      description: 'Convert between formats for better compatibility across platforms',
      icon: '🔗'
    },
    {
      title: 'Size Optimization',
      description: 'Reduce file sizes while maintaining visual quality',
      icon: '📉'
    },
    {
      title: 'Quality Control',
      description: 'Advanced settings for precise quality control',
      icon: '🎛️'
    },
    {
      title: 'Batch Conversion',
      description: 'Process multiple files simultaneously',
      icon: '📚'
    }
  ];

  // 使用场景
  const useCases = [
    {
      title: 'Web Development',
      description: 'Convert images to web-optimized formats',
      icon: '🌐',
      benefits: ['Better performance', 'Wider compatibility', 'SEO optimization']
    },
    {
      title: 'Mobile Apps',
      description: 'Optimize images for mobile applications',
      icon: '📱',
      benefits: ['Faster loading', 'Reduced storage', 'Better UX']
    },
    {
      title: 'Print Media',
      description: 'Convert to print-ready formats',
      icon: '🖨️',
      benefits: ['High quality', 'Print compatibility', 'Color accuracy']
    },
    {
      title: 'Social Media',
      description: 'Optimize images for social platforms',
      icon: '📸',
      benefits: ['Platform requirements', 'Better engagement', 'Faster uploads']
    }
  ];

  // 最佳实践
  const bestPractices = [
    {
      title: 'Choose the Right Format',
      description: 'Select the optimal format for your specific use case',
      tip: `${sourceFormatInfo.name} is great for graphics, ${targetFormatInfo.name} is better for photos`
    },
    {
      title: 'Maintain Quality',
      description: 'Use appropriate quality settings to preserve image details',
      tip: 'Higher quality for print, optimized quality for web use'
    },
    {
      title: 'Batch Processing',
      description: 'Convert multiple images with consistent settings',
      tip: 'Use the same settings for uniform results across all images'
    },
    {
      title: 'Preview Results',
      description: 'Always preview converted images before downloading',
      tip: 'Compare original and converted versions to ensure quality'
    }
  ];

  // FAQ数据
  const faqs = [
    {
      question: `How do I convert ${sourceFormatInfo.name} to ${targetFormatInfo.name}?`,
      answer: `Simply upload your ${sourceFormatInfo.name} files and our converter will transform them to ${targetFormatInfo.name} format with optimized settings.`
    },
    {
      question: 'Will the conversion affect image quality?',
      answer: 'Our converter uses advanced algorithms to maintain image quality during format conversion.'
    },
    {
      question: 'What file sizes are supported?',
      answer: 'We support files up to 50MB. For larger files, consider splitting them into smaller batches.'
    },
    {
      question: 'Can I convert multiple files at once?',
      answer: 'Yes, our batch conversion feature allows you to process multiple files simultaneously.'
    },
    {
      question: 'Is the conversion process secure?',
      answer: 'Yes, all conversion happens in your browser. Your files never leave your device.'
    },
    {
      question: `Why convert from ${sourceFormatInfo.name} to ${targetFormatInfo.name}?`,
      answer: `${targetFormatInfo.name} format offers ${targetFormatInfo.name === 'JPEG' ? 'better compression for photos' : targetFormatInfo.name === 'PNG' ? 'transparency support' : targetFormatInfo.name === 'WebP' ? 'superior compression' : 'modern format benefits'}.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${sourceFormatInfo.color} opacity-20 dark:opacity-15 rounded-full blur-3xl transition-opacity`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr ${targetFormatInfo.color} opacity-20 dark:opacity-15 rounded-full blur-3xl transition-opacity`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Conversion Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 dark:bg-gray-850/95 backdrop-blur-md border-2 border-purple-200 dark:border-purple-700/50 rounded-full text-lg font-semibold mb-8 shadow-lg transition-all"
            >
              <span className="text-2xl">{sourceFormatInfo.icon}</span>
              <span className="text-gray-900 dark:text-white transition-colors">{sourceFormatInfo.name}</span>
              <span className="mx-2 text-blue-500 dark:text-blue-400 font-bold">→</span>
              <span className="text-2xl">{targetFormatInfo.icon}</span>
              <span className="text-gray-900 dark:text-white transition-colors">{targetFormatInfo.name}</span>
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse ml-1" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6 leading-tight"
            >
              {t('hero.title') || `${sourceFormatInfo.name} to ${targetFormatInfo.name} Converter`}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors"
            >
              {t('hero.description') || `Convert ${sourceFormatInfo.name} images to ${targetFormatInfo.name} format with professional quality. Fast, secure, and completely free image format conversion.`}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start Converting</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              Why Choose Our {sourceFormatInfo.name} to {targetFormatInfo.name} Converter?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Professional-grade conversion with advanced features
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

      {/* Conversion Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Conversion Benefits
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Why convert from {sourceFormatInfo.name} to {targetFormatInfo.name}?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {conversionBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="card-solid rounded-2xl p-6">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">
                    {benefit.description}
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
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start mb-6">
                    <div className="text-4xl mr-4">{useCase.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 transition-colors">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
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
              Tips and tricks for optimal conversion results
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
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
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
            <p className="text-xl text-gray-600">
              Everything you need to know about {sourceFormatInfo.name} to {targetFormatInfo.name} conversion
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Convert Your Images?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Convert your {sourceFormatInfo.name} images to {targetFormatInfo.name} format now. Fast, secure, and completely free!
            </p>
            <motion.button
              className="px-8 py-4 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Converting Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
