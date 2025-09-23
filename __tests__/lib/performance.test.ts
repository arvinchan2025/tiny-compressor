/**
 * 性能工具测试
 */

import { 
  PerformanceMonitor, 
  CacheManager, 
  debounce, 
  throttle, 
  preloadImages,
  MemoryOptimizer,
  PerformanceAnalyzer,
  performanceUtils
} from '@/lib/performance'

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => 1000),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
}

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
})

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    PerformanceMonitor.clearMetrics()
    CacheManager.clear()
    MemoryOptimizer.cleanup()
  })

  describe('PerformanceMonitor', () => {
    it('should start and end timing correctly', () => {
      PerformanceMonitor.startTiming('test')
      PerformanceMonitor.endTiming('test')
      
      const metrics = PerformanceMonitor.getMetrics()
      expect(metrics).toHaveProperty('test_start')
      expect(metrics).toHaveProperty('test_duration')
    })

    it('should return 0 for endTiming when startTiming was not called', () => {
      const duration = PerformanceMonitor.endTiming('nonexistent')
      expect(duration).toBe(0)
    })

    it('should clear metrics', () => {
      PerformanceMonitor.startTiming('test')
      PerformanceMonitor.clearMetrics()
      
      const metrics = PerformanceMonitor.getMetrics()
      expect(Object.keys(metrics)).toHaveLength(0)
    })

    it('should get memory info', () => {
      const memoryInfo = PerformanceMonitor.getMemoryInfo()
      // In test environment, this might be null
      expect(memoryInfo).toBeDefined()
    })
  })

  describe('CacheManager', () => {
    it('should set and get cache correctly', () => {
      CacheManager.set('test', 'value', 1000)
      const value = CacheManager.get('test')
      expect(value).toBe('value')
    })

    it('should return null for expired cache', () => {
      CacheManager.set('test', 'value', 0) // Immediately expired
      const value = CacheManager.get('test')
      expect(value).toBeNull()
    })

    it('should delete cache', () => {
      CacheManager.set('test', 'value')
      expect(CacheManager.delete('test')).toBe(true)
      expect(CacheManager.get('test')).toBeNull()
    })

    it('should return false when deleting non-existent cache', () => {
      expect(CacheManager.delete('nonexistent')).toBe(false)
    })

    it('should clean up expired cache', () => {
      CacheManager.set('test1', 'value1', 1000)
      CacheManager.set('test2', 'value2', 0) // Expired
      
      CacheManager.cleanup()
      
      expect(CacheManager.get('test1')).toBe('value1')
      expect(CacheManager.get('test2')).toBeNull()
    })

    it('should respect max size limit', () => {
      // Set more items than max size
      for (let i = 0; i < 105; i++) {
        CacheManager.set(`test${i}`, `value${i}`)
      }
      
      expect(CacheManager.size()).toBeLessThanOrEqual(100)
    })

    it('should clear all cache', () => {
      CacheManager.set('test', 'value')
      CacheManager.clear()
      expect(CacheManager.size()).toBe(0)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')
      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should throttle function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('preloadImages', () => {
    beforeEach(() => {
      // Mock Image constructor
      global.Image = class {
        onload = null
        onerror = null
        src = ''
      } as any
    })

    it('should preload images successfully', async () => {
      const urls = ['image1.jpg', 'image2.jpg']
      const promise = preloadImages(urls)
      
      // Simulate successful loading
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (img.onload) img.onload({} as any)
      })

      await expect(promise).resolves.toEqual([undefined, undefined])
    })

    it('should handle preload errors', async () => {
      const urls = ['invalid.jpg']
      const promise = preloadImages(urls)
      
      // Simulate error
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (img.onerror) img.onerror({} as any)
      })

      await expect(promise).rejects.toBeDefined()
    })
  })

  describe('MemoryOptimizer', () => {
    it('should register and execute cleanup functions', () => {
      const cleanup1 = jest.fn()
      const cleanup2 = jest.fn()

      MemoryOptimizer.registerCleanup(cleanup1)
      MemoryOptimizer.registerCleanup(cleanup2)

      MemoryOptimizer.cleanup()

      expect(cleanup1).toHaveBeenCalled()
      expect(cleanup2).toHaveBeenCalled()
    })

    it('should handle cleanup function errors gracefully', () => {
      const cleanup = jest.fn(() => {
        throw new Error('Cleanup error')
      })

      MemoryOptimizer.registerCleanup(cleanup)

      // Should not throw
      expect(() => MemoryOptimizer.cleanup()).not.toThrow()
      expect(cleanup).toHaveBeenCalled()
    })

    it('should clear cleanup functions after execution', () => {
      const cleanup = jest.fn()
      MemoryOptimizer.registerCleanup(cleanup)

      MemoryOptimizer.cleanup()
      MemoryOptimizer.cleanup()

      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })

  describe('PerformanceAnalyzer', () => {
    it('should analyze component performance', () => {
      const mockRender = jest.fn()
      
      PerformanceAnalyzer.analyzeComponentPerformance('TestComponent', mockRender)
      
      expect(mockRender).toHaveBeenCalled()
      expect(mockPerformance.now).toHaveBeenCalled()
    })

    it('should warn about slow renders', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      const mockRender = jest.fn()
      
      // Mock slow performance
      let callCount = 0
      mockPerformance.now.mockImplementation(() => {
        callCount++
        return callCount === 1 ? 1000 : 2000 // 1000ms duration
      })

      PerformanceAnalyzer.analyzeComponentPerformance('SlowComponent', mockRender)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow render detected in SlowComponent')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('performanceUtils', () => {
    it('should export all utilities', () => {
      expect(performanceUtils.monitor).toBe(PerformanceMonitor)
      expect(performanceUtils.cache).toBe(CacheManager)
      expect(performanceUtils.memory).toBe(MemoryOptimizer)
      expect(performanceUtils.analyzer).toBe(PerformanceAnalyzer)
      expect(performanceUtils.debounce).toBe(debounce)
      expect(performanceUtils.throttle).toBe(throttle)
      expect(performanceUtils.preloadImages).toBe(preloadImages)
    })
  })
})

