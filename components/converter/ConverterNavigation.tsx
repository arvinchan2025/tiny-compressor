/**
 * 转换器导航组件
 * 提供格式选择和转换路径导航
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import { useRouter } from 'next/navigation';

interface ConverterNavigationProps {
  locale: SupportedLanguage;
}

const SUPPORTED_FORMATS = [
  { 
    id: 'jpeg', 
    name: 'JPEG', 
    icon: '📷', 
    description: 'Photos & Images',
    features: ['High quality', 'Universal support', 'Web optimized'],
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'png', 
    name: 'PNG', 
    icon: '🎨', 
    description: 'Graphics & Transparency',
    features: ['Lossless quality', 'Transparency', 'High quality'],
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'webp', 
    name: 'WebP', 
    icon: '🌐', 
    description: 'Modern Web Format',
    features: ['Smaller files', 'Modern browsers', 'Transparency'],
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'avif', 
    name: 'AVIF', 
    icon: '🚀', 
    description: 'Next-Gen Format',
    features: ['Smallest size', 'Future-proof', 'High quality'],
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    id: 'gif', 
    name: 'GIF', 
    icon: '🎬', 
    description: 'Animations & Graphics',
    features: ['Animation support', 'Color optimization', 'Small size'],
    gradient: 'from-teal-500 to-blue-500'
  }
];

const COMMON_CONVERSIONS = [
  { from: 'jpeg', to: 'png', label: 'JPEG → PNG', description: 'Convert photos to graphics format', route: 'convert-jpg-to-png' },
  { from: 'png', to: 'jpeg', label: 'PNG → JPEG', description: 'Convert graphics to photo format', route: 'convert-png-to-jpg' },
  { from: 'jpeg', to: 'webp', label: 'JPEG → WebP', description: 'Modern web optimization', route: 'convert-jpg-to-webp' },
  { from: 'png', to: 'webp', label: 'PNG → WebP', description: 'Graphics with better compression', route: 'convert-png-to-webp' },
  { from: 'webp', to: 'jpeg', label: 'WebP → JPEG', description: 'Universal compatibility', route: 'convert-webp-to-jpg' },
  { from: 'webp', to: 'png', label: 'WebP → PNG', description: 'Graphics with transparency', route: 'convert-webp-to-png' },
  { from: 'jpeg', to: 'avif', label: 'JPEG → AVIF', description: 'Next-generation compression', route: 'convert-jpg-to-avif' },
  { from: 'png', to: 'avif', label: 'PNG → AVIF', description: 'Future-proof graphics', route: 'convert-png-to-avif' },
  { from: 'gif', to: 'png', label: 'GIF → PNG', description: 'Animation to graphics', route: 'convert-gif-to-png' },
  { from: 'png', to: 'gif', label: 'PNG → GIF', description: 'Graphics to animation', route: 'convert-png-to-gif' },
];

export default function ConverterNavigation({ locale }: ConverterNavigationProps) {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const handleFormatSelect = (formatId: string) => {
    if (!selectedSource) {
      setSelectedSource(formatId);
    } else if (!selectedTarget && formatId !== selectedSource) {
      setSelectedTarget(formatId);
    } else if (formatId === selectedSource) {
      setSelectedSource(null);
      setSelectedTarget(null);
    } else if (formatId === selectedTarget) {
      setSelectedTarget(null);
    } else {
      setSelectedSource(formatId);
      setSelectedTarget(null);
    }
  };

  const handleConvert = () => {
    if (selectedSource && selectedTarget) {
      const conversion = COMMON_CONVERSIONS.find(conv => conv.from === selectedSource && conv.to === selectedTarget);
      if (conversion) {
        router.push(`/${locale}/converter/${conversion.route}`);
      } else {
        // Fallback to old route format for custom conversions
        router.push(`/${locale}/converter/${selectedSource}/${selectedTarget}`);
      }
    }
  };

  const handleQuickConvert = (from: string, to: string) => {
    const conversion = COMMON_CONVERSIONS.find(conv => conv.from === from && conv.to === to);
    if (conversion) {
      router.push(`/${locale}/converter/${conversion.route}`);
    } else {
      // Fallback to old route format for custom conversions
      router.push(`/${locale}/converter/${from}/${to}`);
    }
  };

  const resetSelection = () => {
    setSelectedSource(null);
    setSelectedTarget(null);
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
            Image Format Converter
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
            Convert between different image formats with high quality and advanced optimization
          </p>
        </motion.div>

        {/* 核心功能区域 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* 智能转换区域 */}
          <div className="card-elevated mb-12">
            <div className="text-center mb-8">
              <h2 className="heading-3 text-slate-800 mb-4">Smart Image Conversion</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6">
                Convert images between different formats while maintaining quality and optimizing for your needs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                <div className="bg-blue-50/50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Format Flexibility
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Convert between JPEG, PNG, WebP, AVIF, and GIF formats with intelligent optimization
                  </p>
                </div>
                <div className="bg-green-50/50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quality Preservation
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Maintain image quality while converting between formats with advanced algorithms
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
                    Convert multiple images at once with ZIP download and format optimization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popular Conversions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="py-16 container mx-auto px-4"
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Popular Conversions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {COMMON_CONVERSIONS.map((conversion, index) => (
            <motion.button
              key={`${conversion.from}-${conversion.to}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              onClick={() => handleQuickConvert(conversion.from, conversion.to)}
              className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-neutral-200/50 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {SUPPORTED_FORMATS.find(f => f.id === conversion.from)?.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {conversion.label}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {conversion.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Quick convert:</span>
                    <span className="text-sm font-medium text-green-600">Click to start</span>
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

      {/* Custom Conversion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="py-16 container mx-auto px-4"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Custom Conversion
        </h2>
        
        {/* Format Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {SUPPORTED_FORMATS.map((format, index) => (
            <motion.button
              key={format.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              onClick={() => handleFormatSelect(format.id)}
              className={`group block relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-center p-6 ${
                selectedSource === format.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : selectedTarget === format.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl'
              }`}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${format.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className="relative mb-4">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${format.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {format.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {format.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {format.description}
                </p>
                
                {/* Features */}
                <div className="space-y-1">
                  {format.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="text-xs text-gray-500 flex items-center justify-center">
                      <div className={`w-1 h-1 bg-gradient-to-r ${format.gradient} rounded-full mr-2`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selection Display */}
        {selectedSource && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                {SUPPORTED_FORMATS.find(f => f.id === selectedSource)?.name}
              </div>
              <div className="text-2xl">→</div>
              {selectedTarget ? (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                  {SUPPORTED_FORMATS.find(f => f.id === selectedTarget)?.name}
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-semibold">
                  Select Target
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {selectedSource && selectedTarget && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleConvert}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Convert {SUPPORTED_FORMATS.find(f => f.id === selectedSource)?.name} to {SUPPORTED_FORMATS.find(f => f.id === selectedTarget)?.name}
            </motion.button>
          )}
          
          {(selectedSource || selectedTarget) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetSelection}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Reset
            </motion.button>
          )}
        </div>

        {/* Instructions */}
        {!selectedSource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-gray-500"
          >
            <p>1. Select the source format (what you want to convert from)</p>
            <p>2. Select the target format (what you want to convert to)</p>
            <p>3. Click Convert to start the conversion process</p>
          </motion.div>
        )}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="py-16 container mx-auto px-4"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why Choose Our Converter?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional-grade conversion technology that delivers the best results for your images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: '⚡',
              title: 'Fast Conversion',
              description: 'Convert images quickly with our optimized algorithms and advanced processing technology',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🔒',
              title: 'Privacy First',
              description: 'All processing happens locally in your browser. Your images are never uploaded to our servers',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: '📦',
              title: 'Batch Processing',
              description: 'Convert multiple images at once with ZIP download and advanced batch optimization',
              color: 'from-purple-500 to-pink-500'
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

