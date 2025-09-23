'use client';

import { motion, AnimatePresence } from 'framer-motion';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';
import StandardCard from './StandardCard';

interface ErrorStateProps {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  suggestion?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export default function StandardErrorState({
  type,
  title,
  message,
  suggestion,
  action,
  onDismiss,
  className = ''
}: ErrorStateProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          iconName: 'error' as const
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-500',
          iconName: 'warning' as const
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-500',
          iconName: 'info' as const
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: 'text-green-500',
          iconName: 'success' as const
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-500',
          iconName: 'info' as const
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <StandardCard
        variant="elevated"
        size="sm"
        className={`border ${styles.container}`}
      >
        <div className="flex items-start space-x-3">
          {/* 图标 */}
          <div className="flex-shrink-0 mt-0.5">
            <StandardIcon 
              name={styles.iconName} 
              size="md" 
              className={styles.icon}
            />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {title}
              </h3>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-current opacity-60 hover:opacity-100 transition-opacity duration-200"
                >
                  <StandardIcon name="close" size="sm" />
                </button>
              )}
            </div>

            {/* 消息 */}
            <p className="text-sm mt-1">
              {message}
            </p>

            {/* 建议 */}
            {suggestion && (
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <StandardIcon name="info" size="sm" className="text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      建议
                    </div>
                    <div className="text-sm text-gray-600">
                      {suggestion}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            {action && (
              <div className="mt-4">
                <StandardButton
                  variant="secondary"
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </StandardButton>
              </div>
            )}
          </div>
        </div>
      </StandardCard>
    </motion.div>
  );
}
