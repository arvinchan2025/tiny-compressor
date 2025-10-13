/**
 * 组件类型定义
 * 定义所有组件的通用接口和类型
 */

import type { ReactNode } from 'react';
import type { translations } from '@/lib/translations/generated';
import type { SupportedLanguage } from './index';
import type { ImageFile } from './image';

// 基础组件 Props
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly id?: string;
  readonly 'data-testid'?: string;
}

// 动画组件 Props
export interface AnimatedComponentProps extends BaseComponentProps {
  readonly animation?: 'fade' | 'slide' | 'scale' | 'none';
  readonly delay?: number;
  readonly duration?: number;
}

// 国际化组件 Props
export interface InternationalizedComponentProps extends BaseComponentProps {
  readonly translations: typeof translations;
  readonly locale: SupportedLanguage;
}

// 按钮组件 Props
export interface ButtonProps extends BaseComponentProps {
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly icon?: ReactNode;
  readonly iconPosition?: 'left' | 'right';
}

// 输入组件 Props
export interface InputProps extends BaseComponentProps {
  readonly type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  readonly placeholder?: string;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly error?: string;
  readonly label?: string;
  readonly helperText?: string;
  readonly onChange?: (value: string) => void;
  readonly onBlur?: () => void;
  readonly onFocus?: () => void;
}

// 选择器组件 Props
export interface SelectProps extends BaseComponentProps {
  readonly options: readonly SelectOption[];
  readonly value?: string;
  readonly defaultValue?: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly error?: string;
  readonly label?: string;
  readonly helperText?: string;
  readonly onChange?: (value: string) => void;
  readonly onBlur?: () => void;
  readonly onFocus?: () => void;
}

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
}

// 滑块组件 Props
export interface SliderProps extends BaseComponentProps {
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly value: number;
  readonly disabled?: boolean;
  readonly label?: string;
  readonly helperText?: string;
  readonly onChange?: (value: number) => void;
  readonly formatValue?: (value: number) => string;
}

// 模态框组件 Props
export interface ModalProps extends BaseComponentProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  readonly closable?: boolean;
  readonly backdrop?: boolean;
}

// 卡片组件 Props
export interface CardProps extends BaseComponentProps {
  readonly variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly border?: boolean;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
}

// 进度条组件 Props
export interface ProgressProps extends BaseComponentProps {
  readonly value: number;
  readonly max?: number;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'default' | 'success' | 'warning' | 'danger';
  readonly showLabel?: boolean;
  readonly label?: string;
  readonly animated?: boolean;
}

// 文件上传组件 Props
export interface FileUploadProps extends BaseComponentProps {
  readonly accept?: string;
  readonly multiple?: boolean;
  readonly maxSize?: number;
  readonly maxFiles?: number;
  readonly disabled?: boolean;
  readonly onFilesChange?: (files: File[]) => void;
  readonly onFilesSelected?: (files: ImageFile[]) => void;
  readonly onError?: (error: string) => void;
  readonly dragActiveText?: string;
  readonly dragInactiveText?: string;
  readonly supportedFormats?: string[];
  readonly acceptedTypes?: string[];
  readonly translations?: {
    dragActive: string;
    dragInactive: string;
    dragReject: string;
    clickToUpload: string;
    supportedFormats: string;
    maxSize: string;
    maxFiles: string;
    removeFile: string;
    uploadError: string;
    uploadSuccess: string;
  };
}

// 图片预览组件 Props
export interface ImagePreviewProps extends BaseComponentProps {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  readonly loading?: 'lazy' | 'eager';
  readonly placeholder?: ReactNode;
  readonly errorFallback?: ReactNode;
  readonly onClick?: () => void;
}

// 工具提示组件 Props
export interface TooltipProps extends BaseComponentProps {
  readonly content: ReactNode;
  readonly placement?: 'top' | 'bottom' | 'left' | 'right';
  readonly trigger?: 'hover' | 'click' | 'focus';
  readonly disabled?: boolean;
  readonly delay?: number;
}

// 通知组件 Props
export interface NotificationProps extends BaseComponentProps {
  readonly type?: 'success' | 'error' | 'warning' | 'info';
  readonly title?: string;
  readonly message: string;
  readonly duration?: number;
  readonly closable?: boolean;
  readonly onClose?: () => void;
  readonly action?: ReactNode;
}

// 分页组件 Props
export interface PaginationProps extends BaseComponentProps {
  readonly current: number;
  readonly total: number;
  readonly pageSize: number;
  readonly showSizeChanger?: boolean;
  readonly showQuickJumper?: boolean;
  readonly showTotal?: boolean;
  readonly onChange: (page: number, pageSize: number) => void;
}

// 标签组件 Props
export interface TagProps extends BaseComponentProps {
  readonly variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly closable?: boolean;
  readonly onClose?: () => void;
  readonly icon?: ReactNode;
}

