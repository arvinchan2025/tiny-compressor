'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface UseCasesSectionProps {
  useCases: any;
}

export default function UseCasesSection({
  useCases,
}: UseCasesSectionProps) {
  if (!useCases) {
    return null;
  }

  const useCaseStyles = [
    {
      gradient: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      titleColor: 'text-blue-900',
      contentColor: 'text-blue-700',
      dotColor: 'text-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      gradient: 'from-green-50 to-green-100',
      border: 'border-green-200',
      titleColor: 'text-green-900',
      contentColor: 'text-green-700',
      dotColor: 'text-green-600',
      bgColor: 'bg-green-500'
    },
    {
      gradient: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      titleColor: 'text-purple-900',
      contentColor: 'text-purple-700',
      dotColor: 'text-purple-600',
      bgColor: 'bg-purple-500'
    },
    {
      gradient: 'from-orange-50 to-orange-100',
      border: 'border-orange-200',
      titleColor: 'text-orange-900',
      contentColor: 'text-orange-700',
      dotColor: 'text-orange-600',
      bgColor: 'bg-orange-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="py-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {useCases.title || 'Use Cases & Applications'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {useCases.subtitle || 'When and where to use PNG compression'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.cases && useCases.cases.map((useCase, index) => {
              const style = useCaseStyles[index % useCaseStyles.length];

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${style.gradient} p-6 rounded-xl border ${style.border}`}
                >
                  <h3 className={`text-lg font-semibold ${style.titleColor} mb-3`}>
                    {useCase.title}
                  </h3>
                  <p className={`${style.contentColor} text-sm mb-4`}>
                    {useCase.description}
                  </p>
                  <div className={`w-8 h-8 rounded-full ${style.bgColor} flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
