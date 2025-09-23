'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { commonSpacing, responsiveSpacing, layoutUtils } from '@/lib/spacing-utils';

interface StandardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  children: React.ReactNode;
}

const StandardGrid = forwardRef<HTMLDivElement, StandardGridProps>(
  ({
    cols = 2,
    gap = 'md',
    responsive = true,
    children,
    className = '',
    ...props
  }, ref) => {
    // 基础样式
    const baseStyles = 'grid';
    
    // 列数样式
    const colsStyles = responsive 
      ? layoutUtils.gridCols[cols as keyof typeof layoutUtils.gridCols]
      : `grid-cols-${cols}`;
    
    // 间距样式
    const gapStyles = {
      sm: commonSpacing.gridSpacingSm,
      md: commonSpacing.gridSpacing,
      lg: commonSpacing.gridSpacingLg,
    };
    
    const gridClasses = `
      ${baseStyles}
      ${colsStyles}
      ${gapStyles[gap]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <motion.div
        ref={ref}
        className={gridClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={props.style}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

StandardGrid.displayName = 'StandardGrid';

export default StandardGrid;
