
import React from 'react';
import { Locale } from '@/lib/i18n';
import type {
  SimpleVideoFile,
  SimpleCompressionResult,
} from '@/lib/video-processing/simple-compression';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const SingleFileVideoCompressor = React.lazy(
  () => import('@/components/compressor/SingleFileVideoCompressor'),
);

type TFunction = (
  key: string,
  params?: Record<string, string | number>,
) => string;

interface Props {
  locale: Locale;
  file: SimpleVideoFile;

  quality: 'low' | 'medium' | 'high' | 'custom';
  useCustom: boolean;

  customResolution: 'keep' | '1080p' | '720p' | '480p' | '360p';
  customBitrate: number;
  customFps: number;
  customCodec: 'h264' | 'h265' | 'vp9';
  removeAudio: boolean;

  t: TFunction;

  onBack: () => void;
  onComplete: (result: any) => void;
  onReset: () => void;
}

export default function FfmpegCompressorView({
  locale,
  file,
  quality,
  useCustom,
  customResolution,
  customBitrate,
  customFps,
  customCodec,
  removeAudio,
  t,
  onBack,
  onComplete,
  onReset,
}: Props) {
  const initialFile = {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    file: file.file,
    metadata: undefined,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>

          {t('operation.actions.backToSimple') ||
            'Back to Simple Compression'}
        </button>
      </div>

      <React.Suspense fallback={<LoadingSpinner />}>
        <SingleFileVideoCompressor
          locale={locale}
          initialFile={initialFile as any}
          initialQuality={useCustom ? 'custom' : quality}
          customOptions={
            useCustom
              ? {
                  resolution: customResolution,
                  bitrate: customBitrate * 1000,
                  fps: customFps,
                  codec: customCodec,
                  removeAudio,
                } as any
              : undefined
          }
          onComplete={onComplete}
          onReset={onReset}
        />
      </React.Suspense>
    </div>
  );
}
