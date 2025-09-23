/**
 * 输入组件
 * 提供统一的输入框样式和功能
 */

'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import type { InputProps } from '@/types/components';
import { cn } from '@/lib/utils';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      placeholder,
      value,
      defaultValue,
      disabled = false,
      required = false,
      error,
      label,
      helperText,
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const hasError = !!error;
    const hasSuccess = !hasError && value && !error;
    
    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };
    
    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <motion.input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'w-full px-3 py-2 border rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-neutral-400',
              {
                'border-neutral-300 focus:border-primary-500 focus:ring-primary-500': !hasError && !hasSuccess,
                'border-red-300 focus:border-red-500 focus:ring-red-500': hasError,
                'border-green-300 focus:border-green-500 focus:ring-green-500': hasSuccess,
                'pr-10': isPassword || hasError || hasSuccess
              },
              className
            )}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
            {...props}
          />
          
          {/* 密码显示/隐藏按钮 */}
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          
          {/* 错误图标 */}
          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          
          {/* 成功图标 */}
          {hasSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* 错误信息 */}
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
        
        {/* 帮助文本 */}
        {helperText && !hasError && (
          <p className="mt-1 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;


