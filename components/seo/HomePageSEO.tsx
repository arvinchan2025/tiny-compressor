import Head from 'next/head';

interface HomePageSEOProps {
  locale: string;
}

export default function HomePageSEO({ locale }: HomePageSEOProps) {
  const baseUrl = 'https://tinycompressor.com';
  const canonicalUrl = `${baseUrl}/${locale === 'en' ? '' : locale}`;
  
  // SEO-optimized content
  const title = locale === 'en' 
    ? 'TinyCompressor - Free Online Image Compression & Format Conversion Tools'
    : `TinyCompressor - ${locale === 'zh' ? '免费在线图片压缩和格式转换工具' : 'Free Online Image Tools'}`;
    
  const description = locale === 'en'
    ? 'Free online image compression and format conversion tools. Reduce file sizes by up to 90% while maintaining quality. Support PNG, JPEG, WebP, AVIF, GIF, BMP formats. No registration required.'
    : `Free online image compression and format conversion tools. Reduce file sizes by up to 90% while maintaining quality. No registration required.`;

  const keywords = locale === 'en'
    ? 'image compression, compress images, reduce file size, online image optimizer, PNG compressor, JPEG compressor, WebP converter, image format converter, free image tools, lossless compression, image optimizer'
    : `image compression, compress images, reduce file size, online image optimizer, free image tools`;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TinyCompressor",
    "description": description,
    "url": canonicalUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
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
      "Image compression",
      "Format conversion", 
      "Batch processing",
      "Privacy-focused processing",
      "No file upload required",
      "16+ supported formats",
      "Up to 90% size reduction"
    ],
    "screenshot": `${baseUrl}/og-image.jpg`,
    "softwareVersion": "1.0",
    "releaseNotes": "Free online image compression and format conversion tools",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "15000",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does TinyCompressor reduce image file sizes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TinyCompressor uses advanced compression algorithms to reduce image file sizes by up to 90% while maintaining visual quality. Our tools support lossless and lossy compression methods."
        }
      },
      {
        "@type": "Question", 
        "name": "Is my data safe when using TinyCompressor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all image processing happens locally in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security."
        }
      },
      {
        "@type": "Question",
        "name": "What image formats does TinyCompressor support?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "We support 16+ image formats including PNG, JPEG, WebP, AVIF, GIF, BMP, TIFF, and HEIC. You can compress or convert between any of these formats."
        }
      },
      {
        "@type": "Question",
        "name": "Is TinyCompressor really free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, TinyCompressor is 100% free forever with no hidden costs, subscriptions, or file size limits. No registration required."
        }
      }
    ]
  };

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TinyCompressor",
    "description": "Free online image compression and format conversion tools",
    "url": "https://tinycompressor.com",
    "logo": "https://tinycompressor.com/logo.svg",
    "sameAs": [
      "https://twitter.com/tinycompressor",
      "https://github.com/tinycompressor"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@tinycompressor.com"
    }
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="TinyCompressor" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={locale} />
      <meta name="language" content={locale} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="TinyCompressor" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="TinyCompressor - Free Online Image Compression Tools" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />
      <meta name="twitter:site" content="@TinyCompressor" />
      <meta name="twitter:creator" content="@TinyCompressor" />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="TinyCompressor" />
      <meta name="apple-mobile-web-app-title" content="TinyCompressor" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />

      {/* Additional SEO Meta Tags */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="expires" content="never" />
      
      {/* Geo Tags (if applicable) */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Mobile Optimization */}
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
    </Head>
  );
}



