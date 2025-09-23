/**
 * 响应式设计工具类
 * 提供统一的断点和响应式设计工具
 */

// 断点定义
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 媒体查询工具
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
  // 移动端优先的媒体查询
  mobile: `(max-width: ${breakpoints.md})`,
  tablet: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `(min-width: ${breakpoints.lg})`,
} as const;

// 响应式网格工具
export const gridConfig = {
  // 移动端网格
  mobile: {
    columns: 1,
    gap: '1rem',
    padding: '1rem',
  },
  // 平板网格
  tablet: {
    columns: 2,
    gap: '1.5rem',
    padding: '1.5rem',
  },
  // 桌面网格
  desktop: {
    columns: 3,
    gap: '2rem',
    padding: '2rem',
  },
  // 大屏幕网格
  large: {
    columns: 4,
    gap: '2rem',
    padding: '2rem',
  },
} as const;

// 响应式字体大小
export const typography = {
  // 标题字体
  h1: {
    mobile: 'text-3xl',
    tablet: 'text-4xl',
    desktop: 'text-5xl',
    large: 'text-6xl',
  },
  h2: {
    mobile: 'text-2xl',
    tablet: 'text-3xl',
    desktop: 'text-4xl',
    large: 'text-5xl',
  },
  h3: {
    mobile: 'text-xl',
    tablet: 'text-2xl',
    desktop: 'text-3xl',
    large: 'text-4xl',
  },
  // 正文字体
  body: {
    mobile: 'text-sm',
    tablet: 'text-base',
    desktop: 'text-lg',
    large: 'text-xl',
  },
  // 小字体
  small: {
    mobile: 'text-xs',
    tablet: 'text-sm',
    desktop: 'text-base',
    large: 'text-lg',
  },
} as const;

// 响应式间距
export const spacing = {
  // 容器间距
  container: {
    mobile: 'px-4 py-8',
    tablet: 'px-6 py-12',
    desktop: 'px-8 py-16',
    large: 'px-12 py-20',
  },
  // 组件间距
  section: {
    mobile: 'py-8',
    tablet: 'py-12',
    desktop: 'py-16',
    large: 'py-20',
  },
  // 卡片间距
  card: {
    mobile: 'p-4',
    tablet: 'p-6',
    desktop: 'p-8',
    large: 'p-10',
  },
} as const;

// 响应式工具函数
export const responsive = {
  // 获取响应式类名
  getResponsiveClass: (config: Record<string, string>, breakpoint?: string) => {
    if (breakpoint && config[breakpoint]) {
      return config[breakpoint];
    }
    // 返回移动端优先的类名
    return config['mobile'] || '';
  },

  // 生成响应式网格类名
  getGridClass: (columns?: number) => {
    if (!columns) {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
    
    const gridMap: Record<number, string> = {
      1: 'grid grid-cols-1',
      2: 'grid grid-cols-1 md:grid-cols-2',
      3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    };
    
    return gridMap[columns] || gridMap[4];
  },

  // 生成响应式间距类名
  getSpacingClass: (type: 'container' | 'section' | 'card', breakpoint?: string) => {
    const config = spacing[type];
    return responsive.getResponsiveClass(config, breakpoint);
  },

  // 生成响应式字体类名
  getTypographyClass: (type: keyof typeof typography, breakpoint?: string) => {
    const config = typography[type];
    return responsive.getResponsiveClass(config, breakpoint);
  },

  // 检测设备类型
  getDeviceType: (width: number) => {
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    if (width < 1536) return 'desktop';
    return 'large';
  },

  // 生成响应式图片类名
  getImageClass: (aspectRatio: 'square' | 'video' | 'wide' | 'tall' = 'video') => {
    const aspectMap = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[16/9]',
      tall: 'aspect-[3/4]',
    };
    
    return `${aspectMap[aspectRatio]} w-full h-auto object-cover`;
  },

  // 生成响应式按钮类名
  getButtonClass: (size: 'sm' | 'md' | 'lg' = 'md', fullWidth = false) => {
    const sizeMap = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    const widthClass = fullWidth ? 'w-full' : 'w-auto';
    return `${sizeMap[size]} ${widthClass} rounded-lg font-medium transition-all duration-200`;
  },
};

// 响应式Hook（用于客户端组件）
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const deviceType = responsive.getDeviceType(dimensions.width);
  
  return {
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop' || deviceType === 'large',
    deviceType,
    width: dimensions.width,
    height: dimensions.height,
  };
};

// 需要导入React hooks
import { useState, useEffect } from 'react';

