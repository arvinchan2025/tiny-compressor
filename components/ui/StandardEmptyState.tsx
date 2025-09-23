'use client';

import { motion } from 'framer-motion';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';
import StandardCard from './StandardCard';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StandardEmptyState({
  icon = 'info',
  title,
  description,
  action,
  size = 'md',
  className = ''
}: EmptyStateProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-6',
          icon: 'w-12 h-12',
          title: 'text-lg',
          description: 'text-sm',
          spacing: 'space-y-3'
        };
      case 'md':
        return {
          container: 'p-8',
          icon: 'w-16 h-16',
          title: 'text-xl',
          description: 'text-base',
          spacing: 'space-y-4'
        };
      case 'lg':
        return {
          container: 'p-12',
          icon: 'w-20 h-20',
          title: 'text-2xl',
          description: 'text-lg',
          spacing: 'space-y-6'
        };
      default:
        return {
          container: 'p-8',
          icon: 'w-16 h-16',
          title: 'text-xl',
          description: 'text-base',
          spacing: 'space-y-4'
        };
    }
  };

  const styles = getSizeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <StandardCard
        variant="elevated"
        size="sm"
        className="text-center"
      >
        <div className={styles.container}>
          <div className={`flex flex-col items-center ${styles.spacing}`}>
            {/* 图标 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1,
                type: "spring",
                stiffness: 200
              }}
              className={`${styles.icon} text-gray-400`}
            >
              <StandardIcon name={icon as any} size="xl" />
            </motion.div>

            {/* 标题 */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`${styles.title} font-semibold text-gray-800`}
            >
              {title}
            </motion.h3>

            {/* 描述 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className={`${styles.description} text-gray-600 max-w-md`}
            >
              {description}
            </motion.p>

            {/* 操作按钮 */}
            {action && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <StandardButton
                  variant="primary"
                  size={size === 'sm' ? 'sm' : 'md'}
                  onClick={action.onClick}
                >
                  {action.label}
                </StandardButton>
              </motion.div>
            )}
          </div>
        </div>
      </StandardCard>
    </motion.div>
  );
}
