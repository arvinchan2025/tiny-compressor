'use client';

import React from 'react';
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
    <div className="text-center py-12 animate-fade-in">
      {/* 旋转图标 */}
      <div className="mb-6 animate-spin" style={{ animationDuration: '2s' }}>
        {icon || <Zap className={`w-16 h-16 text-${accentColor}-500 mx-auto`} />}
      </div>
      
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
          <div
            className={`h-full bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600 transition-all duration-300 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}


