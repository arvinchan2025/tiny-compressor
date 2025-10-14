'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  title: string;
  subtitle?: string;
  accentColor?: string;
  icon?: React.ReactNode;
}

export default function ProgressIndicator({
  progress,
  title,
  subtitle,
  accentColor = 'blue',
  icon
}: ProgressIndicatorProps) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 旋转图标 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        {icon || <Zap className={`w-16 h-16 text-${accentColor}-500 mx-auto`} />}
      </motion.div>
      
      {/* 处理文字 */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {subtitle}
        </p>
      )}
      
      {/* 进度条 */}
      <div className="max-w-md mx-auto">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {Math.round(progress)}%
        </p>
      </div>
    </motion.div>
  );
}


