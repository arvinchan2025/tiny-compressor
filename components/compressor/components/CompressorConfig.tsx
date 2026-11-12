'use client';

import {useState} from 'react';
import {CompressionOptions, ImageFile} from '@/types/image';
import FileInfoCard from '@/components/shared/FileInfoCard';
import ActionButtons from '@/components/shared/ActionButtons';
import {AdvancedToggle, KeepMetadataToggle, ProgressiveToggle, QualityField, ScaleImageToggle} from "./widgets";

interface Props {
  file: ImageFile;
  format: string;
  settings: CompressionOptions;
  onSettingsChange: (next: CompressionOptions | ((previous: CompressionOptions) => CompressionOptions)) => void;
  onCompress: () => void | Promise<void>;
  onReset: () => void;
  t: any;
}

const fields = {
  'quality': QualityField,
  'keepMetadata': KeepMetadataToggle,
  'progressive': ProgressiveToggle,
}

export default function CompressorConfig({
                                           file,
                                           format,
                                           settings,
                                           onSettingsChange,
                                           onCompress,
                                           onReset,
                                           t,
                                         }: any) {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  return (
    <div className="card-glass p-6 sm:p-8">
      <div className="space-y-6">
        <FileInfoCard
          fileName={file.name}
          fileSize={file.size}
          fileType="image"
          metadata={{
            ...(file.width && file.height
              ? {dimensions: {width: file.width, height: file.height}}
              : {}),
            format: format.toUpperCase(),
          }}
          onRemove={onReset}
          accentColor="blue"
        />
        <AdvancedToggle
          isAdvancedMode={isAdvancedMode}
          setIsAdvancedMode={setIsAdvancedMode}
          t={t}
        />
        {isAdvancedMode && (
          <div
            className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h4 className="mb-4 text-lg font-semibold text-text-primary">
              {t('operation.settings.advancedTitle')}
            </h4>

            <QualityField
              settings={settings}
              onSettingsChange={onSettingsChange}
              t={t}
            />
            <KeepMetadataToggle
              settings={settings}
              onSettingsChange={onSettingsChange}
              t={t}
            />
            {format === 'jpeg' && (
              <ProgressiveToggle
                settings={settings}
                onSettingsChange={onSettingsChange}
                t={t}
              />
            )}
            {format === 'pdf' && (
              <ScaleImageToggle
                settings={settings}
                onSettingsChange={onSettingsChange}
                t={t}
              />
            )}
          </div>
        )}

        <ActionButtons
          buttons={[
            {
              label: t('operation.actions.compress'),
              onClick: onCompress,
              variant: 'primary',
            },
            {
              label: t('operation.actions.cancel'),
              onClick: onReset,
              variant: 'secondary',
            },
          ]}
        />
      </div>
    </div>
  );
}
