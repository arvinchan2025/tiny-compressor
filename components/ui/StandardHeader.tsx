'use client';

import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Removed to fix build issues
import { useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';
import StandardContainer from './StandardContainer';
import Image from 'next/image';
import { getNavigationPath } from '@/lib/i18n/path-utils';

interface StandardHeaderProps {
  currentLocale: Locale;
  onLanguageChange: (locale: string) => void;
}

export default function StandardHeader({ 
  currentLocale, 
  onLanguageChange 
}: StandardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, isLoading: translationLoading } = useTranslation('common/navigation', currentLocale);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 页面状态检测
  const isHomePage = pathname === `/${currentLocale}` || (currentLocale === 'en' && pathname === '/');
  const isCompressorPage = pathname.includes('/compressor');
  const isConverterPage = pathname.includes('/converter');

  const handleLogoClick = () => {
    const homePath = getNavigationPath('/', currentLocale);
    window.location.href = homePath;
  };

  const handleNavClick = (path: string) => {
    const fullPath = getNavigationPath(path, currentLocale);
    window.location.href = fullPath;
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      name: translationLoading ? 'Home' : t('nav.home'),
      path: '/',
      isActive: isHomePage,
      icon: 'home'
    },
    {
      name: translationLoading ? 'Compressor' : t('nav.compressor'),
      path: '/compressor',
      isActive: isCompressorPage,
      icon: 'compress'
    },
    {
      name: translationLoading ? 'Converter' : t('nav.converter'),
      path: '/converter',
      isActive: isConverterPage,
      icon: 'convert'
    }
  ];

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <StandardContainer variant="content" size="lg" center>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="relative w-8 h-8">
              <Image
                src="/logo.svg"
                alt={translationLoading ? 'TinyCompressor' : t('brand.name')}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {translationLoading ? 'TinyCompressor' : t('brand.name')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <div
                key={item.name}
              >
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.isActive
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <StandardIcon name={item.icon} size="sm" variant="default" className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Switcher */}
            <div className="hidden lg:block">
              <ThemeSwitcher />
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher
              currentLocale={currentLocale}
              onLanguageChange={onLanguageChange}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <StandardIcon 
                name={isMobileMenuOpen ? 'close' : 'menu'} 
                size="md" 
                variant="default" 
                className="w-5 h-5" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
            <div
              className="md:hidden border-t border-gray-200 dark:border-gray-800"
            >
              <nav className="py-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <div
                    key={item.name}
                  >
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        item.isActive
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <StandardIcon name={item.icon} size="md" variant="default" className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </div>
                ))}
              </nav>
            </div>
        )}
      </StandardContainer>
    </header>
  );
}