/**
 * ModernCompressorNavigation - 优化版压缩器导航页面
 * 
 * 性能优化版本：
 * - LCP优化：关键内容立即渲染，不等待翻译加载
 * - 渐进式加载：非关键内容延迟渲染
 * - 组件化架构：模块化结构，易于维护
 * - 按需加载：减少初始包大小
 */

'use client';

import React from 'react';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import CompressorHeroSection from './CompressorHeroSection';
import CompressorToolsSection from './CompressorToolsSection';
import CompressionTechniquesSection from './CompressionTechniquesSection';
import HowItWorksSection from './HowItWorksSection';
import BestPracticesSection from './BestPracticesSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

interface ModernCompressorNavigationProps {
  locale: Locale;
}

export default function ModernCompressorNavigation({ locale }: ModernCompressorNavigationProps) {
  const { isLoading: translationLoading } = useTranslation('common/navigation' as any, locale as any);

  return (
    <StandardPageLayout locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/10">
        {/* Hero Section - 立即渲染，LCP优化 */}
        <CompressorHeroSection 
          locale={locale} 
          translationLoading={translationLoading}
        />

        {/* Tools Section - 延迟渲染，等待翻译加载完成 */}
        {!translationLoading && (
          <CompressorToolsSection locale={locale} />
        )}

        {/* Compression Techniques Section - 延迟渲染 */}
        {!translationLoading && (
          <CompressionTechniquesSection locale={locale} />
        )}

        {/* How It Works Section - 延迟渲染 */}
        {!translationLoading && (
          <HowItWorksSection locale={locale} />
        )}

        {/* Best Practices Section - 延迟渲染 */}
        {!translationLoading && (
          <BestPracticesSection locale={locale} />
        )}

        {/* FAQ Section - 延迟渲染 */}
        {!translationLoading && (
          <FAQSection locale={locale} />
        )}

        {/* CTA Section - 延迟渲染 */}
        {!translationLoading && (
          <CTASection locale={locale} />
        )}
      </div>
    </StandardPageLayout>
  );
}
