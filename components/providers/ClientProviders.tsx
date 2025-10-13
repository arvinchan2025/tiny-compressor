/**
 * 客户端Provider组件
 * 包装所有需要在客户端运行的Provider
 */

'use client';

import { ReactNode } from 'react';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
// import TranslationPreloader from './TranslationPreloader';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        {/* <TranslationPreloader locale="en" /> */}
        {children}
      </SettingsProvider>
    </ThemeProvider>
  );
}
