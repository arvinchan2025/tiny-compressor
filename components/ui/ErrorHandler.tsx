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
  action?: {
    label: string;
    onClick: () => void;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ErrorHandlerProps {
  error: ErrorInfo | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorHandler({
  error,
  onDismiss,
  onRetry,
  className = ''
}: ErrorHandlerProps) {
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
          {/* 错误图标 */}
          <div className="flex-shrink-0 mt-0.5">
            <StandardIcon 
              name={getSeverityIcon() as any} 
              size="md" 
              className={error.severity === 'low' || error.severity === 'medium' ? 'text-yellow-500' : 'text-red-500'}
            />
          </div>

          {/* 错误内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {error.title}
              </h3>
              <div className="flex items-center space-x-2">
                {/* 错误代码 */}
                <span className="text-xs opacity-75 font-mono">
                  {error.code}
                </span>
                {/* 关闭按钮 */}
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

            {/* 错误消息 */}
            <p className="text-sm mt-1">
              {error.message}
            </p>

            {/* 建议和操作 */}
            <div className="mt-3 space-y-3">
              {/* 建议 */}
              <div className="p-3 bg-white bg-opacity-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <StandardIcon name="info" size="sm" className="text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      建议
                    </div>
                    <div className="text-sm text-gray-600">
                      {error.suggestion}
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-3">
                {onRetry && (
                  <StandardButton
                    variant="secondary"
                    size="sm"
                    onClick={onRetry}
                  >
                    重试
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
                  {isExpanded ? '收起详情' : '查看详情'}
                </button>
              </div>

              {/* 展开的详细信息 */}
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
                        <span className="font-medium">错误代码：</span>
                        <span className="font-mono">{error.code}</span>
                      </div>
                      <div>
                        <span className="font-medium">严重程度：</span>
                        <span className="capitalize">{error.severity}</span>
                      </div>
                      <div>
                        <span className="font-medium">时间：</span>
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

