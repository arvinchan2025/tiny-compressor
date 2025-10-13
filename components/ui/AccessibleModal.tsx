'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { keyboardNavigation, ariaLabels } from '@/lib/accessibility';
import { modalAnimations, transitions } from '@/lib/micro-interactions';
import { useTranslation } from '@/hooks/useTranslation';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
  closeOnEscape: boolean;
  className: string;
}

export default function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}: AccessibleModalProps) {
  const { t } = useTranslation('common');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 尺寸样式
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  // 处理关闭
  const handleClose = () => {
    onClose();
    // 恢复焦点到之前的元素
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  };

  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent) => {
    keyboardNavigation.handleKeyDown(event, {
      onEscape: () => {
        if (closeOnEscape) {
          handleClose();
        }
      }
    });
  };

  // 处理遮罩点击
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      handleClose();
    }
  };

  // 焦点管理
  useEffect(() => {
    if (isOpen) {
      // 保存当前焦点元素
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // 设置焦点到模态框
      if (modalRef.current) {
        keyboardNavigation.focusManagement.focusFirst(modalRef.current);
      }
      
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';
      
      // 添加焦点陷阱
      const handleTabKey = (event: KeyboardEvent) => {
        if (modalRef.current) {
          keyboardNavigation.focusManagement.trapFocus(modalRef.current, event);
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleTabKey);
      };
    }
    return undefined;
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={modalAnimations.backdrop.initial}
          animate={modalAnimations.backdrop.animate}
          exit={modalAnimations.backdrop.exit}
          transition={transitions.standard}
          onClick={handleOverlayClick}
        >
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          {/* 模态框内容 */}
          <motion.div
            ref={modalRef}
            className={`relative bg-white rounded-lg shadow-xl w-full ${sizeStyles[size]} ${className}`}
            initial={modalAnimations.content.initial}
            animate={modalAnimations.content.animate}
            exit={modalAnimations.content.exit}
            transition={transitions.standard}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            {...ariaLabels.dialog(title, { modal: true })}
          >
            {/* 标题*/}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
              
              {showCloseButton && (
                <StandardButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  aria-label={t('common.button.close', 'Close modal')}
                  className="p-2"
                >
                  <StandardIcon name="close" size="sm" />
                </StandardButton>
              )}
            </div>
            
            {/* 内容区域 */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
