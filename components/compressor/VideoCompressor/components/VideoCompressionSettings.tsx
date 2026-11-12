
import { VIDEO_PRESETS } from '@/lib/video-processing/presets';

type Quality = 'low' | 'medium' | 'high';
type Resolution = 'keep' | '720p' | '480p' | '360p';
type CustomResolution = 'keep' | '1080p' | '720p' | '480p' | '360p';
type FfmpegQuality = Quality | 'custom';
type Codec = 'h264' | 'h265' | 'vp9';
type Engine = 'simple' | 'ffmpeg';

type TFunction = (
  key: string,
  params?: Record<string, string | number>,
) => string;

interface Props {
  t: TFunction;

  isAdvancedMode: boolean;

  compressionEngine: Engine;
  setCompressionEngine: (value: Engine) => void;

  quality: Quality;
  setQuality: (value: Quality) => void;

  resolution: Resolution;
  setResolution: (value: Resolution) => void;

  ffmpegQuality: FfmpegQuality;
  setFfmpegQuality: (value: FfmpegQuality) => void;

  ffmpegUseCustom: boolean;
  setFfmpegUseCustom: (value: boolean) => void;

  customResolution: CustomResolution;
  setCustomResolution: (value: CustomResolution) => void;

  customBitrate: number;
  setCustomBitrate: (value: number) => void;

  customFps: number;
  setCustomFps: (value: number) => void;

  customCodec: Codec;
  setCustomCodec: (value: Codec) => void;

  removeAudio: boolean;
  setRemoveAudio: (value: boolean) => void;
}

export default function VideoCompressionSettings({
  t,
  isAdvancedMode,
  compressionEngine,
  setCompressionEngine,
  quality,
  setQuality,
  resolution,
  setResolution,
  ffmpegQuality,
  setFfmpegQuality,
  ffmpegUseCustom,
  setFfmpegUseCustom,
  customResolution,
  setCustomResolution,
  customBitrate,
  setCustomBitrate,
  customFps,
  setCustomFps,
  customCodec,
  setCustomCodec,
  removeAudio,
  setRemoveAudio,
}: Props) {
  if (!isAdvancedMode) return null;

  return (
    <div className="card-glass p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {t('operation.settings.advancedTitle')}
      </h3>

      {/* Compression engine */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('operation.settings.compressionEngine')}
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setCompressionEngine('simple')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              compressionEngine === 'simple'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">⚡</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {t('operation.settings.simpleCompression')}
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('operation.settings.simpleCompressionDesc')}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCompressionEngine('ffmpeg')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              compressionEngine === 'ffmpeg'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🔧</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {t('operation.settings.ffmpegCompression')}
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('operation.settings.ffmpegCompressionDesc')}
            </div>
          </button>
        </div>

        {compressionEngine === 'ffmpeg' && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ {t('operation.settings.ffmpegWarning')}
            </p>
          </div>
        )}
      </div>

      {/* Simple settings */}
      {compressionEngine === 'simple' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('operation.settings.quality')}
            </label>

            <select
              value={quality}
              onChange={(event) =>
                setQuality(event.target.value as Quality)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="low">{t('operation.settings.low')}</option>
              <option value="medium">{t('operation.settings.medium')}</option>
              <option value="high">{t('operation.settings.high')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('operation.settings.resolution')}
            </label>

            <select
              value={resolution}
              onChange={(event) =>
                setResolution(event.target.value as Resolution)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="keep">
                {t('operation.settings.resolutionKeep')}
              </option>
              <option value="720p">
                {t('operation.settings.resolution720p')}
              </option>
              <option value="480p">
                {t('operation.settings.resolution480p')}
              </option>
              <option value="360p">
                {t('operation.settings.resolution360p')}
              </option>
            </select>
          </div>
        </div>
      )}

      {/* FFmpeg settings */}
      {compressionEngine === 'ffmpeg' && (
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
            {t('operation.settings.qualityLabel') || 'Quality Preset'}
          </h4>

          {/* Preset / Custom */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFfmpegUseCustom(false)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !ffmpegUseCustom
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t('operation.settings.presets')}
            </button>

            <button
              type="button"
              onClick={() => setFfmpegUseCustom(true)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                ffmpegUseCustom
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t('operation.settings.custom')}
            </button>
          </div>

          {/* Presets */}
          {!ffmpegUseCustom && (
            <div className="grid gap-3">
              {Object.entries(VIDEO_PRESETS).map(([key, preset]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() =>
                    setFfmpegQuality(key as FfmpegQuality)
                  }
                  className={`p-4 rounded-lg border-2 transition-all text-left group ${
                    ffmpegQuality === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {t(`operation.settings.${key}`) || preset.name}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t(`operation.settings.${key}Desc`) || preset.description}
                  </div>

                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    {t('operation.settings.estimatedReduction', {
                      ratio: Math.round(preset.estimatedRatio * 100),
                    }) ||
                      `Estimated size reduction: ${Math.round(
                        preset.estimatedRatio * 100,
                      )}%`}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Custom options */}
          {ffmpegUseCustom && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('operation.settings.resolution')}
                  </label>

                  <select
                    value={customResolution}
                    onChange={(event) =>
                      setCustomResolution(
                        event.target.value as CustomResolution,
                      )
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="keep">
                      {t('operation.settings.resolutionKeep')}
                    </option>
                    <option value="1080p">
                      {t('operation.settings.resolution1080p')}
                    </option>
                    <option value="720p">
                      {t('operation.settings.resolution720p')}
                    </option>
                    <option value="480p">
                      {t('operation.settings.resolution480p')}
                    </option>
                    <option value="360p">
                      {t('operation.settings.resolution360p')}
                    </option>
                  </select>
                </div>

                {/* Codec */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('operation.settings.codec')}
                  </label>

                  <select
                    value={customCodec}
                    onChange={(event) =>
                      setCustomCodec(event.target.value as Codec)
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="h264">
                      {t('operation.settings.codecH264')}
                    </option>
                    <option value="h265">
                      {t('operation.settings.codecH265')}
                    </option>
                    <option value="vp9">
                      {t('operation.settings.codecVP9')}
                    </option>
                  </select>
                </div>

                {/* Bitrate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('operation.settings.bitrate')}:{' '}
                    {t('operation.settings.bitrateValue', {
                      value: customBitrate,
                    })}
                  </label>

                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={customBitrate}
                    onChange={(event) =>
                      setCustomBitrate(
                        Number.parseInt(event.target.value, 10),
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                  />

                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>500 Kbps</span>
                    <span>5000 Kbps</span>
                  </div>
                </div>

                {/* FPS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('operation.settings.frameRate')}:{' '}
                    {t('operation.settings.frameRateValue', {
                      value: customFps,
                    })}
                  </label>

                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={customFps}
                    onChange={(event) =>
                      setCustomFps(
                        Number.parseInt(event.target.value, 10),
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                  />

                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>15 FPS</span>
                    <span>60 FPS</span>
                  </div>
                </div>
              </div>

              {/* Remove audio */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    {t('operation.settings.removeAudio')}
                  </label>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t('operation.settings.removeAudioDesc')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRemoveAudio(!removeAudio)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    removeAudio
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={removeAudio}
                  aria-label={t('operation.settings.removeAudio')}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      removeAudio ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ {t('operation.settings.ffmpegDownloadNote')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
