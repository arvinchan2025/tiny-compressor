/**
 * 高级错误处理系统
 * 提供全局错误边界、错误监控、用户友好的错误信息
 */

import { ErrorInfo, ReactNode } from 'react';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  componentStack?: string;
  errorBoundary?: string;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'compression' | 'conversion' | 'ui' | 'unknown';
  resolved: boolean;
  userReported: boolean;
}

export class ErrorHandler {
  private static errors: Map<string, ErrorReport> = new Map();
  private static listeners: Array<(error: ErrorReport) => void> = [];
  private static maxErrors = 100;

  /**
   * 记录错误
   */
  static reportError(
    error: Error,
    context: Partial<ErrorContext> = {},
    severity: ErrorReport['severity'] = 'medium',
    category: ErrorReport['category'] = 'unknown'
  ): string {
    const errorId = this.generateErrorId();
    const timestamp = Date.now();

    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      context: {
        timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...context
      },
      severity,
      category,
      resolved: false,
      userReported: false
    };

    // 存储错误
    this.errors.set(errorId, errorReport);

    // 清理旧错误
    if (this.errors.size > this.maxErrors) {
      const oldestError = this.errors.keys().next().value;
      this.errors.delete(oldestError);
    }

    // 通知监听器
    this.listeners.forEach(listener => listener(errorReport));

    // 根据严重程度决定处理方式
    this.handleErrorBySeverity(errorReport);

    return errorId;
  }

  /**
   * 根据严重程度处理错误
   */
  private static handleErrorBySeverity(error: ErrorReport): void {
    switch (error.severity) {
      case 'critical':
        // 关键错误：立即通知用户并记录
        this.showCriticalError(error);
        this.logToConsole(error, 'error');
        break;
      case 'high':
        // 高级错误：显示警告并记录
        this.showErrorNotification(error);
        this.logToConsole(error, 'warn');
        break;
      case 'medium':
        // 中级错误：记录到控制台
        this.logToConsole(error, 'info');
        break;
      case 'low':
        // 低级错误：静默记录
        this.logToConsole(error, 'debug');
        break;
    }
  }

  /**
   * 显示关键错误
   */
  private static showCriticalError(error: ErrorReport): void {
    // 创建错误模态框
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
      <div class="error-modal-content">
        <div class="error-modal-header">
          <h2>⚠️ Critical Error</h2>
          <button class="error-modal-close">&times;</button>
        </div>
        <div class="error-modal-body">
          <p>We encountered a critical error. Please refresh the page or contact support.</p>
          <details>
            <summary>Error Details</summary>
            <pre>${error.message}</pre>
            <p><strong>Error ID:</strong> ${error.id}</p>
          </details>
        </div>
        <div class="error-modal-footer">
          <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
          <button class="btn btn-secondary" onclick="this.closest('.error-modal').remove()">Close</button>
        </div>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .error-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .error-modal-content {
        background: white;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      }
      .error-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
      }
      .error-modal-body {
        padding: 20px;
      }
      .error-modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // 关闭按钮事件
    modal.querySelector('.error-modal-close')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  /**
   * 显示错误通知
   */
  private static showErrorNotification(error: ErrorReport): void {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-notification-content">
        <span class="error-notification-icon">⚠️</span>
        <span class="error-notification-message">${this.getUserFriendlyMessage(error)}</span>
        <button class="error-notification-close">&times;</button>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 4px;
        padding: 12px 16px;
        max-width: 400px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .error-notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .error-notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
      }
    `;

    if (!document.querySelector('.error-notification-styles')) {
      style.className = 'error-notification-styles';
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // 自动移除
    setTimeout(() => {
      notification.remove();
    }, 5000);

    // 关闭按钮事件
    notification.querySelector('.error-notification-close')?.addEventListener('click', () => {
      notification.remove();
    });
  }

  /**
   * 获取用户友好的错误消息
   */
  private static getUserFriendlyMessage(error: ErrorReport): string {
    const messages = {
      compression: 'Image compression failed. Please try again or use a different image.',
      conversion: 'Image conversion failed. Please check the image format and try again.',
      network: 'Network error. Please check your connection and try again.',
      javascript: 'An unexpected error occurred. Please refresh the page.',
      ui: 'Interface error. Please refresh the page.',
      unknown: 'An unexpected error occurred. Please try again.'
    };

    return messages[error.category] || messages.unknown;
  }

  /**
   * 记录到控制台
   */
  private static logToConsole(error: ErrorReport, level: 'debug' | 'info' | 'warn' | 'error'): void {
    const logMessage = `[${error.severity.toUpperCase()}] ${error.category}: ${error.message}`;
    
    switch (level) {
      case 'debug':
        console.debug(logMessage, error);
        break;
      case 'info':
        console.info(logMessage, error);
        break;
      case 'warn':
        console.warn(logMessage, error);
        break;
      case 'error':
        console.error(logMessage, error);
        break;
    }
  }

  /**
   * 生成错误ID
   */
  private static generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 添加错误监听器
   */
  static addErrorListener(listener: (error: ErrorReport) => void): void {
    this.listeners.push(listener);
  }

  /**
   * 移除错误监听器
   */
  static removeErrorListener(listener: (error: ErrorReport) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 获取所有错误
   */
  static getErrors(): ErrorReport[] {
    return Array.from(this.errors.values());
  }

  /**
   * 获取未解决的错误
   */
  static getUnresolvedErrors(): ErrorReport[] {
    return this.getErrors().filter(error => !error.resolved);
  }

  /**
   * 标记错误为已解决
   */
  static resolveError(errorId: string): void {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
    }
  }

  /**
   * 清理所有错误
   */
  static clearErrors(): void {
    this.errors.clear();
  }

  /**
   * 导出错误报告
   */
  static exportErrors(): string {
    return JSON.stringify(this.getErrors(), null, 2);
  }
}

/**
 * React错误边界组件
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = ErrorHandler.reportError(
      error,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name
      },
      'high',
      'ui'
    );

    this.setState({
      error,
      errorInfo,
      errorId
    });

    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            {this.state.errorId && (
              <p>Error ID: {this.state.errorId}</p>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 异步错误处理
 */
export class AsyncErrorHandler {
  /**
   * 包装异步函数，自动捕获错误
   */
  static wrap<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        ErrorHandler.reportError(
          error as Error,
          { componentStack: context },
          'medium',
          'javascript'
        );
        throw error;
      }
    };
  }

  /**
   * 安全执行异步函数，不抛出错误
   */
  static async safeExecute<T>(
    fn: () => Promise<T>,
    defaultValue: T,
    context?: string
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      ErrorHandler.reportError(
        error as Error,
        { componentStack: context },
        'low',
        'javascript'
      );
      return defaultValue;
    }
  }
}

/**
 * 网络错误处理
 */
export class NetworkErrorHandler {
  /**
   * 处理网络请求错误
   */
  static handleNetworkError(error: Error, url: string, method: string = 'GET'): void {
    let category: ErrorReport['category'] = 'network';
    let severity: ErrorReport['severity'] = 'medium';

    // 根据错误类型调整严重程度
    if (error.message.includes('timeout')) {
      severity = 'low';
    } else if (error.message.includes('404')) {
      severity = 'medium';
    } else if (error.message.includes('500')) {
      severity = 'high';
    }

    ErrorHandler.reportError(
      error,
      { url: `${method} ${url}` },
      severity,
      category
    );
  }

  /**
   * 重试网络请求
   */
  static async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError!;
  }
}

export default {
  ErrorHandler,
  ErrorBoundary,
  AsyncErrorHandler,
  NetworkErrorHandler
};

