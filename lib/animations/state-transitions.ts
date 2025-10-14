/**
 * 统一的动画配置和变体
 * 用于 Compressor, Converter 和 PDF 压缩器的状态切换动画
 */

export const stateVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const animationTimings = {
  // 页面级动画
  pageTransition: 0.6,
  sectionFadeIn: 0.8,
  
  // 状态切换
  stateTransition: 0.3,
  stateExit: 0.2,
  
  // 元素动画
  buttonHover: 0.2,
  cardHover: 0.3,
  badgeScale: 0.4,
  
  // 进度动画
  progressUpdate: 0.15,
  
  // 背景动画
  backgroundSlow: 20,
  backgroundFast: 25,
  glowPulse: 3
};

export const easings = {
  smooth: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0.0, 0.6, 1]
};


