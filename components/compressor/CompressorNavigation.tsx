/**
 * 压缩器导航组件
 * 提供格式选择和压缩路径导航
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import { useRouter } from 'next/navigation';

interface CompressorNavigationProps {
  locale: SupportedLanguage;
}

const SUPPORTED_FORMATS = [
  { id: 'jpeg', name: 'JPEG', icon: '📷', description: 'Photos & Images' },
  { id: 'png', name: 'PNG', icon: '🎨', description: 'Graphics & Transparency' },
  { id: 'webp', name: 'WebP', icon: '🌐', description: 'Modern Web Format' },
  { id: 'avif', name: 'AVIF', icon: '🚀', description: 'Next-Gen Format' },
  { id: 'gif', name: 'GIF', icon: '🎬', description: 'Animations & Graphics' },
];

const QUICK_COMPRESSION_TYPES = [
  { 
    format: 'jpeg', 
    label: 'JPEG Compressor', 
    description: 'Perfect for photos with quality control',
    icon: '📸',
    reduction: '60-90%',
    route: 'compress-jpg'
  },
  { 
    format: 'png', 
    label: 'PNG Compressor', 
    description: 'Lossless compression with transparency',
    icon: '🖼️',
    reduction: '20-50%',
    route: 'compress-png'
  },
  { 
    format: 'webp', 
    label: 'WebP Compressor', 
    description: 'Modern format with superior compression',
    icon: '🚀',
    reduction: '70-95%',
    route: 'compress-webp'
  },
  { 
    format: 'avif', 
    label: 'AVIF Compressor', 
    description: 'Next-gen format with excellent compression',
    icon: '⚡',
    reduction: '80-95%',
    route: 'compress-avif'
  },
  { 
    format: 'gif', 
    label: 'GIF Compressor', 
    description: 'Animation compression and optimization',
    icon: '🎬',
    reduction: '30-70%',
    route: 'compress-gif'
  }
];

export default function CompressorNavigation({ locale }: CompressorNavigationProps) {
  const router = useRouter();

  const handleFormatSelect = (formatId: string) => {
    const compression = QUICK_COMPRESSION_TYPES.find(comp => comp.format === formatId);
    if (compression) {
      router.push(`/${locale}/compressor/${compression.route}`);
    } else {
      // Fallback to old route format for custom compressions
      router.push(`/${locale}/compressor/${formatId}`);
    }
  };

  return (
    <div className="relative pt-8 pb-20 md:pt-12 md:pb-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* 主标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="heading-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Image Compressor
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
            Compress images with high quality and advanced optimization algorithms
          </p>
        </motion.div>

        {/* 核心功能区域 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* 智能压缩区域 */}
          <div className="card-elevated mb-12">
            <div className="text-center mb-8">
              <h2 className="heading-3 text-slate-800 mb-4">Smart Image Compression</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6">
                Reduce file sizes by up to 90% while maintaining excellent visual quality
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                <div className="bg-blue-50/50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Advanced Algorithms
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Smart compression algorithms that analyze your images to achieve the best compression ratio
                  </p>
                </div>
                <div className="bg-green-50/50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quality Control
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Fine-tune compression settings to balance file size and visual quality
                  </p>
                </div>
                <div className="bg-purple-50/50 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Batch Processing
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Process up to 20 images simultaneously with ZIP download
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Compression Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="py-16 container mx-auto px-4"
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Quick Compression
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {QUICK_COMPRESSION_TYPES.map((type, index) => (
            <motion.button
              key={type.format}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              onClick={() => handleFormatSelect(type.format)}
              className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-neutral-200/50 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {type.label}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Size reduction:</span>
                    <span className="text-sm font-medium text-green-600">{type.reduction}</span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Custom Compression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="py-16 container mx-auto px-4"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Custom Compression
        </h2>
        
        {/* Format Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SUPPORTED_FORMATS.map((format, index) => (
            <motion.button
              key={format.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              onClick={() => handleFormatSelect(format.id)}
              className="group block relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 text-center p-6"
            >
              {/* Icon */}
              <div className="relative mb-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {format.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {format.name} Compressor
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                  {format.description}
                </p>
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-gray-500"
        >
          <p>1. Select the image format you want to compress</p>
          <p>2. Click on the format to start compression</p>
          <p>3. Upload your images and adjust settings as needed</p>
        </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="py-16 container mx-auto px-4"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why Choose Our Compressor?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional-grade compression technology that delivers the best results for your images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: '📊',
              title: 'Smart Compression Algorithms',
              description: 'Advanced algorithms that analyze your images to achieve the best compression ratio while maintaining visual quality',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '⚡',
              title: 'Lightning Fast Processing',
              description: 'Process up to 20 images simultaneously in seconds with our optimized compression engine',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              icon: '🔒',
              title: '100% Privacy & Security',
              description: 'All processing happens locally in your browser. Your images are never uploaded to our servers',
              color: 'from-green-500 to-emerald-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 + index * 0.2 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

