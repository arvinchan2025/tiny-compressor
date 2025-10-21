/**
 * 转换模式选择器组件
 * 简单模式和高级模式切换
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface ConversionModeSelectorProps {
  isAdvancedMode: boolean;
  onModeChange: (isAdvanced: boolean) => void;
  locale?: string;
  format?: string;
}

export default function ConversionModeSelector({ isAdvancedMode, onModeChange, locale = 'en', format = 'png' }: ConversionModeSelectorProps) {
  const { t } = useTranslation(`converters/${format}` as any, locale as any);
  
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-1 inline-flex transition-colors">
        <motion.button
          onClick={() => onModeChange(false)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            !isAdvancedMode
              ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">⚡</span>
          <span>{t('operation.settings.simple') || 'Simple'}</span>
        </motion.button>
        
        <motion.button
          onClick={() => onModeChange(true)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            isAdvancedMode
              ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">⚙️</span>
          <span>{t('operation.settings.advanced') || 'Advanced'}</span>
        </motion.button>
      </div>
    </div>
  );
}