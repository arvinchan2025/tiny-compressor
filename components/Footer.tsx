'use client';

import { motion } from 'framer-motion';
import { ImageIcon, Heart, Github, Twitter, Mail } from 'lucide-react';
import { Translations } from '@/lib/translations';

interface FooterProps {
  translations: Translations;
  locale?: string;
}

export default function Footer({ translations, locale = 'en' }: FooterProps) {

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-2 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <ImageIcon className="w-8 h-8 text-primary-400" />
                <motion.div
                  className="absolute inset-0 bg-primary-500/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-2xl font-bold">TinyCompressor</span>
            </motion.div>
            <p className="text-gray-300 text-lg mb-6 max-w-md">
              {translations.footer.description}
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:contact@tinycompressor.com"
                className="p-2 bg-gray-700 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{translations.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={locale === 'en' ? '/#features' : `/${locale}/#features`}
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  {translations.nav.features}
                </a>
              </li>
              <li>
                <a
                  href={locale === 'en' ? '/#how-it-works' : `/${locale}/#how-it-works`}
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  {translations.howItWorks.title}
                </a>
              </li>
              <li>
                <a
                  href={locale === 'en' ? '/#faq' : `/${locale}/#faq`}
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  {translations.faq.title}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{translations.footer.legal}</h3>
            <ul className="space-y-3">
              <li>
                <a href={locale === 'en' ? '/privacy' : `/${locale}/privacy`} className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  {translations.footer.privacy}
                </a>
              </li>
              <li>
                <a href={locale === 'en' ? '/terms' : `/${locale}/terms`} className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  {translations.footer.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-700 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              {translations.footer.copyright}
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>for the community</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
