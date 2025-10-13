#!/usr/bin/env node
/**
 * Generate comprehensive sitemap.xml for TinyCompressor
 * Includes all 11 languages and all pages
 * 
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const baseUrl = 'https://tinycompressor.com';
// 动态获取当前日期，格式为 YYYY-MM-DD
const lastModified = new Date().toISOString().split('T')[0];

// 所有11种支持的语言
const locales = ['en', 'zh', 'ja', 'ko', 'ar', 'de', 'es', 'fr', 'it', 'pt', 'ru'];

// 所有压缩器页面
const compressorPages = [
  '/compressor/compress-png',
  '/compressor/compress-jpeg',
  '/compressor/compress-webp',
  '/compressor/compress-avif',
  '/compressor/compress-gif',
  '/compressor/compress-bmp',
];

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
];

// 静态页面
const staticPages = [
  { path: '', priority: '1.0', changefreq: 'daily' },          // 首页
  { path: '/privacy', priority: '0.7', changefreq: 'monthly' }, // 隐私政策
  { path: '/terms', priority: '0.7', changefreq: 'monthly' },   // 服务条款
];

// 功能页面配置
const functionalPages = [
  ...compressorPages.map(path => ({ path, priority: '0.9', changefreq: 'weekly' })),
  ...converterPages.map(path => ({ path, priority: '0.9', changefreq: 'weekly' })),
];

// 合并所有页面
const allPages = [...staticPages, ...functionalPages];

// 生成XML
function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';
  
  // 为每种语言生成所有页面
  locales.forEach(locale => {
    allPages.forEach(page => {
      // 英语作为默认语言不需要语言前缀
      const url = locale === 'en' 
        ? `${baseUrl}${page.path}`
        : `${baseUrl}/${locale}${page.path}`;
      
      // 确定页面标题（用于注释）
      let pageTitle = page.path === '' ? 'Homepage' :
                      page.path.startsWith('/compressor/') ? 'Compressor' :
                      page.path.startsWith('/converter/') ? 'Converter' :
                      page.path === '/privacy' ? 'Privacy Policy' :
                      page.path === '/terms' ? 'Terms of Service' : 'Page';
      
      const localeNames = {
        'en': 'English', 'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean',
        'ar': 'Arabic', 'de': 'German', 'es': 'Spanish', 'fr': 'French',
        'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian'
      };
      
      xml += `  <!-- ${pageTitle} - ${localeNames[locale]} (${locale}) -->\n`;
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${lastModified}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      
      // 添加hreflang标签（告诉搜索引擎其他语言版本）
      locales.forEach(altLocale => {
        const altUrl = altLocale === 'en' 
          ? `${baseUrl}${page.path}`
          : `${baseUrl}/${altLocale}${page.path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}"/>\n`;
      });
      
      xml += '  </url>\n\n';
    });
  });
  
  xml += '</urlset>\n';
  
  return xml;
}

// 生成统计信息
function generateStats() {
  const totalUrls = locales.length * allPages.length;
  const compressorUrls = locales.length * compressorPages.length;
  const converterUrls = locales.length * converterPages.length;
  const staticUrls = locales.length * staticPages.length;
  
  return {
    totalUrls,
    compressorUrls,
    converterUrls,
    staticUrls,
    languages: locales.length,
    pages: allPages.length,
  };
}

// 主函数
function main() {
  console.log('Generating sitemap.xml...\n');
  
  const stats = generateStats();
  console.log('Sitemap Statistics:');
  console.log(`- Total URLs: ${stats.totalUrls}`);
  console.log(`- Languages: ${stats.languages}`);
  console.log(`- Pages per language: ${stats.pages}`);
  console.log(`  - Static pages: ${staticPages.length}`);
  console.log(`  - Compressor pages: ${compressorPages.length}`);
  console.log(`  - Converter pages: ${converterPages.length}`);
  console.log('');
  
  const xml = generateSitemap();
  
  // 写入public目录
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`   Location: public/sitemap.xml`);
  console.log(`   Size: ${(xml.length / 1024).toFixed(2)} KB`);
  console.log(`   Last Modified: ${lastModified}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Deploy to Vercel');
  console.log('2. Verify at: https://tinycompressor.com/sitemap.xml');
  console.log('3. Submit to Google Search Console');
  console.log('4. Submit to Bing Webmaster Tools');
}

// 运行
main();

