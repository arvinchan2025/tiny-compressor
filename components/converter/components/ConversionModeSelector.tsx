/**
 * 转换模式选择器组件
 * 简单模式和高级模式切换
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useModuleTranslation } from '@/hooks/useTranslationNew';

interface ConversionModeSelectorProps {
  isAdvancedMode: boolean;
  onModeChange: (isAdvanced: boolean) => void;
  locale?: string;
  sourceFormat?: string;
  targetFormat?: string;
}

export default function ConversionModeSelector({ 
  isAdvancedMode, 
  onModeChange, 
  locale = 'en', 
  sourceFormat = 'png',
  targetFormat = 'jpg' 
}: ConversionModeSelectorProps) {
  const { t } = useModuleTranslation(`converters/${sourceFormat}-to-${targetFormat}`, locale as any);
  
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-1 inline-flex transition-colors">
        <motion.button
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            !isAdvancedMode
              ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          onClick={() => onModeChange(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">⚡</span>
          <span>{t('operation.settings.simple') || 'Simple'}</span>
        </motion.button>
        
        <motion.button
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            isAdvancedMode
              ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          onClick={() => onModeChange(true)}
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