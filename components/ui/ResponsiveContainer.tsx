'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { getResponsiveContainerWidth, getResponsiveConfig } from '@/lib/responsive-utils';
import { transitions, commonVariants } from '@/lib/micro-interactions';

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'fluid' | 'content' | 'section';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ResponsiveContainer = forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({
    children,
    variant = 'content',
    maxWidth = 'lg',
    padding = 'md',
    className = '',
    ...props
  }, ref) => {
    // 获取响应式配置
    const config = getResponsiveConfig();
    
    // 基础样式
    const baseStyles = 'w-full';
    
    // 变体样式
    const variantStyles = {
      fluid: 'w-full',
      content: getResponsiveContainerWidth(),
      section: 'w-full max-w-7xl mx-auto'
    };
    
    // 最大宽度样式
    const maxWidthStyles = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'max-w-full'
    };
    
    // 内边距样式
    const paddingStyles = {
      none: '',
      sm: 'px-2 py-1',
      md: 'px-4 py-2',
      lg: 'px-6 py-4',
      xl: 'px-8 py-6'
    };
    
    // 响应式内边距
    const responsivePadding = config.deviceType === 'mobile' 
      ? 'px-4 py-2' 
      : config.deviceType === 'tablet' 
      ? 'px-6 py-4' 
      : 'px-8 py-6';
    
    const containerClasses = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${variant === 'content' ? maxWidthStyles[maxWidth] : ''}
      ${paddingStyles[padding]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        initial={commonVariants.slideUp.initial}
        animate={commonVariants.slideUp.animate}
        transition={transitions.standard}
        style={props.style}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';

export default ResponsiveContainer;
