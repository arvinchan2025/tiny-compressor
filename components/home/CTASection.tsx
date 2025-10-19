/**
 * CTASection - 行动号召区域组件
 * 
 * 性能优化版本：
 * - 延迟渲染，等待翻译加载完成
 * - 简化动画，减少渲染复杂度
 * - 按需加载，提升首屏性能
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StandardContainer from '@/components/ui/StandardContainer';

interface CTASectionProps {
  locale: string;
  t: (key: string, options?: any) => string;
  getLocalizedUrl: (path: string) => string;
}

export default function CTASection({ locale, t, getLocalizedUrl }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <StandardContainer variant="content" size="lg" center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            {t('cta.description')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href={getLocalizedUrl('/compressor')}
              className="group relative px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10">
                {t('cta.buttons.startCompression')}
              </span>
              <div className="absolute inset-0 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            
            <a
              href={getLocalizedUrl('/converter')}
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10">
                {t('cta.buttons.convertFormats')}
              </span>
              <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
        </motion.div>
      </StandardContainer>
    </section>
  );
}
