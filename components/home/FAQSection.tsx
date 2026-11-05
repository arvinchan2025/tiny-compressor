/**
 * FAQSection - 常见问题解答区域组件
 * 
 * 性能优化版本：
 * - 延迟渲染，等待翻译加载完成
 * - 简化动画，减少渲染复杂度
 * - 按需加载，提升首屏性能
 */

// 'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StandardContainer from '@/components/ui/StandardContainer';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  t: (key: string, options?: any) => string;
}

export default function FAQSection({ faqs, translator }: any) {
  const {t} = translator
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <StandardContainer variant="content" size="lg" center>
        <div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6 }}
          // viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('faq.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq: any, index: number) => (
            <div
              key={index}
              // initial={{ opacity: 0, y: 30 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: index * 0.1 }}
              // viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



