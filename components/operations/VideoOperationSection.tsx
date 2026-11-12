'use client';
import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const VideoCompressor = dynamic(
  () => import('@/components/compressor/VideoCompressor/VideoCompressor'),
  {
    ssr: false,
    loading: () => (
      <div className="card-glass p-12">
        <LoadingSpinner/>
      </div>
    )
  }
);

export function VideoOperationSection(props: any) {
  return (
    <div className="section-subtle py-16">
      <StandardContainer variant="content" size="lg" center>
        <div className="max-w-4xl mx-auto">
          <VideoCompressor
            {...props}
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