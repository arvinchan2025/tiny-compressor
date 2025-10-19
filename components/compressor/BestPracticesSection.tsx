'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';

interface BestPracticesSectionProps {
  locale: string;
}

export default function BestPracticesSection({ locale }: BestPracticesSectionProps) {
  const { t } = useTranslation('common/navigation' as any, locale as any);

  // 安全的翻译获取函数
  const getTranslationArray = (key: string, fallback: any[] = []): any[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const bestPractices = getTranslationArray('compressorNavigation.bestPractices', [
    {
      category: 'Images',
      tips: [
        'Use PNG for graphics with transparency',
        'JPEG is ideal for photographs',
        'WebP offers best compression with quality',
        'AVIF provides maximum size reduction'
      ]
    },
    {
      category: 'Documents',
      tips: [
        'Remove unnecessary images before compression',
        'Use lossless compression for legal documents',
        'Consider password protection for sensitive files'
      ]
    },
    {
      category: 'Videos',
      tips: [
        'MP4 is most compatible across platforms',
        'H.265 offers better compression ratios',
        'Lower resolution for web use',
        'Adjust bitrate based on content type'
      ]
    }
  ]);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800">
      <StandardContainer variant="content" size="xl" center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('compressorNavigation.sections.bestPractices.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('compressorNavigation.sections.bestPractices.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestPractices.map((category: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.tips.map((tip: string, tipIndex: number) => (
                  <li key={tipIndex} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



