'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import CompressionManager from './components/CompressionManager';
import ModernSEO from './components/ModernSEO';

interface ModernPngCompressorProps {
  locale: SupportedLanguage;
}

export default function ModernPngCompressor({ locale }: ModernPngCompressorProps) {
  const { t } = useTranslation('compressors/png', locale);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <StandardPageLayout locale={locale}>
      <ModernSEO 
        locale={locale}
        format="png"
      />
      
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Hero Section */}
        <motion.section 
          className="pt-24 pb-12 md:pt-28 md:pb-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            {/* Main Title with Enhanced Animation */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t('hero.title')}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur-lg -z-10"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.h1>
            
            {/* Animated Divider */}
            <motion.div 
              className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            
            {/* Description with Stagger Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-3">
                {t('hero.description')}
              </p>
              
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                {t('hero.subtitle') || 'Compress PNG images online with our advanced compression technology. Reduce file size while maintaining quality and transparency.'}
              </p>
            </motion.div>

            {/* Enhanced Features Badges */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              {(Array.isArray(t('hero.features')) ? t('hero.features') : [
                'Lossless Compression',
                'Preserve Transparency', 
                'Batch Processing',
                'No Registration Required'
              ]).map((feature: string, index: number) => (
                <motion.span 
                  key={index}
                  className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    y: -2
                  }}
                >
                  {feature}
                </motion.span>
              ))}
            </motion.div>

            {/* Floating Action Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('compression-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <span className="text-lg">🚀</span>
                <span>Start Compressing</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Compression Section */}
        <motion.section 
          id="compression-section"
          className="py-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Section Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Compress Your Images
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Upload your PNG images and get optimized files with our advanced compression technology
                </p>
              </motion.div>

              {/* Enhanced Compression Manager */}
              <motion.div
                className="relative"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-lg"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
                  <CompressionManager />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Knowledge Base Section */}
        <motion.section 
          className="py-24 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.3) 2px, transparent 0)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-full text-sm font-medium text-blue-800 mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse" />
                  <span className="font-semibold">PNG Compression Knowledge Base</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Professional Guide</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  {t('technicalPrinciples.title')}
                </h2>
                <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                  {t('technicalPrinciples.description')}
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Technical Principles */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-white text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Technical Principles</h3>
                  </div>
                  <div className="space-y-6">
                    {(Array.isArray(t('technicalPrinciples.items')) ? t('technicalPrinciples.items') : []).map((item: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-6 bg-gradient-to-r from-blue-50/50 to-transparent p-4 rounded-r-xl">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h4>
                        <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                        {item.benefits && Array.isArray(item.benefits) && (
                          <ul className="space-y-2">
                            {item.benefits.map((benefit: string, benefitIndex: number) => (
                              <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Format Specifications */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-white text-2xl">📋</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Format Specifications</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="text-sm text-blue-600 mb-1 font-medium">File Extension</div>
                        <div className="font-bold text-gray-900 text-lg">.png</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <div className="text-sm text-green-600 mb-1 font-medium">Compression Type</div>
                        <div className="font-bold text-gray-900 text-lg">Lossless</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <div className="text-sm text-purple-600 mb-1 font-medium">Max Dimensions</div>
                        <div className="font-bold text-gray-900 text-lg">Unlimited</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                        <div className="text-sm text-orange-600 mb-1 font-medium">Color Support</div>
                        <div className="font-bold text-gray-900 text-lg">Full Color</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {t('formatInfo.description')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Transparency Support</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Lossless Quality</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Web Optimized</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(Array.isArray(t('technicalPrinciples.items')) ? t('technicalPrinciples.items') : []).map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                      {item.icon && (
                        <motion.div 
                          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-white text-2xl">
                            {item.icon}
                          </span>
                        </motion.div>
                      )}
                      <h3 className="text-xl font-bold text-slate-800 mb-4">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {item.description || item.content}
                      </p>
                      {item.benefits && Array.isArray(item.benefits) && item.benefits.length > 0 && (
                        <ul className="space-y-3">
                          {item.benefits.map((benefit: string, benefitIndex: number) => (
                            <motion.li 
                              key={benefitIndex} 
                              className="flex items-center text-slate-600"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: benefitIndex * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></span>
                              {benefit}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Use Cases Section */}
        <motion.section 
          className="py-24 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm border border-purple-200 rounded-full text-sm font-medium text-purple-800 mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" />
                  <span className="font-semibold">Real-World Applications</span>
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Industry Use Cases</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  {t('useCases.title')}
                </h2>
                <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                  {t('useCases.description')}
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {(Array.isArray(t('useCases.items')) ? t('useCases.items') : []).map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 h-full">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-white text-2xl">{item.icon || ['🌐', '📱', '🎨', '🖨️', '📱', '🎮', '🛒', '📢'][index % 8]}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-4">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      {item.content && (
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Industry Impact Statistics */}
              <motion.div
                className="mt-20 bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Industry Impact</h3>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    PNG compression drives significant improvements across various industries
                  </p>
                </div>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Web Performance</div>
                    <div className="text-xs text-gray-500">Improvement</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">60%</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Bandwidth Savings</div>
                    <div className="text-xs text-gray-500">Cost reduction</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">40%</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Storage Costs</div>
                    <div className="text-xs text-gray-500">Reduction</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                    <div className="text-4xl font-bold text-orange-600 mb-2">25%</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Faster Load Times</div>
                    <div className="text-xs text-gray-500">User experience</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Best Practices Section */}
        <motion.section 
          className="py-16 bg-gradient-to-br from-emerald-50 to-cyan-50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  {t('bestPractices.title')}
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  {t('bestPractices.description')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(t('bestPractices.tips')) ? t('bestPractices.tips') : []).map((tip: any, index: number) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {tip.description || tip.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced FAQ Section */}
        <motion.section 
          className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-full text-sm font-medium text-blue-800 mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse" />
                  <span className="font-semibold">Frequently Asked Questions</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Expert Answers</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  {t('faq.title')}
                </h2>
                <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                  {t('faq.description') || 'Get answers to the most common questions about PNG compression'}
                </p>
              </motion.div>
              
              <div className="space-y-6">
                {(Array.isArray(t('faq.items')) ? t('faq.items') : []).map((faq: any, index: number) => (
                  <motion.div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                        <span className="text-white font-bold text-sm">Q</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">
                          {faq.question || faq.title}
                        </h3>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                            <span className="text-white font-bold text-sm">A</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed text-lg">
                            {faq.answer || faq.description || faq.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Support */}
              <motion.div
                className="mt-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-3xl">💬</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                    Can't find the answer you're looking for? Our support team is here to help with any questions about PNG compression.
                  </p>
                  <motion.button
                    className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Support
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Quick Links Section - CTA Style */}
        <motion.section 
          className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 relative overflow-hidden transition-colors"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background Decorative Layers */}
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-12">
                {t('quickLinks.title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Array.isArray(t('quickLinks.items')) ? t('quickLinks.items') : []).map((item: any, index: number) => (
                  <motion.a
                    key={index}
                    href={item.path}
                    className="card-cta block p-6 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-gray-900 dark:text-white text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                      {item.description}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </StandardPageLayout>
  );
}