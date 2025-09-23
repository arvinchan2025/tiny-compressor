/**
 * 响应式工具测试
 */

import { responsive, breakpoints, mediaQueries, gridConfig, typography, spacing } from '@/lib/responsive'

describe('Responsive Utilities', () => {
  describe('breakpoints', () => {
    it('should have all required breakpoints', () => {
      expect(breakpoints.xs).toBe('320px')
      expect(breakpoints.sm).toBe('640px')
      expect(breakpoints.md).toBe('768px')
      expect(breakpoints.lg).toBe('1024px')
      expect(breakpoints.xl).toBe('1280px')
      expect(breakpoints['2xl']).toBe('1536px')
    })
  })

  describe('mediaQueries', () => {
    it('should have correct media query strings', () => {
      expect(mediaQueries.sm).toBe('(min-width: 640px)')
      expect(mediaQueries.md).toBe('(min-width: 768px)')
      expect(mediaQueries.lg).toBe('(min-width: 1024px)')
      expect(mediaQueries.mobile).toBe('(max-width: 768px)')
      expect(mediaQueries.desktop).toBe('(min-width: 1024px)')
    })
  })

  describe('responsive utilities', () => {
    describe('getResponsiveClass', () => {
      it('should return mobile class by default', () => {
        const config = {
          mobile: 'text-sm',
          tablet: 'text-base',
          desktop: 'text-lg'
        }
        expect(responsive.getResponsiveClass(config)).toBe('text-sm')
      })

      it('should return specified breakpoint class', () => {
        const config = {
          mobile: 'text-sm',
          tablet: 'text-base',
          desktop: 'text-lg'
        }
        expect(responsive.getResponsiveClass(config, 'tablet')).toBe('text-base')
      })

      it('should return empty string for unknown breakpoint', () => {
        const config = {
          mobile: 'text-sm'
        }
        expect(responsive.getResponsiveClass(config, 'unknown')).toBe('')
      })
    })

    describe('getGridClass', () => {
      it('should return default grid class when no columns specified', () => {
        const result = responsive.getGridClass()
        expect(result).toContain('grid')
        expect(result).toContain('grid-cols-1')
        expect(result).toContain('md:grid-cols-2')
      })

      it('should return correct grid class for specified columns', () => {
        expect(responsive.getGridClass(1)).toBe('grid grid-cols-1')
        expect(responsive.getGridClass(2)).toBe('grid grid-cols-1 md:grid-cols-2')
        expect(responsive.getGridClass(3)).toBe('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
        expect(responsive.getGridClass(4)).toBe('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')
      })

      it('should return default grid class for unknown column count', () => {
        expect(responsive.getGridClass(999)).toBe('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')
      })
    })

    describe('getSpacingClass', () => {
      it('should return mobile spacing by default', () => {
        expect(responsive.getSpacingClass('container')).toBe('px-4 py-8')
        expect(responsive.getSpacingClass('section')).toBe('py-8')
        expect(responsive.getSpacingClass('card')).toBe('p-4')
      })

      it('should return specified breakpoint spacing', () => {
        expect(responsive.getSpacingClass('container', 'tablet')).toBe('px-6 py-12')
        expect(responsive.getSpacingClass('section', 'desktop')).toBe('py-16')
      })
    })

    describe('getTypographyClass', () => {
      it('should return mobile typography by default', () => {
        expect(responsive.getTypographyClass('h1')).toBe('text-3xl')
        expect(responsive.getTypographyClass('body')).toBe('text-sm')
      })

      it('should return specified breakpoint typography', () => {
        expect(responsive.getTypographyClass('h1', 'tablet')).toBe('text-4xl')
        expect(responsive.getTypographyClass('h1', 'desktop')).toBe('text-5xl')
      })
    })

    describe('getDeviceType', () => {
      it('should return correct device type for different widths', () => {
        expect(responsive.getDeviceType(320)).toBe('mobile')
        expect(responsive.getDeviceType(640)).toBe('tablet')
        expect(responsive.getDeviceType(1024)).toBe('desktop')
        expect(responsive.getDeviceType(1600)).toBe('large')
      })
    })

    describe('getImageClass', () => {
      it('should return correct image classes', () => {
        expect(responsive.getImageClass('square')).toContain('aspect-square')
        expect(responsive.getImageClass('video')).toContain('aspect-video')
        expect(responsive.getImageClass('wide')).toContain('aspect-[16/9]')
        expect(responsive.getImageClass('tall')).toContain('aspect-[3/4]')
      })

      it('should default to video aspect ratio', () => {
        expect(responsive.getImageClass()).toContain('aspect-video')
      })
    })

    describe('getButtonClass', () => {
      it('should return correct button classes', () => {
        expect(responsive.getButtonClass('sm')).toContain('px-4 py-2 text-sm')
        expect(responsive.getButtonClass('md')).toContain('px-6 py-3 text-base')
        expect(responsive.getButtonClass('lg')).toContain('px-8 py-4 text-lg')
      })

      it('should include full width class when specified', () => {
        expect(responsive.getButtonClass('md', true)).toContain('w-full')
        expect(responsive.getButtonClass('md', false)).toContain('w-auto')
      })
    })
  })

  describe('configuration objects', () => {
    it('should have correct grid configuration', () => {
      expect(gridConfig.mobile.columns).toBe(1)
      expect(gridConfig.tablet.columns).toBe(2)
      expect(gridConfig.desktop.columns).toBe(3)
      expect(gridConfig.large.columns).toBe(4)
    })

    it('should have correct typography configuration', () => {
      expect(typography.h1.mobile).toBe('text-3xl')
      expect(typography.h1.desktop).toBe('text-5xl')
      expect(typography.body.mobile).toBe('text-sm')
      expect(typography.body.desktop).toBe('text-lg')
    })

    it('should have correct spacing configuration', () => {
      expect(spacing.container.mobile).toBe('px-4 py-8')
      expect(spacing.section.mobile).toBe('py-8')
      expect(spacing.card.mobile).toBe('p-4')
    })
  })
})

