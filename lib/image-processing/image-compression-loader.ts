/**
 * Image Compression Library Dynamic Loader
 * 按需加载 browser-image-compression，避免首屏加载
 */

let compressionLibInstance: any = null
let isLoading = false
let loadPromise: Promise<any> | null = null

/**
 * 动态加载 browser-image-compression
 */
export async function loadImageCompression() {
  // 如果已加载，直接返回
  if (compressionLibInstance) {
    return compressionLibInstance
  }
  
  // 如果正在加载，返回加载 Promise
  if (isLoading && loadPromise) {
    return loadPromise
  }
  
  isLoading = true
  
  loadPromise = (async () => {
    try {
      console.log('📸 Loading browser-image-compression...')
      const lib = await import('browser-image-compression')
      compressionLibInstance = lib.default
      console.log('✅ browser-image-compression loaded successfully')
      return lib.default
    } catch (error) {
      console.error('❌ Failed to load browser-image-compression:', error)
      throw error
    } finally {
      isLoading = false
      loadPromise = null
    }
  })()
  
  return loadPromise
}

/**
 * 检查库是否已加载
 */
export function isImageCompressionLoaded(): boolean {
  return compressionLibInstance !== null
}

/**
 * 获取已加载的库实例
 */
export function getImageCompressionInstance() {
  return compressionLibInstance
}

/**
 * 预加载库（可选）
 */
export async function preloadImageCompression(delay: number = 2000): Promise<void> {
  // 延迟预加载，不影响首屏
  setTimeout(() => {
    loadImageCompression().catch(err => {
      console.warn('Preload browser-image-compression failed:', err)
    })
  }, delay)
}


