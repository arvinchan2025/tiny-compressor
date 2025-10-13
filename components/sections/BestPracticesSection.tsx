'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BestPracticesSectionProps {
  bestPractices: any;
}

export default function BestPracticesSection({
  bestPractices,
}: BestPracticesSectionProps) {
  if (!bestPractices) {
    return null;
  }

  const practiceItems = [
    {
      key: 'imagePreparation',
      gradient: 'from-cyan-50 to-cyan-100',
      border: 'border-cyan-200',
      titleColor: 'text-cyan-900',
      contentColor: 'text-cyan-700',
      dotColor: 'text-cyan-600',
      bgColor: 'bg-cyan-500'
    },
    {
      key: 'compressionSettings',
      gradient: 'from-emerald-50 to-emerald-100',
      border: 'border-emerald-200',
      titleColor: 'text-emerald-900',
      contentColor: 'text-emerald-700',
      dotColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500'
    },
    {
      key: 'workflowOptimization',
      gradient: 'from-violet-50 to-violet-100',
      border: 'border-violet-200',
      titleColor: 'text-violet-900',
      contentColor: 'text-violet-700',
      dotColor: 'text-violet-600',
      bgColor: 'bg-violet-500'
    },
    {
      key: 'qualityAssurance',
      gradient: 'from-rose-50 to-rose-100',
      border: 'border-rose-200',
      titleColor: 'text-rose-900',
      contentColor: 'text-rose-700',
      dotColor: 'text-rose-600',
      bgColor: 'bg-rose-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {bestPractices.title || 'Best Practices & Tips'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {bestPractices.subtitle || 'Professional guidelines for optimal PNG compression'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestPractices.tips && bestPractices.tips.map((tip, index) => {
              const style = practiceItems[index % practiceItems.length];

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${style.gradient} p-6 rounded-xl border ${style.border}`}
                >
                  <h3 className={`text-lg font-semibold ${style.titleColor} mb-3`}>
                    Tip {index + 1}
                  </h3>
                  <p className={`${style.contentColor} text-sm mb-4`}>
                    {tip}
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
