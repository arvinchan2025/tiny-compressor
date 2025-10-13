'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TechnicalPrinciplesSectionProps {
  technicalPrinciples: any;
}

export default function TechnicalPrinciplesSection({
  technicalPrinciples,
}: TechnicalPrinciplesSectionProps) {
  if (!technicalPrinciples) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {technicalPrinciples.title || 'Technical Principles'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {technicalPrinciples.subtitle || 'Understanding how PNG compression works'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* DEFLATE压缩引擎 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {technicalPrinciples.deflateAlgorithm.title || 'DEFLATE Compression Engine'}
              </h3>
              <p className="text-slate-600 mb-4">
                {technicalPrinciples.deflateAlgorithm.content || 'Our PNG compressor uses the industry-standard DEFLATE algorithm...'}
              </p>
              <ul className="space-y-2">
                {[
                  technicalPrinciples.deflateAlgorithm.benefit1,
                  technicalPrinciples.deflateAlgorithm.benefit2,
                  technicalPrinciples.deflateAlgorithm.benefit3
                ].filter(Boolean).map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center text-slate-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* 自适应优化引擎 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {technicalPrinciples.adaptiveOptimization.title || 'Adaptive Optimization Engine'}
              </h3>
              <p className="text-slate-600 mb-4">
                {technicalPrinciples.adaptiveOptimization.content || 'Our intelligent system analyzes each image\'s characteristics...'}
              </p>
              <ul className="space-y-2">
                {[
                  technicalPrinciples.adaptiveOptimization.benefit1,
                  technicalPrinciples.adaptiveOptimization.benefit2,
                  technicalPrinciples.adaptiveOptimization.benefit3
                ].filter(Boolean).map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center text-slate-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
