'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';

interface HowItWorksSectionProps {
  locale: string;
}

export default function HowItWorksSection({ locale }: HowItWorksSectionProps) {
  const { t } = useTranslation('common/navigation' as any, locale as any);

  // 安全的翻译获取函数
  const getTranslationArray = (key: string, fallback: any[] = []): any[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const steps = getTranslationArray('converterNavigation.howItWorks', [
    {
      step: '01',
      title: 'Upload Your File',
      description: 'Simply drag and drop your file or click to select. We support all major image and document formats.',
      icon: '📁'
    },
    {
      step: '02',
      title: 'Choose Target Format',
      description: 'Select your desired output format. Our smart recommendations help you choose the best format for your needs.',
      icon: '🎯'
    },
    {
      step: '03',
      title: 'Download Converted File',
      description: 'Get your converted file in seconds. Compare original and converted formats, ensuring perfect compatibility.',
      icon: '💾'
    }
  ]);

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <StandardContainer variant="content" size="xl" center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('converterNavigation.sections.howItWorks.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('converterNavigation.sections.howItWorks.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full text-white text-2xl font-bold mb-6 shadow-lg">
                {step.step}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



