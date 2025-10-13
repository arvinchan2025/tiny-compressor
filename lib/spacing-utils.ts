/**
 * 间距工具函数
 * 提供统一的间距计算和布局工具
 */

import designSystem from './design-system';

const { spacing } = designSystem;

// 间距类型
export type SpacingScale = keyof typeof spacing;

// 获取间距值
export const getSpacing = (scale: SpacingScale): string => {
  return spacing[scale];
};

// 生成间距类名
export const spacingClasses = {
  // 外边距
  margin: {
    all: (scale: SpacingScale) => `m-${scale}`,
    top: (scale: SpacingScale) => `mt-${scale}`,
    right: (scale: SpacingScale) => `mr-${scale}`,
    bottom: (scale: SpacingScale) => `mb-${scale}`,
    left: (scale: SpacingScale) => `ml-${scale}`,
    x: (scale: SpacingScale) => `mx-${scale}`,
    y: (scale: SpacingScale) => `my-${scale}`,
  },
  
  // 内边距
  padding: {
    all: (scale: SpacingScale) => `p-${scale}`,
    top: (scale: SpacingScale) => `pt-${scale}`,
    right: (scale: SpacingScale) => `pr-${scale}`,
    bottom: (scale: SpacingScale) => `pb-${scale}`,
    left: (scale: SpacingScale) => `pl-${scale}`,
    x: (scale: SpacingScale) => `px-${scale}`,
    y: (scale: SpacingScale) => `py-${scale}`,
  },
  
  // 间距
  gap: (scale: SpacingScale) => `gap-${scale}`,
  space: {
    x: (scale: SpacingScale) => `space-x-${scale}`,
    y: (scale: SpacingScale) => `space-y-${scale}`,
  },
};

// 常用间距组合
export const commonSpacing = {
  // 页面容器
  pageContainer: 'px-4 sm:px-6 lg:px-8',
  
  // 内容区域
  contentArea: 'px-4 sm:px-6',
  
  // 卡片间距
  cardSpacing: 'p-6',
  cardSpacingSm: 'p-4',
  cardSpacingLg: 'p-8',
  
  // 组件间距
  componentSpacing: 'mb-6',
  componentSpacingSm: 'mb-4',
  componentSpacingLg: 'mb-8',
  
  // 按钮间距
  buttonSpacing: 'px-4 py-2',
  buttonSpacingSm: 'px-3 py-1.5',
  buttonSpacingLg: 'px-6 py-3',
  
  // 表单间距
  formSpacing: 'space-y-4',
  formSpacingSm: 'space-y-3',
  formSpacingLg: 'space-y-6',
  
  // 网格间距
  gridSpacing: 'gap-6',
  gridSpacingSm: 'gap-4',
  gridSpacingLg: 'gap-8',
  
  // 列表间距
  listSpacing: 'space-y-2',
  listSpacingSm: 'space-y-1',
  listSpacingLg: 'space-y-4',
};

// 响应式间距
export const responsiveSpacing = {
  // 页面边距
  pagePadding: 'px-4 sm:px-6 lg:px-8 xl:px-12',
  
  // 内容边距
  contentPadding: 'px-4 sm:px-6 lg:px-8',
  
  // 垂直间距
  verticalSpacing: 'py-8 sm:py-12 lg:py-16 xl:py-20',
  
  // 组件间距
  componentMargin: 'mb-4 sm:mb-6 lg:mb-8',
  
  // 网格间距
  gridGap: 'gap-4 sm:gap-6 lg:gap-8',
};

// 布局工具
export const layoutUtils = {
  // 居中容器
  centerContainer: 'max-w-7xl mx-auto',
  centerContainerSm: 'max-w-4xl mx-auto',
  centerContainerLg: 'max-w-5xl mx-auto',
  
  // 内容宽度
  contentWidth: 'max-w-4xl',
  contentWidthSm: 'max-w-2xl',
  contentWidthLg: 'max-w-6xl',
  
  // 文本对齐
  textCenter: 'text-center',
  textLeft: 'text-left',
  textRight: 'text-right',
  
  // 弹性布局
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  
  // 网格布局
  gridCols: {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
};

// 间距验证
export const validateSpacing = (scale: string | number): scale is SpacingScale => {
  return String(scale) in spacing;
};

// 生成间距样式对象
export const generateSpacingStyles = (config: {
  margin?: SpacingScale;
  padding?: SpacingScale;
  gap?: SpacingScale;
}) => {
  const styles: Record<string, string> = {};
  
  if (config.margin) {
    styles['margin'] = getSpacing(config.margin);
  }
  
  if (config.padding) {
    styles['padding'] = getSpacing(config.padding);
  }
  
  if (config.gap) {
    styles['gap'] = getSpacing(config.gap);
  }
  
  return styles;
};
