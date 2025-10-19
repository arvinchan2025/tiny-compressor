/**
 * ModernHomePage - 重构后的主页组件
 * 
 * 组件化架构优势：
 * - 代码模块化，易于维护
 * - 性能优化，LCP优化
 * - 翻译加载优化，渐进式渲染
 * - 避免重复编辑问题
 */

'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import HomePageSEO from '@/components/seo/HomePageSEO';
import HeroSection from './HeroSection';
import ToolsSection from './ToolsSection';
import BenefitsSection from './BenefitsSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

interface ModernHomePageProps {
  locale: string;
}

export default function ModernHomePage({ locale }: ModernHomePageProps) {
  const { t, isLoading: translationLoading } = useTranslation('home', locale as any);

  // Helper function to generate correct URLs based on locale
  const getLocalizedUrl = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  // Tool categories with modern design - based on actual project capabilities
  const tools = [
    {
      id: 'images',
      title: t('toolCategories.images.title'),
      subtitle: t('toolCategories.images.subtitle'),
      description: t('toolCategories.images.description'),
      icon: t('toolCategories.images.icon'),
      gradient: 'from-blue-500 to-cyan-500',
      href: getLocalizedUrl('/compressor'),
      features: t('toolCategories.images.features', { returnObjects: true }) as string[],
      stats: t('toolCategories.images.stats'),
      popular: true
    },
    {
      id: 'conversion',
      title: t('toolCategories.conversion.title'),
      subtitle: t('toolCategories.conversion.subtitle'),
      description: t('toolCategories.conversion.description'),
      icon: t('toolCategories.conversion.icon'),
      gradient: 'from-purple-500 to-pink-500',
      href: getLocalizedUrl('/converter'),
      features: t('toolCategories.conversion.features', { returnObjects: true }) as string[],
      stats: t('toolCategories.conversion.stats'),
      popular: false
    },
    {
      id: 'pdf',
      title: t('toolCategories.pdf.title'),
      subtitle: t('toolCategories.pdf.subtitle'),
      description: t('toolCategories.pdf.description'),
      icon: t('toolCategories.pdf.icon'),
      gradient: 'from-emerald-500 to-teal-500',
      href: getLocalizedUrl('/compressor/compress-pdf'),
      features: t('toolCategories.pdf.features', { returnObjects: true }) as string[],
      stats: t('toolCategories.pdf.stats'),
      popular: false
    },
    {
      id: 'video',
      title: t('toolCategories.video.title'),
      subtitle: t('toolCategories.video.subtitle'),
      description: t('toolCategories.video.description'),
      icon: t('toolCategories.video.icon'),
      gradient: 'from-orange-500 to-red-500',
      href: getLocalizedUrl('/compressor/compress-video'),
      features: t('toolCategories.video.features', { returnObjects: true }) as string[],
      stats: t('toolCategories.video.stats'),
      popular: false
    }
  ];

  // Key benefits - based on actual project capabilities
  const benefits = t('benefits', { returnObjects: true }) as Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;

  // FAQ items
  const faqs = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <>
      <HomePageSEO locale={locale} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/10">
        
        {/* Hero Section - 关键内容优先渲染，不等待翻译 */}
        <HeroSection 
          locale={locale}
          translationLoading={translationLoading}
          t={t}
          getLocalizedUrl={getLocalizedUrl}
        />

        {/* Tools Section - 延迟渲染直到翻译加载完成 */}
        {!translationLoading && (
          <ToolsSection 
            tools={tools}
            t={t}
          />
        )}

        {/* Benefits Section - 延迟渲染直到翻译加载完成 */}
        {!translationLoading && (
          <BenefitsSection 
            benefits={benefits}
            t={t}
          />
        )}

        {/* FAQ Section - 延迟渲染直到翻译加载完成 */}
        {!translationLoading && (
          <FAQSection 
            faqs={faqs}
            t={t}
          />
        )}

        {/* CTA Section - 延迟渲染直到翻译加载完成 */}
        {!translationLoading && (
          <CTASection 
            locale={locale}
            t={t}
            getLocalizedUrl={getLocalizedUrl}
          />
        )}
      </div>
    </>
  );
}
