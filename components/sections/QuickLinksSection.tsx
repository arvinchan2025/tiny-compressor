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

export default function QuickLinksSection({
  links,
  title = 'Quick Links',
  subtitle = 'Explore related tools and resources'
}: QuickLinksSectionProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const colorVariants = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900 hover:from-blue-100 hover:to-blue-200',
    green: 'from-green-50 to-green-100 border-green-200 text-green-900 hover:from-green-100 hover:to-green-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900 hover:from-purple-100 hover:to-purple-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-900 hover:from-orange-100 hover:to-orange-200',
    pink: 'from-pink-50 to-pink-100 border-pink-200 text-pink-900 hover:from-pink-100 hover:to-pink-200',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900 hover:from-indigo-100 hover:to-indigo-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="py-16 bg-gradient-to-br from-slate-50 to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {title}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`block bg-gradient-to-br ${colorVariants[link.color as keyof typeof colorVariants] || colorVariants.blue} p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <StandardIcon
                        name={link.icon}
                        size="lg"
                        className="text-current"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-current transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                        {link.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <StandardIcon
                        name="arrow-right"
                        size="sm"
                        className="text-current opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
