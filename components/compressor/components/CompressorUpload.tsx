import UploadArea from '@/components/shared/UploadArea';

interface Props {
  format: string;
  t: any;
  acceptTypes?: any;
  onFileSelect: (file: File) => void | Promise<void>;
}

export default function CompressorUpload({ format, t, onFileSelect, acceptTypes }: Props) {
  const displayFormat = format.toUpperCase();

  return (
    <div className="card-glass p-8" data-state="empty">
      <UploadArea
        title={t('operation.upload.title', { format: displayFormat })}
        subtitle={t('operation.upload.subtitle', { format: displayFormat })}
        buttonText={t('operation.upload.selectFiles', { format: displayFormat })}
        acceptTypes={acceptTypes ?? `image/${format}`}
        onFileSelect={onFileSelect}
        accentColor="blue"
      />
    </div>
  );
}