// 徽章组件 Props
export interface BadgeProps extends BaseComponentProps {
  readonly count?: number;
  readonly max?: number;
  readonly variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly dot?: boolean;
  readonly offset?: [number, number];
}

// 分割线组件 Props
export interface DividerProps extends BaseComponentProps {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly variant?: 'solid' | 'dashed' | 'dotted';
  readonly spacing?: 'sm' | 'md' | 'lg';
  readonly label?: ReactNode;
  readonly labelPosition?: 'left' | 'center' | 'right';
}

// 空状态组件 Props
export interface EmptyProps extends BaseComponentProps {
  readonly image?: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

// 加载组件 Props
export interface LoadingProps extends BaseComponentProps {
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  readonly text?: string;
  readonly overlay?: boolean;
}

// 错误边界组件 Props
export interface ErrorBoundaryProps extends BaseComponentProps {
  readonly fallback?: ReactNode;
  readonly onError?: (error: Error, errorInfo: any) => void;
  readonly resetKeys?: any[];
}

// 布局组件 Props
export interface LayoutProps extends BaseComponentProps {
  readonly direction?: 'row' | 'column';
  readonly align?: 'start' | 'center' | 'end' | 'stretch';
  readonly justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  readonly wrap?: boolean;
  readonly gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// 网格组件 Props
export interface GridProps extends BaseComponentProps {
  readonly columns?: number;
  readonly gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly responsive?: boolean;
  readonly breakpoints?: {
    readonly sm?: number;
    readonly md?: number;
    readonly lg?: number;
    readonly xl?: number;
  };
}

// 容器组件 Props
export interface ContainerProps extends BaseComponentProps {
  readonly maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  readonly center?: boolean;
  readonly padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// 响应式组件 Props
export interface ResponsiveProps extends BaseComponentProps {
  readonly breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  readonly hide?: boolean;
  readonly show?: boolean;
}

// 主题组件 Props
export interface ThemedComponentProps extends BaseComponentProps {
  readonly theme?: 'light' | 'dark' | 'auto';
  readonly variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

// 可访问性组件 Props
export interface AccessibleComponentProps extends BaseComponentProps {
  readonly 'aria-label'?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-describedby'?: string;
  readonly 'aria-hidden'?: boolean;
  readonly role?: string;
  readonly tabIndex?: number;
}

// 组件状态类型
export interface ComponentState {
  readonly loading: boolean;
  readonly error: string | null;
  readonly data: any;
}

// 组件动作类型
export interface ComponentActions {
  readonly onLoad: () => void;
  readonly onError: (error: string) => void;
  readonly onSuccess: (data: any) => void;
  readonly onReset: () => void;
}

// 组件配置类型
export interface ComponentConfig {
  readonly theme: 'light' | 'dark' | 'auto';
  readonly locale: SupportedLanguage;
  readonly animations: boolean;
  readonly accessibility: boolean;
  readonly performance: 'low' | 'medium' | 'high';
}

// 组件事件类型
export interface ComponentEvents {
  readonly onClick?: () => void;
  readonly onHover?: () => void;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (event: KeyboardEvent) => void;
  readonly onKeyUp?: (event: KeyboardEvent) => void;
}

// 组件样式类型
export interface ComponentStyles {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly variant?: string;
  readonly size?: string;
  readonly color?: string;
  readonly background?: string;
  readonly border?: string;
  readonly shadow?: string;
  readonly radius?: string;
  readonly spacing?: string;
}

// 组件验证类型
export interface ComponentValidation {
  readonly required?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly pattern?: RegExp;
  readonly custom?: (value: any) => boolean | string;
  readonly message?: string;
}

// 组件性能类型
export interface ComponentPerformance {
  readonly lazy?: boolean;
  readonly memo?: boolean;
  readonly virtual?: boolean;
  readonly debounce?: number;
  readonly throttle?: number;
  readonly cache?: boolean;
}

// 组件测试类型
export interface ComponentTest {
  readonly 'data-testid'?: string;
  readonly 'data-cy'?: string;
  readonly 'data-qa'?: string;
  readonly 'aria-label'?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-describedby'?: string;
}

// 组件文档类型
export interface ComponentDocumentation {
  readonly name: string;
  readonly description: string;
  readonly examples: ComponentExample[];
  readonly props: ComponentProp[];
  readonly events: ComponentEvent[];
  readonly slots: ComponentSlot[];
}

export interface ComponentExample {
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly preview: ReactNode;
}

export interface ComponentProp {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly default: any;
  readonly description: string;
}

export interface ComponentEvent {
  readonly name: string;
  readonly description: string;
  readonly parameters: string[];
}

export interface ComponentSlot {
  readonly name: string;
  readonly description: string;
  readonly props: string[];
}


