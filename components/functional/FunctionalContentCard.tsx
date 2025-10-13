/**
 * 功能页内容卡片组
 * 借鉴主页设计风格，提供统一的内容区
 */

'use client';

import { motion } from 'framer-motion';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardCard from '@/components/ui/StandardCard';

interface FunctionalContentCardProps {
  children: React.ReactNode;
  variant: 'default' | 'elevated' | 'glass';
  className: string;
}

export default function FunctionalContentCard({
  children,
  variant = 'default',
  className = ''
}: FunctionalContentCardProps) {
  const variantClasses = {
    default: 'bg-white shadow-lg border border-slate-200/50',
    elevated: 'bg-white shadow-2xl border border-white/20',
    glass: 'bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20'
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="py-16"
    >
      <StandardContainer variant="content" size="lg">
        <div className="max-w-6xl mx-auto">
          {/* 主内容卡*/}
          <div className="relative">
            {/* 卡片阴影和边*/}
            {variant === 'glass' && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
            )}
            
            <StandardCard
              variant="elevated"
              size="lg"
              hover={false}
              className={`${variantClasses[variant]} ${className}`}
            >
              {/* 内容区域 */}
              <div className="relative z-10">
                {children}
              </div>
            </StandardCard>
          </div>
        </div>
      </StandardContainer>
    </motion.section>
  );
}

