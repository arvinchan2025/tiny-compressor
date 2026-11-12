
import { Download, Check } from 'lucide-react';

import { ConversionResult } from '@/types/image';

import ResultStats from '@/components/shared/ResultStats';
import ActionButtons from '@/components/shared/ActionButtons';

interface Props {
  result: ConversionResult;
  targetFormat: string;
  t: (key: string) => string;
  onDownload: () => void;
  onReset: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes.length - 1,
  );

  return `${Math.round(
    (bytes / Math.pow(1024, index)) * 100,
  ) / 100} ${sizes[index]}`;
}

export default function ConversionResultView({
  result,
  targetFormat,
  t,
  onDownload,
  onReset,
}: Props) {
  return (
    <div className="card-glass p-6 sm:p-8 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        <h2 className="text-2xl font-semibold text-slate-800 dark:text-gray-200 mb-2">
          {t('operation.results.title') ||
            'Conversion Complete!'}
        </h2>

        <p className="text-slate-600 dark:text-gray-400">
          {t('operation.results.subtitle') ||
            'Your image has been successfully converted'}
        </p>
      </div>

      <ResultStats
        stats={[
          {
            label:
              t('operation.results.originalFormat') ||
              'Original Format',
            value: result.fromFormat.toUpperCase(),
            color: 'gray',
          },
          {
            label:
              t('operation.results.newFormat') ||
              'New Format',
            value: result.toFormat.toUpperCase(),
            color: 'purple',
          },
          {
            label:
              t('operation.results.fileSize') ||
              'File Size',
            value: formatFileSize(result.originalFile.size),
            color: 'green',
          },
        ]}
      />

      <ActionButtons
        buttons={[
          {
            label:
              t('operation.results.download') ||
              `Download ${targetFormat.toUpperCase()}`,
            onClick: onDownload,
            icon: Download,
            variant: 'primary',
          },
          {
            label:
              t('operation.results.reset') ||
              'Convert Another',
            onClick: onReset,
            variant: 'secondary',
          },
        ]}
      />
    </div>
  );
}
