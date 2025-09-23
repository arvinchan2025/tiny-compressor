'use client';

import { motion } from 'framer-motion';
import { progressAnimations, transitions } from '@/lib/micro-interactions';

interface StandardProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  animated?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export default function StandardProgressBar({
  progress,
  size = 'md',
  variant = 'primary',
  animated = true,
  showPercentage = false,
  className = ''
}: StandardProgressBarProps) {
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

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${getSizeStyles()}`}>
        <motion.div
          className={`${getSizeStyles()} rounded-full ${getVariantStyles()}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={animated ? transitions.standard : { duration: 0 }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}
