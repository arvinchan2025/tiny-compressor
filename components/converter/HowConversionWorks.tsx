/**
 * 转换流程说明组件
 * 解释转换过程和技术原
 */

'use client';

import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';

interface HowConversionWorksProps {
  locale: SupportedLanguage;
  sourceFormat: string;
  targetFormat: string;
  customSteps: Array<{
    step: string;
    title: string;
    description: string;
    icon: string;
  }> | undefined;
  translations: any;
}

export default function HowConversionWorks({
  locale,
  sourceFormat,
  targetFormat,
  customSteps,
  translations
}: HowConversionWorksProps) {
  const isRTL = locale === 'ar';
  
  // 默认步骤 - 简化描
  const defaultSteps = [
    {
      step: '1',
      title: translations.converter.howItWorks.steps.upload.title || `Upload ${sourceFormat.toUpperCase()} Images`,
      description: translations.converter.howItWorks.steps.upload.description || `Select ${sourceFormat.toUpperCase()} images from your device`,
      icon: ''
    },
    {
      step: '2',
      title: translations.converter.howItWorks.steps.settings.title || 'Choose Quality',
      description: translations.converter.howItWorks.steps.settings.description || 'Select conversion quality and settings',
      icon: ''
    },
    {
      step: '3',
      title: translations.converter.howItWorks.steps.convert.title || `Convert to ${targetFormat.toUpperCase()}`,
      description: translations.converter.howItWorks.steps.convert.description || `Click convert to change format to ${targetFormat.toUpperCase()}`,
      icon: ''
    },
    {
      step: '4',
      title: translations.converter.howItWorks.steps.download.title || 'Download Results',
      description: translations.converter.howItWorks.steps.download.description || 'Download your converted images',
      icon: ''
    }
  ];

  const steps = customSteps || defaultSteps;

  return (
    <section className="py-16 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="heading-3 text-slate-800 mb-4">
            {translations.converter.howItWorks.title || 'How Image Conversion Works'}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {translations.converter.howItWorks.subtitle || `Our converter uses advanced algorithms to transform ${sourceFormat.toUpperCase()} images to ${targetFormat.toUpperCase()} format while maintaining quality`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              {/* 步骤图标 */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                {/* 步骤编号 */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{step.step}</span>
                </div>
              </div>

              {/* 步骤内容 */}
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 技术细*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">
            {translations.converter.howItWorks.technicalDetails.title || 'Technical Details'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 转换算法 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">
                {translations.converter.howItWorks.technicalDetails.algorithm.title || 'Conversion Algorithm'}
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.algorithm.step1 || 'Advanced format detection and validation'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.algorithm.step2 || 'Intelligent color space conversion and optimization'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.algorithm.step3 || 'Quality preservation with compression optimization'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.algorithm.step4 || 'Metadata handling and format-specific optimizations'}
                  </span>
                </li>
              </ul>
            </div>

            {/* 质量保证 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">
                {translations.converter.howItWorks.technicalDetails.quality.title || 'Quality Assurance'}
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.quality.step1 || 'Lossless metadata preservation when requested'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.quality.step2 || 'Color accuracy maintenance across format conversion'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.quality.step3 || 'Automatic quality optimization for target format'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">
                    {translations.converter.howItWorks.technicalDetails.quality.step4 || 'Real-time conversion preview and validation'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 性能优化 */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  {translations.converter.howItWorks.technicalDetails.performance.title || 'Performance Optimization'}
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {translations.converter.howItWorks.technicalDetails.performance.description || 'Our conversion engine uses optimized algorithms and parallel processing to ensure fast, efficient conversion of your images while maintaining the highest quality standards.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
