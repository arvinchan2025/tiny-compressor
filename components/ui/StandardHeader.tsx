'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { SupportedLanguage } from '@/types/i18n';
import { getHomePath, getCompressorPath, getConverterPath } from '@/lib/path-utils';
import { switchLanguage } from '@/lib/language-switch';
import LanguageSwitcher from '../LanguageSwitcher';
import SettingsButton from './SettingsButton';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';
import StandardContainer from './StandardContainer';
import Image from 'next/image';

interface StandardHeaderProps {
  currentLocale: SupportedLanguage;
  onLanguageChange: (locale: string) => void;
  translations?: any;
}

export default function StandardHeader({ 
  currentLocale, 
  onLanguageChange, 
  translations 
}: StandardHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 检查当前页面
  const isHomePage = pathname === getHomePath(currentLocale);
  const isCompressorPage = pathname.startsWith(getCompressorPath(currentLocale));
  const isConverterPage = pathname.startsWith(getConverterPath(currentLocale));

  const handleLogoClick = () => {
    router.push(getHomePath(currentLocale));
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = (newLocale: string) => {
    switchLanguage(newLocale, pathname);
  };

  const navItems = [
    {
      key: 'home',
      label: translations?.nav?.home || 'Home',
      path: getHomePath(currentLocale),
      isActive: isHomePage,
      icon: 'home'
    },
    {
      key: 'compressor',
      label: translations?.nav?.compressor || 'Compressor',
      path: getCompressorPath(currentLocale),
      isActive: isCompressorPage,
      icon: 'compress'
    },
    {
      key: 'converter',
      label: translations?.nav?.converter || 'Converter',
      path: getConverterPath(currentLocale),
      isActive: isConverterPage,
      icon: 'convert'
    }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/60' 
          : 'bg-white/90 backdrop-blur-lg border-b border-slate-200/40'
      }`}
    >
      <StandardContainer variant="page" size="lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogoClick}
          >
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="TinyCompressor Logo"
                width={40}
                height={40}
                className="group-hover:scale-110 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-md"
              />
              <motion.div
                className="absolute inset-0 bg-blue-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-80 transition-all duration-300">
                TinyCompressor
              </h1>
              <span className="text-xs text-slate-500 -mt-1 font-medium">
                Image Tools
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                onClick={() => handleNavClick(item.path)}
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  item.isActive
                    ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50/80 hover:shadow-sm'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StandardIcon name={item.icon as any} size="sm" />
                <span>{item.label}</span>
                {item.isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}

            {/* Settings and Language */}
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
              <SettingsButton
                translations={translations?.settings}
              />
              <LanguageSwitcher
                currentLocale={currentLocale}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <SettingsButton
              translations={translations?.settings}
            />
            <LanguageSwitcher
              currentLocale={currentLocale}
              onLanguageChange={handleLanguageChange}
            />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <StandardIcon 
                name={isMobileMenuOpen ? "close" : "menu"} 
                size="md" 
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.key}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                      item.isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <StandardIcon name={item.icon as any} size="sm" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </StandardContainer>
    </motion.header>
  );
}
