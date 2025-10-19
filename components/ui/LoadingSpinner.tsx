'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        {/* 外圈旋转动画 */}
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        
        {/* 内圈反向旋转动画 */}
        <div 
          className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-b-primary/60 rounded-full animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
        
        {/* 中心点脉冲动画 */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-subtle" />
      </div>
    </div>
  );
}

