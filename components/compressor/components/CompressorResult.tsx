import { Check, Download } from 'lucide-react';
import { CompressionResult } from '@/types/image';
import { formatFileSize } from './utils/format';

interface Props {
  result: CompressionResult;
  format: string;
  quality: number;
  onDownload: () => void;
  onReset: () => void;
  t: any;
}

export default function CompressorResult({
  result,
  format,
  quality,
  onDownload,
  onReset,
  t,
}: Props) {
  const originalSize =
    result.originalFile?.size || result.originalFile?.file?.size || 0;
  const compressedSize = result.compressedSize || 0;
  const compressedPercent =
    originalSize > 0
      ? Math.min((compressedSize / originalSize) * 100, 100)
      : 0;
  const savedSize = originalSize - compressedSize;

  return (
    <div className="card-glass p-6 sm:p-8">
      <div className="space-y-6">
        <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center dark:border-green-500/20 dark:from-green-500/10 dark:to-emerald-500/10">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-green-800 dark:text-green-300">
            {t('operation.results.title')}
          </h3>
          <p className="text-green-700 dark:text-green-400">
            {t('operation.results.subtitle')}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <h4 className="mb-3 text-sm font-semibold text-text-secondary">
            {t('operation.files.title')}
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-text-secondary">
                {t('operation.files.name')}:
              </span>
              <span className="ml-2 inline-block max-w-[200px] truncate font-medium text-text-primary">
                {result.originalFile.name}
              </span>
            </div>
            {result.originalFile.width && result.originalFile.height && (
              <div>
                <span className="text-text-secondary">
                  {t('operation.files.dimensions')}:
                </span>
                <span className="ml-2 font-medium text-text-primary">
                  {result.originalFile.width} × {result.originalFile.height}
                </span>
              </div>
            )}
            <div>
              <span className="text-text-secondary">
                {t('operation.results.format')}:
              </span>
              <span className="ml-2 font-medium uppercase text-text-primary">
                {format}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">
                {t('operation.settings.quality')}:
              </span>
              <span className="ml-2 font-medium text-text-primary">
                {quality}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <h4 className="mb-4 text-lg font-semibold text-text-primary">
            {t('operation.results.sizeComparison')}
          </h4>

          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-text-secondary">
                  {t('operation.results.original')}
                </span>
                <span className="font-semibold text-text-primary">
                  {formatFileSize(originalSize)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-full rounded-full bg-gray-500 dark:bg-gray-400" />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-text-secondary">
                  {t('operation.results.compressed')}
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatFileSize(compressedSize)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${compressedPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center dark:border-green-500/20 dark:from-green-500/10 dark:to-emerald-500/10">
            <div className="mb-1 text-3xl font-bold text-green-600 dark:text-green-400">
              -{Math.abs(result.compressionRatio || 0)}%
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              {t('operation.results.saved')} {formatFileSize(savedSize)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            value={formatFileSize(originalSize)}
            label={`${t('operation.results.original')} ${t('operation.files.sizeInfo')}`}
          />
          <StatCard
            value={formatFileSize(compressedSize)}
            label={`${t('operation.results.compressed')} ${t('operation.files.sizeInfo')}`}
            valueClassName="text-green-600 dark:text-green-400"
          />
          <StatCard
            value={`${quality}%`}
            label={t('operation.stats.qualityUsed')}
            valueClassName="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            value={`${(result.processingTime / 1000).toFixed(1)}s`}
            label={t('operation.stats.processingTime')}
            valueClassName="text-purple-600 dark:text-purple-400"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg dark:from-blue-700 dark:to-indigo-700"
          >
            <Download className="h-5 w-5" />
            {t('operation.results.download')}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border-2 border-border-default px-6 py-4 font-semibold text-text-primary transition-all hover:bg-gray-50 dark:hover:bg-gray-850"
          >
            {t('operation.results.compressMore')}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  valueClassName = 'text-text-primary',
}: {
  value: string;
  label: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-800/50">
      <div className={`mb-1 text-lg font-bold ${valueClassName}`}>{value}</div>
      <div className="text-xs text-text-secondary">{label}</div>
    </div>
  );
}
