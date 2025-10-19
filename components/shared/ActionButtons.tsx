'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonConfig {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

interface ActionButtonsProps {
  buttons: ButtonConfig[];
  layout?: 'horizontal' | 'vertical';
}

export default function ActionButtons({ 
  buttons, 
  layout = 'horizontal' 
}: ActionButtonsProps) {
  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row'} gap-4`}>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.disabled || button.loading}
          className={`
            ${button.variant === 'primary' ? 'flex-1' : ''}
            ${button.variant === 'primary' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white hover:shadow-lg' 
              : 'border-2 border-border-default hover:bg-gray-50 dark:hover:bg-gray-850 text-text-primary'
            }
            px-6 py-4 rounded-lg font-semibold
            transition-all duration-300 ease-out
            hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            flex items-center justify-center gap-2
            animate-slide-up
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {button.loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {button.icon && <button.icon className="w-5 h-5" />}
              {button.label}
            </>
          )}
        </button>
      ))}
    </div>
  );
}



