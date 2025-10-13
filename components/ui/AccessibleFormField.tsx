'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { keyboardNavigation, ariaLabels, screenReader } from '@/lib/accessibility';
import { transitions } from '@/lib/micro-interactions';
import StandardIcon from './StandardIcon';

interface AccessibleFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error: string;
  helperText: string;
  required: boolean;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  variant: 'default' | 'error' | 'success';
}

const AccessibleFormField = forwardRef<HTMLInputElement, AccessibleFormFieldProps>(
  ({
    label,
    error,
    helperText,
    required = false,
    leftIcon,
    rightIcon,
    variant = 'default',
    className = '',
    id,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    
    // 生成唯一ID
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;
    
    // 基础样式
    const baseStyles = 'block w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    // 变体样式
    const variantStyles = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
    };
    
    // 图标样式
    const iconStyles = 'absolute inset-y-0 flex items-center pointer-events-none';
    const leftIconStyles = 'left-0 pl-3';
    const rightIconStyles = 'right-0 pr-3';
    
    // 输入框样
    const inputStyles = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
    
    const inputClasses = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${inputStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // ARIA属
    const describedBy = error ? errorId : helperText ? helperId : undefined;
    const formControlState: {
      required: boolean;
      invalid: boolean;
      describedBy: string;
    } = {
      required,
      invalid: !!error
    };
    
    if (describedBy) formControlState.describedBy = describedBy;
    
    const ariaAttributes = ariaLabels.formControl(label, formControlState);

    // 键盘事件处理
    const handleKeyDown = (event: React.KeyboardEvent) => {
      keyboardNavigation.handleKeyDown(event, {
        onEscape: () => {
          (event.target as HTMLInputElement).blur();
        }
      });
    };

    // 处理值变
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(event.target.value.length > 0);
      props.onChange?.(event);
    };

    // 处理焦点
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(event);
    };

    return (
      <div className="space-y-2">
        {/* 标签 */}
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {/* 输入框容*/}
        <div className="relative">
          {/* 左侧图标 */}
          {leftIcon && (
            <div className={`${iconStyles} ${leftIconStyles}`}>
              {leftIcon}
            </div>
          )}

          {/* 输入*/}
          <motion.input
            ref={ref}
            id={fieldId}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            style={props.style}
            {...ariaAttributes}
            {...(props as any)}
          />

          {/* 右侧图标 */}
          {rightIcon && (
            <div className={`${iconStyles} ${rightIconStyles}`}>
              {rightIcon}
            </div>
          )}

          {/* 焦点指示*/}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused ? 1 : 0 }}
            transition={transitions.fast}
          />
        </div>

        {/* 错误消息 */}
        {error && (
          <motion.div
            id={errorId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitions.fast}
            className="flex items-center space-x-2 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            <StandardIcon name="error" size="sm" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* 帮助文本 */}
        {helperText && !error && (
          <motion.div
            id={helperId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitions.fast}
            className="text-sm text-gray-500"
          >
            {helperText}
          </motion.div>
        )}

        {/* 屏幕阅读器文*/}
        <span className={screenReader.hiddenTextClass}>
          {`${label}${required ? ' required' : ''}${error ? ` error: ${error}` : ''}${helperText ? ` ${helperText}` : ''}`}
        </span>
      </div>
    );
  }
);

AccessibleFormField.displayName = 'AccessibleFormField';

export default AccessibleFormField;
