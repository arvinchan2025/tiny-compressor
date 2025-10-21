'use client';

// import { motion } from 'framer-motion';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';
import StandardCard from './StandardCard';

interface SuccessStateProps {
  title: string;
  message: string;
  action: {
    label: string;
    onClick: () => void;
  };
  onDismiss: () => void;
  className: string;
}

export default function StandardSuccessState({
  title,
  message,
  action,
  onDismiss,
  className = ''
}: SuccessStateProps) {
  return (
    <div
      className={className}
    >
      <StandardCard
        variant="elevated"
        size="sm"
        className="bg-green-50 border-green-200 text-green-800"
      >
        <div className="flex items-start space-x-3">
          {/* 成功图标 */}
          <div
            className="flex-shrink-0 mt-0.5"
          >
            <StandardIcon 
              name="success" 
              size="md" 
              className="text-green-500"
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

            {/* 操作按钮 */}
            {action && (
              <div
                className="mt-4"
              >
                <StandardButton
                  variant="primary"
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
    </div>
  );
}
