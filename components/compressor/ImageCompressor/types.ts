import { CompressionOptions } from '@/types/image';

export type OperationState = 'empty' | 'config' | 'processing' | 'result';

export type Translate = (key: any, options?: any) => any;

export interface UseSingleFileCompressorOptions {
  format: string;
  defaultSettings?: Record<string, any>;
  initialFile?: import('@/types/image').ImageFile;
  onComplete?: (result: import('@/types/image').CompressionResult) => void;
  onReset?: () => void;
  t: Translate;
}

export type SettingsUpdater = (
  next:
    | CompressionOptions
    | ((previous: CompressionOptions) => CompressionOptions)
) => void;
