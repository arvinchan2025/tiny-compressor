'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';
import StandardCard from './StandardCard';

interface ErrorInfo {
  code: string;
  title: string;
  message: string;
  suggestion: string;
  action: {
    label: string;
    onClick: () => void;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ErrorHandlerProps {
  error: ErrorInfo | null;
  onDismiss: () => void;
  onRetry: () => void;
  className: string;
  translations: {
    error: {
      title: string;
      retry: string;
      dismiss: string;
      details: string;
    };
  };
}

export default function ErrorHandler({
  error,
  onDismiss,
  onRetry,
  className = '',
  translations
}: ErrorHandlerProps) {
  // 浣跨敤浼犲叆鐨勭炕璇戞垨榛樿缈昏瘧
  const t = (key: string, fallback: string) => {
    if (translations.error) {
      const keys = key.split('.');
      let value: any = translations.error;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return fallback;
        }
      }
      return value || fallback;
    }
    return fallback;
  };
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  const getSeverityStyles = () => {
    switch (error.severity) {
      case 'low':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = () => {
    switch (error.severity) {
      case 'low':
        return 'warning';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  };

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
        className={`border ${getSeverityStyles()}`}
      >
        <div className="flex items-start space-x-3">
          {/* 错误鍥炬爣 */}
          <div className="flex-shrink-0 mt-0.5">
            <StandardIcon 
              name={getSeverityIcon() as any} 
              size="md" 
              className={error.severity === 'low' || error.severity === 'medium' ? 'text-yellow-500' : 'text-red-500'}
            />
          </div>

          {/* 错误鍐呭 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {error.title}
              </h3>
              <div className="flex items-center space-x-2">
                {/* 错误浠ｇ爜 */}
                <span className="text-xs opacity-75 font-mono">
                  {error.code}
                </span>
                {/* 鍏抽棴鎸夐挳 */}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="text-current opacity-60 hover:opacity-100 transition-opacity duration-200"
                  >
                    <StandardIcon name="close" size="sm" />
                  </button>
                )}
              </div>
            </div>

            {/* 错误娑堟伅 */}
            <p className="text-sm mt-1">
              {error.message}
            </p>

            {/* 寤鸿鍜屾搷*/}
            <div className="mt-3 space-y-3">
              {/* 寤鸿 */}
              <div className="p-3 bg-white bg-opacity-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <StandardIcon name="info" size="sm" className="text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      {t('error.suggestion', 'Suggestion')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {error.suggestion}
                    </div>
                  </div>
                </div>
              </div>

              {/* 鎿嶄綔鎸夐挳 */}
              <div className="flex items-center space-x-3">
                {onRetry && (
                  <StandardButton
                    variant="secondary"
                    size="sm"
                    onClick={onRetry}
                  >
                    {t('button.retry', 'Retry')}
                  </StandardButton>
                )}
                {error.action && (
                  <StandardButton
                    variant="secondary"
                    size="sm"
                    onClick={error.action.onClick}
                  >
                    {error.action.label}
                  </StandardButton>
                )}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm font-medium underline hover:no-underline transition-all duration-200"
                >
                  {isExpanded ? t('button.collapseDetails', 'Collapse Details') : t('button.viewDetails', 'View Details')}
                </button>
              </div>

              {/* 灞曞紑鐨勮缁嗕俊*/}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 p-3 bg-white bg-opacity-50 rounded border"
                  >
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium">{t('error.errorCode', 'Error Code')}:</span>
                        <span className="font-mono">{error.code}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('error.severity', 'Severity')}:</span>
                        <span className="capitalize">{error.severity}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('error.time', 'Time')}:</span>
                        <span>{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </StandardCard>
    </motion.div>
  );
}

