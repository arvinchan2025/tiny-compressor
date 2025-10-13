'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { keyboardNavigation, ariaLabels } from '@/lib/accessibility';
import { hoverEffects, transitions } from '@/lib/micro-interactions';
import { ComponentSizeScale } from '@/lib/design-system';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size: ComponentSizeScale;
  loading: boolean;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  fullWidth: boolean;
  asChild: boolean;
  children: React.ReactNode;
  // 可访问性属
  ariaLabel: string;
  ariaPressed: boolean;
  ariaExpanded: boolean;
  ariaDescribedBy: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    asChild = false,
    children,
    ariaLabel,
    ariaPressed,
    ariaExpanded,
    ariaDescribedBy,
    className = '',
    disabled = false,
    ...props
  }, ref) => {
    // 基础样式
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // 尺寸样式
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-xl'
    };
    
    // 变体样式
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
      error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    
    // 宽度样式
    const widthStyles = fullWidth ? 'w-full' : '';
    
    const buttonClasses = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${widthStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // ARIA属
    const buttonState: {
      pressed: boolean;
      expanded: boolean;
      disabled: boolean;
      loading: boolean;
    } = {
      disabled: disabled || loading,
      loading
    };
    
    if (ariaPressed !== undefined) buttonState.pressed = ariaPressed;
    if (ariaExpanded !== undefined) buttonState.expanded = ariaExpanded;
    
    const ariaAttributes = ariaLabels.button(
      ariaLabel || (typeof children === 'string' ? children : 'Button'),
      buttonState
    );

    // 键盘事件处理
    const handleKeyDown = (event: React.KeyboardEvent) => {
      keyboardNavigation.handleKeyDown(event, {
        onEnter: () => {
          if (!disabled && !loading) {
            (event.target as HTMLButtonElement).click();
          }
        },
        onSpace: () => {
          if (!disabled && !loading) {
            (event.target as HTMLButtonElement).click();
          }
        }
      });
    };

    // 按钮内容
    const buttonContent = (
      <>
        {loading && (
          <motion.div
            className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </>
    );

    if (asChild) {
      return (
        <motion.div
          className={buttonClasses}
          whileHover={disabled || loading ? {} : hoverEffects.scale.whileHover}
          whileTap={disabled || loading ? {} : hoverEffects.scale.whileTap}
          transition={transitions.fast}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={ariaLabel}
          {...ariaAttributes}
        >
          {buttonContent}
        </motion.div>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        whileHover={disabled || loading ? {} : hoverEffects.scale.whileHover}
        whileTap={disabled || loading ? {} : hoverEffects.scale.whileTap}
        transition={transitions.fast}
        onKeyDown={handleKeyDown}
        aria-describedby={ariaDescribedBy}
        style={props.style}
        {...ariaAttributes}
        {...(props as any)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
