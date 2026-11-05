/**
 * ModernCompressorPage - 现代化压缩器页面组件
 *
 * 这是一个完整的、现代化的压缩器页面组件
 * 支持所有图像格式的压缩，具有统一的现代化设计
 * 使用增强的翻译系统，支持懒加载和多语言
 */

// 'use client';

import React from 'react';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import {
  CompressorOperationSection,
  CTASection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  TechnicalSection,
  UseCasesSection
} from "components/pages/sections";
import {createTranslator, loadServerTranslations} from "@/lib/i18n/ssr-optimization";
import {getLocalizedPath, supportedLocales} from "@/lib/i18n";

// 懒加载压缩管理器组件 - LCP优化版本

export async function getPageStaticProps({params, category, format, targetFormat, pathname}: any) {
  const {locale} = params;
  const translationModule = targetFormat ? `${format}-to-${targetFormat}` : format;
  const translations = await loadServerTranslations(`${category}/${translationModule}`, locale)
  const {t} = createTranslator(translations)
  const languages: Record<string, string> = {};

  for (const lang of supportedLocales) {
    languages[lang] = getLocalizedPath(pathname, lang);
  }
  console.log("getPageStaticProps:", params)

  return {
    title: t('seo.title'),
    description: t('seo.description'),
    keywords: t('seo.keywords'),
    openGraph: {
      title: t('seo.title'),
      description: t('seo.description'),
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seo.title'),
      description: t('seo.description'),
    },
    alternates: {
      canonical: getLocalizedPath(pathname, locale),
      languages: {
        ...languages,
        'x-default': getLocalizedPath(pathname, 'en'),
      },
    }
  };
}

export default async function ModernPageLayout({locale, category, format, targetFormat, maxFiles, operation}: any) {
  console.log("ModernPageLayout:", format, targetFormat)
  const translationModule = targetFormat ? `${format}-to-${targetFormat}` : format;
  const translations = await loadServerTranslations(`${category}/${translationModule}`, locale)
  const translator = createTranslator(translations)
  const Operation = operation ?? CompressorOperationSection
  // 关键内容优先渲染 - 不等待翻译加载
  // 翻译加载状态只影响非关键内容

  // 渲染主要内容
  return (
    <>
      <StandardPageLayout locale={locale}>
        <div className="page-base min-h-screen">
          {/* Hero Section - LCP优化版本 */}
          <HeroSection translator={translator}/>

          {/* Compression Operation Section */}
          <Operation
            locale={locale}
            format={format}
            maxFiles={maxFiles}
            sourceFormat={format}
            targetFormat={targetFormat}
          />

          {/* Features Section - 延迟渲染直到翻译加载完成 */}
          <FeaturesSection translator={translator}/>

          {/* FAQ Section - 延迟渲染直到翻译加载完成 */}
          <FAQSection translator={translator}/>

          {/* Use Cases Section - 延迟渲染直到翻译加载完成 */}
          <UseCasesSection translator={translator}/>

          {/* Technical Principles Section - 延迟渲染直到翻译加载完成 */}
          <TechnicalSection translator={translator}/>

          {/* Quick Links Section - CTA Style - 延迟渲染直到翻译加载完成 */}
          <CTASection translator={translator}/>
        </div>
      </StandardPageLayout>
    </>
  );
}