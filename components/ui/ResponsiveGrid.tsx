'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { getResponsiveGridCols, getResponsiveConfig } from '@/lib/responsive-utils';
import { transitions, commonVariants } from '@/lib/micro-interactions';

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({
    children,
    cols = { mobile: 1, tablet: 2, desktop: 3 },
    gap = 'md',
    className = '',
    ...props
  }, ref) => {
    // 获取响应式配置
    const config = getResponsiveConfig();
    
    // 基础样式
    const baseStyles = 'grid';
    
    // 网格列数样式
    const gridCols = getResponsiveGridCols(cols);
    
    // 间距样式
    const gapStyles = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };
    
    // 响应式间距
    const responsiveGap = config.deviceType === 'mobile' 
      ? 'gap-2' 
      : config.deviceType === 'tablet' 
      ? 'gap-4' 
      : 'gap-6';
    
    const gridClasses = `
      ${baseStyles}
      ${gridCols}
      ${gapStyles[gap]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <motion.div
        ref={ref}
        className={gridClasses}
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

ResponsiveGrid.displayName = 'ResponsiveGrid';

export default ResponsiveGrid;
