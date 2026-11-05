'use client';
import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const UnifiedConversionManager = dynamic(
  () => import('@/components/converter/components/UnifiedConversionManager'),
  {
    loading: () => (
      <div className="card-glass p-8">
        <LoadingSpinner/>
      </div>
    ),
    ssr: false
  }
);

export function ConverterOperationSection({sourceFormat, targetFormat, locale}: any) {
  return (
    <section
      // initial={{opacity: 0, y: 30}}
      // animate={{opacity: 1, y: 0}}
      // transition={{duration: 0.6, delay: 0.2}}
      className="py-8"
    >
      <StandardContainer variant="page" size="lg" center>
        <UnifiedConversionManager
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          locale={locale}
          maxFiles={10}
          onConversionComplete={(results) => {
            // 转换完成回调
            console.log('Conversion completed:', results);
          }}
          onError={(error) => {
            console.error('Conversion error:', error);
          }}
        />
      </StandardContainer>
    </section>
  )
}