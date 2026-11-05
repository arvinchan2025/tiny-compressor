/**
 * ToolsSection - 压缩器工具选择区域组件
 * 
 * 性能优化版本：
 * - 延迟渲染，等待翻译加载完成
 * - 简化动画，减少渲染复杂度
 * - 按需加载，提升首屏性能
 */

// 'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';
import Link from 'next/link';
import { getFunctionalPagePath } from '@/lib/i18n/path-utils';

interface CompressorToolsSectionProps {
  title: string;
  subtitle: string;
  tools: any;
  translator: any;
}

export default function ToolsSection({ title, subtitle, tools, translator }: CompressorToolsSectionProps) {
  const {t} = translator

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool: any, index: number) => (
            <div
              key={tool.id}
              // initial={{ opacity: 0, y: 30 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.6, delay: index * 0.1 }}
              // viewport={{ once: true }}
              className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl border border-white/30 dark:border-slate-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {tool.popular && (
                <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t('compressorNavigation.labels.popular')}
                </span>
              )}
              <header className="text-center mb-6 flex-shrink-0">
                <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${tool.gradient} rounded-full items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl">{tool.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  {tool.subtitle}
                </p>
                <p className="text-slate-700 dark:text-slate-400 text-base leading-relaxed">
                  {tool.description}
                </p>
              </header>

              <div className="flex-grow flex flex-col justify-between">
                {/* Features */}
                <div className="mb-6 text-center">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t('compressorNavigation.labels.keyFeatures')}
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tool.features.map((feature: any, featureIndex: number) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {tool.stats}
                  </p>
                </div>

                {/* CTA Button */}
                <Link href={tool.href} className="block">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    {tool.buttonText || 'Get Started'}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}
