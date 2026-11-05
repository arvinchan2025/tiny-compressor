/**
 * HeroSection - 压缩器导航页Hero区域组件
 *
 * 性能优化版本：
 * - 立即渲染关键内容，不等待翻译加载
 * - 简化动画，减少渲染复杂度
 * - 按需加载，提升首屏性能
 */

// 'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {useTranslation} from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';
import {createTranslator} from "@/lib/i18n/ssr-optimization";

interface CompressorHeroSectionProps {
  title: string;
  subtitle: string;
  heroStats: any;
}

function HeroStats({heroStats}: any) {
  return heroStats.map((stat: any, index: number) => (
    <div key={index} className="group">
      <div
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
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
    </div>))
}

export default function HeroSection({title, subtitle, heroStats}: CompressorHeroSectionProps) {
  // const { t } = useTranslation('common/navigation' as any, locale as any);
  const heroVariants = {
    hidden: {opacity: 0, scale: 0.95},
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"/>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"/>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"/>

      <StandardContainer variant="content" size="xl" center className="relative z-10">
        <div className="text-center pt-20 pb-16">
          {/* Main Headline */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <HeroStats heroStats={heroStats}/>
          </div>
        </div>
      </StandardContainer>
    </section>
  );
}
