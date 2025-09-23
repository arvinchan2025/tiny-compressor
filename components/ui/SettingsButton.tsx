/**
 * 设置配置按钮组件
 * 触发设置弹窗
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';

interface SettingsButtonProps {
  className?: string;
  translations?: any;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ 
  className = '', 
  translations = {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* 设置按钮 */}
      <motion.button
        onClick={handleOpen}
        className={`p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={translations.settings || 'Settings'}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* 设置弹窗 */}
      <SettingsModal
        isOpen={isOpen}
        onClose={handleClose}
        translations={translations}
      />
    </>
  );
};

export default SettingsButton;
