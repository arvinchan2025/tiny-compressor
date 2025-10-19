'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';
import { getFunctionalPagePath } from '@/lib/i18n/path-utils';

interface CTASectionProps {
  locale: string;
}

export default function CTASection({ locale }: CTASectionProps) {
  const { t } = useTranslation('common/navigation' as any, locale as any);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent" />
      </div>
      
      <StandardContainer variant="content" size="xl" center className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('compressorNavigation.sections.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            {t('compressorNavigation.sections.cta.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={getFunctionalPagePath('compressor', 'compress-png', locale as any)}
              className="group relative px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10">{t('compressorNavigation.sections.cta.buttons.startCompression')}</span>
              <div className="absolute inset-0 bg-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            
            <a
              href={locale === 'en' ? '/' : `/${locale}`}
              className="group relative px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10">{t('compressorNavigation.sections.cta.buttons.backToHome')}</span>
            </a>
          </div>
        </motion.div>
      </StandardContainer>
    </section>
  );
}



