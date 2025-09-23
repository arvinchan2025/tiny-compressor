/**
 * 响应式工具函数
 * 提供断点检测、设备类型判断等响应式功能
 */

// 断点定义
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof breakpoints;

// 设备类型
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 屏幕方向
export type ScreenOrientation = 'portrait' | 'landscape';

// 响应式配置
export interface ResponsiveConfig {
  deviceType: DeviceType;
  breakpoint: Breakpoint;
  orientation: ScreenOrientation;
  isTouch: boolean;
  isRetina: boolean;
  isDarkMode: boolean;
}

// 获取当前断点
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'xs';
};

// 获取设备类型
export const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// 获取屏幕方向
export const getScreenOrientation = (): ScreenOrientation => {
  if (typeof window === 'undefined') return 'landscape';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// 检测是否为触摸设备
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         (navigator as any).msMaxTouchPoints > 0;
};

// 检测是否为视网膜屏
export const isRetinaDisplay = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.devicePixelRatio > 1;
};

// 检测是否为深色模式
export const isDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// 获取完整响应式配置
export const getResponsiveConfig = (): ResponsiveConfig => {
  return {
    deviceType: getDeviceType(),
    breakpoint: getCurrentBreakpoint(),
    orientation: getScreenOrientation(),
    isTouch: isTouchDevice(),
    isRetina: isRetinaDisplay(),
    isDarkMode: isDarkMode(),
  };
};

// 断点比较
export const isBreakpointUp = (breakpoint: Breakpoint): boolean => {
  const current = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(current);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  return currentIndex >= targetIndex;
};

export const isBreakpointDown = (breakpoint: Breakpoint): boolean => {
  const current = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(current);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  return currentIndex <= targetIndex;
};

// 响应式类名生成
export const getResponsiveClasses = (config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string => {
  const classes: string[] = [];
  
  // 设备类型类名
  if (config.mobile) classes.push(`mobile:${config.mobile}`);
  if (config.tablet) classes.push(`tablet:${config.tablet}`);
  if (config.desktop) classes.push(`desktop:${config.desktop}`);
  
  // 断点类名
  if (config.xs) classes.push(`xs:${config.xs}`);
  if (config.sm) classes.push(`sm:${config.sm}`);
  if (config.md) classes.push(`md:${config.md}`);
  if (config.lg) classes.push(`lg:${config.lg}`);
  if (config.xl) classes.push(`xl:${config.xl}`);
  if (config['2xl']) classes.push(`2xl:${config['2xl']}`);
  
  return classes.join(' ');
};

// 响应式间距
export const getResponsiveSpacing = (config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const spacing = getResponsiveConfig();
  
  switch (spacing.deviceType) {
    case 'mobile':
      return config.mobile || config.tablet || config.desktop || '';
    case 'tablet':
      return config.tablet || config.desktop || config.mobile || '';
    case 'desktop':
      return config.desktop || config.tablet || config.mobile || '';
    default:
      return '';
  }
};

// 响应式网格列数
export const getResponsiveGridCols = (config: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string => {
  const deviceType = getDeviceType();
  
  let cols: number;
  switch (deviceType) {
    case 'mobile':
      cols = config.mobile || 1;
      break;
    case 'tablet':
      cols = config.tablet || 2;
      break;
    case 'desktop':
      cols = config.desktop || 3;
      break;
    default:
      cols = 3;
  }
  
  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };
  
  return gridColsMap[cols] || 'grid-cols-1';
};

// 响应式字体大小
export const getResponsiveFontSize = (config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return config.mobile || 'text-sm';
    case 'tablet':
      return config.tablet || 'text-base';
    case 'desktop':
      return config.desktop || 'text-lg';
    default:
      return 'text-base';
  }
};

// 响应式容器宽度
export const getResponsiveContainerWidth = (): string => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return 'w-full px-4';
    case 'tablet':
      return 'w-full max-w-4xl mx-auto px-6';
    case 'desktop':
      return 'w-full max-w-6xl mx-auto px-8';
    default:
      return 'w-full max-w-6xl mx-auto px-8';
  }
};

// 响应式图片尺寸
export const getResponsiveImageSize = (config: {
  mobile?: { width: number; height: number };
  tablet?: { width: number; height: number };
  desktop?: { width: number; height: number };
}): { width: number; height: number } => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return config.mobile || { width: 300, height: 200 };
    case 'tablet':
      return config.tablet || { width: 500, height: 300 };
    case 'desktop':
      return config.desktop || { width: 800, height: 500 };
    default:
      return { width: 800, height: 500 };
  }
};

// 响应式动画配置
export const getResponsiveAnimation = (config: {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}): boolean => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return config.mobile ?? true;
    case 'tablet':
      return config.tablet ?? true;
    case 'desktop':
      return config.desktop ?? true;
    default:
      return true;
  }
};

// 媒体查询工具
export const createMediaQuery = (breakpoint: Breakpoint, direction: 'up' | 'down' = 'up'): string => {
  const bp = breakpoints[breakpoint];
  return direction === 'up' 
    ? `(min-width: ${bp})` 
    : `(max-width: ${parseInt(bp) - 1}px)`;
};

// 监听断点变化
export const useBreakpointListener = (callback: (breakpoint: Breakpoint) => void) => {
  if (typeof window === 'undefined') return;
  
  const handleResize = () => {
    callback(getCurrentBreakpoint());
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
};

// 响应式Hook（用于React组件）
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'desktop' as DeviceType,
      breakpoint: 'lg' as Breakpoint,
      orientation: 'landscape' as ScreenOrientation,
      isTouch: false,
      isRetina: false,
      isDarkMode: false,
      config: getResponsiveConfig(),
    };
  }
  
  return {
    deviceType: getDeviceType(),
    breakpoint: getCurrentBreakpoint(),
    orientation: getScreenOrientation(),
    isTouch: isTouchDevice(),
    isRetina: isRetinaDisplay(),
    isDarkMode: isDarkMode(),
    config: getResponsiveConfig(),
  };
};
