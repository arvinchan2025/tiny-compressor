/**
 * 卡片组件
 * 提供统一的卡片样式和布局
 */

'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { CardProps } from '@/types/components';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      padding = 'md',
      shadow = 'md',
      border = true,
      header,
      footer,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'bg-white rounded-lg transition-all duration-200';
    
    const variantClasses = {
      default: 'border border-neutral-200',
      elevated: 'shadow-lg',
      outlined: 'border-2 border-neutral-300',
      filled: 'bg-neutral-50 border border-neutral-200'
    };
    
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    };
    
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };
    
    const borderClasses = border ? 'border' : '';
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          shadowClasses[shadow],
          borderClasses,
          className
        )}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {header && (
          <div className="border-b border-neutral-200 pb-4 mb-4">
            {header}
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
        
        {footer && (
          <div className="border-t border-neutral-200 pt-4 mt-4">
            {footer}
          </div>
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;


