import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tinycompressor.com'
  const lastModified = new Date('2025-09-18')
  
  // 支持的语言列表
  const languages = ['en', 'zh', 'es', 'de', 'fr']
  
  // 生成所有语言的主页
  const homePages = languages.map(lang => ({
    url: lang === 'en' ? baseUrl : `${baseUrl}/${lang}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }))
  
  // 生成所有语言的隐私政策页面
  const privacyPages = languages.map(lang => ({
    url: lang === 'en' ? `${baseUrl}/privacy` : `${baseUrl}/${lang}/privacy`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  // 生成所有语言的服务条款页面
  const termsPages = languages.map(lang => ({
    url: lang === 'en' ? `${baseUrl}/terms` : `${baseUrl}/${lang}/terms`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [
    ...homePages,
    ...privacyPages,
    ...termsPages,
  ]
}
