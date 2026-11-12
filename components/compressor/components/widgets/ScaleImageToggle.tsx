import CustomToggle from "./CustomToggle";


export default function ScaleImageToggle({settings, onSettingsChange, t}: any) {
  return (
    <CustomToggle
      checked={settings.scaleImages}
      onChange={() =>
        onSettingsChange((previous: any) => ({
          ...previous,
          scaleImages: !previous.scaleImages,
        }))
      }
      label={t('operation.settings.progressive')}
      description={t('operation.settings.progressiveDesc')}
    />
  )
}