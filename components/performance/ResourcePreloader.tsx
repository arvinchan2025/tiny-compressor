'use client';

import { useEffect } from 'react';

interface ResourcePreloaderProps {
  locale: string;
}

export default function ResourcePreloader({ locale }: ResourcePreloaderProps) {
  useEffect(() => {
    // 移动端优化的预加载策略
    const preloadCriticalResources = async () => {
      // 只预加载最关键的翻译文件
      const criticalModules = ['common/ui', 'home'];
      
      for (const moduleName of criticalModules) {
        try {
          // 预加载但不等待
          import(`@/lib/i18n/translations/${locale}/${moduleName}.json`);
        } catch (error) {
          // 静默失败，不影响用户体验
        }
      }
    };

    // 移动端延迟预加载图片处理库
    const preloadImageLibs = async () => {
      try {
        // 移动端延迟预加载，减少初始加载压力
        import('browser-image-compression');
      } catch (error) {
        // 静默失败
      }
    };

    // 移动端更长的延迟，避免阻塞关键渲染路径
    const timeoutId = setTimeout(() => {
      preloadCriticalResources();
      // 图片处理库进一步延迟
      setTimeout(preloadImageLibs, 500);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [locale]);

  return null;
}
