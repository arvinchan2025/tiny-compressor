import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = 'https://tinycompressor.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // 支持的语言列表
    const locales = ['en', 'zh', 'ja', 'ko', 'ar', 'de', 'es', 'fr', 'it', 'pt', 'ru'];
    
    // 页面配置
    const pages = [
      {
        path: '',
        priority: '1.0',
        changefreq: 'daily'
      },
      {
        path: '/privacy',
        priority: '0.7',
        changefreq: 'monthly'
      },
      {
        path: '/terms',
        priority: '0.7',
        changefreq: 'monthly'
      }
    ];

    // 功能页面
    const functionalPages = [
      // 压缩器页面
      { type: 'compressor', formats: ['png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'bmp', 'pdf', 'video'] },
      // 转换器页面
      { type: 'converter', formats: ['png-to-jpg', 'png-to-webp', 'png-to-avif', 'jpg-to-png', 'jpg-to-webp', 'jpg-to-avif', 'webp-to-png', 'webp-to-jpg', 'webp-to-avif', 'heic-to-jpg'] }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // 生成主页和静态页面
    pages.forEach(page => {
      locales.forEach(locale => {
        const url = locale === 'en' ? `${baseUrl}${page.path}` : `${baseUrl}/${locale}${page.path}`;
        const alternateLinks = locales.map(altLocale => 
          `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${altLocale === 'en' ? baseUrl : `${baseUrl}/${altLocale}`}${page.path}"/>`
        ).join('\n    ');

        sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${alternateLinks}
  </url>`;
      });
    });

    // 生成功能页面
    functionalPages.forEach(pageGroup => {
      pageGroup.formats.forEach(format => {
        locales.forEach(locale => {
          const path = pageGroup.type === 'compressor' 
            ? `/compressor/compress-${format}`
            : `/converter/convert-${format}`;
          const url = locale === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
          const alternateLinks = locales.map(altLocale => {
            const altPath = pageGroup.type === 'compressor' 
              ? `/compressor/compress-${format}`
              : `/converter/convert-${format}`;
            return `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${altLocale === 'en' ? baseUrl : `${baseUrl}/${altLocale}`}${altPath}"/>`;
          }).join('\n    ');

          sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    ${alternateLinks}
  </url>`;
        });
      });
    });

    sitemap += `
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
