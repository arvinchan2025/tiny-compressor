// 'use client';

import React from 'react';
import StandardContainer from '@/components/ui/StandardContainer';

interface HowItWorksSectionProps {
  title: string;
  subtitle: string;
  steps: any;
  translator: any;
}

export default function HowItWorksSection({title, subtitle, steps, translator}: HowItWorksSectionProps) {

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
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

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step: any, index: number) => (
            <div
              key={index}
              // initial={{ opacity: 0, y: 20 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: index * 0.2 }}
              // viewport={{ once: true }}
              className="text-center"
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl font-bold mb-6 shadow-lg">
                {step.step}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



