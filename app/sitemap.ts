import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tinycompressor.com'
  // 最后更新：2025-10-15
  const lastModified = new Date('2025-10-15')
  
  // 支持的所有11种语言
  const locales = ['en', 'zh', 'ja', 'ko', 'ar', 'de', 'es', 'fr', 'it', 'pt', 'ru']
  
  // 所有压缩器页面
  const compressorPages = [
    '/compressor/compress-png',
    '/compressor/compress-jpeg',
    '/compressor/compress-webp',
    '/compressor/compress-avif',
    '/compressor/compress-gif',
    '/compressor/compress-bmp',
    '/compressor/compress-pdf',
    '/compressor/compress-video',
  ]
  
  // 所有转换器页面
  const converterPages = [
    '/converter/convert-heic-to-jpg',
    '/converter/convert-jpg-to-avif',
    '/converter/convert-jpg-to-png',
    '/converter/convert-jpg-to-webp',
    '/converter/convert-png-to-avif',
    '/converter/convert-png-to-jpg',
    '/converter/convert-png-to-webp',
    '/converter/convert-webp-to-avif',
    '/converter/convert-webp-to-jpg',
    '/converter/convert-webp-to-png',
  ]
  
  // 常规页面
  const staticPages = [
    '',           // 首页
    '/privacy',   // 隐私政策
    '/terms',     // 服务条款
    '/compressor', // 压缩器主页
    '/converter',  // 转换器主页
  ]
  
  // 合并所有页面
  const allPages = [...staticPages, ...compressorPages, ...converterPages]
  
  const urls: MetadataRoute.Sitemap = []
  
  // 为每种语言生成所有页面的URL
  locales.forEach(locale => {
    allPages.forEach(page => {
      // 确定优先级
      let priority = 0.8
      if (page === '') {
        priority = 1.0 // 首页最高优先级
      } else if (page === '/compressor' || page === '/converter') {
        priority = 0.95 // 功能主页高优先级
      } else if (compressorPages.includes(page) || converterPages.includes(page)) {
        priority = 0.9 // 核心功能页面高优先级
      } else {
        priority = 0.7 // 静态页面较低优先级
      }
      
      // 确定更新频率
      const changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 
        page === '' ? 'daily' : 
        (page === '/compressor' || page === '/converter') ? 'weekly' :
        (compressorPages.includes(page) || converterPages.includes(page)) ? 'weekly' : 
        'monthly'
      
      // 英语作为默认语言，不需要语言前缀
      const url = locale === 'en' 
        ? `${baseUrl}${page}`
        : `${baseUrl}/${locale}${page}`
      
      urls.push({
        url,
        lastModified,
        changeFrequency,
        priority,
      })
    })
  })
  
  return urls
}
