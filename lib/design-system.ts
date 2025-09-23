/**
 * 统一设计系统
 * 定义项目的标准色彩、间距、组件尺寸等设计规范
 */

// 色彩系统
export const colors = {
  // 主色调 - 蓝紫粉渐变
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
  },
  
  // 紫色
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // 主色
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // 粉色
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // 主色
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // 中性色
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
  },
  
  // 可访问性色彩
  accessible: {
    // 高对比度文本
    highContrast: {
      onLight: '#000000', // 黑色在浅色背景上
      onDark: '#ffffff', // 白色在深色背景上
    },
    // 焦点指示器
    focus: {
      ring: '#3b82f6', // blue-500
      ringOffset: '#ffffff', // white
    },
    // 语义色彩（确保对比度）
    semantic: {
      success: {
        bg: '#10b981', // green-500
        text: '#ffffff', // white
        border: '#059669', // green-600
      },
      warning: {
        bg: '#f59e0b', // amber-500
        text: '#ffffff', // white
        border: '#d97706', // amber-600
      },
      error: {
        bg: '#ef4444', // red-500
        text: '#ffffff', // white
        border: '#dc2626', // red-600
      },
      info: {
        bg: '#3b82f6', // blue-500
        text: '#ffffff', // white
        border: '#2563eb', // blue-600
      }
    }
  },
  
  // 语义化颜色
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
} as const;

// 间距系统 (基于8px)
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
  40: '10rem',   // 160px
  48: '12rem',   // 192px
  56: '14rem',   // 224px
  64: '16rem',   // 256px
} as const;

// 字体大小系统
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem',  // 72px
  '8xl': '6rem',    // 96px
  '9xl': '8rem',    // 128px
} as const;

// 字体粗细
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// 行高
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// 圆角系统
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// 阴影系统
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
} as const;

// 组件尺寸系统
export const componentSizes = {
  // 按钮尺寸
  button: {
    sm: {
      height: '2rem',      // 32px
      padding: '0.5rem 0.75rem', // 8px 12px
      fontSize: '0.875rem', // 14px
    },
    md: {
      height: '2.5rem',    // 40px
      padding: '0.625rem 1rem', // 10px 16px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '3rem',      // 48px
      padding: '0.75rem 1.5rem', // 12px 24px
      fontSize: '1rem',    // 16px
    },
    xl: {
      height: '3.5rem',    // 56px
      padding: '1rem 2rem', // 16px 32px
      fontSize: '1.125rem', // 18px
    },
  },
  
  // 输入框尺寸
  input: {
    sm: {
      height: '2rem',      // 32px
      padding: '0.5rem 0.75rem', // 8px 12px
      fontSize: '0.875rem', // 14px
    },
    md: {
      height: '2.5rem',    // 40px
      padding: '0.625rem 1rem', // 10px 16px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '3rem',      // 48px
      padding: '0.75rem 1rem', // 12px 16px
      fontSize: '1rem',    // 16px
    },
  },
  
  // 卡片尺寸
  card: {
    sm: {
      padding: '1rem',     // 16px
      borderRadius: '0.5rem', // 8px
    },
    md: {
      padding: '1.5rem',   // 24px
      borderRadius: '0.75rem', // 12px
    },
    lg: {
      padding: '2rem',     // 32px
      borderRadius: '1rem', // 16px
    },
  },
} as const;

// 渐变系统
export const gradients = {
  primary: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
  primaryHover: 'linear-gradient(135deg, #2563eb, #7c3aed, #db2777)',
  secondary: 'linear-gradient(135deg, #f3f4f6, #e5e7eb, #d1d5db)',
  success: 'linear-gradient(135deg, #10b981, #059669)',
  warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
  error: 'linear-gradient(135deg, #ef4444, #dc2626)',
  info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
} as const;

// 动画系统
export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// 断点系统
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 设计系统类型
export type ColorScale = keyof typeof colors;
export type SpacingScale = keyof typeof spacing;
export type FontSizeScale = keyof typeof fontSize;
export type FontWeightScale = keyof typeof fontWeight;
export type LineHeightScale = keyof typeof lineHeight;
export type BorderRadiusScale = keyof typeof borderRadius;
export type BoxShadowScale = keyof typeof boxShadow;
export type ComponentSizeScale = keyof typeof componentSizes.button;
export type GradientScale = keyof typeof gradients;
export type AnimationDurationScale = keyof typeof animations.duration;
export type AnimationEasingScale = keyof typeof animations.easing;
export type BreakpointScale = keyof typeof breakpoints;
