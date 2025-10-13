/**
 * 现代化SEO组件
 * 优化页面的搜索引擎优化
 */

'use client';

import React from 'react';
import Head from 'next/head';
import { 
  usePngCompressorTranslation, 
  useJpegCompressorTranslation, 
  useWebpCompressorTranslation, 
  useAvifCompressorTranslation,
  useGifCompressorTranslation 
} from '@/hooks/useTranslationNew';

interface ModernSEOProps {
  locale: string;
  format: string;
}

export default function ModernSEO({ locale, format = 'png' }: ModernSEOProps) {
  // 根据格式选择相应的翻译钩子
  const getTranslationHook = () => {
    switch (format.toLowerCase()) {
      case 'png':
        return usePngCompressorTranslation();
      case 'jpeg':
      case 'jpg':
        return useJpegCompressorTranslation();
      case 'webp':
        return useWebpCompressorTranslation();
      case 'avif':
        return useAvifCompressorTranslation();
      case 'gif':
        return useGifCompressorTranslation();
      default:
        return usePngCompressorTranslation();
    }
  };

  const { t } = getTranslationHook();

  const title = t('seo.title') || `${format.toUpperCase()} Compressor - Compress ${format.toUpperCase()} Images Online`;
  const description = t('seo.description') || `Compress ${format.toUpperCase()} images online with advanced optimization. Reduce file size while maintaining quality.`;
  // 确保 keywords 始终是数组
  const keywordsData = t('seo.keywords');
  let keywords: string[];
  
  if (Array.isArray(keywordsData)) {
    keywords = keywordsData;
  } else if (typeof keywordsData === 'string') {
    // 如果是字符串，尝试按逗号分割
    keywords = keywordsData.split(',').map(k => k.trim()).filter(k => k.length > 0);
  } else {
    // 回退到默认关键词
    keywords = [
      `${format.toUpperCase()} compressor`,
      'image compression',
      `${format.toUpperCase()} optimization`,
      'online tool',
      'lossless compression',
      'image optimizer',
      `${format.toUpperCase()} file size reducer`,
      `free ${format.toUpperCase()} compressor`
    ];
  }

  const canonicalUrl = `https://tinycompressor.com/${locale}/compressor/compress-${format}`;
  const ogImage = `https://tinycompressor.com/api/ogtitle=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return (
    <Head>
      {/* 基础SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": title,
            "description": description,
            "url": canonicalUrl,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "TinyCompressor",
              "url": "https://tinycompressor.com"
            },
            "featureList": [
              "Lossless PNG compression",
              "Transparency preservation",
              "Batch processing",
              "Online tool",
              "No file upload required",
              "Privacy-focused"
            ]
          })
        }}
      />
      
      {/* 语言和地区 */}
      <meta httpEquiv="content-language" content={locale} />
      <meta name="language" content={locale} />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* 预加载关键资源 */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* 额外的meta标签 */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* 页面特定meta */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Head>
  );
}
