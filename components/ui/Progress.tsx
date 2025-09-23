'use client';

import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function Progress({ 
  value, 
  max = 100, 
  className = '', 
  showLabel = false, 
  label,
  size = 'md',
  animated = true
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const ProgressBar = animated ? motion.div : 'div';
  const progressProps = animated ? {
    initial: { width: 0 },
    animate: { width: `${percentage}%` },
    transition: { duration: 0.5, ease: "easeOut" }
  } : {
    style: { width: `${percentage}%` }
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-slate-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-slate-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <ProgressBar
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          {...progressProps}
        />
      </div>
    </div>
  );
}
