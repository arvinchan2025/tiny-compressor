/**
 * 功能页面布局组件
 * 专门为compressor和converter功能页设计的布局
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import { getNavigationPath, getNavigationPagePath } from '@/lib/i18n/path-utils';
import ModernPageLayout from './ModernPageLayout';

interface FunctionalPageLayoutProps {
  children: React.ReactNode;
  locale: SupportedLanguage;
  pageType: 'compressor' | 'converter';
  format: string;
}

export default function FunctionalPageLayout({ 
  children, 
  locale,
  pageType,
  format
}: FunctionalPageLayoutProps) {
  
  // 页面级动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: 'easeOut'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  // 根据页面类型设置不同的背景渐变
  const getBackgroundClass = () => {
    if (pageType === 'compressor') {
      return 'bg-gradient-to-br from-slate-50 to-blue-50';
    } else {
      return 'bg-gradient-to-br from-slate-50 to-green-50';
    }
  };

  return (
    <ModernPageLayout locale={locale}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`min-h-screen ${getBackgroundClass()}`}
      >
        {/* 面包屑导航 */}
        <motion.div
          variants={itemVariants}
          className="bg-white border-b border-slate-200 py-3"
        >
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-slate-600">
              <a href={getNavigationPath('/', locale)} className="hover:text-blue-600 transition-colors">
                Home
              </a>
              <span className="text-slate-400">/</span>
              <a 
                href={getNavigationPagePath(pageType, locale)} 
                className="hover:text-blue-600 transition-colors capitalize"
              >
                {pageType}
              </a>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 font-medium capitalize">
                {format}
              </span>
            </nav>
          </div>
        </motion.div>

        {/* 主内容区域 */}
        <motion.main variants={itemVariants}>
          {children}
        </motion.main>
      </motion.div>
    </ModernPageLayout>
  );
}


