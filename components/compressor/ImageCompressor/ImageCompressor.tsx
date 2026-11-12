'use client';

import {Locale} from '@/lib/i18n';
import {CompressionResult, ImageFile} from '@/types/image';

import {useImageCompressor} from './hooks/useImageCompressor';
import {
  CompressorUpload,
  CompressorConfig,
  CompressorProgress,
  CompressorResult,
} from '@/components/compressor/components';
import {createTranslator} from "@/lib/i18n/ssr-optimization";

export interface SingleFileCompressorProps {
  locale: Locale;
  format: string;
  initialFile?: ImageFile;
  onComplete?: (result: CompressionResult) => void;
  onReset?: () => void;
}

export default function ImageCompressor(props: any) {
  const {locale, format, initialFile, onComplete, onReset, options, translations, operationTranslations} = props
  // const {t} = useTranslation(`compressors/${format}` as any, locale);
  const {t} = createTranslator(operationTranslations)
  console.log("ImageCompressor", props)

  const compressor = useImageCompressor({
    format,
    options,
    initialFile,
    onComplete,
    onReset,
    t,
  } as any);

  return (
    <div className="relative">
      {compressor.state === 'empty' && (
        <CompressorUpload
          format={format}
          t={t}
          onFileSelect={compressor.selectFile}
        />
      )}

      {compressor.state === 'config' && compressor.file && (
        <CompressorConfig
          file={compressor.file}
          format={format}
          settings={compressor.settings}
          onSettingsChange={compressor.setSettings}
          onCompress={compressor.compress}
          onReset={compressor.reset}
          t={t}
        />
      )}

      {compressor.state === 'processing' && (
        <CompressorProgress
          progress={compressor.progress}
          format={format}
          t={t}
        />
      )}

      {compressor.state === 'result' && compressor.result && (
        <CompressorResult
          result={compressor.result}
          format={format}
          quality={compressor.settings.quality}
          onDownload={compressor.download}
          onReset={compressor.reset}
          t={t}
        />
      )}

      {compressor.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="font-medium text-red-800 dark:text-red-300">Error</p>
          <p className="text-sm text-red-700 dark:text-red-400">
            {compressor.error}
          </p>
        </div>
      )}
    </div>
  );
}
