/**
 * ModernConverterNavigation - 优化版转换器导航页面
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
import ConverterHeroSection from './ConverterHeroSection';
import ConverterToolsSection from './ConverterToolsSection';
import ConversionTechnologiesSection from './ConversionTechnologiesSection';
import HowItWorksSection from './HowItWorksSection';
import BestPracticesSection from './BestPracticesSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

interface ModernConverterNavigationProps {
  locale: Locale;
}

export default function ModernConverterNavigation({ locale }: ModernConverterNavigationProps) {
  const { isLoading: translationLoading } = useTranslation('common/navigation' as any, locale as any);

  return (
    <StandardPageLayout locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/10">
        {/* Hero Section - 立即渲染，LCP优化 */}
        <ConverterHeroSection 
          locale={locale} 
          translationLoading={translationLoading}
        />

        {/* Tools Section - 延迟渲染，等待翻译加载完成 */}
        {!translationLoading && (
          <ConverterToolsSection locale={locale} />
        )}

        {/* Conversion Technologies Section - 延迟渲染 */}
        {!translationLoading && (
          <ConversionTechnologiesSection locale={locale} />
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
