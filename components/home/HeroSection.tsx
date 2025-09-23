'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StandardButton from '@/components/ui/StandardButton';
import StandardIcon from '@/components/ui/StandardIcon';
import StandardCard from '@/components/ui/StandardCard';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardGrid from '@/components/ui/StandardGrid';

interface HeroSectionProps {
  translations?: any;
}

export default function HeroSection({ translations }: HeroSectionProps) {
  const gradient = "from-blue-600 via-purple-600 to-pink-600";
  
  const stats = [
    {
      value: "90%",
      label: "Size Reduction",
      color: "bg-blue-50/50",
      icon: "compress"
    },
    {
      value: "10+",
      label: "Supported Formats",
      color: "bg-green-50/50",
      icon: "image"
    },
    {
      value: "100%",
      label: "Free & Secure",
      color: "bg-purple-50/50",
      icon: "success"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center pt-8 pb-20"
    >
      <StandardContainer variant="content" size="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          {/* 图标 */}
          <div className="flex justify-center mb-8">
            <StandardIcon name="image" size="xl" className="text-blue-600" />
          </div>
          
          <h1 className={`heading-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-8`}>
            {translations?.hero?.title || "Smart Image Processing"}
          </h1>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-8">
            {translations?.hero?.subtitle || "Compress and convert your images with AI-powered precision. Fast, secure, and completely free."}
          </p>
          <p className="text-lg text-slate-600 max-w-5xl mx-auto leading-relaxed">
            {translations?.hero?.description || "Professional-grade image processing tools that work directly in your browser. No uploads, no watermarks, no hidden fees."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <StandardGrid cols={3} gap="md" className="max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StandardCard
                key={index}
                variant="elevated"
                size="md"
                hover
                className={`${stat.color} text-center`}
              >
                <div className="flex flex-col items-center">
                  <StandardIcon 
                    name={stat.icon as any} 
                    size="lg" 
                    className="mb-4 text-blue-600" 
                  />
                  <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              </StandardCard>
            ))}
          </StandardGrid>
        </motion.div>
      </StandardContainer>
    </motion.section>
  );
}