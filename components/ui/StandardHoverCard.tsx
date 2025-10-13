'use client';

import { motion } from 'framer-motion';
import { hoverEffects, transitions } from '@/lib/micro-interactions';
import StandardCard from './StandardCard';

interface StandardHoverCardProps {
  children: React.ReactNode;
  hoverEffect: 'scale' | 'scaleMedium' | 'lift' | 'liftMedium' | 'rotate' | 'shadow';
  className: string;
  onClick: () => void;
}

export default function StandardHoverCard({
  children,
  hoverEffect = 'scale',
  className = '',
  onClick
}: StandardHoverCardProps) {
  const effect = hoverEffects[hoverEffect];
  
  return (
    <motion.div
      whileHover={effect.whileHover}
      whileTap={effect.whileTap}
      transition={transitions.standard}
      className={className}
      onClick={onClick}
    >
      <StandardCard
        variant="elevated"
        size="sm"
        hover
        className="cursor-pointer"
      >
        {children}
      </StandardCard>
    </motion.div>
  );
}
