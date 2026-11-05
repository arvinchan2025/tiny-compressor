'use client';
import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const UnifiedCompressionManager = dynamic(
  () => import('@/components/compressor/components/UnifiedCompressionManager'),
  {
    loading: () => (
      <div className="card-glass p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner/>
          <p className="mt-4 text-text-secondary">Loading compression tool...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export function CompressorOperationSection({format, locale, maxFiles}: any) {
  return (
    <div className="section-subtle py-16">
      <StandardContainer variant="content" size="lg" center>
        <div className="max-w-4xl mx-auto">
          <UnifiedCompressionManager
            format={format as 'png' | 'jpeg' | 'webp' | 'avif' | 'gif' | 'bmp'}
            locale={locale}
            maxFiles={maxFiles}
            onCompressionComplete={(results) => {
              // 更新压缩结果
              // if (onDownloadAll) {
              //   onDownloadAll();
              // }
            }}
            onError={(error) => {
              console.error('Compression error:', error);
            }}
          />
        </div>
      </StandardContainer>
    </div>
  )
}