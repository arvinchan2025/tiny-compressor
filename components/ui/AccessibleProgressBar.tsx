'use client';

import { motion } from 'framer-motion';
import { ariaLabels } from '@/lib/accessibility';
import { progressAnimations, transitions } from '@/lib/micro-interactions';

interface AccessibleProgressBarProps {
  progress: number; // 0-100
  label: string;
  size: 'sm' | 'md' | 'lg';
  variant: 'primary' | 'success' | 'warning' | 'error';
  animated: boolean;
  showPercentage: boolean;
  className: string;
}

export default function AccessibleProgressBar({
  progress,
  label,
  size = 'md',
  variant = 'primary',
  animated = true,
  showPercentage = false,
  className = ''
}: AccessibleProgressBarProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600';
      case 'success':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  // ARIA属
  const ariaAttributes = ariaLabels.progress(label, clampedProgress, 100);

  return (
    <div className={`w-full ${className}`}>
      {/* 标签和百分比 */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {showPercentage && (
          <span className="text-sm text-gray-600">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>

      {/* 进度*/}
      <div 
        className={`w-full bg-gray-200 rounded-full ${getSizeStyles()}`}
        role="progressbar"
        aria-label={label}
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={`${getSizeStyles()} rounded-full ${getVariantStyles()}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={animated ? transitions.standard : { duration: 0 }}
          aria-hidden="true"
        />
      </div>

      {/* 屏幕阅读器文*/}
      <div className="sr-only" aria-live="polite">
        {clampedProgress === 100 
          ? `${label} completed` 
          : `${label} is ${Math.round(clampedProgress)}% complete`
        }
      </div>
    </div>
  );
}
