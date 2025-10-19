#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 支持的语言列表
const languages = ['ar', 'de', 'es', 'fr', 'it', 'ko', 'pt', 'ru'];

// 图标映射
const iconMapping = [
  { icon: '📷', key: 'jpeg' },
  { icon: '🌐', key: 'webp' },
  { icon: '⚡', key: 'avif' },
  { icon: '🎬', key: 'gif' },
  { icon: '🖼️', key: 'bmp' },
  { icon: '🔄', key: 'converter' }
];

// 标题映射（不同语言的标题）
const titleMappings = {
  ar: {
    jpeg: 'ضاغط JPEG',
    webp: 'ضاغط WebP', 
    avif: 'ضاغط AVIF',
    gif: 'ضاغط GIF',
    bmp: 'ضاغط BMP',
    converter: 'محول الصور'
  },
  de: {
    jpeg: 'JPEG-Komprimierer',
    webp: 'WebP-Komprimierer',
    avif: 'AVIF-Komprimierer', 
    gif: 'GIF-Komprimierer',
    bmp: 'BMP-Komprimierer',
    converter: 'Bildkonverter'
  },
  es: {
    jpeg: 'Compresor JPEG',
    webp: 'Compresor WebP',
    avif: 'Compresor AVIF',
    gif: 'Compresor GIF', 
    bmp: 'Compresor BMP',
    converter: 'Convertidor de imágenes'
  },
  fr: {
    jpeg: 'Compresseur JPEG',
    webp: 'Compresseur WebP',
    avif: 'Compresseur AVIF',
    gif: 'Compresseur GIF',
    bmp: 'Compresseur BMP', 
    converter: 'Convertisseur d\'images'
  },
  it: {
    jpeg: 'Compressore JPEG',
    webp: 'Compressore WebP',
    avif: 'Compressore AVIF',
    gif: 'Compressore GIF',
    bmp: 'Compressore BMP',
    converter: 'Convertitore di immagini'
  },
  ko: {
    jpeg: 'JPEG 압축기',
    webp: 'WebP 압축기',
    avif: 'AVIF 압축기',
    gif: 'GIF 압축기',
    bmp: 'BMP 압축기',
    converter: '이미지 변환기'
  },
  pt: {
    jpeg: 'Compressor JPEG',
    webp: 'Compressor WebP',
    avif: 'Compressor AVIF',
    gif: 'Compressor GIF',
    bmp: 'Compressor BMP',
    converter: 'Conversor de imagens'
  },
  ru: {
    jpeg: 'Сжиматель JPEG',
    webp: 'Сжиматель WebP',
    avif: 'Сжиматель AVIF',
    gif: 'Сжиматель GIF',
    bmp: 'Сжиматель BMP',
    converter: 'Конвертер изображений'
  }
};

