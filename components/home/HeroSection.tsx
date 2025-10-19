/**
 * HeroSection - 主页Hero区域组件
 * 
 * LCP优化版本：
 * - 关键内容立即渲染，不等待翻译
 * - 简化背景元素，减少渲染复杂度
 * - 默认文本fallback，翻译完成后渐进更新
 */

'use client';

import React from 'react';
import StandardContainer from '@/components/ui/StandardContainer';

interface HeroSectionProps {
  locale: string;
  translationLoading: boolean;
  t: (key: string, options?: any) => string;
  getLocalizedUrl: (path: string) => string;
}

export default function HeroSection({ 
  locale, 
  translationLoading, 
  t, 
  getLocalizedUrl 
}: HeroSectionProps) {
  return (
    <section className="relative">
      {/* 简化背景元素 - 减少渲染复杂度 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950" />
      
      <StandardContainer variant="content" size="xl" center className="relative z-10">
        <div className="text-center pt-20 pb-16">
          {/* Main Headline - 关键内容优先渲染 */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              TinyCompressor
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              {translationLoading 
                ? 'Free Online Image Compression and Conversion Tools' 
                : t('hero.subtitle')
              }
            </p>
          </div>

          {/* Quick Actions - 关键内容优先渲染 */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a
              href={getLocalizedUrl('/compressor')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10">
                {translationLoading ? 'Compress Files' : t('hero.quickActions.compressFiles')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href={getLocalizedUrl('/converter')}
              className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
            >
              <span className="relative z-10">
                {translationLoading ? 'Convert Formats' : t('hero.quickActions.convertFormats')}
              </span>
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>

          {/* Stats - 关键内容优先渲染 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {translationLoading ? (
              // 默认统计信息
              [
                { number: '90%', label: 'Size Reduction', color: 'blue' },
                { number: '16+', label: 'Formats', color: 'green' },
                { number: '100%', label: 'Free', color: 'purple' },
                { number: '<1s', label: 'Processing', color: 'orange' }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className={`text-3xl font-bold mb-2 ${
                      stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              (t('heroStats', { returnObjects: true }) as Array<{
                number: string;
                label: string;
                color: string;
              }>).map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                    <div className={`text-3xl font-bold mb-2 ${
                      stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </StandardContainer>
    </section>
  );
}



