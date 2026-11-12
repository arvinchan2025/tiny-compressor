'use client';
import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const PdfCompressor = dynamic(
  () => import('@/components/compressor/PDFCompressor/PdfCompressor'),
  {
    loading: () => (
      <div className="card-glass p-12">
        <LoadingSpinner/>
      </div>
    ),
    ssr: false // PDF 压缩是纯客户端功能
  }
);

export function PDFOperationSection(props: any) {
  return (
    <div className="section-subtle py-16">
      <StandardContainer variant="content" size="lg" center>
        <div className="max-w-4xl mx-auto">
          <PdfCompressor
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