// 描述映射
const descriptionMappings = {
  ar: {
    jpeg: 'ضغط صور JPEG للويب والجوال',
    webp: 'ضغط صور WebP',
    avif: 'ضغط صور AVIF',
    gif: 'تقليل حجم ملفات GIF مع الحفاظ على الرسوم المتحركة',
    bmp: 'ضغط صور BMP للحصول على تخزين أفضل',
    converter: 'تحويل بين تنسيقات الصور المختلفة'
  },
  de: {
    jpeg: 'JPEG-Bilder für Web und Mobile komprimieren',
    webp: 'WebP-Bilder komprimieren',
    avif: 'AVIF-Bilder komprimieren',
    gif: 'GIF-Dateigrößen reduzieren und Animationen beibehalten',
    bmp: 'BMP-Bilder für bessere Speicherung komprimieren',
    converter: 'Zwischen verschiedenen Bildformaten konvertieren'
  },
  es: {
    jpeg: 'Comprimir imágenes JPEG para web y móvil',
    webp: 'Comprimir imágenes WebP',
    avif: 'Comprimir imágenes AVIF',
    gif: 'Reducir tamaños de archivos GIF preservando animaciones',
    bmp: 'Comprimir imágenes BMP para mejor almacenamiento',
    converter: 'Convertir entre diferentes formatos de imagen'
  },
  fr: {
    jpeg: 'Compresser les images JPEG pour le web et mobile',
    webp: 'Compresser les images WebP',
    avif: 'Compresser les images AVIF',
    gif: 'Réduire les tailles de fichiers GIF tout en préservant les animations',
    bmp: 'Compresser les images BMP pour un meilleur stockage',
    converter: 'Convertir entre différents formats d\'image'
  },
  it: {
    jpeg: 'Comprimere immagini JPEG per web e mobile',
    webp: 'Comprimere immagini WebP',
    avif: 'Comprimere immagini AVIF',
    gif: 'Ridurre le dimensioni dei file GIF preservando le animazioni',
    bmp: 'Comprimere immagini BMP per una migliore memorizzazione',
    converter: 'Convertire tra diversi formati di immagine'
  },
  ko: {
    jpeg: '웹과 모바일을 위한 JPEG 이미지 압축',
    webp: 'WebP 이미지 압축',
    avif: 'AVIF 이미지 압축',
    gif: '애니메이션을 유지하면서 GIF 파일 크기 줄이기',
    bmp: '더 나은 저장을 위한 BMP 이미지 압축',
    converter: '다양한 이미지 형식 간 변환'
  },
  pt: {
    jpeg: 'Comprimir imagens JPEG para web e móvel',
    webp: 'Comprimir imagens WebP',
    avif: 'Comprimir imagens AVIF',
    gif: 'Reduzir tamanhos de arquivos GIF preservando animações',
    bmp: 'Comprimir imagens BMP para melhor armazenamento',
    converter: 'Converter entre diferentes formatos de imagem'
  },
  ru: {
    jpeg: 'Сжимать изображения JPEG для веб и мобильных',
    webp: 'Сжимать изображения WebP',
    avif: 'Сжимать изображения AVIF',
    gif: 'Уменьшать размеры файлов GIF, сохраняя анимацию',
    bmp: 'Сжимать изображения BMP для лучшего хранения',
    converter: 'Конвертировать между различными форматами изображений'
  }
};

function updateQuickLinksForLanguage(lang) {
  const filePath = path.join(__dirname, '..', 'lib', 'i18n', 'translations', lang, 'compressors', 'png.json');
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    if (!data.quickLinks || !data.quickLinks.items) {
      console.log(`No quickLinks.items found in ${lang}`);
      return;
    }
    
    // 更新现有的项目
    data.quickLinks.items.forEach((item, index) => {
      if (index < iconMapping.length) {
        const mapping = iconMapping[index];
        item.icon = mapping.icon;
        
        // 如果有对应的翻译，更新标题和描述
        if (titleMappings[lang] && titleMappings[lang][mapping.key]) {
          item.title = titleMappings[lang][mapping.key];
        }
        if (descriptionMappings[lang] && descriptionMappings[lang][mapping.key]) {
          item.description = descriptionMappings[lang][mapping.key];
        }
      }
    });
    
    // 确保有足够的项目
    while (data.quickLinks.items.length < 6) {
      const index = data.quickLinks.items.length;
      const mapping = iconMapping[index];
      
      if (mapping) {
        data.quickLinks.items.push({
          title: titleMappings[lang] && titleMappings[lang][mapping.key] 
            ? titleMappings[lang][mapping.key] 
            : `${mapping.key.toUpperCase()} Compressor`,
          description: descriptionMappings[lang] && descriptionMappings[lang][mapping.key]
            ? descriptionMappings[lang][mapping.key]
            : `Compress ${mapping.key.toUpperCase()} images`,
          url: mapping.key === 'converter' ? '/converter' : `/compressor/compress-${mapping.key}`,
          icon: mapping.icon
        });
      }
    }
    
    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ Updated ${lang}/compressors/png.json`);
    
  } catch (error) {
    console.error(`❌ Error updating ${lang}:`, error.message);
  }
}

// 执行更新
console.log('🔧 Fixing Quick Links icons for all languages...\n');

languages.forEach(lang => {
  updateQuickLinksForLanguage(lang);
});

console.log('\n🎉 Quick Links icons fix completed!');



