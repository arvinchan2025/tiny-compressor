'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';

interface CompressionTechniquesSectionProps {
  locale: string;
}

export default function CompressionTechniquesSection({ locale }: CompressionTechniquesSectionProps) {
  const { t } = useTranslation('common/navigation' as any, locale as any);

  // 安全的翻译获取函数
  const getTranslationArray = (key: string, fallback: any[] = []): any[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const techniques = getTranslationArray('compressorNavigation.compressionTechniques', [
    {
      icon: '🧠',
      title: 'Smart Algorithm Selection',
      description: 'Automatically chooses the best compression algorithm based on file type and content characteristics for optimal results.',
      color: 'blue'
    },
    {
      icon: '🎯',
      title: 'Lossless & Lossy Options',
      description: 'Choose between lossless compression for maximum quality or lossy compression for maximum size reduction.',
      color: 'green'
    },
    {
      icon: '⚡',
      title: 'WebAssembly Optimization',
      description: 'Leveraging WebAssembly technology for near-native performance and faster compression processing.',
      color: 'purple'
    },
    {
      icon: '🔍',
      title: 'Content-Aware Analysis',
      description: 'Advanced image analysis detects patterns and optimizes compression settings for specific content types.',
      color: 'orange'
    },
    {
      icon: '📊',
      title: 'Real-time Quality Metrics',
      description: 'Live quality assessment ensures you maintain the perfect balance between file size and visual quality.',
      color: 'pink'
    },
    {
      icon: '🛠️',
      title: 'Batch Processing Ready',
      description: 'Optimized for single-file processing with plans for advanced batch compression capabilities.',
      color: 'indigo'
    }
  ]);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800">
      <StandardContainer variant="content" size="xl" center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('compressorNavigation.sections.compressionTechniques.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('compressorNavigation.sections.compressionTechniques.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techniques.map((technique: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${
                technique.color === 'blue' ? 'from-blue-500 to-blue-600' :
                technique.color === 'green' ? 'from-green-500 to-green-600' :
                technique.color === 'purple' ? 'from-purple-500 to-purple-600' :
                technique.color === 'orange' ? 'from-orange-500 to-orange-600' :
                technique.color === 'pink' ? 'from-pink-500 to-pink-600' :
                'from-indigo-500 to-indigo-600'
              } rounded-xl items-center justify-center text-2xl mb-6`}>
                {technique.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {technique.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {technique.description}
              </p>
            </motion.div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



