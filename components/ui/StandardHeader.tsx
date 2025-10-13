'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '../LanguageSwitcher';
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
  const { t } = useTranslation('common/navigation', currentLocale);
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
      name: t('nav.home'),
      path: '/',
      isActive: isHomePage,
      icon: 'home'
    },
    {
      name: t('nav.compressor'),
      path: '/compressor',
      isActive: isCompressorPage,
      icon: 'compress'
    },
    {
      name: t('nav.converter'),
      path: '/converter',
      isActive: isConverterPage,
      icon: 'convert'
    }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <StandardContainer variant="content" size="lg" center>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="relative w-8 h-8">
              <Image
                src="/logo.svg"
                alt={t('brand.name')}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {t('brand.name')}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <StandardIcon name={item.icon} size="sm" variant="default" className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher
              currentLocale={currentLocale}
              onLanguageChange={onLanguageChange}
            />

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <StandardIcon 
                name={isMobileMenuOpen ? 'close' : 'menu'} 
                size="md" 
                variant="default" 
                className="w-5 h-5" 
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200"
            >
              <nav className="py-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        item.isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <StandardIcon name={item.icon} size="md" variant="default" className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </StandardContainer>
    </header>
  );
}