/**
 * 可访问性提供者组件
 * 提供键盘导航、屏幕阅读器支持、高对比度模式等
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AccessibilityState {
  isHighContrast: boolean;
  isReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: AccessibilityState['fontSize']) => void;
  toggleScreenReaderMode: () => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [state, setState] = useState<AccessibilityState>({
    isHighContrast: false,
    isReducedMotion: false,
    fontSize: 'medium',
    screenReaderMode: false,
    keyboardNavigation: false,
    focusVisible: false
  });

  // 检测用户偏好设置
  useEffect(() => {
    const mediaQueries = {
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
    };

    const updatePreferences = () => {
      setState(prev => ({
        ...prev,
        isHighContrast: mediaQueries.highContrast.matches,
        isReducedMotion: mediaQueries.reducedMotion.matches
      }));
    };

    // 初始设置
    updatePreferences();

    // 监听变化
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', updatePreferences);
    });

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', updatePreferences);
      });
    };
  }, []);

  // 键盘导航检测
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setState(prev => ({ ...prev, keyboardNavigation: true, focusVisible: true }));
      }
    };

    const handleMouseDown = () => {
      setState(prev => ({ ...prev, keyboardNavigation: false }));
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (state.keyboardNavigation) {
        setState(prev => ({ ...prev, focusVisible: true }));
      }
    };

    const handleFocusOut = () => {
      setState(prev => ({ ...prev, focusVisible: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [state.keyboardNavigation]);

  // 应用可访问性样式
  useEffect(() => {
    const root = document.documentElement;
    
    // 高对比度模式
    if (state.isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 减少动画
    if (state.isReducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // 字体大小
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${state.fontSize}`);

    // 键盘导航
    if (state.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // 焦点可见
    if (state.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [state]);

  // 屏幕阅读器公告
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const contextValue: AccessibilityContextType = {
    ...state,
    toggleHighContrast: () => setState(prev => ({ ...prev, isHighContrast: !prev.isHighContrast })),
    toggleReducedMotion: () => setState(prev => ({ ...prev, isReducedMotion: !prev.isReducedMotion })),
    setFontSize: (fontSize) => setState(prev => ({ ...prev, fontSize })),
    toggleScreenReaderMode: () => setState(prev => ({ ...prev, screenReaderMode: !prev.screenReaderMode })),
    setKeyboardNavigation: (keyboardNavigation) => setState(prev => ({ ...prev, keyboardNavigation })),
    announceToScreenReader
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      <AccessibilityStyles />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// 可访问性样式组件
function AccessibilityStyles() {
  return (
    <style jsx global>{`
      /* 屏幕阅读器专用类 */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .sr-only-focusable:focus {
        position: static;
        width: auto;
        height: auto;
        padding: inherit;
        margin: inherit;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }

      /* 高对比度模式 */
      .high-contrast {
        --bg-primary: #000000;
        --bg-secondary: #1a1a1a;
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
        --border-color: #ffffff;
        --accent-color: #ffff00;
      }

      .high-contrast button,
      .high-contrast input,
      .high-contrast select,
      .high-contrast textarea {
        border: 2px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
      }

      .high-contrast button:hover,
      .high-contrast input:hover,
      .high-contrast select:hover,
      .high-contrast textarea:hover {
        background: var(--accent-color);
        color: var(--bg-primary);
      }

      /* 减少动画 */
      .reduced-motion *,
      .reduced-motion *::before,
      .reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      /* 字体大小调整 */
      .font-small {
        font-size: 14px;
      }

      .font-medium {
        font-size: 16px;
      }

      .font-large {
        font-size: 18px;
      }

      .font-extra-large {
        font-size: 20px;
      }

      /* 键盘导航 */
      .keyboard-navigation button:focus,
      .keyboard-navigation input:focus,
      .keyboard-navigation select:focus,
      .keyboard-navigation textarea:focus,
      .keyboard-navigation a:focus,
      .keyboard-navigation [tabindex]:focus {
        outline: 2px solid var(--accent-color, #007bff);
        outline-offset: 2px;
      }

      /* 焦点可见 */
      .focus-visible button:focus,
      .focus-visible input:focus,
      .focus-visible select:focus,
      .focus-visible textarea:focus,
      .focus-visible a:focus,
      .focus-visible [tabindex]:focus {
        outline: 2px solid var(--accent-color, #007bff);
        outline-offset: 2px;
      }

      /* 跳过链接 */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--bg-primary, #000);
        color: var(--text-primary, #fff);
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
      }

      .skip-link:focus {
        top: 6px;
      }

      /* 高对比度模式下的链接 */
      .high-contrast a {
        text-decoration: underline;
        color: var(--accent-color, #ffff00);
      }

      .high-contrast a:visited {
        color: var(--accent-color, #ffff00);
      }

      .high-contrast a:hover,
      .high-contrast a:focus {
        background: var(--accent-color, #ffff00);
        color: var(--bg-primary, #000);
      }

      /* 表单元素可访问性 */
      input:required,
      select:required,
      textarea:required {
        border-left: 4px solid var(--accent-color, #007bff);
      }

      input:invalid,
      select:invalid,
      textarea:invalid {
        border-left: 4px solid #dc3545;
      }

      input:valid,
      select:valid,
      textarea:valid {
        border-left: 4px solid #28a745;
      }

      /* 错误消息 */
      .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .error-message::before {
        content: "⚠️ ";
        margin-right: 0.25rem;
      }

      /* 成功消息 */
      .success-message {
        color: #28a745;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .success-message::before {
        content: "✅ ";
        margin-right: 0.25rem;
      }

      /* 加载状态 */
      .loading {
        position: relative;
      }

      .loading::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid var(--accent-color, #007bff);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* 减少动画模式下的加载动画 */
      .reduced-motion .loading::after {
        animation: none;
        border: 2px solid var(--accent-color, #007bff);
      }
    `}</style>
  );
}

// 可访问性控制面板组件
export function AccessibilityControls() {
  const {
    isHighContrast,
    isReducedMotion,
    fontSize,
    screenReaderMode,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSize,
    toggleScreenReaderMode,
    announceToScreenReader
  } = useAccessibility();

  const handleFontSizeChange = (newSize: AccessibilityState['fontSize']) => {
    setFontSize(newSize);
    announceToScreenReader(`Font size changed to ${newSize}`);
  };

  const handleToggleHighContrast = () => {
    toggleHighContrast();
    announceToScreenReader(`High contrast mode ${isHighContrast ? 'disabled' : 'enabled'}`);
  };

  const handleToggleReducedMotion = () => {
    toggleReducedMotion();
    announceToScreenReader(`Reduced motion ${isReducedMotion ? 'disabled' : 'enabled'}`);
  };

  const handleToggleScreenReaderMode = () => {
    toggleScreenReaderMode();
    announceToScreenReader(`Screen reader mode ${screenReaderMode ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="accessibility-controls" role="region" aria-label="Accessibility Controls">
      <h3>Accessibility Options</h3>
      
      <div className="control-group">
        <label htmlFor="font-size-select">Font Size:</label>
        <select
          id="font-size-select"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value as AccessibilityState['fontSize'])}
          aria-describedby="font-size-help"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
        <div id="font-size-help" className="help-text">
          Adjust the text size for better readability
        </div>
      </div>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={isHighContrast}
            onChange={handleToggleHighContrast}
            aria-describedby="high-contrast-help"
          />
          High Contrast Mode
        </label>
        <div id="high-contrast-help" className="help-text">
          Increase contrast for better visibility
        </div>
      </div>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={isReducedMotion}
            onChange={handleToggleReducedMotion}
            aria-describedby="reduced-motion-help"
          />
          Reduce Motion
        </label>
        <div id="reduced-motion-help" className="help-text">
          Reduce animations and transitions
        </div>
      </div>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={screenReaderMode}
            onChange={handleToggleScreenReaderMode}
            aria-describedby="screen-reader-help"
          />
          Screen Reader Mode
        </label>
        <div id="screen-reader-help" className="help-text">
          Optimize interface for screen readers
        </div>
      </div>
    </div>
  );
}

// 跳过链接组件
export function SkipLinks() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#accessibility-controls" className="skip-link">
        Skip to accessibility controls
      </a>
    </>
  );
}

export default AccessibilityProvider;

