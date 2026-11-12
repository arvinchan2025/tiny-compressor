import CustomToggle from "./CustomToggle";


export default function KeepMetadataToggle({settings, onSettingsChange, t}: any) {
  return (
    <CustomToggle
      checked={settings.keepMetadata}
      onChange={() =>
        onSettingsChange((previous: any) => ({
          ...previous,
          keepMetadata: !previous.keepMetadata,
        }))
      }
      label={t('operation.settings.keepMetadata')}
      description={t('operation.settings.metadataDesc')}
    />
  )
}