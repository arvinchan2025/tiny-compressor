'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { hoverEffects, transitions } from '@/lib/micro-interactions';
import { ComponentSizeScale } from '@/lib/design-system';

interface StandardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size?: ComponentSizeScale;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const StandardButton = forwardRef<HTMLButtonElement, StandardButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    asChild = false,
    children,
    className = '',
    disabled,
    ...props
  }, ref) => {
    // 基础样式
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    // 尺寸样式
    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    };

    // 变体样式
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
        text-white shadow-md hover:shadow-lg
        hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
        focus:ring-blue-500
        active:scale-95
      `,
      secondary: `
        bg-gray-100 text-gray-900 shadow-sm
        hover:bg-gray-200 hover:shadow-md
        focus:ring-gray-500
        active:scale-95
      `,
      outline: `
        border-2 border-gray-300 text-gray-700
        hover:border-gray-400 hover:bg-gray-50
        focus:ring-gray-500
        active:scale-95
      `,
      ghost: `
        text-gray-700 hover:bg-gray-100
        focus:ring-gray-500
        active:scale-95
      `,
      success: `
        bg-gradient-to-r from-green-500 to-green-600
        text-white shadow-md hover:shadow-lg
        hover:from-green-600 hover:to-green-700
        focus:ring-green-500
        active:scale-95
      `,
      warning: `
        bg-gradient-to-r from-yellow-500 to-orange-500
        text-white shadow-md hover:shadow-lg
        hover:from-yellow-600 hover:to-orange-600
        focus:ring-yellow-500
        active:scale-95
      `,
      error: `
        bg-gradient-to-r from-red-500 to-red-600
        text-white shadow-md hover:shadow-lg
        hover:from-red-600 hover:to-red-700
        focus:ring-red-500
        active:scale-95
      `,
    };

    const buttonClasses = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const buttonContent = (
      <>
        {loading && (
          <motion.div
            className="mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </motion.div>
        )}
        
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        
        <span>{children}</span>
        
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
        style={props.style}
        {...(props as any)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

StandardButton.displayName = 'StandardButton';

export default StandardButton;
