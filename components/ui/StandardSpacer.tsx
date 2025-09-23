'use client';

import { forwardRef } from 'react';
import { SpacingScale } from '@/lib/spacing-utils';

interface StandardSpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpacingScale;
  axis?: 'x' | 'y' | 'both';
  children?: React.ReactNode;
}

const StandardSpacer = forwardRef<HTMLDivElement, StandardSpacerProps>(
  ({
    size = 4,
    axis = 'y',
    children,
    className = '',
    ...props
  }, ref) => {
    // 基础样式
    const baseStyles = 'block';
    
    // 轴样式
    const axisStyles = {
      x: `w-${size}`,
      y: `h-${size}`,
      both: `w-${size} h-${size}`,
    };
    
    const spacerClasses = `
      ${baseStyles}
      ${axisStyles[axis]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    if (children) {
      return (
        <div
          ref={ref}
          className={spacerClasses}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={spacerClasses}
        {...props}
      />
    );
  }
);

StandardSpacer.displayName = 'StandardSpacer';

export default StandardSpacer;
