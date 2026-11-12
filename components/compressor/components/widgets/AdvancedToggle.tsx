export default function AdvancedToggle({isAdvancedMode, setIsAdvancedMode, t}: any) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <span className="text-sm font-medium text-text-primary">
            {t('operation.settings.advanced') || 'Advanced'}
          </span>
      <button
        type="button"
        onClick={() => setIsAdvancedMode((previous: any) => !previous)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          isAdvancedMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={isAdvancedMode}
        aria-label="Toggle advanced settings"
      >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                isAdvancedMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
      </button>
    </div>
  )
}