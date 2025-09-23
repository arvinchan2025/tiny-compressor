/**
 * 微交互工具函数
 * 提供统一的动画和交互效果
 */

import { Variants } from 'framer-motion';

// 通用动画变体
export const commonVariants = {
  // 淡入淡出
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  // 从下方滑入
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  // 从上方滑入
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  
  // 从左侧滑入
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  
  // 从右侧滑入
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  
  // 缩放效果
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  
  // 弹跳效果
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { opacity: 0, scale: 0.3 }
  }
};

// 悬停效果
export const hoverEffects = {
  // 轻微放大
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  },
  
  // 中等放大
  scaleMedium: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  },
  
  // 轻微上移
  lift: {
    whileHover: { y: -2 },
    whileTap: { y: 0 }
  },
  
  // 中等上移
  liftMedium: {
    whileHover: { y: -4 },
    whileTap: { y: 0 }
  },
  
  // 旋转效果
  rotate: {
    whileHover: { rotate: 5 },
    whileTap: { rotate: 0 }
  },
  
  // 阴影效果
  shadow: {
    whileHover: { 
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    },
    whileTap: { 
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }
  }
};

// 过渡动画
export const transitions = {
  // 快速过渡
  fast: {
    duration: 0.2,
    ease: "easeOut"
  },
  
  // 标准过渡
  standard: {
    duration: 0.3,
    ease: "easeOut"
  },
  
  // 慢速过渡
  slow: {
    duration: 0.5,
    ease: "easeOut"
  },
  
  // 弹性过渡
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 20
  },
  
  // 弹性过渡（快速）
  springFast: {
    type: "spring",
    stiffness: 400,
    damping: 25
  },
  
  // 弹性过渡（慢速）
  springSlow: {
    type: "spring",
    stiffness: 200,
    damping: 15
  }
};

// 加载动画
export const loadingAnimations = {
  // 旋转加载
  spin: {
    animate: { rotate: 360 },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  },
  
  // 脉冲效果
  pulse: {
    animate: { 
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  // 弹跳效果
  bounce: {
    animate: { 
      y: [0, -10, 0]
    },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  // 波浪效果
  wave: {
    animate: { 
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 页面过渡
export const pageTransitions = {
  // 标准页面过渡
  standard: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  // 快速页面过渡
  fast: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // 慢速页面过渡
  slow: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// 列表动画
export const listAnimations = {
  // 交错动画
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  
  // 列表项动画
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  // 列表项悬停
  itemHover: {
    whileHover: { 
      scale: 1.02,
      y: -2
    },
    whileTap: { 
      scale: 0.98,
      y: 0
    }
  }
};

// 模态框动画
export const modalAnimations = {
  // 背景遮罩
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  // 模态框内容
  content: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 }
  }
};

// 工具提示动画
export const tooltipAnimations = {
  // 工具提示
  tooltip: {
    initial: { opacity: 0, scale: 0.8, y: 5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 5 }
  }
};

// 进度条动画
export const progressAnimations = {
  // 进度条填充
  fill: {
    initial: { width: 0 },
    animate: { width: "100%" },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  // 进度条脉冲
  pulse: {
    animate: { 
      opacity: [0.5, 1, 0.5]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 创建自定义动画变体
export const createVariants = (baseVariants: any, overrides: any = {}) => {
  return {
    ...baseVariants,
    ...overrides
  };
};

// 创建延迟动画
export const createDelayedAnimation = (delay: number, baseAnimation: any) => {
  return {
    ...baseAnimation,
    transition: {
      ...baseAnimation.transition,
      delay
    }
  };
};

// 创建循环动画
export const createLoopAnimation = (baseAnimation: any, repeat: number = Infinity) => {
  return {
    ...baseAnimation,
    transition: {
      ...baseAnimation.transition,
      repeat
    }
  };
};
