'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { hoverEffects, transitions, commonVariants } from '@/lib/micro-interactions';

interface StandardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'default' | 'elevated' | 'outlined' | 'filled';
  size: 'sm' | 'md' | 'lg';
  hover: boolean;
  children: React.ReactNode;
}

const StandardCard = forwardRef<HTMLDivElement, StandardCardProps>(
  ({
    variant = 'default',
    size = 'md',
    hover = false,
    children,
    className = '',
    ...props
  }, ref) => {
    // 基础样式
    const baseStyles = `
      rounded-lg transition-all duration-200
      ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
    `;

    // 尺寸样式
    const sizeStyles = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // 变体样式（统一设计系统 - 2025-10-13）
    const variantStyles = {
      default: `
        bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 shadow-sm
        hover:border-gray-300 dark:hover:border-gray-600
        hover:shadow-md dark:hover:shadow-xl
      `,
      elevated: `
        bg-white dark:bg-gray-850 shadow-md dark:shadow-xl
        hover:shadow-lg dark:hover:shadow-2xl
        border border-transparent dark:border-gray-800
      `,
      outlined: `
        bg-transparent border-2 border-gray-200 dark:border-gray-700
        hover:border-gray-300 dark:hover:border-gray-600 
        hover:bg-gray-50 dark:hover:bg-gray-850/50
      `,
      filled: `
        bg-gray-50 dark:bg-gray-875 border border-gray-200 dark:border-gray-700
        hover:bg-gray-100 dark:hover:bg-gray-850
      `,
    };

    const cardClasses = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        initial={commonVariants.slideUp.initial}
        animate={commonVariants.slideUp.animate}
        transition={transitions.standard}
        whileHover={hover ? hoverEffects.scale.whileHover : {}}
        whileTap={hover ? hoverEffects.scale.whileTap : {}}
        style={props.style}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

StandardCard.displayName = 'StandardCard';

export default StandardCard;
