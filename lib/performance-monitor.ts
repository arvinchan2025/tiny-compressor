/**
 * 翻译系统性能监控工具
 * 监控翻译加载性能、缓存命中率等指标
 */

interface PerformanceMetrics {
  loadTimes: Map<string, number>
  cacheHits: number
  cacheMisses: number
  totalRequests: number
  averageLoadTime: number
  errorCount: number
}

interface LoadEvent {
  module: string
  startTime: number
  endTime?: number
  success?: boolean
  error?: string
}

/**
 * 性能监控器类
 */
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTimes: new Map(),
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
    averageLoadTime: 0,
    errorCount: 0
  }

  private activeLoads = new Map<string, LoadEvent>()
  private isEnabled = true

  /**
   * 开始监控加载
   */
  startLoad(module: string): void {
    if (!this.isEnabled) return

    this.activeLoads.set(module, {
      module,
      startTime: performance.now()
    })
  }

  /**
   * 结束监控加载
   */
  endLoad(module: string, success: boolean, error?: string): void {
    if (!this.isEnabled) return

    const loadEvent = this.activeLoads.get(module)
    if (!loadEvent) return

    loadEvent.endTime = performance.now()
    loadEvent.success = success
    if (error) {
      loadEvent.error = error
    }

    this.activeLoads.delete(module)
    this.updateMetrics(loadEvent)
  }

  /**
   * 记录缓存命中
   */
  recordCacheHit(): void {
    if (!this.isEnabled) return
    this.metrics.cacheHits++
    this.metrics.totalRequests++
  }

  /**
   * 记录缓存未命中
   */
  recordCacheMiss(): void {
    if (!this.isEnabled) return
    this.metrics.cacheMisses++
    this.metrics.totalRequests++
  }

  /**
   * 更新指标
   */
  private updateMetrics(loadEvent: LoadEvent): void {
    if (!loadEvent.endTime) return

    const loadTime = loadEvent.endTime - loadEvent.startTime
    this.metrics.loadTimes.set(loadEvent.module, loadTime)

    if (!loadEvent.success) {
      this.metrics.errorCount++
    }

    this.updateAverageLoadTime()
  }

  /**
   * 更新平均加载时间
   */
  private updateAverageLoadTime(): void {
    const times = Array.from(this.metrics.loadTimes.values())
    if (times.length > 0) {
      this.metrics.averageLoadTime = times.reduce((sum, time) => sum + time, 0) / times.length
    }
  }

  /**
   * 获取性能报告
   */
  getReport(): {
    metrics: PerformanceMetrics
    cacheHitRate: number
    recommendations: string[]
  } {
    const cacheHitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100 
      : 0

    const recommendations: string[] = []

    // 分析性能并给出建议
    if (cacheHitRate < 70) {
      recommendations.push('缓存命中率较低，考虑增加预加载策略')
    }

    if (this.metrics.averageLoadTime > 1000) {
      recommendations.push('平均加载时间过长，考虑优化网络请求或增加并发数')
    }

    if (this.metrics.errorCount > this.metrics.totalRequests * 0.1) {
      recommendations.push('错误率过高，检查网络连接和API稳定性')
    }

    if (this.metrics.loadTimes.size > 50) {
      recommendations.push('加载时间记录过多，考虑定期清理历史数据')
    }

    return {
      metrics: { ...this.metrics },
      cacheHitRate,
      recommendations
    }
  }

  /**
   * 重置指标
   */
  reset(): void {
    this.metrics = {
      loadTimes: new Map(),
      cacheHits: 0,
      cacheMisses: 0,
      totalRequests: 0,
      averageLoadTime: 0,
      errorCount: 0
    }
    this.activeLoads.clear()
  }

  /**
   * 清理旧数据
   */
  cleanup(): void {
    // 保留最近100个加载时间记录
    if (this.metrics.loadTimes.size > 100) {
      const entries = Array.from(this.metrics.loadTimes.entries())
      const recentEntries = entries.slice(-100)
      this.metrics.loadTimes = new Map(recentEntries)
    }
  }

  /**
   * 启用/禁用监控
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * 检查是否启用
   */
  isMonitoringEnabled(): boolean {
    return this.isEnabled
  }

  /**
   * 获取实时状态
   */
  getStatus(): {
    activeLoads: number
    totalRequests: number
    errorCount: number
    averageLoadTime: number
    cacheHitRate: number
  } {
    const cacheHitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100 
      : 0

    return {
      activeLoads: this.activeLoads.size,
      totalRequests: this.metrics.totalRequests,
      errorCount: this.metrics.errorCount,
      averageLoadTime: this.metrics.averageLoadTime,
      cacheHitRate
    }
  }
}

// 创建单例实例
export const performanceMonitor = new PerformanceMonitor()

// 导出类以便测试
export { PerformanceMonitor }

