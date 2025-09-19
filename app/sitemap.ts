import { MetadataRoute } from 'next'
import { generateSitemapUrls } from '../lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tinycompressor.com'
  const urls = generateSitemapUrls(baseUrl)
  
  return urls.map(url => ({
    url: url.loc,
    lastModified: new Date(url.lastmod),
    changeFrequency: url.changefreq as 'weekly' | 'monthly',
    priority: parseFloat(url.priority),
  }))
}
