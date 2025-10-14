/**
 * Google Analytics 工具模块
 * 提供统一的 Analytics 事件跟踪
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics 配置
export const GA_MEASUREMENT_ID = 'G-R23Y0Z9XSP';

/**
 * 页面浏览跟踪
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

/**
 * 自定义事件跟踪
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * 文件压缩事件跟踪
 */
export const trackCompressionEvent = (
  format: string,
  originalSize: number,
  compressedSize: number,
  compressionRatio: number
) => {
  trackEvent('file_compressed', 'compression', format, compressionRatio);
  
  // 额外的压缩统计
  trackEvent('compression_stats', 'performance', `${format}_size_reduction`, Math.round((originalSize - compressedSize) / originalSize * 100));
};

/**
 * 文件转换事件跟踪
 */
export const trackConversionEvent = (
  fromFormat: string,
  toFormat: string,
  fileSize: number
) => {
  trackEvent('file_converted', 'conversion', `${fromFormat}_to_${toFormat}`, fileSize);
};

/**
 * 用户交互事件跟踪
 */
export const trackUserInteraction = (action: string, element: string) => {
  trackEvent(action, 'user_interaction', element);
};

/**
 * 错误事件跟踪
 */
export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  trackEvent('error_occurred', 'error', `${errorType}_${context}`, 0);
  
  // 发送错误详情到 GA
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
    });
  }
};

/**
 * 工具使用统计
 */
export const trackToolUsage = (toolName: string, action: string) => {
  trackEvent(action, 'tool_usage', toolName);
};

/**
 * 下载事件跟踪
 */
export const trackDownload = (fileType: string, fileSize: number) => {
  trackEvent('file_downloaded', 'download', fileType, fileSize);
};

/**
 * 语言切换事件跟踪
 */
export const trackLanguageChange = (fromLang: string, toLang: string) => {
  trackEvent('language_changed', 'localization', `${fromLang}_to_${toLang}`);
};

/**
 * 主题切换事件跟踪
 */
export const trackThemeChange = (theme: 'light' | 'dark') => {
  trackEvent('theme_changed', 'ui', theme);
};

/**
 * 搜索事件跟踪
 */
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search_performed', 'search', searchTerm, resultsCount);
};

/**
 * 分享事件跟踪
 */
export const trackShare = (platform: string, contentType: string) => {
  trackEvent('content_shared', 'social', `${platform}_${contentType}`);
};

/**
 * 性能指标跟踪
 */
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent('performance_metric', 'performance', `${metric}_${unit}`, value);
};

/**
 * 用户流程跟踪
 */
export const trackUserFlow = (step: string, flowName: string) => {
  trackEvent('user_flow_step', 'user_journey', `${flowName}_${step}`);
};

// 预定义的常用跟踪函数
export const Analytics = {
  // 压缩相关
  compression: {
    start: (format: string) => trackEvent('compression_started', 'compression', format),
    complete: (format: string, ratio: number) => trackCompressionEvent(format, 0, 0, ratio),
    error: (format: string, error: string) => trackError('compression_error', error, format),
  },
  
  // 转换相关
  conversion: {
    start: (fromFormat: string, toFormat: string) => trackEvent('conversion_started', 'conversion', `${fromFormat}_to_${toFormat}`),
    complete: (fromFormat: string, toFormat: string, size: number) => trackConversionEvent(fromFormat, toFormat, size),
    error: (fromFormat: string, toFormat: string, error: string) => trackError('conversion_error', error, `${fromFormat}_to_${toFormat}`),
  },
  
  // 下载相关
  download: {
    start: (fileType: string) => trackEvent('download_started', 'download', fileType),
    complete: (fileType: string, size: number) => trackDownload(fileType, size),
    error: (fileType: string, error: string) => trackError('download_error', error, fileType),
  },
  
  // UI 交互
  ui: {
    click: (element: string) => trackUserInteraction('click', element),
    upload: (format: string) => trackUserInteraction('upload', format),
    reset: (tool: string) => trackUserInteraction('reset', tool),
    settings: (tool: string, setting: string) => trackUserInteraction('settings_change', `${tool}_${setting}`),
  },
  
  // 导航
  navigation: {
    pageView: (page: string) => trackPageView(page),
    menuClick: (menuItem: string) => trackUserInteraction('menu_click', menuItem),
    breadcrumb: (path: string) => trackUserInteraction('breadcrumb_click', path),
  },
  
  // 用户偏好
  preferences: {
    language: (lang: string) => trackLanguageChange('unknown', lang),
    theme: (theme: 'light' | 'dark') => trackThemeChange(theme),
  }
};

export default Analytics;
