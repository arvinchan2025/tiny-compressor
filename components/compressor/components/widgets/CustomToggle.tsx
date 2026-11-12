export default function CustomToggle({checked, onChange, label, description,}: any) {
  return (
    <div
      className="flex items-center justify-between rounded-lg bg-gray-50 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800">
      <div>
        <label className="cursor-pointer text-sm font-medium text-text-primary">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}