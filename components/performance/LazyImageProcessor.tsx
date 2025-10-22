'use client';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// 懒加载图片处理组件
const ImageProcessor = lazy(() => import('@/components/compressor/SingleFileCompressor'));
const VideoProcessor = lazy(() => import('@/components/compressor/SingleFileVideoCompressor'));
const PdfProcessor = lazy(() => import('@/components/compressor/SingleFilePdfCompressor'));

interface LazyImageProcessorProps {
  format: string;
  locale: string;
  onComplete?: (result: any) => void;
  onReset?: () => void;
}

export default function LazyImageProcessor({ format, locale, onComplete, onReset }: LazyImageProcessorProps) {
  const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Loading processor...</span>
    </div>
  );

  const renderProcessor = () => {
    switch (format) {
      case 'video':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <VideoProcessor
              locale={locale as any}
              onComplete={onComplete}
              onReset={onReset}
            />
          </Suspense>
        );
      case 'pdf':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PdfProcessor
              locale={locale as any}
              onComplete={onComplete}
              onReset={onReset}
            />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ImageProcessor
              locale={locale as any}
              format={format}
              onComplete={onComplete}
              onReset={onReset}
            />
          </Suspense>
        );
    }
  };

  return renderProcessor();
}
