import ProgressIndicator from '@/components/shared/ProgressIndicator';
import { Translate } from '../types';

interface Props {
  progress: number;
  format: string;
  t: Translate;
}

export default function CompressorProgress({ progress, format, t }: Props) {
  return (
    <div className="card-glass p-6 sm:p-8">
      <ProgressIndicator
        progress={progress}
        title={t('operation.status.processing', { progress })}
        subtitle={t('operation.progress.compressing', {
          format: format.toUpperCase(),
        })}
        accentColor="blue"
      />
    </div>
  );
}
