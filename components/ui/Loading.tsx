/**
 * 加载组件
 * 提供统一的加载状态显示
 */

'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { LoadingProps } from '@/types/components';
import { cn } from '@/lib/utils';

const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      size = 'md',
      variant = 'spinner',
      text,
      overlay = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    
    const textSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };
    
    const renderSpinner = () => (
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
    );
    
    const renderDots = () => (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('rounded-full bg-current', {
              'w-1 h-1': size === 'sm',
              'w-2 h-2': size === 'md',
              'w-3 h-3': size === 'lg',
              'w-4 h-4': size === 'xl'
            })}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    );
    
    const renderPulse = () => (
      <motion.div
        className={cn('rounded-full bg-current', sizeClasses[size])}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
      />
    );
    
    const renderSkeleton = () => (
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
      </div>
    );
    
    const renderContent = () => {
      switch (variant) {
        case 'spinner':
          return renderSpinner();
        case 'dots':
          return renderDots();
        case 'pulse':
          return renderPulse();
        case 'skeleton':
          return renderSkeleton();
        default:
          return renderSpinner();
      }
    };
    
    const content = (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center space-y-2',
          className
        )}
        {...props}
      >
        {renderContent()}
        {text && (
          <p className={cn('text-neutral-600', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
    
    if (overlay) {
      return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          {content}
        </div>
      );
    }
    
    return content;
  }
);

Loading.displayName = 'Loading';

export default Loading;


