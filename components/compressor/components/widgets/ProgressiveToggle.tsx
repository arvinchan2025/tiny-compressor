import CustomToggle from "./CustomToggle";


export default function ProgressiveToggle({settings, onSettingsChange, t}: any) {
  return (
    <CustomToggle
      checked={settings.progressive}
      onChange={() =>
        onSettingsChange((previous: any) => ({
          ...previous,
          progressive: !previous.progressive,
        }))
      }
      label={t('operation.settings.progressive')}
      description={t('operation.settings.progressiveDesc')}
    />
  )
}