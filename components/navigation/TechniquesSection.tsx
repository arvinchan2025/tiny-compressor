// 'use client';

import React from 'react';
import StandardContainer from '@/components/ui/StandardContainer';

interface CompressionTechniquesSectionProps {
  title: string;
  subtitle: string;
  techniques: any;
  translator: any
}

export default function TechniquesSection({ title, subtitle, techniques, translator }: CompressionTechniquesSectionProps) {

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
            {title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techniques?.map((technique: any, index: number) => (
            <div
              key={index}
              // initial={{ opacity: 0, y: 20 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: index * 0.1 }}
              // viewport={{ once: true }}
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
            </div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



