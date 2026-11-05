'use client';
import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const SimpleVideoCompressor = dynamic(
  () => import('@/components/compressor/SimpleVideoCompressor'),
  {
    ssr: false,
    loading: () => (
      <div className="card-glass p-12">
        <LoadingSpinner />
      </div>
    )
  }
);

export function VideoOperationSection({format, locale, maxFiles}: any) {
  return (
    <section
      // initial={{opacity: 0, y: 30}}
      // animate={{opacity: 1, y: 0}}
      // transition={{duration: 0.6, delay: 0.5}}
      className="section-default relative py-16"
      // data-compressor-component
    >
      <StandardContainer variant="content" size="md" center>
        <SimpleVideoCompressor locale={locale}/>
      </StandardContainer>
    </section>
  )
}