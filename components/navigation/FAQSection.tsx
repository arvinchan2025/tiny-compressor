// 'use client';

import React from 'react';
import StandardContainer from '@/components/ui/StandardContainer';

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: any;
  translator: any;
}

export default function FAQSection({title, subtitle, faqs, translator}: FAQSectionProps) {

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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqs.map((faq: any, index: number) => (
            <div
              key={index}
              // initial={{ opacity: 0, y: 20 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: index * 0.1 }}
              // viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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



