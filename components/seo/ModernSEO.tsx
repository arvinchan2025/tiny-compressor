'use client';

import React from 'react';
import Head from 'next/head';

interface ModernSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  locale?: string;
  structuredData?: any;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function ModernSEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  locale = 'en',
  structuredData,
  noindex = false,
  nofollow = false
}: ModernSEOProps) {
  const fullTitle = `${title} | TinyCompressor`;
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content="TinyCompressor" />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3b82f6" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="TinyCompressor" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@TinyCompressor" />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="TinyCompressor" />
      <meta name="apple-mobile-web-app-title" content="TinyCompressor" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
}

// 预定义的SEO配置
export const seoConfigs = {
  home: {
    title: 'Professional Image Compression & Conversion Tools',
    description: 'Free online image compressor and converter. Reduce file sizes by up to 90% while maintaining quality. Support for PNG, JPEG, WebP, AVIF, GIF, and BMP formats.',
    keywords: [
      'image compressor',
      'image converter',
      'free image optimization',
      'PNG compressor',
      'JPEG compressor',
      'WebP converter',
      'AVIF converter',
      'image size reduction',
      'online image tools',
      'batch image processing'
    ]
  },
  
  compressor: {
    png: {
      title: 'PNG Image Compressor - Free Online PNG Optimization Tool',
      description: 'Compress PNG images online for free. Reduce PNG file sizes by up to 90% while maintaining quality and transparency. Batch processing supported.',
      keywords: [
        'PNG compressor',
        'PNG optimization',
        'PNG file size reduction',
        'lossless PNG compression',
        'PNG transparency',
        'online PNG tools'
      ]
    },
    jpeg: {
      title: 'JPEG Image Compressor - Free Online JPEG Optimization Tool',
      description: 'Compress JPEG images online for free. Reduce JPEG file sizes while maintaining photo quality. Advanced quality control and batch processing.',
      keywords: [
        'JPEG compressor',
        'JPEG optimization',
        'JPEG file size reduction',
        'photo compression',
        'JPEG quality control',
        'online JPEG tools'
      ]
    },
    webp: {
      title: 'WebP Image Compressor - Free Online WebP Optimization Tool',
      description: 'Compress WebP images online for free. Optimize WebP files for web delivery with superior compression and quality preservation.',
      keywords: [
        'WebP compressor',
        'WebP optimization',
        'WebP file size reduction',
        'modern image format',
        'web optimization',
        'online WebP tools'
      ]
    },
    avif: {
      title: 'AVIF Image Compressor - Free Online AVIF Optimization Tool',
      description: 'Compress AVIF images online for free. Next-generation AVIF format compression with advanced algorithms and superior quality.',
      keywords: [
        'AVIF compressor',
        'AVIF optimization',
        'AVIF file size reduction',
        'next-gen image format',
        'advanced compression',
        'online AVIF tools'
      ]
    },
    gif: {
      title: 'GIF Image Compressor - Free Online GIF Optimization Tool',
      description: 'Compress GIF images online for free. Reduce GIF file sizes while preserving animations. Perfect for web and social media.',
      keywords: [
        'GIF compressor',
        'GIF optimization',
        'GIF file size reduction',
        'animated GIF compression',
        'GIF animation',
        'online GIF tools'
      ]
    },
    bmp: {
      title: 'BMP Image Compressor - Free Online BMP Optimization Tool',
      description: 'Compress BMP images online for free. Convert and optimize BMP files to more efficient formats while maintaining quality.',
      keywords: [
        'BMP compressor',
        'BMP optimization',
        'BMP file size reduction',
        'bitmap compression',
        'BMP conversion',
        'online BMP tools'
      ]
    }
  },

  converter: {
    'png-to-jpg': {
      title: 'PNG to JPEG Converter - Free Online PNG to JPG Conversion',
      description: 'Convert PNG images to JPEG format online for free. Maintain photo quality while reducing file sizes. Batch conversion supported.',
      keywords: [
        'PNG to JPEG',
        'PNG to JPG',
        'PNG converter',
        'image format conversion',
        'PNG to JPEG online',
        'free image converter'
      ]
    },
    'png-to-webp': {
      title: 'PNG to WebP Converter - Free Online PNG to WebP Conversion',
      description: 'Convert PNG images to WebP format online for free. Superior compression with transparency support. Perfect for web optimization.',
      keywords: [
        'PNG to WebP',
        'PNG converter',
        'WebP conversion',
        'modern image format',
        'PNG to WebP online',
        'free image converter'
      ]
    },
    'png-to-avif': {
      title: 'PNG to AVIF Converter - Free Online PNG to AVIF Conversion',
      description: 'Convert PNG images to AVIF format online for free. Next-generation compression with advanced algorithms and superior quality.',
      keywords: [
        'PNG to AVIF',
        'PNG converter',
        'AVIF conversion',
        'next-gen format',
        'PNG to AVIF online',
        'free image converter'
      ]
    },
    'jpeg-to-png': {
      title: 'JPEG to PNG Converter - Free Online JPEG to PNG Conversion',
      description: 'Convert JPEG images to PNG format online for free. Add transparency and lossless compression. Batch processing supported.',
      keywords: [
        'JPEG to PNG',
        'JPEG converter',
        'PNG conversion',
        'lossless format',
        'JPEG to PNG online',
        'free image converter'
      ]
    },
    'webp-to-png': {
      title: 'WebP to PNG Converter - Free Online WebP to PNG Conversion',
      description: 'Convert WebP images to PNG format online for free. Maintain quality and transparency. Perfect for compatibility.',
      keywords: [
        'WebP to PNG',
        'WebP converter',
        'PNG conversion',
        'format compatibility',
        'WebP to PNG online',
        'free image converter'
      ]
    },
    'jpeg-to-webp': {
      title: 'JPEG to WebP Converter - Free Online JPEG to WebP Conversion',
      description: 'Convert JPEG images to WebP format online for free. Superior compression for photos with better quality preservation.',
      keywords: [
        'JPEG to WebP',
        'JPEG converter',
        'WebP conversion',
        'photo optimization',
        'JPEG to WebP online',
        'free image converter'
      ]
    },
    'jpeg-to-avif': {
      title: 'JPEG to AVIF Converter - Free Online JPEG to AVIF Conversion',
      description: 'Convert JPEG images to AVIF format online for free. Next-generation compression for photos with superior quality.',
      keywords: [
        'JPEG to AVIF',
        'JPEG converter',
        'AVIF conversion',
        'next-gen photo format',
        'JPEG to AVIF online',
        'free image converter'
      ]
    },
    'webp-to-jpg': {
      title: 'WebP to JPEG Converter - Free Online WebP to JPEG Conversion',
      description: 'Convert WebP images to JPEG format online for free. Universal compatibility with maintained photo quality.',
      keywords: [
        'WebP to JPEG',
        'WebP to JPG',
        'WebP converter',
        'universal compatibility',
        'WebP to JPEG online',
        'free image converter'
      ]
    },
    'webp-to-avif': {
      title: 'WebP to AVIF Converter - Free Online WebP to AVIF Conversion',
      description: 'Convert WebP images to AVIF format online for free. Upgrade to next-generation compression with superior efficiency.',
      keywords: [
        'WebP to AVIF',
        'WebP converter',
        'AVIF conversion',
        'format upgrade',
        'WebP to AVIF online',
        'free image converter'
      ]
    },
    'heic-to-jpg': {
      title: 'HEIC to JPEG Converter - Free Online HEIC to JPEG Conversion',
      description: 'Convert HEIC images to JPEG format online for free. Universal compatibility for iPhone photos and modern devices.',
      keywords: [
        'HEIC to JPEG',
        'HEIC to JPG',
        'HEIC converter',
        'iPhone photo conversion',
        'HEIC to JPEG online',
        'free image converter'
      ]
    }
  }
};

// 生成结构化数据的辅助函数
export const generateStructuredData = (type: string, data: any) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "provider": {
      "@type": "Organization",
      "name": "TinyCompressor",
      "url": "https://tinycompressor.com"
    }
  };

  switch (type) {
    case "WebApplication":
      return {
        ...baseStructuredData,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };
    case "SoftwareApplication":
      return {
        ...baseStructuredData,
        "applicationCategory": "Image Processing",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };
    default:
      return baseStructuredData;
  }
};






