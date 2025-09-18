'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Translations } from '@/lib/translations';
import LogoIcon from '/public/logo.svg';

interface HeaderProps {
  translations: Translations;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function Header({ translations, currentLanguage, onLanguageChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    // 根据当前语言跳转到主页
    const homePath = currentLanguage === 'en' ? '/' : `/${currentLanguage}`;
    router.push(homePath);
  };


  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50' 
          : 'bg-white/80 backdrop-blur-sm border-b border-neutral-200/30'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoClick}
            title={currentLanguage === 'en' ? 'Go to Homepage' : '返回主页'}
          >
            <div className="relative">
              <LogoIcon 
                className="w-10 h-10 group-hover:scale-110 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-md"
              />
              <motion.div
                className="absolute inset-0 bg-primary-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <h1 className="text-2xl font-bold gradient-text group-hover:opacity-80 transition-opacity duration-200">TinyCompressor</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
          </nav>

          {/* Mobile Language Switcher */}
          <div className="flex items-center space-x-4 lg:hidden">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>

        {/* Mobile Menu - Removed navigation items, keeping only language switcher */}
      </div>
    </motion.header>
  );
}
