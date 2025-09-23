/**
 * 格式对比组件
 * 显示源格式和目标格式的详细对比信息
 */

'use client';

import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';

interface FormatComparisonProps {
  locale: SupportedLanguage;
  sourceFormat: string;
  targetFormat: string;
  translations: any;
}

export default function FormatComparison({
  locale,
  sourceFormat,
  targetFormat,
  translations
}: FormatComparisonProps) {
  const isRTL = locale === 'ar';
  
  // 获取格式对比的翻译
  const comparisonKey = `${sourceFormat.toLowerCase()}To${targetFormat.toLowerCase()}`;
  const comparisonTranslations = translations?.comparisons?.[comparisonKey] || {};

  const comparisonData = {
    fileSize: comparisonTranslations.fileSize || `${targetFormat.toUpperCase()} files are typically smaller than ${sourceFormat.toUpperCase()}`,
    quality: comparisonTranslations.quality || 'High-quality conversion maintains excellent visual quality',
    transparency: comparisonTranslations.transparency || 'Transparency support varies between formats',
    browserSupport: comparisonTranslations.browserSupport || 'Both formats have good browser support',
    useCase: comparisonTranslations.useCase || 'Choose based on your specific needs'
  };

  const features = [
    {
      icon: '📊',
      title: translations?.comparison?.fileSize || 'File Size',
      sourceValue: translations?.comparison?.larger || 'Larger',
      targetValue: translations?.comparison?.smaller || 'Smaller',
      description: comparisonData.fileSize,
      sourceColor: 'text-red-600',
      targetColor: 'text-green-600'
    },
    {
      icon: '🎨',
      title: translations?.comparison?.quality || 'Quality',
      sourceValue: translations?.comparison?.high || 'High',
      targetValue: translations?.comparison?.high || 'High',
      description: comparisonData.quality,
      sourceColor: 'text-blue-600',
      targetColor: 'text-blue-600'
    },
    {
      icon: '🔍',
      title: translations?.comparison?.transparency || 'Transparency',
      sourceValue: translations?.comparison?.supported || 'Supported',
      targetValue: translations?.comparison?.varies || 'Varies',
      description: comparisonData.transparency,
      sourceColor: 'text-green-600',
      targetColor: 'text-yellow-600'
    },
    {
      icon: '🌐',
      title: translations?.comparison?.browserSupport || 'Browser Support',
      sourceValue: translations?.comparison?.excellent || 'Excellent',
      targetValue: translations?.comparison?.excellent || 'Excellent',
      description: comparisonData.browserSupport,
      sourceColor: 'text-green-600',
      targetColor: 'text-green-600'
    }
  ];

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
            {translations?.comparison?.title || 'Format Comparison'}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {translations?.comparison?.subtitle || `Compare ${sourceFormat.toUpperCase()} and ${targetFormat.toUpperCase()} formats to understand the differences`}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8">
          {/* 格式标题 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {sourceFormat.toUpperCase()}
              </h3>
              <p className="text-sm text-slate-600">
                {translations?.comparison?.sourceFormat || 'Source Format'}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {translations?.comparison?.comparison || 'Comparison'}
              </h3>
              <p className="text-sm text-slate-600">
                {translations?.comparison?.features || 'Features'}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {targetFormat.toUpperCase()}
              </h3>
              <p className="text-sm text-slate-600">
                {translations?.comparison?.targetFormat || 'Target Format'}
              </p>
            </div>
          </div>

          {/* 对比项目 */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid grid-cols-3 gap-4 items-center p-4 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200"
              >
                {/* 源格式值 */}
                <div className="text-center">
                  <span className={`text-lg font-medium ${feature.sourceColor}`}>
                    {feature.sourceValue}
                  </span>
                </div>

                {/* 特性名称和描述 */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl mr-2">{feature.icon}</span>
                    <h4 className="font-semibold text-slate-800">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>

                {/* 目标格式值 */}
                <div className="text-center">
                  <span className={`text-lg font-medium ${feature.targetColor}`}>
                    {feature.targetValue}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 使用建议 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 p-6 bg-blue-50/50 rounded-xl border border-blue-200/50"
          >
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  {translations?.comparison?.recommendation || 'Recommendation'}
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {comparisonData.useCase}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
