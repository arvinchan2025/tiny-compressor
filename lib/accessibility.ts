/**
 * 可访问性工具函数
 * 提供无障碍访问支持
 */

// 色彩对比度计算
export const calculateContrast = (color1: string, color2: string): number => {
  // 简化的对比度计算，实际项目中应使用更精确的算法
  const getLuminance = (color: string): number => {
    // 移除 # 前缀
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    
    return 0.2126 * (rs || 0) + 0.7152 * (gs || 0) + 0.0722 * (bs || 0);
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// 检查对比度是否符合WCAG标准
export const checkContrast = (foreground: string, background: string): {
  ratio: number;
  aa: boolean;
  aaa: boolean;
} => {
  const ratio = calculateContrast(foreground, background);
  return {
    ratio,
    aa: ratio >= 4.5, // WCAG AA标准
    aaa: ratio >= 7 // WCAG AAA标准
  };
};

// 无障碍色彩调色板
export const accessibleColors = {
  // 主色调 - 确保足够的对比度
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // 主色
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // 语义色彩
  semantic: {
    success: {
      light: '#10b981', // 绿色
      dark: '#059669',
      text: '#ffffff' // 白色文字确保对比度
    },
    warning: {
      light: '#f59e0b', // 黄色
      dark: '#d97706',
      text: '#ffffff' // 白色文字确保对比度
    },
    error: {
      light: '#ef4444', // 红色
      dark: '#dc2626',
      text: '#ffffff' // 白色文字确保对比度
    },
    info: {
      light: '#3b82f6', // 蓝色
      dark: '#2563eb',
      text: '#ffffff' // 白色文字确保对比度
    }
  },
  
  // 中性色彩
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    }
  }
};

// 键盘导航支持
export const keyboardNavigation = {
  // 键盘事件处理
  handleKeyDown: (event: React.KeyboardEvent, handlers: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: () => void;
    onSpace?: () => void;
  }) => {
    switch (event.key) {
      case 'Enter':
        handlers.onEnter?.();
        break;
      case 'Escape':
        handlers.onEscape?.();
        break;
      case 'ArrowUp':
        handlers.onArrowUp?.();
        break;
      case 'ArrowDown':
        handlers.onArrowDown?.();
        break;
      case 'ArrowLeft':
        handlers.onArrowLeft?.();
        break;
      case 'ArrowRight':
        handlers.onArrowRight?.();
        break;
      case 'Tab':
        handlers.onTab?.();
        break;
      case ' ':
        event.preventDefault();
        handlers.onSpace?.();
        break;
    }
  },
  
  // 焦点管理
  focusManagement: {
    // 获取可聚焦元素
    getFocusableElements: (container: HTMLElement): HTMLElement[] => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ');
      
      return Array.from(container.querySelectorAll(focusableSelectors));
    },
    
    // 设置焦点到第一个可聚焦元素
    focusFirst: (container: HTMLElement) => {
      const focusableElements = keyboardNavigation.focusManagement.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0]?.focus();
      }
    },
    
    // 设置焦点到最后一个可聚焦元素
    focusLast: (container: HTMLElement) => {
      const focusableElements = keyboardNavigation.focusManagement.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1]?.focus();
      }
    },
    
    // 循环焦点
    trapFocus: (container: HTMLElement, event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const focusableElements = keyboardNavigation.focusManagement.getFocusableElements(container);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    }
  }
};

// ARIA标签生成
export const ariaLabels = {
  // 生成按钮的ARIA标签
  button: (label: string, state?: {
    pressed?: boolean;
    expanded?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }) => {
    const attributes: Record<string, string> = {
      'aria-label': label
    };
    
    if (state?.pressed !== undefined) {
      attributes['aria-pressed'] = state.pressed.toString();
    }
    
    if (state?.expanded !== undefined) {
      attributes['aria-expanded'] = state.expanded.toString();
    }
    
    if (state?.disabled) {
      attributes['aria-disabled'] = 'true';
    }
    
    if (state?.loading) {
      attributes['aria-busy'] = 'true';
    }
    
    return attributes;
  },
  
  // 生成表单控件的ARIA标签
  formControl: (label: string, state?: {
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
  }) => {
    const attributes: Record<string, string> = {
      'aria-label': label
    };
    
    if (state?.required) {
      attributes['aria-required'] = 'true';
    }
    
    if (state?.invalid) {
      attributes['aria-invalid'] = 'true';
    }
    
    if (state?.describedBy) {
      attributes['aria-describedby'] = state.describedBy;
    }
    
    return attributes;
  },
  
  // 生成进度条的ARIA标签
  progress: (label: string, value: number, max: number = 100) => ({
    'aria-label': label,
    'aria-valuenow': value.toString(),
    'aria-valuemin': '0',
    'aria-valuemax': max.toString(),
    role: 'progressbar'
  }),
  
  // 生成对话框的ARIA标签
  dialog: (label: string, state?: {
    modal?: boolean;
    describedBy?: string;
  }) => {
    const attributes: Record<string, string> = {
      'aria-label': label,
      role: state?.modal ? 'dialog' : 'region'
    };
    
    if (state?.describedBy) {
      attributes['aria-describedby'] = state.describedBy;
    }
    
    return attributes;
  }
};

// 屏幕阅读器支持
export const screenReader = {
  // 生成屏幕阅读器文本
  srOnly: 'sr-only', // Tailwind CSS的屏幕阅读器专用类
  
  // 生成隐藏文本的类名
  hiddenTextClass: 'sr-only',
  
  // 生成描述文本的类名
  descriptionClass: 'sr-only'
};

// 可访问性检查工具
export const accessibilityChecks = {
  // 检查颜色对比度
  checkColorContrast: (foreground: string, background: string) => {
    const result = checkContrast(foreground, background);
    return {
      ...result,
      recommendation: result.aaa 
        ? 'Excellent contrast ratio' 
        : result.aa 
        ? 'Good contrast ratio' 
        : 'Poor contrast ratio - consider using darker/lighter colors'
    };
  },
  
  // 检查焦点可见性
  checkFocusVisibility: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    const outline = styles.outline;
    const boxShadow = styles.boxShadow;
    
    return {
      hasOutline: outline !== 'none',
      hasBoxShadow: boxShadow !== 'none',
      isVisible: outline !== 'none' || boxShadow !== 'none'
    };
  },
  
  // 检查语义化标签
  checkSemanticMarkup: (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    
    return {
      hasSemanticTag: ['button', 'input', 'select', 'textarea', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName),
      hasRole: !!role,
      hasAriaLabel: !!ariaLabel,
      isAccessible: ['button', 'input', 'select', 'textarea', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName) || !!role || !!ariaLabel
    };
  }
};
