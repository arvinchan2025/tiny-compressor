'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ThemeSwitcher() {
  const { theme, actualTheme, toggleTheme } = useTheme();
  const { t, isLoading: translationLoading } = useTranslation('common/ui');

  // 显示当前实际主题（解析system后的结果）
  const isDark = actualTheme === 'dark';
  
  // 工具提示文本
  const getTooltip = () => {
    if (translationLoading) {
      return theme === 'system' ? 'System' : (isDark ? 'Dark' : 'Light');
    }
    if (theme === 'system') {
      return `${t('theme.system')} (${isDark ? t('theme.dark') : t('theme.light')})`;
    }
    return isDark ? t('theme.dark') : t('theme.light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
      title={getTooltip()}
      aria-label={translationLoading ? 'Toggle theme' : t('theme.toggle')}
    >
      {/* 太阳/月亮图标切换动画 */}
      <div
        className="relative transition-transform duration-300"
        style={{
          transform: `rotate(${isDark ? 180 : 0}deg) scale(${isDark ? 0.8 : 1})`
        }}
      >
        {isDark ? (
          <span className="text-xl">🌙</span>
        ) : (
          <span className="text-xl">☀️</span>
        )}
      </div>
      
      {/* 跟随系统指示器 */}
      {theme === 'system' && (
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"
          title={translationLoading ? 'Following system' : t('theme.system')}
        />
      )}
    </button>
  );
}

