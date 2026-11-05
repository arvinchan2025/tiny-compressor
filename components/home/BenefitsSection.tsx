/**
 * BenefitsSection - 功能特性展示区域组件
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

interface Benefit {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface BenefitsSectionProps {
  benefits: Benefit[];
  t: (key: string, options?: any) => string;
}

export default function BenefitsSection({ benefits, translator }: any) {
  const {t} = translator
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800">
      <StandardContainer variant="content" size="xl" center>
        <div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6 }}
          // viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('sections.benefits.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('sections.benefits.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit: any, index: number) => (
            <div
              key={index}
              // initial={{ opacity: 0, y: 30 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: index * 0.1 }}
              // viewport={{ once: true }}
              className="group text-center"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



