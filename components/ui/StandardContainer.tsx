// 'use client';

// import { forwardRef } from 'react';
// import { motion } from 'framer-motion'; // Removed to fix build issues
import {commonSpacing, responsiveSpacing, layoutUtils} from '@/lib/spacing-utils';

interface StandardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'page' | 'content' | 'section' | 'card';
  size: 'sm' | 'md' | 'lg' | 'xl';
  center: boolean;
  children: React.ReactNode;
}

export default function StandardContainer({
                                            variant = 'content',
                                            size = 'md',
                                            center = true,
                                            children,
                                            className = '',
                                            ...props
                                          }: StandardContainerProps) {
  // 基础样式
  const baseStyles = 'w-full';

  // 变体样式
  const variantStyles = {
    page: responsiveSpacing.pagePadding,
    content: responsiveSpacing.contentPadding,
    section: 'px-4 py-8 sm:py-12 lg:py-16',
    card: commonSpacing.cardSpacing,
  };

  // 尺寸样式
  const sizeStyles = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  };

  // 居中样式
  const centerStyles = center ? 'mx-auto' : '';

  const containerClasses = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${centerStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={containerClasses}
      {...props}
    >
      {children}
    </div>
  );
}

