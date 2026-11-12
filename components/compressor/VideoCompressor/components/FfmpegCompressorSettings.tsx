
'use client';

import React from 'react';

type Quality = 'low' | 'medium' | 'high' | 'custom';

type Resolution =
  | 'keep'
  | '1080p'
  | '720p'
  | '480p'
  | '360p';

type Codec = 'h264' | 'h265' | 'vp9';

type TFunction = (
  key: string,
  params?: Record<string, string | number>,
) => string;

interface Props {
  quality: Quality;
  setQuality: (value: Quality) => void;

  resolution: Resolution;
  setResolution: (value: Resolution) => void;

  bitrate: number;
  setBitrate: (value: number) => void;

  fps: number;
  setFps: (value: number) => void;

  codec: Codec;
  setCodec: (value: Codec) => void;

  removeAudio: boolean;
  setRemoveAudio: (value: boolean) => void;

  t: TFunction;
  disabled?: boolean;
}

const QUALITY_OPTIONS: {
  value: Quality;
  label: string;
  description: string;
}[] = [
  {
    value: 'low',
    label: 'Low',
    description: 'Smaller file size',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Balanced quality and size',
  },
  {
    value: 'high',
    label: 'High',
    description: 'Better video quality',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Configure encoding parameters',
  },
];

const RESOLUTION_OPTIONS: {
  value: Resolution;
  label: string;
}[] = [
  { value: 'keep', label: 'Original' },
  { value: '1080p', label: '1080p' },
  { value: '720p', label: '720p' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
];

const CODEC_OPTIONS: {
  value: Codec;
  label: string;
  description: string;
}[] = [
  {
    value: 'h264',
    label: 'H.264',
    description: 'Widely compatible',
  },
  {
    value: 'h265',
    label: 'H.265 / HEVC',
    description: 'Better compression efficiency',
  },
  {
    value: 'vp9',
    label: 'VP9',
    description: 'Web-oriented encoding',
  },
];

const BITRATE_OPTIONS = [
  { value: 500, label: '500 Kbps' },
  { value: 1000, label: '1 Mbps' },
  { value: 1500, label: '1.5 Mbps' },
  { value: 2000, label: '2 Mbps' },
  { value: 3000, label: '3 Mbps' },
  { value: 5000, label: '5 Mbps' },
  { value: 8000, label: '8 Mbps' },
];

const FPS_OPTIONS = [
  { value: 15, label: '15 FPS' },
  { value: 24, label: '24 FPS' },
  { value: 25, label: '25 FPS' },
  { value: 30, label: '30 FPS' },
  { value: 50, label: '50 FPS' },
  { value: 60, label: '60 FPS' },
];

export default function FfmpegCompressionSettings({
  quality,
  setQuality,
  resolution,
  setResolution,
  bitrate,
  setBitrate,
  fps,
  setFps,
  codec,
  setCodec,
  removeAudio,
  setRemoveAudio,
  t,
  disabled = false,
}: Props) {
  const isCustom = quality === 'custom';

  return (
    <div className="space-y-6">
      {/* Quality */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.quality.title')}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('settings.quality.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUALITY_OPTIONS.map((option) => {
            const selected = quality === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() => setQuality(option.value)}
                aria-pressed={selected}
                className={`
                  rounded-lg border p-3 text-left transition-colors
                  disabled:cursor-not-allowed disabled:opacity-50
                  ${
                    selected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t(`settings.quality.${option.value}`)}
                  </span>

                  {selected && (
                    <span
                      className="text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t(`settings.quality.${option.value}Description`)}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Custom settings */}
      {isCustom && (
        <section className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t('settings.advanced.title')}
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('settings.advanced.description')}
            </p>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <label
              htmlFor="ffmpeg-resolution"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('settings.resolution')}
            </label>

            <select
              id="ffmpeg-resolution"
              value={resolution}
              disabled={disabled}
              onChange={(event) =>
                setResolution(event.target.value as Resolution)
              }
              className="
                w-full rounded-lg border border-gray-300 bg-white
                px-3 py-2 text-sm text-gray-900
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                disabled:cursor-not-allowed disabled:opacity-50
                dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
              "
            >
              {RESOLUTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(`settings.resolutionOptions.${option.value}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Bitrate */}
          <div className="space-y-2">
            <label
              htmlFor="ffmpeg-bitrate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('settings.bitrate')}
            </label>

            <select
              id="ffmpeg-bitrate"
              value={bitrate}
              disabled={disabled}
              onChange={(event) =>
                setBitrate(Number(event.target.value))
              }
              className="
                w-full rounded-lg border border-gray-300 bg-white
                px-3 py-2 text-sm text-gray-900
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                disabled:cursor-not-allowed disabled:opacity-50
                dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
              "
            >
              {BITRATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('settings.bitrateDescription')}
            </p>
          </div>

          {/* FPS */}
          <div className="space-y-2">
            <label
              htmlFor="ffmpeg-fps"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('settings.fps')}
            </label>

            <select
              id="ffmpeg-fps"
              value={fps}
              disabled={disabled}
              onChange={(event) =>
                setFps(Number(event.target.value))
              }
              className="
                w-full rounded-lg border border-gray-300 bg-white
                px-3 py-2 text-sm text-gray-900
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                disabled:cursor-not-allowed disabled:opacity-50
                dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
              "
            >
              {FPS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Codec */}
          <div className="space-y-2">
            <label
              htmlFor="ffmpeg-codec"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('settings.codec')}
            </label>

            <select
              id="ffmpeg-codec"
              value={codec}
              disabled={disabled}
              onChange={(event) =>
                setCodec(event.target.value as Codec)
              }
              className="
                w-full rounded-lg border border-gray-300 bg-white
                px-3 py-2 text-sm text-gray-900
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                disabled:cursor-not-allowed disabled:opacity-50
                dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
              "
            >
              {CODEC_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {t(`settings.codecOptions.${option.value}`)}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('settings.codecDescription')}
            </p>
          </div>

          {/* Remove audio */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={removeAudio}
              disabled={disabled}
              onChange={(event) =>
                setRemoveAudio(event.target.checked)
              }
              className="
                mt-0.5 h-4 w-4 rounded border-gray-300
                text-blue-600 focus:ring-blue-500
                disabled:cursor-not-allowed
              "
            />

            <span>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.removeAudio')}
              </span>

              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                {t('settings.removeAudioDescription')}
              </span>
            </span>
          </label>
        </section>
      )}
    </div>
  );
}
