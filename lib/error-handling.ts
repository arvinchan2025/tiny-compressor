/**
 * 错误处理工具和组件
 * 提供统一的错误处理机制和错误边界组件
 */

import React from 'react';

// 错误类型定义
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// 错误级别
export enum ErrorLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 错误处理器类
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: AppError[] = [];
  private maxQueueSize = 100;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 记录错误
   */
  public logError(error: Partial<AppError>, level: ErrorLevel = ErrorLevel.MEDIUM): void {
    const fullError: AppError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error.details,
      timestamp: Date.now(),
      userId: error.userId,
      sessionId: error.sessionId
    };

    // 添加到错误队列
    this.errorQueue.push(fullError);
    
    // 保持队列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // 根据错误级别处理
    switch (level) {
      case ErrorLevel.CRITICAL:
        console.error('CRITICAL ERROR:', fullError);
        // 这里可以发送到错误监控服务
        break;
      case ErrorLevel.HIGH:
        console.error('HIGH PRIORITY ERROR:', fullError);
        break;
      case ErrorLevel.MEDIUM:
        console.warn('MEDIUM PRIORITY ERROR:', fullError);
        break;
      case ErrorLevel.LOW:
        console.info('LOW PRIORITY ERROR:', fullError);
        break;
    }
  }

  /**
   * 获取错误队列
   */
  public getErrors(): AppError[] {
    return [...this.errorQueue];
  }

  /**
   * 清空错误队列
   */
  public clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * 获取最近的错误
   */
  public getRecentError(): AppError | null {
    return this.errorQueue.length > 0 ? this.errorQueue[this.errorQueue.length - 1] : null;
  }
}

// 错误边界组件属性
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

// 错误边界组件状态
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

// 错误边界组件
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorHandler: ErrorHandler;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
    this.errorHandler = ErrorHandler.getInstance();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误
    this.errorHandler.logError({
      code: 'REACT_ERROR_BOUNDARY',
      message: error.message,
      details: {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId
      }
    }, ErrorLevel.HIGH);

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return React.createElement('div', { className: 'error-boundary' },
        React.createElement('div', { className: 'error-boundary-content' },
          React.createElement('h2', null, 'Something went wrong'),
          React.createElement('p', null, 'We\'re sorry, but something unexpected happened.'),
          this.state.errorId && React.createElement('p', null, `Error ID: ${this.state.errorId}`),
          React.createElement('button', {
            onClick: () => window.location.reload(),
            className: 'btn btn-primary'
          }, 'Refresh Page')
        )
      );
    }

    return this.props.children;
  }
}

// 错误处理Hook
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance();

  const handleError = React.useCallback((error: Partial<AppError>, level?: ErrorLevel) => {
    errorHandler.logError(error, level);
  }, [errorHandler]);

  const getErrors = React.useCallback(() => {
    return errorHandler.getErrors();
  }, [errorHandler]);

  const clearErrors = React.useCallback(() => {
    errorHandler.clearErrors();
  }, [errorHandler]);

  return {
    handleError,
    getErrors,
    clearErrors
  };
}

// 异步错误处理函数
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorCode: string = 'ASYNC_ERROR'
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorHandler = ErrorHandler.getInstance();
      errorHandler.logError({
        code: errorCode,
        message: error instanceof Error ? error.message : 'Unknown async error',
        details: error
      }, ErrorLevel.MEDIUM);
      return null;
    }
  };
}

// 同步错误处理函数
export function withSyncErrorHandling<T extends any[], R>(
  fn: (...args: T) => R,
  errorCode: string = 'SYNC_ERROR'
) {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      const errorHandler = ErrorHandler.getInstance();
      errorHandler.logError({
        code: errorCode,
        message: error instanceof Error ? error.message : 'Unknown sync error',
        details: error
      }, ErrorLevel.MEDIUM);
      return null;
    }
  };
}

// 错误格式化函数
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  return 'An unknown error occurred';
}

// 导出默认实例
export default ErrorHandler.getInstance();
