"use client";
import { motion } from 'framer-motion';
import ResultStats from '@/components/shared/ResultStats';
import ActionButtons from '@/components/shared/ActionButtons';
import type { SimpleCompressionResult } from '@/lib/video-processing/simple-compression';

interface Props {
  t: (key: string, params?: Record<string, string | number>) => string;
  result: SimpleCompressionResult;
  onDownload: () => void;
  onReset: () => void;
}

export default function VideoCompressionResultView({
  t,
  result,
  onDownload,
  onReset,
}: Props) {
  const savedMB = (
    (result.originalSize - result.compressedSize) /
    1024 /
    1024
  ).toFixed(2);

  return (
    <motion.div
      className="card-glass p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-state="result"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('operation.results.title')}
        </h3>
      </div>

      <div className="mb-8">
        <ResultStats
          stats={[
            {
              label: t('operation.results.originalSize'),
              value: `${(result.originalSize / 1024 / 1024).toFixed(2)} MB`,
              color: 'gray',
            },
            {
              label: t('operation.results.compressedSize'),
              value: `${(result.compressedSize / 1024 / 1024).toFixed(2)} MB`,
              color: 'blue',
            },
            {
              label: t('operation.results.saved'),
              value: `${savedMB} MB`,
              color: 'green',
            },
            {
              label: t('operation.results.compressionRatio'),
              value: `${result.compressionRatio.toFixed(1)}%`,
              color: 'blue',
            },
            {
              label: t('operation.results.processingTime'),
              value: `${(result.processingTime / 1000).toFixed(1)}s`,
              color: 'orange',
            },
          ]}
        />
      </div>

      <ActionButtons
        buttons={[
          {
            label: t('operation.actions.download'),
            onClick: onDownload,
            variant: 'primary',
          },
          {
            label: t('operation.actions.compressAnother'),
            onClick: onReset,
            variant: 'secondary',
          },
        ]}
      />
    </motion.div>
  );
}
