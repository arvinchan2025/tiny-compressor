'use client';

import { motion } from 'framer-motion';
import { loadingAnimations, transitions, commonVariants } from '@/lib/micro-interactions';
import StandardLoadingSpinner from './StandardLoadingSpinner';
import StandardCard from './StandardCard';
import StandardIcon from './StandardIcon';

interface LoadingStateProps {
  message?: string;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StandardLoadingState({
  message = 'Loading...',
  progress,
  size = 'md',
  className = ''
}: LoadingStateProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          spinner: 'w-4 h-4',
          text: 'text-sm'
        };
      case 'md':
        return {
          container: 'p-6',
          spinner: 'w-6 h-6',
          text: 'text-base'
        };
      case 'lg':
        return {
          container: 'p-8',
          spinner: 'w-8 h-8',
          text: 'text-lg'
        };
      default:
        return {
          container: 'p-6',
          spinner: 'w-6 h-6',
          text: 'text-base'
        };
    }
  };

  const styles = getSizeStyles();

  return (
    <motion.div
      initial={commonVariants.scale.initial}
      animate={commonVariants.scale.animate}
      exit={commonVariants.scale.exit}
      transition={transitions.standard}
      className={className}
    >
      <StandardCard
        variant="elevated"
        size="sm"
        className="text-center"
      >
        <div className={styles.container}>
          {/* 加载动画 */}
          <div className="flex justify-center mb-4">
            <StandardLoadingSpinner
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
              variant="spin"
              color="primary"
            />
          </div>

          {/* 消息 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`${styles.text} font-medium text-gray-700 mb-2`}
          >
            {message}
          </motion.div>

          {/* 进度条 */}
          {progress !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-full bg-gray-200 rounded-full h-2 mb-4"
            >
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={transitions.standard}
              />
            </motion.div>
          )}

          {/* 加载点动画 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex justify-center space-x-1"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={loadingAnimations.pulse.animate}
                transition={{
                  ...loadingAnimations.pulse.transition,
                  delay: index * 0.2
                }}
              />
            ))}
          </motion.div>
        </div>
      </StandardCard>
    </motion.div>
  );
}
