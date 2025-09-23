import { SupportedLanguage } from '@/types/i18n';
import CompressorNavigation from '@/components/compressor/CompressorNavigation';
import PageLayout from '@/components/layout/PageLayout';
import { Metadata } from 'next';

interface CompressorPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: CompressorPageProps): Promise<Metadata> {
  const { locale } = params;
  const validLocale: SupportedLanguage = ['en', 'zh', 'es', 'de', 'fr', 'ar'].includes(locale)
    ? (locale as SupportedLanguage)
    : 'en';

  const metadata: Record<SupportedLanguage, { title: string; description: string; keywords: string }> = {
    en: {
      title: "Image Compressor - Free Online Compression Tool | TinyCompressor",
      description: "Compress images online for free! Reduce JPG, PNG, WebP, AVIF, GIF file sizes by up to 90% while maintaining quality. Smart compression with batch processing. No registration required.",
      keywords: "image compressor, compress images, reduce file size, JPG compression, PNG compression, WebP compression, AVIF compression, GIF compression, batch compression, online image optimizer, free image compression tool"
    },
    zh: {
      title: "图片压缩器 - 免费在线压缩工具 | TinyCompressor",
      description: "免费在线压缩图片！将JPG、PNG、WebP、AVIF、GIF文件大小减少高达90%，同时保持质量。智能压缩，支持批量处理。无需注册。",
      keywords: "图片压缩器, 压缩图片, 减少文件大小, JPG压缩, PNG压缩, WebP压缩, AVIF压缩, GIF压缩, 批量压缩, 在线图片优化器, 免费图片压缩工具"
    },
    es: {
      title: "Compresor de Imágenes - Herramienta Gratuita de Compresión Online | TinyCompressor",
      description: "¡Comprime imágenes en línea gratis! Reduce el tamaño de archivos JPG, PNG, WebP, AVIF, GIF hasta un 90% manteniendo la calidad. Compresión inteligente con procesamiento por lotes. No requiere registro.",
      keywords: "compresor de imágenes, comprimir imágenes, reducir tamaño archivo, compresión JPG, compresión PNG, compresión WebP, compresión AVIF, compresión GIF, compresión por lotes, optimizador imagen online, herramienta gratuita compresión imagen"
    },
    de: {
      title: "Bildkompressor - Kostenloses Online-Komprimierungstool | TinyCompressor",
      description: "Bilder kostenlos online komprimieren! Reduzieren Sie JPG, PNG, WebP, AVIF, GIF Dateigrößen um bis zu 90% bei gleichbleibender Qualität. Intelligente Komprimierung mit Stapelverarbeitung. Keine Registrierung erforderlich.",
      keywords: "Bildkompressor, Bilder komprimieren, Dateigröße reduzieren, JPG-Komprimierung, PNG-Komprimierung, WebP-Komprimierung, AVIF-Komprimierung, GIF-Komprimierung, Stapelkomprimierung, Online-Bildoptimierer, kostenloses Bildkomprimierungstool"
    },
    fr: {
      title: "Compresseur d'Images - Outil Gratuit de Compression en Ligne | TinyCompressor",
      description: "Compressez des images en ligne gratuitement ! Réduisez la taille des fichiers JPG, PNG, WebP, AVIF, GIF jusqu'à 90% tout en maintenant la qualité. Compression intelligente avec traitement par lots. Aucune inscription requise.",
      keywords: "compresseur d'images, compresser images, réduire taille fichier, compression JPG, compression PNG, compression WebP, compression AVIF, compression GIF, compression par lots, optimiseur image en ligne, outil gratuit compression image"
    },
    ar: {
      title: "ضاغط الصور - أداة الضغط المجانية عبر الإنترنت | TinyCompressor",
      description: "اضغط الصور مجاناً عبر الإنترنت! قلل حجم ملفات JPG، PNG، WebP، AVIF، GIF بنسبة تصل إلى 90% مع الحفاظ على الجودة. ضغط ذكي مع معالجة مجمعة. لا يتطلب تسجيل.",
      keywords: "ضاغط الصور, ضغط الصور, تقليل حجم الملف, ضغط JPG, ضغط PNG, ضغط WebP, ضغط AVIF, ضغط GIF, ضغط مجمع, محسن الصور عبر الإنترنت, أداة ضغط الصور المجانية"
    }
  };

  const meta = metadata[validLocale] || metadata.en;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `/compressor`,
    },
  };
}

export default async function CompressorPage({ params }: CompressorPageProps) {
  const { locale } = params;
  const validLocale: SupportedLanguage = ['en', 'zh', 'es', 'de', 'fr', 'ar'].includes(locale)
    ? (locale as SupportedLanguage)
    : 'en';

  return (
    <PageLayout locale={validLocale}>
      <CompressorNavigation locale={validLocale} />
    </PageLayout>
  );
}