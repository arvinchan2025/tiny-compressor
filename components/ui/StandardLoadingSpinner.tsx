'use client';

import { motion } from 'framer-motion';
import { loadingAnimations, transitions } from '@/lib/micro-interactions';

interface StandardLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spin' | 'pulse' | 'bounce' | 'wave';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export default function StandardLoadingSpinner({
  size = 'md',
  variant = 'spin',
  color = 'primary',
  className = ''
}: StandardLoadingSpinnerProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return 'border-blue-200 border-t-blue-600';
      case 'secondary':
        return 'border-gray-200 border-t-gray-600';
      case 'success':
        return 'border-green-200 border-t-green-600';
      case 'warning':
        return 'border-yellow-200 border-t-yellow-600';
      case 'error':
        return 'border-red-200 border-t-red-600';
      default:
        return 'border-blue-200 border-t-blue-600';
    }
  };

  const animation = loadingAnimations[variant];

  if (variant === 'spin') {
    return (
      <motion.div
        className={`${getSizeStyles()} border-2 ${getColorStyles()} rounded-full ${className}`}
        animate={animation.animate}
        transition={animation.transition}
      />
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${getSizeStyles()} bg-blue-600 rounded-full ${className}`}
        animate={animation.animate}
        transition={animation.transition}
      />
    );
  }

  if (variant === 'bounce') {
    return (
      <motion.div
        className={`${getSizeStyles()} bg-blue-600 rounded-full ${className}`}
        animate={animation.animate}
        transition={animation.transition}
      />
    );
  }

  if (variant === 'wave') {
    return (
      <motion.div
        className={`${getSizeStyles()} bg-blue-600 rounded-full ${className}`}
        animate={animation.animate}
        transition={animation.transition}
      />
    );
  }

  return null;
}
