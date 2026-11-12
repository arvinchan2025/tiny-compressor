
'use client';

import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { ConversionResult } from '@/types/image';

import UploadArea from '@/components/shared/UploadArea';
import FileInfoCard from '@/components/shared/FileInfoCard';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ActionButtons from '@/components/shared/ActionButtons';

import { useFileConverter } from './hooks/useFileConverter';

import FormatConversionPreview from './components/FormatConversionPreview';
import ConversionSettings from './components/ConversionSettings';
import ConversionResultView from './components/ConversionResultView';

interface SingleFileConverterProps {
  locale: Locale;
  format: string;
  targetFormat: string;
  initialFile?: import('@/types/image').ImageFile;
  onComplete?: (result: ConversionResult) => void;
  onReset?: () => void;
}

export default function ImagerConverter({
  locale,
  format,
  targetFormat,
  initialFile,
  onComplete,
  onReset,
}: SingleFileConverterProps) {
  const sourceFormat = format
  const conversionModule = `${sourceFormat}-to-${targetFormat}`;

  const { t: tConverter } = useTranslation(
    `converters/${conversionModule}` as any,
    locale,
  );

  const { t: tCommon } = useTranslation(
    'common/operation' as any,
    locale,
  );

  const t = (key: string, params?: any): string => {
    const converterResult = tConverter(key, params);

    if (converterResult !== key) {
      return converterResult;
    }

    const commonResult = tCommon(key, params);

    return commonResult !== key ? commonResult : key;
  };

  const {
    state,
    file,
    isAdvancedMode,
    progress,
    result,
    error,
    quality,
    maintainQuality,

    handleFileSelect,
    handleConvert,
    handleDownload,
    handleReset,
    toggleAdvancedMode,
    toggleMaintainQuality,
    updateQuality,
  } = useFileConverter({
    sourceFormat,
    targetFormat,
    initialFile,
    onComplete,
    onReset,
  });

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Empty */}
      {state === 'empty' && (
        <div className="text-center">
          <UploadArea
            title={
              t('operation.upload.title') ||
              `Upload ${sourceFormat.toUpperCase()} File`
            }
            subtitle={
              t('operation.upload.subtitle', {
                format: sourceFormat.toUpperCase(),
              }) ||
              `Drag and drop your ${sourceFormat.toUpperCase()} file here or click to select`
            }
            buttonText={
              t('operation.upload.selectFiles') ||
              'Select File'
            }
            acceptTypes={`image/${sourceFormat}`}
            onFileSelect={handleFileSelect}
            accentColor="blue"
            maxFileSize={50}
          />
        </div>
      )}

      {/* Preview */}
      {state === 'preview' && file && (
        <div className="card-glass p-6 sm:p-8">
          <div className="space-y-6">

            <FileInfoCard
              fileName={file.name}
              fileSize={file.size}
              fileType="image"
              metadata={{
                ...(file.width && file.height
                  ? {
                      dimensions: {
                        width: file.width,
                        height: file.height,
                      },
                    }
                  : {}),
                format: sourceFormat.toUpperCase(),
              }}
              onRemove={handleReset}
              accentColor="blue"
            />

            <FormatConversionPreview
              sourceFormat={sourceFormat}
              targetFormat={targetFormat}
              t={t}
            />

            <ConversionSettings
              t={t}
              isAdvancedMode={isAdvancedMode}
              quality={quality}
              maintainQuality={maintainQuality}
              onToggleAdvanced={toggleAdvancedMode}
              onToggleMaintainQuality={toggleMaintainQuality}
              onQualityChange={updateQuality}
            />

            <ActionButtons
              buttons={[
                {
                  label:
                    t('operation.convert.start') || 'Convert',
                  onClick: handleConvert,
                  variant: 'primary',
                },
                {
                  label:
                    t('operation.actions.reset') || 'Reset',
                  onClick: handleReset,
                  variant: 'secondary',
                },
              ]}
            />

          </div>
        </div>
      )}

      {/* Converting */}
      {state === 'converting' && (
        <div className="card-glass p-6 sm:p-8 text-center">
          <ProgressIndicator
            progress={progress}
            title="Converting..."
          />
        </div>
      )}

      {/* Result */}
      {state === 'result' && result && (
        <ConversionResultView
          result={result}
          targetFormat={targetFormat}
          t={t}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
          <p className="text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

    </div>
  );
}
