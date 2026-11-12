export default function QualityField({settings, onSettingsChange, t}: any) {
  return (
    <div>
      <label className="mb-2 block text-sm text-text-secondary">
        {t('operation.settings.quality')}: {settings.quality}%
      </label>
      <input
        type="range"
        min="10"
        max="100"
        step="5"
        value={settings.quality}
        onChange={(event) =>
          onSettingsChange((previous: any) => ({
            ...previous,
            quality: Number(event.target.value),
          }))
        }
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700"
      />
      <div className="mt-1 flex justify-between text-xs text-text-secondary">
        <span>{t('operation.settings.qualityLow')}</span>
        <span>{t('operation.settings.qualityHigh')}</span>
      </div>
    </div>
  )
}