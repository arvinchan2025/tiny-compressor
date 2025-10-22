'use client';

import { useEffect } from 'react';

export default function MobileCriticalPath() {
  useEffect(() => {
    // 移动端关键路径优化
    const optimizeMobilePerformance = () => {
      // 1. 预连接关键域名
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // 2. 预加载关键字体
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);

      // 3. 移动端视口优化
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        );
      }

      // 4. 移动端触摸优化
      document.documentElement.style.touchAction = 'manipulation';
      document.documentElement.style.webkitTouchCallout = 'none';
      document.documentElement.style.webkitUserSelect = 'none';
      document.documentElement.style.userSelect = 'none';
    };

    // 立即执行关键路径优化
    optimizeMobilePerformance();

    // 5. 移动端网络状态检测
    const handleNetworkChange = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // 慢网络时减少动画和效果
          document.documentElement.classList.add('slow-network');
        }
      }
    };

    // 监听网络变化
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', handleNetworkChange);
      handleNetworkChange(); // 初始检测
    }

    return () => {
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', handleNetworkChange);
      }
    };
  }, []);

  return null;
}
