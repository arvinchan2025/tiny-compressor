/**
 * ModernHomePage - 重构后的主页组件
 *
 * 组件化架构优势：
 * - 代码模块化，易于维护
 * - 性能优化，LCP优化
 * - 翻译加载优化，渐进式渲染
 * - 避免重复编辑问题
 */

// 'use client';

import React from 'react';
import HomePageSEO from '@/components/seo/HomePageSEO';
import HeroSection from './HeroSection';
import ToolsSection from './ToolsSection';
import BenefitsSection from './BenefitsSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import {createTranslator} from "@/lib/i18n/ssr-optimization";

interface ModernHomePageProps {
  translations: any;
  locale: string;
}

export default function ModernHomePage({translations, locale}: ModernHomePageProps) {
  // const { t, isLoading: translationLoading } = useTranslation('home', locale as any);
  const translator = createTranslator(translations)

  // Helper function to generate correct URLs based on locale
  const getLocalizedUrl = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  // Tool categories with modern design - based on actual project capabilities
  // Key benefits - based on actual project capabilities
  const benefits = translator.getTranslation('benefits');

  // FAQ items
  const faqs = translator.getTranslation('faq.items');

  return (
    <>
      <HomePageSEO locale={locale}/>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/10">

        {/* Hero Section - 关键内容优先渲染，不等待翻译 */}
        <HeroSection
          locale={locale}
          // translationLoading={translationLoading}
          translator={translator}
          // getTranslation={getTranslation}
          // getLocalizedUrl={getLocalizedUrl}
        />

        {/* Tools Section - 延迟渲染直到翻译加载完成 */}
        <ToolsSection
          locale={locale}
          translator={translator}
        />


        {/* Benefits Section - 延迟渲染直到翻译加载完成 */}
        <BenefitsSection
          benefits={benefits}
          translator={translator}
        />

        {/* FAQ Section - 延迟渲染直到翻译加载完成 */}
        <FAQSection
          faqs={faqs}
          translator={translator}
        />

        {/* CTA Section - 延迟渲染直到翻译加载完成 */}
        <CTASection
          locale={locale}
          translator={translator}
          // getLocalizedUrl={getLocalizedUrl}
        />
      </div>
    </>
  );
}
