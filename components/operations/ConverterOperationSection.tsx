'use client';
import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ImagerConverter = dynamic(
  () => import('@/components/converter/ImageConvertor/ImageConverter'),
  {
    loading: () => (
      <div className="card-glass p-8">
        <LoadingSpinner/>
      </div>
    ),
    ssr: false
  }
);

export function ConverterOperationSection(props: any) {
  return (
    <div className="section-subtle py-16">
      <StandardContainer variant="content" size="lg" center>
        <div className="max-w-4xl mx-auto">
          <ImagerConverter
            {...props}
            onConversionComplete={(results) => {
              // 转换完成回调
              console.log('Conversion completed:', results);
            }}
            onError={(error) => {
              console.error('Conversion error:', error);
            }}
          />
        </div>
      </StandardContainer>
    </div>
)
}