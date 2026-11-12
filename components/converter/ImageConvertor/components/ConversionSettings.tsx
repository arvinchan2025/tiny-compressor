
interface Props {
  t: (key: string) => string;
  isAdvancedMode: boolean;
  quality: number;
  maintainQuality: boolean;
  onToggleAdvanced: () => void;
  onToggleMaintainQuality: () => void;
  onQualityChange: (value: number) => void;
}

export default function ConversionSettings({
  t,
  isAdvancedMode,
  quality,
  maintainQuality,
  onToggleAdvanced,
  onToggleMaintainQuality,
  onQualityChange,
}: Props) {
  return (
    <>
      {isAdvancedMode && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            {t('operation.settings.advancedTitle') ||
              'Advanced Options'}
          </h4>

          <div>
            <label className="text-sm text-text-secondary block mb-2">
              {t('operation.settings.quality') || 'Quality'}: {quality}%
            </label>

            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={quality}
              onChange={(event) =>
                onQualityChange(Number(event.target.value))
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />

            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>
                {t('operation.settings.qualityLow') ||
                  '10% - Smaller file'}
              </span>

              <span>
                {t('operation.settings.qualityHigh') ||
                  '100% - Best quality'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div>
              <label className="text-sm font-medium text-text-primary cursor-pointer">
                {t('operation.settings.maintainQuality') ||
                  'Maintain Quality'}
              </label>

              <p className="text-xs text-text-secondary mt-0.5">
                {t('operation.settings.maintainQualityDesc') ||
                  'Keep original image quality during conversion'}
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleMaintainQuality}
              aria-pressed={maintainQuality}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                maintainQuality
                  ? 'bg-purple-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  maintainQuality
                    ? 'translate-x-6'
                    : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-text-primary">
          {t('operation.settings.advanced') || 'Advanced'}
        </span>

        <button
          type="button"
          onClick={onToggleAdvanced}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            isAdvancedMode
              ? 'bg-blue-600'
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={isAdvancedMode}
          aria-label="Toggle advanced settings"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
              isAdvancedMode
                ? 'translate-x-6'
                : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </>
  );
}
