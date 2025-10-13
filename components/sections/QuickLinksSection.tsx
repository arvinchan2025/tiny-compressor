'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StandardIcon from '@/components/ui/StandardIcon';

interface QuickLink {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

interface QuickLinksSectionProps {
  links: QuickLink[];
  title: string;
  subtitle: string;
}

// 渐变色映射
const gradientColors = {
  blue: 'from-blue-500/20 to-blue-600/20',
  green: 'from-green-500/20 to-green-600/20',
  purple: 'from-purple-500/20 to-purple-600/20',
  orange: 'from-orange-500/20 to-orange-600/20',
  pink: 'from-pink-500/20 to-pink-600/20',
  indigo: 'from-indigo-500/20 to-indigo-600/20',
  teal: 'from-teal-500/20 to-teal-600/20',
  red: 'from-red-500/20 to-red-600/20'
};

// 图标背景色
const iconBgColors = {
  blue: 'bg-blue-500/10 dark:bg-blue-500/20 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30',
  green: 'bg-green-500/10 dark:bg-green-500/20 group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30',
  purple: 'bg-purple-500/10 dark:bg-purple-500/20 group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/30',
  orange: 'bg-orange-500/10 dark:bg-orange-500/20 group-hover:bg-orange-500/20 dark:group-hover:bg-orange-500/30',
  pink: 'bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30',
  indigo: 'bg-indigo-500/10 dark:bg-indigo-500/20 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-500/30',
  teal: 'bg-teal-500/10 dark:bg-teal-500/20 group-hover:bg-teal-500/20 dark:group-hover:bg-teal-500/30',
  red: 'bg-red-500/10 dark:bg-red-500/20 group-hover:bg-red-500/20 dark:group-hover:bg-red-500/30'
};

// 图标颜色
const iconColors = {
  blue: 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300',
  green: 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300',
  purple: 'text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300',
  orange: 'text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300',
  pink: 'text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300',
  indigo: 'text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300',
  teal: 'text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300',
  red: 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300'
};

export default function QuickLinksSection({
  links,
  title = 'Quick Links',
  subtitle = 'Explore related tools and resources'
}: QuickLinksSectionProps) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 relative overflow-hidden transition-colors"
    >
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent" />
      </div>
      
      {/* 装饰圆形 */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* 标题区域 */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <span className="text-white/80 text-sm font-medium">✨ Related Tools</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-blue-100 dark:text-blue-200 max-w-2xl mx-auto transition-colors">
              {subtitle}
            </p>
          </motion.div>
          
          {/* 快捷链接网格 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {links.map((link, index) => {
              const color = (link.color || 'blue') as keyof typeof gradientColors;
              const gradient = gradientColors[color] || gradientColors.blue;
              const iconBg = iconBgColors[color] || iconBgColors.blue;
              const iconColor = iconColors[color] || iconColors.blue;
              
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 1.4 + index * 0.08,
                    ease: "easeOut"
                  }}
                >
                  <Link
                    href={link.href}
                    className="group relative block h-full"
                  >
                    {/* 渐变装饰边框 */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`} />
                    
                    {/* 主卡片 */}
                    <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl p-6 border border-white/40 dark:border-gray-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                      
                      {/* 图标和标题 */}
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <StandardIcon
                            name={link.icon}
                            size="lg"
                            className={`${iconColor} transition-colors duration-300`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                            {link.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* 描述 */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300 flex-1 line-clamp-2 leading-relaxed mb-4">
                        {link.description}
                      </p>
                      
                      {/* 箭头指示器 */}
                      <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        <span className="mr-2">Learn more</span>
                        <StandardIcon
                          name="arrow-right"
                          size="sm"
                          className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300"
                        />
                      </div>
                      
                      {/* 彩色底部装饰条 */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          
          {/* 底部提示 */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            <p className="text-white/60 text-sm">
              🚀 All tools are free, fast, and secure • Process locally in your browser
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
