// 'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';

interface BestPracticesSectionProps {
  title: string;
  subtitle: string;
  bestPractices: any;
  translator: any;
}

export default function BestPracticesSection({ title, subtitle, bestPractices, translator }: BestPracticesSectionProps) {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800">
      <StandardContainer variant="content" size="xl" center>
        <div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6 }}
          // viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestPractices.map((category: any, index: number) => (
            <div
              key={index}
              // initial={{ opacity: 0, y: 20 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: index * 0.1 }}
              // viewport={{ once: true }}
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
            </div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



