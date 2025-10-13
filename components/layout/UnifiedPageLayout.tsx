'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UnifiedPageLayoutProps } from '@/types/page-layout';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import { transitions, commonVariants } from '@/lib/micro-interactions';
import TechnicalPrinciplesSection from '../sections/TechnicalPrinciplesSection';
import UseCasesSection from '../sections/UseCasesSection';
// import PerformanceComparisonSection from '../sections/PerformanceComparisonSection';
import BestPracticesSection from '../sections/BestPracticesSection';
import NotesSection from '../sections/NotesSection';
import FAQSection from '../sections/FAQSection';
import QuickLinksSection from '../sections/QuickLinksSection';

export default function UnifiedPageLayout({
  locale,
  pageType,
  format,
  sourceFormat,
  targetFormat,
  hero,
  children,
  notes,
  faqs,
  technicalPrinciples,
  useCases,
  performanceComparison,
  bestPractices,
  quickLinks
}: UnifiedPageLayoutProps) {
  // 组件渲染逻辑
  
  return (
    <StandardPageLayout locale={locale}>
      {/* Hero Section */}
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50"
      >
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="heading-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          {hero.title}
        </h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
        <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-3">
          {hero.subtitle}
        </p>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {hero.description}
        </p>
      </div>
      </motion.div>

      {/* 主要内容区域 */}
      <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="py-8"
      >
      {children}
      </motion.div>

      {/* 可选内容区- 条件渲染 */}
      {technicalPrinciples && (
      <TechnicalPrinciplesSection
        technicalPrinciples={technicalPrinciples}
      />
      )}
      
      {useCases && (
      <UseCasesSection
        useCases={useCases}
      />
      )}
      
      {/* {performanceComparison && (
      <PerformanceComparisonSection
        performanceComparison={performanceComparison}
      />
      )} */}
      
      {bestPractices && (
      <BestPracticesSection
        bestPractices={bestPractices}
      />
      )}
      
      {notes && notes.length > 0 && (
      <NotesSection customNotes={notes} />
      )}
      
      {faqs && faqs.length > 0 && (
      <FAQSection customFAQs={faqs} />
      )}

      {quickLinks && quickLinks.length > 0 && (
      <QuickLinksSection links={quickLinks} />
      )}

    </StandardPageLayout>
  );
}
