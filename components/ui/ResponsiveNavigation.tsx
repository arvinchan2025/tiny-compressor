'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/lib/responsive-utils';
import { transitions, commonVariants } from '@/lib/micro-interactions';
import StandardButton from './StandardButton';
import StandardIcon from './StandardIcon';

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

interface ResponsiveNavigationProps {
  items: NavigationItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export default function ResponsiveNavigation({
  items,
  currentPath = '',
  onNavigate,
  className = ''
}: ResponsiveNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const responsive = useResponsive();

  // 关闭菜单当窗口大小改变时
  useEffect(() => {
    const handleResize = () => {
      if (responsive.deviceType !== 'mobile') {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive.deviceType]);

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      setActiveItem(activeItem === item.href ? null : item.href);
    } else {
      onNavigate?.(item.href);
      setIsOpen(false);
    }
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = currentPath === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = activeItem === item.href;

    return (
      <div key={item.href} className="relative">
        <StandardButton
          variant={isActive ? 'primary' : 'ghost'}
          size="md"
          onClick={() => handleItemClick(item)}
          className={`w-full justify-start ${level > 0 ? 'ml-4' : ''}`}
          leftIcon={item.icon ? <StandardIcon name={item.icon} size="sm" /> : undefined}
          rightIcon={hasChildren ? (
            <StandardIcon 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size="sm" 
            />
          ) : undefined}
        >
          {item.label}
        </StandardButton>

        {/* 子菜单 */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={transitions.standard}
              className="mt-2 space-y-1"
            >
              {item.children!.map((child) => renderNavigationItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // 移动端导航
  if (responsive.deviceType === 'mobile') {
    return (
      <div className={`relative ${className}`}>
        {/* 移动端菜单按钮 */}
        <StandardButton
          variant="ghost"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          leftIcon={<StandardIcon name="menu" size="sm" />}
          className="lg:hidden"
        >
          菜单
        </StandardButton>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 背景遮罩 */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.fast}
                onClick={() => setIsOpen(false)}
              />

              {/* 菜单内容 */}
              <motion.div
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={transitions.standard}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">导航菜单</h2>
                  <StandardButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    leftIcon={<StandardIcon name="close" size="sm" />}
                  >
                    关闭
                  </StandardButton>
                </div>

                <nav className="space-y-2">
                  {items.map((item) => renderNavigationItem(item))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 平板端导航
  if (responsive.deviceType === 'tablet') {
    return (
      <nav className={`flex flex-wrap gap-2 ${className}`}>
        {items.map((item) => (
          <div key={item.href} className="relative group">
            <StandardButton
              variant={currentPath === item.href ? 'primary' : 'ghost'}
              size="md"
              onClick={() => handleItemClick(item)}
              leftIcon={item.icon ? <StandardIcon name={item.icon} size="sm" /> : undefined}
              rightIcon={item.children ? (
                <StandardIcon 
                  name={activeItem === item.href ? 'chevron-up' : 'chevron-down'} 
                  size="sm" 
                />
              ) : undefined}
            >
              {item.label}
            </StandardButton>

            {/* 下拉菜单 */}
            <AnimatePresence>
              {item.children && activeItem === item.href && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={transitions.standard}
                >
                  <div className="p-2 space-y-1">
                    {item.children.map((child) => (
                      <StandardButton
                        key={child.href}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleItemClick(child)}
                        className="w-full justify-start"
                        leftIcon={child.icon ? <StandardIcon name={child.icon} size="sm" /> : undefined}
                      >
                        {child.label}
                      </StandardButton>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    );
  }

  // 桌面端导航
  return (
    <nav className={`flex items-center space-x-1 ${className}`}>
      {items.map((item) => (
        <div key={item.href} className="relative group">
          <StandardButton
            variant={currentPath === item.href ? 'primary' : 'ghost'}
            size="md"
            onClick={() => handleItemClick(item)}
            leftIcon={item.icon ? <StandardIcon name={item.icon} size="sm" /> : undefined}
            rightIcon={item.children ? (
              <StandardIcon 
                name={activeItem === item.href ? 'chevron-up' : 'chevron-down'} 
                size="sm" 
              />
            ) : undefined}
          >
            {item.label}
          </StandardButton>

          {/* 下拉菜单 */}
          <AnimatePresence>
            {item.children && activeItem === item.href && (
              <motion.div
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={transitions.standard}
              >
                <div className="p-2 space-y-1">
                  {item.children.map((child) => (
                    <StandardButton
                      key={child.href}
                      variant="ghost"
                      size="md"
                      onClick={() => handleItemClick(child)}
                      className="w-full justify-start"
                      leftIcon={child.icon ? <StandardIcon name={child.icon} size="sm" /> : undefined}
                    >
                      {child.label}
                    </StandardButton>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
}
