'use client';
import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const SingleFilePdfCompressor = dynamic(
  () => import('@/components/compressor/SingleFilePdfCompressor'),
  {
    loading: () => (
      <div className="card-glass p-12">
        <LoadingSpinner />
      </div>
    ),
    ssr: false // PDF 压缩是纯客户端功能
  }
);

export function PDFOperationSection({format, locale, maxFiles}: any) {
  return (
    <section
      // initial={{opacity: 0, y: 30}}
      // animate={{opacity: 1, y: 0}}
      // transition={{duration: 0.6, delay: 0.5}}
      className="section-default relative py-16"
      // data-compressor-component
    >
      <StandardContainer variant="content" size="lg" center>
        <SingleFilePdfCompressor locale={locale}/>
      </StandardContainer>
    </section>
  )
}