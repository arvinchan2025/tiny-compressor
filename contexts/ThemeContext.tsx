'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // 实际应用的主题（解析system后）
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean; // 是否正在加载主题
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 本地存储键名
const STORAGE_KEY = 'tinycompressor-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 获取系统主题偏好
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // 计算实际应用的主题
  const calculateActualTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, [getSystemTheme]);

  // 从本地存储读取主题
  const loadThemeFromStorage = useCallback((): Theme => {
    try {
      if (typeof window === 'undefined') return 'system';
      
      const savedTheme = window.localStorage.getItem(STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme as Theme;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return 'system'; // 默认跟随系统
  }, []);

  // 保存主题到本地存储
  const saveThemeToStorage = useCallback((themeToSave: Theme) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, themeToSave);
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, []);

  // 应用主题到DOM
  const applyThemeToDOM = useCallback((themeToApply: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeToApply);
    
    // 设置 data 属性以便 CSS 使用
    root.setAttribute('data-theme', themeToApply);
  }, []);

  // 初始化主题（仅在客户端运行一次）
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      
      // 从本地存储加载主题
      const savedTheme = loadThemeFromStorage();
      setThemeState(savedTheme);
      
      // 计算并应用实际主题
      const actual = calculateActualTheme(savedTheme);
      setActualTheme(actual);
      applyThemeToDOM(actual);
      
      setIsLoading(false);
    }
  }, [mounted, loadThemeFromStorage, calculateActualTheme, applyThemeToDOM]);

  // 当主题改变时，更新DOM和本地存储
  useEffect(() => {
    if (!mounted) return; // 跳过初始渲染
    
    const actual = calculateActualTheme(theme);
    setActualTheme(actual);
    applyThemeToDOM(actual);
    saveThemeToStorage(theme);
  }, [theme, mounted, calculateActualTheme, applyThemeToDOM, saveThemeToStorage]);

  // 监听系统主题变化（仅在 system 模式下）
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newSystemTheme = getSystemTheme();
      setActualTheme(newSystemTheme);
      applyThemeToDOM(newSystemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, getSystemTheme, applyThemeToDOM]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // 简单的开关切换逻辑
  const toggleTheme = useCallback(() => {
    setThemeState(current => {
      // 如果当前是系统模式，根据当前系统主题切换到相反的手动模式
      if (current === 'system') {
        const systemTheme = getSystemTheme();
        return systemTheme === 'dark' ? 'light' : 'dark';
      }
      // 如果是手动模式，在light和dark之间切换
      return current === 'light' ? 'dark' : 'light';
    });
  }, [getSystemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

