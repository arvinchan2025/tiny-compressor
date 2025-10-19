'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';

interface ConversionTechnologiesSectionProps {
  locale: string;
}

export default function ConversionTechnologiesSection({ locale }: ConversionTechnologiesSectionProps) {
  const { t } = useTranslation('common/navigation' as any, locale as any);

  // 安全的翻译获取函数
  const getTranslationArray = (key: string, fallback: any[] = []): any[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const technologies = getTranslationArray('converterNavigation.conversionTechnologies', [
    {
      icon: '🧠',
      title: 'Smart Algorithm Selection',
      description: 'Automatically chooses the best conversion algorithm based on source and target formats for optimal results.',
      color: 'blue'
    },
    {
      icon: '🎯',
      title: 'Quality Preservation',
      description: 'Advanced algorithms that maintain visual fidelity while converting between different formats.',
      color: 'green'
    },
    {
      icon: '⚡',
      title: 'WebAssembly Optimization',
      description: 'Leverages WebAssembly technology for near-native performance and faster conversion processing.',
      color: 'purple'
    },
    {
      icon: '🔍',
      title: 'Metadata Handling',
      description: 'Intelligent metadata preservation and optimization for EXIF, ICC profiles, and other embedded data.',
      color: 'orange'
    },
    {
      icon: '🛡️',
      title: 'Transparency Support',
      description: 'Full transparency channel support for PNG, GIF, and WebP formats with intelligent background handling.',
      color: 'pink'
    },
    {
      icon: '📐',
      title: 'Quality Optimization',
      description: 'Smart quality algorithms that adapt to content characteristics for optimal size-to-quality ratios.',
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
            {t('converterNavigation.sections.conversionTechnologies.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('converterNavigation.sections.conversionTechnologies.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((technology: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${
                technology.color === 'blue' ? 'from-blue-500 to-blue-600' :
                technology.color === 'green' ? 'from-green-500 to-green-600' :
                technology.color === 'purple' ? 'from-purple-500 to-purple-600' :
                technology.color === 'orange' ? 'from-orange-500 to-orange-600' :
                technology.color === 'pink' ? 'from-pink-500 to-pink-600' :
                'from-indigo-500 to-indigo-600'
              } rounded-xl items-center justify-center text-2xl mb-6`}>
                {technology.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {technology.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {technology.description}
              </p>
            </motion.div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



