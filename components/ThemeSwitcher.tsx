'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ThemeSwitcher() {
  const { theme, actualTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // 显示当前实际主题（解析system后的结果）
  const isDark = actualTheme === 'dark';
  
  // 工具提示文本
  const getTooltip = () => {
    if (theme === 'system') {
      return `${t('theme.system') || 'System'} (${isDark ? t('theme.dark') || 'Dark' : t('theme.light') || 'Light'})`;
    }
    return isDark ? t('theme.dark') || 'Dark' : t('theme.light') || 'Light';
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
      title={getTooltip()}
      aria-label={t('theme.toggle') || 'Toggle theme'}
    >
      {/* 太阳/月亮图标切换动画 */}
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0.8 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {isDark ? (
          <span className="text-xl">🌙</span>
        ) : (
          <span className="text-xl">☀️</span>
        )}
      </motion.div>
      
      {/* 跟随系统指示器 */}
      {theme === 'system' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"
          title={t('theme.system') || 'Following system'}
        />
      )}
    </motion.button>
  );
}

