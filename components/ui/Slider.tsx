/**
 * 滑块组件
 * 提供统一的滑块样式和功能
 */

'use client';

import { forwardRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { SliderProps } from '@/types/components';
import { cn } from '@/lib/utils';

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      min,
      max,
      step = 1,
      value,
      disabled = false,
      label,
      helperText,
      onChange,
      formatValue,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onChange?.(newValue);
    }, [onChange]);
    
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    
    const percentage = ((value - min) / (max - min)) * 100;
    const displayValue = formatValue ? formatValue(value) : value.toString();
    
    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700">
              {label}
            </label>
            <span className="text-sm text-neutral-500">
              {displayValue}
            </span>
          </div>
        )}
        
        <div className="relative">
          {/* 轨道 */}
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600 rounded-full"
              style={{ width: `${percentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          
          {/* 滑块 */}
          <motion.input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className={cn(
              'absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'slider-thumb',
              className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            {...props}
          />
          
          {/* 自定义滑块样式 */}
          <style jsx>{`
            .slider-thumb::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${isDragging ? '#2563eb' : '#3b82f6'};
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              cursor: pointer;
              transition: all 0.2s ease;
            }
            
            .slider-thumb::-webkit-slider-thumb:hover {
              background: #2563eb;
              transform: scale(1.1);
            }
            
            .slider-thumb::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${isDragging ? '#2563eb' : '#3b82f6'};
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              cursor: pointer;
              transition: all 0.2s ease;
            }
            
            .slider-thumb::-moz-range-thumb:hover {
              background: #2563eb;
              transform: scale(1.1);
            }
            
            .slider-thumb:disabled::-webkit-slider-thumb {
              background: #9ca3af;
              cursor: not-allowed;
            }
            
            .slider-thumb:disabled::-moz-range-thumb {
              background: #9ca3af;
              cursor: not-allowed;
            }
          `}</style>
        </div>
        
        {/* 帮助文本 */}
        {helperText && (
          <p className="mt-1 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
        
        {/* 数值标签 */}
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>{formatValue ? formatValue(min) : min}</span>
          <span>{formatValue ? formatValue(max) : max}</span>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;


