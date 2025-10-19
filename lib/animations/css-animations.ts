/**
 * CSS Animation Utilities
 * 轻量级 CSS 动画类，替代简单的 Framer Motion 动画
 */

// 动画类名
export const animations = {
  // 淡入动画
  fadeIn: 'animate-fade-in',
  fadeInFast: 'animate-fade-in-fast',
  fadeInSlow: 'animate-fade-in-slow',
  
  // 滑动动画
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  
  // 缩放动画
  scaleIn: 'animate-scale-in',
  scaleInFast: 'animate-scale-in-fast',
  
  // 组合动画
  slideUpFade: 'animate-slide-up', // 已包含 fade
  slideDownFade: 'animate-slide-down',
} as const

// Transition 类名
export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  normal: 'transition-all duration-300 ease-out',
  slow: 'transition-all duration-500 ease-out',
  
  // 特定属性的 transition
  transform: 'transition-transform duration-300 ease-out',
  opacity: 'transition-opacity duration-300 ease-out',
  colors: 'transition-colors duration-300 ease-out',
  shadow: 'transition-shadow duration-300 ease-out',
} as const

// Hover 效果
export const hovers = {
  scale: 'hover:scale-[1.02] active:scale-[0.98]',
  scaleSmall: 'hover:scale-[1.01] active:scale-[0.99]',
  scaleLarge: 'hover:scale-[1.05] active:scale-[0.95]',
  
  lift: 'hover:-translate-y-1 hover:shadow-lg',
  liftSmall: 'hover:-translate-y-0.5 hover:shadow-md',
  
  brightness: 'hover:brightness-110',
  opacity: 'hover:opacity-80',
} as const

// 延迟类（用于交错动画）
export const delays = {
  none: '',
  xs: 'animation-delay-75',
  sm: 'animation-delay-150',
  md: 'animation-delay-300',
  lg: 'animation-delay-500',
  xl: 'animation-delay-700',
} as const

/**
 * 生成带延迟的动画类名
 */
export function withDelay(animation: string, delayMs: number): string {
  return `${animation} [animation-delay:${delayMs}ms]`
}

/**
 * 生成交错动画类名
 */
export function staggered(animation: string, index: number, staggerMs: number = 100): string {
  const delay = index * staggerMs
  return `${animation} [animation-delay:${delay}ms]`
}

/**
 * 组合多个类名
 */
export function combine(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}


