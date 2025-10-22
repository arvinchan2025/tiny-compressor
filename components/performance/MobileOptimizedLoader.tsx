'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface MobileOptimizedLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export default function MobileOptimizedLoader({ 
  children, 
  fallback,
  delay = 100 
}: MobileOptimizedLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 移动端优化的加载延迟
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isLoaded) {
    return fallback || (
      <div className="flex items-center justify-center p-4 min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
