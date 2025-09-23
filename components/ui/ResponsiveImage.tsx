'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getResponsiveImageSize, getResponsiveConfig } from '@/lib/responsive-utils';
import { transitions, commonVariants } from '@/lib/micro-interactions';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: {
    mobile?: { width: number; height: number };
    tablet?: { width: number; height: number };
    desktop?: { width: number; height: number };
  };
  priority?: boolean;
  quality?: number;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
}

const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(
  ({
    src,
    alt,
    sizes,
    priority = false,
    quality = 75,
    className = '',
    fallback = '/placeholder-image.jpg',
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    // 获取响应式配置
    const config = getResponsiveConfig();
    
    // 获取响应式尺寸
    const imageSize = sizes ? getResponsiveImageSize(sizes) : {
      mobile: { width: 300, height: 200 },
      tablet: { width: 500, height: 300 },
      desktop: { width: 800, height: 500 }
    };
    
    const currentSize = getResponsiveImageSize(sizes || {
      mobile: { width: 300, height: 200 },
      tablet: { width: 500, height: 300 },
      desktop: { width: 800, height: 500 }
    });
    
    // 响应式类名
    const responsiveClasses = config.deviceType === 'mobile' 
      ? 'w-full h-48 object-cover' 
      : config.deviceType === 'tablet' 
      ? 'w-full h-64 object-cover' 
      : 'w-full h-80 object-cover';
    
    const imageClasses = `
      ${responsiveClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const handleError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    const handleLoad = () => {
      setImageLoading(false);
    };

    if (imageError) {
      return (
        <motion.div
          className={`${imageClasses} bg-gray-200 flex items-center justify-center`}
          initial={commonVariants.fadeIn.initial}
          animate={commonVariants.fadeIn.animate}
          transition={transitions.standard}
        >
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">图片加载失败</div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="relative overflow-hidden rounded-lg"
        initial={commonVariants.scale.initial}
        animate={commonVariants.scale.animate}
        transition={transitions.standard}
      >
        {imageLoading && (
          <motion.div
            className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          </motion.div>
        )}
        
        <Image
          src={src}
          alt={alt}
          width={currentSize.width}
          height={currentSize.height}
          priority={priority}
          quality={quality}
          className={imageClasses}
          onError={handleError}
          onLoad={handleLoad}
          sizes={`
            (max-width: 768px) 100vw,
            (max-width: 1024px) 50vw,
            33vw
          `}
        />
      </motion.div>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';

export default ResponsiveImage;
