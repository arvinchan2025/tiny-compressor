"use client";
import { motion } from 'framer-motion';
import UploadArea from '@/components/shared/UploadArea';

interface Props {
  t: (key: string, params?: Record<string, string | number>) => string;
  onFileSelect: (file: File) => void | Promise<void>;
}

export default function VideoCompressionUpload({
  t,
  onFileSelect,
}: Props) {
  return (
    <motion.div
      className="card-glass p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-state="empty"
    >
      <UploadArea
        title={t('operation.upload.title')}
        subtitle={t('operation.upload.subtitle')}
        buttonText={t('operation.upload.selectFiles')}
        acceptTypes="video/*"
        onFileSelect={onFileSelect}
        accentColor="blue"
      />

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 {t('operation.info.privacy')}
        </p>

        <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
          ✨ {t('operation.info.nativeCompression')}
        </p>
      </div>
    </motion.div>
  );
}
