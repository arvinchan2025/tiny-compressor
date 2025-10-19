'use client';

import React from 'react';
import Link from 'next/link';

interface CTAQuickLinksProps {
  title: string;
  description?: string;
  items: Array<{
    title: string;
    description: string;
    url: string;
    icon?: string;
  }>;
  className?: string;
  maxItems?: number;
}

export default function CTAQuickLinks({
  title,
  description,
  items,
  className = '',
  maxItems = 6
}: CTAQuickLinksProps) {
  // 限制显示的项目数量
  const displayItems = items.slice(0, maxItems);

  return (
    <section className={`py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 relative overflow-hidden ${className}`}>
      {/* Background Decorative Layers */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-blue-100 dark:text-blue-200">
              {description}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {displayItems.map((item, index) => (
            <Link key={index} href={item.url} className="group block h-full">
              <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-4 shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* 强制卡片背景 */}
                <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                
                <div className="relative z-10 flex items-start gap-3 flex-1">
                  {/* Icon - 变小 */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      {item.icon ? (
                        <span className="text-sm text-white">{item.icon}</span>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Content - 紧凑布局 */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="text-base font-semibold text-white mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-blue-100 text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Arrow - 变小 */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
