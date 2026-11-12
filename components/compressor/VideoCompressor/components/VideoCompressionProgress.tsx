"use client";
import {motion} from 'framer-motion';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import React from "react";

interface Props {
  t: (key: string, params?: Record<string, string | number>) => string;
  progress: number;
}

export default function VideoCompressionProgress(props: any) {
  const {t, progress, ffmpegLoadProgress, isLoadingFFmpeg} = props;
  return (
    <motion.div
      className="card-glass p-8"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      data-state="processing"
    >
      {isLoadingFFmpeg
        ? <div className="text-center py-12">
          <div
            className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"/>
          <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
            {t('operation.progress.loadingEngine')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('operation.progress.engineInfo')}
          </p>
          <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{width: `${ffmpegLoadProgress}%`}}
            />
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
            {ffmpegLoadProgress}%
          </p>
        </div>
        : <>
          <ProgressIndicator
            title={t('operation.progress.compressing')}
            subtitle={`Processing... ${Math.round(progress)}%`}
            progress={progress}
            accentColor="blue"
          />
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            {t('operation.info.processingNative')}
          </p>
        </>
      }
    </motion.div>
  );
}
