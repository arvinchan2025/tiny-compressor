/**
 * 现代化页面布局组件
 * 统一的页面结构，包含Header、主内容区域和Footer
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ModernPageLayoutProps {
  children: React.ReactNode;
  locale: SupportedLanguage;
  showHeader: boolean;
  showFooter: boolean;
}

export default function ModernPageLayout({ 
  children, 
  locale,
  showHeader = true,
  showFooter = true
}: ModernPageLayoutProps) {
  
  // 页面级动画变体
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col bg-slate-50"
    >
      {/* Header */}
      {showHeader && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200"
        >
          <Header 
            currentLocale={locale}
            onLanguageChange={(newLocale) => {
              // 语言切换逻辑
              window.location.href = `/${newLocale}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`;
            }}
          />
        </motion.header>
      )}

      {/* Main Content */}
      <motion.main
        variants={contentVariants}
        className="flex-1"
      >
        {children}
      </motion.main>

      {/* Footer */}
      {showFooter && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-auto"
        >
          <Footer currentLocale={locale} />
        </motion.footer>
      )}
    </motion.div>
  );
}








