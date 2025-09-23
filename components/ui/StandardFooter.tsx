'use client';

import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import { getHomePath, getConverterPath, getPrivacyPath, getTermsPath } from '@/lib/path-utils';
import StandardContainer from './StandardContainer';
import StandardGrid from './StandardGrid';
import StandardIcon from './StandardIcon';
import Image from 'next/image';

interface StandardFooterProps {
  translations: any;
  currentLocale?: SupportedLanguage;
}

export default function StandardFooter({ 
  translations, 
  currentLocale = 'en' 
}: StandardFooterProps) {
  const t = (key: string) => {
    if (!translations) return key;
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { 
      name: t('footer.links.home') || 'Home', 
      path: getHomePath(currentLocale),
      icon: 'home'
    },
    { 
      name: t('footer.links.compressor') || 'Compressor', 
      path: getHomePath(currentLocale),
      icon: 'compress'
    },
    { 
      name: t('footer.links.converter') || 'Converter', 
      path: getConverterPath(currentLocale),
      icon: 'convert'
    }
  ];

  const legalLinks = [
    { 
      name: t('footer.links.privacy') || 'Privacy Policy', 
      path: getPrivacyPath(currentLocale),
      icon: 'info'
    },
    { 
      name: t('footer.links.terms') || 'Terms of Service', 
      path: getTermsPath(currentLocale),
      icon: 'info'
    }
  ];

  const features = [
    {
      icon: 'success',
      title: t('footer.features.free') || '100% Free',
      description: t('footer.features.freeDesc') || 'No hidden costs or subscriptions'
    },
    {
      icon: 'success',
      title: t('footer.features.secure') || 'Secure & Private',
      description: t('footer.features.secureDesc') || 'Files processed locally in your browser'
    },
    {
      icon: 'success',
      title: t('footer.features.fast') || 'Lightning Fast',
      description: t('footer.features.fastDesc') || 'Optimized for speed and performance'
    }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <StandardContainer variant="page" size="lg">
        <div className="py-16">
          <StandardGrid cols={4} gap="lg">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Image
                    src="/logo.svg"
                    alt="TinyCompressor Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      TinyCompressor
                    </h3>
                    <p className="text-sm text-gray-400">Image Tools</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
                  {t('footer.description') || 'Professional-grade image compression and conversion tools that are fast, secure, and completely free.'}
                </p>
                
                {/* Features */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <StandardIcon 
                        name={feature.icon as any} 
                        size="sm" 
                        className="text-green-400" 
                      />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {feature.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {feature.description}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">
                {t('footer.quickLinks') || 'Quick Links'}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <StandardIcon 
                        name={link.icon as any} 
                        size="sm" 
                        className="mr-3 group-hover:text-white transition-colors duration-200" 
                      />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">
                {t('footer.legal') || 'Legal & Support'}
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <StandardIcon 
                        name={link.icon as any} 
                        size="sm" 
                        className="mr-3 group-hover:text-white transition-colors duration-200" 
                      />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </StandardGrid>
        </div>
      </StandardContainer>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <StandardContainer variant="page" size="lg">
          <div className="py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>© {currentYear} TinyCompressor. All rights reserved.</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center space-x-1">
                  <span>Made with</span>
                  <StandardIcon name="success" size="sm" className="text-red-400" />
                  <span>for developers</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <StandardIcon name="success" size="sm" className="text-green-400" />
                <span>Free & Open Source</span>
              </div>
            </div>
          </div>
        </StandardContainer>
      </div>
    </footer>
  );
}
