
import { ArrowRight } from 'lucide-react';

interface Props {
  sourceFormat: string;
  targetFormat: string;
  t: (key: string) => string;
}

function getFormatIcon(format: string): string {
  const icons: Record<string, string> = {
    png: '🖼️',
    jpg: '📷',
    jpeg: '📷',
    webp: '🌐',
    avif: '🚀',
    heic: '📱',
  };

  return icons[format.toLowerCase()] || '🖼️';
}

export default function FormatConversionPreview({
  sourceFormat,
  targetFormat,
  t,
}: Props) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-text-primary mb-6 text-center">
        {t('operation.preview.formatConversion') ||
          'Format Conversion'}
      </h4>

      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <span className="text-3xl">
              {getFormatIcon(sourceFormat)}
            </span>

            <span className="font-bold text-lg">
              {sourceFormat.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t('operation.preview.currentFormat') ||
              'Current format'}
          </p>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-purple-500" />
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-2 px-4 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
            <span className="text-3xl">
              {getFormatIcon(targetFormat)}
            </span>

            <span className="font-bold text-lg">
              {targetFormat.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t('operation.preview.targetFormat') ||
              'Target format'}
          </p>
        </div>
      </div>
    </div>
  );
}
