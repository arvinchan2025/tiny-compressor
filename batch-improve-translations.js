const fs = require('fs');

// 读取所有翻译文件
const languages = ['ar', 'de', 'es', 'fr'];
const translations = {};

languages.forEach(lang => {
  try {
    const content = fs.readFileSync(`lib/translations/${lang}.json`, 'utf8');
    translations[lang] = JSON.parse(content);
  } catch (error) {
    console.log(`Error reading ${lang}.json:`, error.message);
    translations[lang] = {};
  }
});

// 为每个语言添加缺失的hero部分
const heroTranslations = {
  ar: {
    "compressButton": "ضغط الصور",
    "convertButton": "تحويل الصور",
    "stats": {
      "sizeReduction": "تقليل الحجم حتى 90%",
      "supportedFormats": "10+ تنسيقات مدعومة",
      "freeSecure": "100% مجاني وآمن"
    }
  },
  de: {
    "description": "Fortgeschrittene Bildverarbeitungstools, die direkt in Ihrem Browser arbeiten. Keine Uploads, keine Wasserzeichen, keine versteckten Gebühren.",
    "compressButton": "Bilder komprimieren",
    "convertButton": "Bilder konvertieren",
    "stats": {
      "sizeReduction": "Bis zu 90% Größenreduktion",
      "supportedFormats": "10+ unterstützte Formate"
    }
  },
  es: {
    "description": "Herramientas avanzadas de procesamiento de imágenes que funcionan directamente en tu navegador. Sin subidas, sin marcas de agua, sin tarifas ocultas.",
    "compressButton": "Comprimir imágenes",
    "convertButton": "Convertir imágenes",
    "stats": {
      "sizeReduction": "Hasta 90% de reducción de tamaño",
      "supportedFormats": "10+ formatos soportados"
    }
  },
  fr: {
    "description": "Outils avancés de traitement d'images qui fonctionnent directement dans votre navigateur. Pas de téléchargements, pas de filigranes, pas de frais cachés.",
    "compressButton": "Compresser les images",
    "convertButton": "Convertir les images",
    "stats": {
      "sizeReduction": "Jusqu'à 90% de réduction de taille",
      "supportedFormats": "10+ formats supportés"
    }
  }
};

// 为每个语言添加缺失的upload部分
const uploadTranslations = {
  ar: {
    "singleFileTitle": "رفع صورتك",
    "singleFileSubtitle": "اسحب وأفلت صورتك هنا أو انقر للتصفح",
    "batchTitle": "رفع صور متعددة",
    "batchSubtitle": "اسحب وأفلت صور متعددة هنا أو انقر للتصفح",
    "addMore": "إضافة المزيد من الملفات"
  },
  de: {
    "singleFileTitle": "Lade dein Bild hoch",
    "singleFileSubtitle": "Ziehe dein Bild hierher oder klicke zum Durchsuchen",
    "batchTitle": "Lade mehrere Bilder hoch",
    "batchSubtitle": "Ziehe mehrere Bilder hierher oder klicke zum Durchsuchen",
    "addMore": "Weitere Dateien hinzufügen"
  },
  es: {
    "singleFileTitle": "Sube tu imagen",
    "singleFileSubtitle": "Arrastra tu imagen aquí o haz clic para explorar",
    "batchTitle": "Sube múltiples imágenes",
    "batchSubtitle": "Arrastra múltiples imágenes aquí o haz clic para explorar",
    "addMore": "Agregar más archivos"
  },
  fr: {
    "singleFileTitle": "Téléchargez votre image",
    "singleFileSubtitle": "Glissez votre image ici ou cliquez pour parcourir",
    "batchTitle": "Téléchargez plusieurs images",
    "batchSubtitle": "Glissez plusieurs images ici ou cliquez pour parcourir",
    "addMore": "Ajouter plus de fichiers"
  }
};

// 为每个语言添加翻译
languages.forEach(lang => {
  console.log(`正在完善 ${lang.toUpperCase()} 翻译...`);
  
  // 添加hero部分
  if (!translations[lang].hero) {
    translations[lang].hero = {};
  }
  Object.assign(translations[lang].hero, heroTranslations[lang] || {});
  
  // 添加upload部分
  if (!translations[lang].upload) {
    translations[lang].upload = {};
  }
  Object.assign(translations[lang].upload, uploadTranslations[lang] || {});
  
  // 写回文件
  fs.writeFileSync(`lib/translations/${lang}.json`, JSON.stringify(translations[lang], null, 2));
  console.log(`✓ ${lang.toUpperCase()} 翻译已更新`);
});

console.log('\n批量翻译完善完成！');
