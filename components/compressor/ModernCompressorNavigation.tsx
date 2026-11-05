/**
 * ModernCompressorNavigation - 优化版压缩器导航页面
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
import HeroSection from "@/components/navigation/HeroSection";
import ToolsSection from "@/components/navigation/ToolsSection";
import TechniquesSection from "@/components/navigation/TechniquesSection";
import HowItWorksSection from "@/components/navigation/HowItWorksSection";
import BestPracticesSection from "@/components/navigation/BestPracticesSection";
import FAQSection from "@/components/navigation/FAQSection";
import CTASection from "@/components/navigation/CTASection";
import {getFunctionalPagePath} from "@/lib/i18n/path-utils";

function getCompressorTools(translator: any, locale: Locale) {
  const {t, getTranslation} = translator
  return [
    {
      id: 'png',
      title: t('compressor.tools.png.name'),
      subtitle: t('compressorNavigation.tools.png.subtitle'),
      description: t('compressorNavigation.tools.png.description'),
      icon: '🖼️',
      gradient: 'from-blue-500 to-cyan-500',
      href: getFunctionalPagePath('compressor', 'compress-png', locale as any),
      features: getTranslation('compressorNavigation.tools.png.features'),
      stats: t('compressorNavigation.tools.png.stats'),
      buttonText: t('compressorNavigation.tools.png.buttonText'),
      popular: true
    },
    {
      id: 'jpeg',
      title: t('compressor.tools.jpeg.name'),
      subtitle: t('compressorNavigation.tools.jpeg.subtitle'),
      description: t('compressorNavigation.tools.jpeg.description'),
      icon: '📷',
      gradient: 'from-green-500 to-emerald-500',
      href: getFunctionalPagePath('compressor', 'compress-jpeg', locale as any),
      features: getTranslation('compressorNavigation.tools.jpeg.features'),
      stats: t('compressorNavigation.tools.jpeg.stats'),
      buttonText: t('compressorNavigation.tools.jpeg.buttonText'),
      popular: false
    },
    {
      id: 'webp',
      title: t('compressor.tools.webp.name'),
      subtitle: t('compressorNavigation.tools.webp.subtitle'),
      description: t('compressorNavigation.tools.webp.description'),
      icon: '🌐',
      gradient: 'from-purple-500 to-pink-500',
      href: getFunctionalPagePath('compressor', 'compress-webp', locale as any),
      features: getTranslation('compressorNavigation.tools.webp.features'),
      stats: t('compressorNavigation.tools.webp.stats'),
      buttonText: t('compressorNavigation.tools.webp.buttonText'),
      popular: false
    },
    {
      id: 'avif',
      title: t('compressor.tools.avif.name'),
      subtitle: t('compressorNavigation.tools.avif.subtitle'),
      description: t('compressorNavigation.tools.avif.description'),
      icon: '🚀',
      gradient: 'from-orange-500 to-red-500',
      href: getFunctionalPagePath('compressor', 'compress-avif', locale as any),
      features: getTranslation('compressorNavigation.tools.avif.features', ['AVIF compression', 'Next-gen format', 'Ultra efficient']),
      stats: t('compressorNavigation.tools.avif.stats'),
      buttonText: t('compressorNavigation.tools.avif.buttonText'),
      popular: false
    },
    {
      id: 'gif',
      title: t('compressor.tools.gif.name'),
      subtitle: t('compressorNavigation.tools.gif.subtitle'),
      description: t('compressorNavigation.tools.gif.description'),
      icon: '🎬',
      gradient: 'from-teal-500 to-cyan-500',
      href: getFunctionalPagePath('compressor', 'compress-gif', locale as any),
      features: getTranslation('compressorNavigation.tools.gif.features'),
      stats: t('compressorNavigation.tools.gif.stats'),
      buttonText: t('compressorNavigation.tools.gif.buttonText'),
      popular: false
    },
    {
      id: 'bmp',
      title: t('compressor.tools.bmp.name'),
      subtitle: t('compressorNavigation.tools.bmp.subtitle'),
      description: t('compressorNavigation.tools.bmp.description'),
      icon: '🖼️',
      gradient: 'from-indigo-500 to-purple-500',
      href: getFunctionalPagePath('compressor', 'compress-bmp', locale as any),
      features: getTranslation('compressorNavigation.tools.bmp.features'),
      stats: t('compressorNavigation.tools.bmp.stats'),
      buttonText: t('compressorNavigation.tools.bmp.buttonText'),
      popular: false
    },
    {
      id: 'pdf',
      title: t('compressor.tools.pdf.name'),
      subtitle: t('compressorNavigation.tools.pdf.subtitle'),
      description: t('compressorNavigation.tools.pdf.description'),
      icon: '📄',
      gradient: 'from-red-500 to-pink-500',
      href: getFunctionalPagePath('compressor', 'compress-pdf', locale as any),
      features: getTranslation('compressorNavigation.tools.pdf.features'),
      stats: t('compressorNavigation.tools.pdf.stats'),
      buttonText: t('compressorNavigation.tools.pdf.buttonText'),
      popular: false
    },
    {
      id: 'video',
      title: t('compressor.tools.video.name'),
      subtitle: t('compressorNavigation.tools.video.subtitle'),
      description: t('compressorNavigation.tools.video.description'),
      icon: '🎥',
      gradient: 'from-yellow-500 to-orange-500',
      href: getFunctionalPagePath('compressor', 'compress-video', locale as any),
      features: getTranslation('compressorNavigation.tools.video.features'),
      stats: t('compressorNavigation.tools.video.stats'),
      buttonText: t('compressorNavigation.tools.video.buttonText'),
      popular: false
    }
  ];
}

interface ModernCompressorNavigationProps {
  locale: Locale;
}

export default async function ModernCompressorNavigation({locale}: ModernCompressorNavigationProps) {
  // const { isLoading: translationLoading } = useTranslation('common/navigation' as any, locale as any);
  const translations = await loadServerTranslations('common/navigation', locale);
  const translator = createTranslator(translations);
  const {t, getTranslation} = translator
  const tools = getCompressorTools(translator, locale)
  return (
    <StandardPageLayout locale={locale}>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/10">
        <HeroSection
          title={t('compressor.title')}
          subtitle={t('compressorNavigation.sections.hero.subtitle')}
          heroStats={getTranslation('compressorNavigation.heroStats')}
        />

        {/* Tools Section - 延迟渲染，等待翻译加载完成 */}
        <ToolsSection
          title={t('compressorNavigation.toolsSection.title')}
          subtitle={t('compressorNavigation.toolsSection.title')}
          tools={tools}
          translator={translator}
        />

        {/* Technologies Section - 延迟渲染 */}
        <TechniquesSection
          title={t('compressorNavigation.sections.compressionTechniques.title')}
          subtitle={t('compressorNavigation.sections.compressionTechniques.subtitle')}
          techniques={getTranslation('compressorNavigation.compressionTechniques')}
          translator={translator}
        />

        {/* How It Works Section - 延迟渲染 */}
        <HowItWorksSection
          title={t('compressorNavigation.sections.howItWorks.title')}
          subtitle={t('compressorNavigation.sections.howItWorks.subtitle')}
          steps={getTranslation('compressorNavigation.howItWorks')}
          translator={translator}
        />

        {/* Best Practices Section - 延迟渲染 */}
        <BestPracticesSection
          title={t('compressorNavigation.sections.bestPractices.title')}
          subtitle={t('compressorNavigation.sections.bestPractices.subtitle')}
          bestPractices={getTranslation('compressorNavigation.bestPractices')}
          translator={translator}
        />

        {/* FAQ Section - 延迟渲染 */}
        <FAQSection
          title={t('compressorNavigation.sections.faq.title')}
          subtitle={t('compressorNavigation.sections.faq.subtitle')}
          faqs={getTranslation('compressorNavigation.faq')}
          translator={translator}
        />

        {/* CTA Section - 延迟渲染 */}
        <CTASection
          title={t('compressorNavigation.sections.cta.title')}
          description={t('compressorNavigation.sections.cta.description')}
          navigationPath={getLocalizedPath('/compressor/compress-png', locale)}
          homePath={getLocalizedPath('/', locale)}
          translator={translator}
        />
      </div>
    </StandardPageLayout>
  );
}
