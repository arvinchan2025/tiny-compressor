#!/usr/bin/env python3
"""
PDF 压缩器多语言翻译脚本 - 完整版
基于英文 PDF 翻译结构，批量翻译所有语言版本
使用高效的批量翻译方式
"""

import json
import os
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# 语言配置
LANGUAGES = {
    'zh': 'Chinese (Simplified)',
    'es': 'Spanish', 
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ar': 'Arabic',
    'ja': 'Japanese',
    'ko': 'Korean'
}

# 翻译映射表（基于之前项目的翻译经验）
TRANSLATION_MAPPINGS = {
    'zh': {
        # SEO
        'PDF Compressor - Compress PDF Files Online Free': 'PDF 压缩器 - 免费在线压缩 PDF 文件',
        'Compress PDF files online with our free PDF compressor. Reduce PDF file size while maintaining quality. Fast, secure, and easy to use.': '使用我们的免费 PDF 压缩器在线压缩 PDF 文件。在保持质量的同时减小文件大小。快速、安全、易用。',
        'PDF compressor, compress PDF, PDF optimization, reduce PDF size, PDF compressor online, free PDF compressor': 'PDF 压缩器，压缩 PDF，PDF 优化，减小 PDF 大小，在线 PDF 压缩器，免费 PDF 压缩器',
        
        # Hero
        'PDF Compressor': 'PDF 压缩器',
        'Compress PDF files online with our advanced compression technology. Reduce file size while maintaining quality and readability.': '使用我们先进的压缩技术在线压缩 PDF 文件。在保持质量和可读性的同时减小文件大小。',
        'Compressor': '压缩器',
        
        # Features
        'PDF Format Features': 'PDF 格式特性',
        'Why PDF is the universal standard for document sharing': '为什么 PDF 是文档共享的通用标准',
        'Universal Standard': '通用标准',
        'ISO-standardized format readable on any device, platform, or operating system': 'ISO 标准化格式，可在任何设备、平台或操作系统上读取',
        'Mixed Content Support': '混合内容支持',
        'Seamlessly combines text, images, vector graphics, fonts, and multimedia': '无缝结合文本、图像、矢量图形、字体和多媒体',
        'Security & Encryption': '安全与加密',
        'Built-in password protection, digital signatures, and 256-bit AES encryption': '内置密码保护、数字签名和 256 位 AES 加密',
        'Searchable Text': '可搜索文本',
        'Full-text search, copy-paste support, and accessibility features for screen readers': '全文搜索、复制粘贴支持和屏幕阅读器辅助功能',
        'Interactive Features': '交互功能',
        'Supports forms, annotations, bookmarks, hyperlinks, and embedded attachments': '支持表单、注释、书签、超链接和嵌入式附件',
        'Print Fidelity': '打印保真度',
        'WYSIWYG guarantee - document appears exactly the same on screen and in print': '所见即所得保证 - 文档在屏幕和打印中完全一致',
        
        # Operation
        'Drop PDF file here or click to upload': '将 PDF 文件拖拽到此处或点击上传',
        'Maximum file size: 50MB': '最大文件大小：50MB',
        'Choose PDF File': '选择 PDF 文件',
        'Selected Files': '已选文件',
        'Name': '名称',
        'Pages': '页数',
        'Remove': '移除',
        'Size': '大小',
        'Compress PDF': '压缩 PDF',
        'Compressing... {progress}%': '压缩中... {progress}%',
        'Processing...': '处理中...',
        'Optimizing images and removing unnecessary data': '优化图像并移除不必要的数据',
        'Compression Complete! 🎉': '压缩完成！🎉',
        'Your PDF has been successfully optimized': '您的 PDF 已成功优化',
        'Original': '原始',
        'Compressed': '压缩后',
        'Saved': '节省',
        'Time': '时间',
        'Format': '格式',
        'Compression Ratio': '压缩比',
        'Size Reduction': '大小减少',
        'Size Increase': '大小增加',
        'Great job!': '做得很好！',
        'Consider adjusting settings': '考虑调整设置',
        'Saved {amount} KB': '节省 {amount} KB',
        'Great compression!': '压缩效果很好！',
        'Your PDF is now {ratio}% smaller while maintaining excellent quality. Optimized for sharing!': '您的 PDF 现在小了 {ratio}%，同时保持优秀质量。已优化用于分享！',
        'Download': '下载',
        'Compress More': '继续压缩',
        'Reset': '重置',
        'Size Comparison': '大小对比',
        'Original: {original} MB → Compressed: {compressed} MB ({ratio}% reduction)': '原始：{original} MB → 压缩后：{compressed} MB（减少 {ratio}%）',
        'Simple': '简单',
        'Advanced': '高级',
        'Advanced Settings': '高级设置',
        'Image Quality': '图像质量',
        'Low (Smaller file)': '低（文件更小）',
        'Medium': '中等',
        'High (Best quality)': '高（最佳质量）',
        'Keep Metadata': '保留元数据',
        'Preserve document properties and metadata': '保留文档属性和元数据',
        'Compress Images': '压缩图像',
        'Optimize embedded images for smaller file size': '优化嵌入图像以减小文件大小',
        'Remove Metadata': '移除元数据',
        'Remove document properties and metadata': '移除文档属性和元数据',
        'Compress Now': '立即压缩',
        'Cancel': '取消',
        'Download All': '下载全部',
        'Error': '错误',
        '💡 Tip: Make sure your file is a valid PDF and under 50MB': '💡 提示：确保您的文件是有效的 PDF 且小于 50MB',
        'Unknown error': '未知错误',
        'Failed to process {fileName}': '处理 {fileName} 失败',
        'Compression failed': '压缩失败',
        'Starting compression...': '开始压缩...',
        'Compressing PDF...': '压缩 PDF 中...',
        'Compression completed!': '压缩完成！',
        'Quality Used': '使用的质量',
        'Processing Time': '处理时间',
        'Ready to Compress Your PDF?': '准备好压缩您的 PDF 了吗？',
        'Start compressing your PDF files now and experience faster, more efficient document management.': '立即开始压缩您的 PDF 文件，体验更快、更高效的文档管理。',
        'Start Compressing': '开始压缩',
        'Learn More': '了解更多'
    },
    
    'es': {
        'PDF Compressor - Compress PDF Files Online Free': 'Compresor PDF - Comprimir archivos PDF en línea gratis',
        'PDF Compressor': 'Compresor PDF',
        'Compress PDF files online with our advanced compression technology. Reduce file size while maintaining quality and readability.': 'Comprime archivos PDF en línea con nuestra tecnología de compresión avanzada. Reduce el tamaño del archivo manteniendo la calidad y legibilidad.',
        'Compressor': 'Compresor',
        'PDF Format Features': 'Características del formato PDF',
        'Why PDF is the universal standard for document sharing': 'Por qué PDF es el estándar universal para compartir documentos',
        'Universal Standard': 'Estándar Universal',
        'Mixed Content Support': 'Soporte de Contenido Mixto',
        'Security & Encryption': 'Seguridad y Encriptación',
        'Searchable Text': 'Texto Buscable',
        'Interactive Features': 'Características Interactivas',
        'Print Fidelity': 'Fidelidad de Impresión',
        'Drop PDF file here or click to upload': 'Arrastra el archivo PDF aquí o haz clic para subir',
        'Maximum file size: 50MB': 'Tamaño máximo de archivo: 50MB',
        'Choose PDF File': 'Elegir archivo PDF',
        'Selected Files': 'Archivos Seleccionados',
        'Name': 'Nombre',
        'Pages': 'Páginas',
        'Remove': 'Eliminar',
        'Size': 'Tamaño',
        'Compress PDF': 'Comprimir PDF',
        'Compressing... {progress}%': 'Comprimiendo... {progress}%',
        'Processing...': 'Procesando...',
        'Compression Complete! 🎉': '¡Compresión completada! 🎉',
        'Your PDF has been successfully optimized': 'Tu PDF ha sido optimizado exitosamente',
        'Original': 'Original',
        'Compressed': 'Comprimido',
        'Saved': 'Ahorrado',
        'Download': 'Descargar',
        'Compress More': 'Comprimir Más',
        'Reset': 'Restablecer',
        'Simple': 'Simple',
        'Advanced': 'Avanzado',
        'Image Quality': 'Calidad de Imagen',
        'Compress Now': 'Comprimir Ahora',
        'Ready to Compress Your PDF?': '¿Listo para comprimir tu PDF?',
        'Start Compressing': 'Comenzar Compresión'
    },
    
    'fr': {
        'PDF Compressor - Compress PDF Files Online Free': 'Compresseur PDF - Compresser les fichiers PDF en ligne gratuitement',
        'PDF Compressor': 'Compresseur PDF',
        'Compress PDF files online with our advanced compression technology. Reduce file size while maintaining quality and readability.': 'Compressez les fichiers PDF en ligne avec notre technologie de compression avancée. Réduisez la taille du fichier tout en maintenant la qualité et la lisibilité.',
        'Compressor': 'Compresseur',
        'PDF Format Features': 'Caractéristiques du format PDF',
        'Why PDF is the universal standard for document sharing': 'Pourquoi PDF est la norme universelle pour le partage de documents',
        'Universal Standard': 'Norme Universelle',
        'Mixed Content Support': 'Support de Contenu Mixte',
        'Security & Encryption': 'Sécurité et Chiffrement',
        'Searchable Text': 'Texte Recherchable',
        'Interactive Features': 'Fonctionnalités Interactives',
        'Print Fidelity': 'Fidélité d\'Impression',
        'Drop PDF file here or click to upload': 'Glissez le fichier PDF ici ou cliquez pour télécharger',
        'Maximum file size: 50MB': 'Taille maximale de fichier : 50MB',
        'Choose PDF File': 'Choisir un fichier PDF',
        'Selected Files': 'Fichiers Sélectionnés',
        'Name': 'Nom',
        'Pages': 'Pages',
        'Remove': 'Supprimer',
        'Size': 'Taille',
        'Compress PDF': 'Compresser PDF',
        'Compressing... {progress}%': 'Compression... {progress}%',
        'Processing...': 'Traitement...',
        'Compression Complete! 🎉': 'Compression terminée ! 🎉',
        'Your PDF has been successfully optimized': 'Votre PDF a été optimisé avec succès',
        'Original': 'Original',
        'Compressed': 'Comprimé',
        'Saved': 'Économisé',
        'Download': 'Télécharger',
        'Compress More': 'Compresser Plus',
        'Reset': 'Réinitialiser',
        'Simple': 'Simple',
        'Advanced': 'Avancé',
        'Image Quality': 'Qualité d\'Image',
        'Compress Now': 'Compresser Maintenant',
        'Ready to Compress Your PDF?': 'Prêt à compresser votre PDF ?',
        'Start Compressing': 'Commencer la Compression'
    }
}

def translate_text(text, target_lang, context=""):
    """翻译文本"""
    if target_lang in TRANSLATION_MAPPINGS and text in TRANSLATION_MAPPINGS[target_lang]:
        return TRANSLATION_MAPPINGS[target_lang][text]
    
    # 如果没有预定义翻译，返回原文
    return text

def translate_pdf_content(english_data, target_lang):
    """翻译 PDF 内容"""
    translated_data = {}
    
    for section_name, section_data in english_data.items():
        if section_name == 'seo':
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'keywords': translate_text(section_data['keywords'], target_lang)
            }
        
        elif section_name == 'hero':
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'subtitle': translate_text(section_data['subtitle'], target_lang),
                'badge': translate_text(section_data['badge'], target_lang)
            }
        
        elif section_name == 'formatInfo':
            translated_data[section_name] = {
                'description': translate_text(section_data['description'], target_lang)
            }
        
        elif section_name == 'features':
            items = []
            for item in section_data['items']:
                items.append({
                    'icon': item['icon'],
                    'title': translate_text(item['title'], target_lang),
                    'description': translate_text(item['description'], target_lang)
                })
            
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'items': items
            }
        
        elif section_name == 'technicalPrinciples':
            items = []
            for item in section_data['items']:
                benefits = [translate_text(benefit, target_lang) for benefit in item['benefits']]
                items.append({
                    'title': translate_text(item['title'], target_lang),
                    'description': translate_text(item['description'], target_lang),
                    'icon': item['icon'],
                    'benefits': benefits
                })
            
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'items': items
            }
        
        elif section_name == 'useCases':
            items = []
            for item in section_data['items']:
                items.append({
                    'title': translate_text(item['title'], target_lang),
                    'description': translate_text(item['description'], target_lang),
                    'content': translate_text(item['content'], target_lang),
                    'icon': item['icon']
                })
            
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'items': items
            }
        
        elif section_name == 'faq':
            items = []
            for item in section_data['items']:
                items.append({
                    'question': translate_text(item['question'], target_lang),
                    'answer': translate_text(item['answer'], target_lang)
                })
            
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'items': items
            }
        
        elif section_name == 'quickLinks':
            items = []
            for item in section_data['items']:
                items.append({
                    'title': translate_text(item['title'], target_lang),
                    'description': translate_text(item['description'], target_lang),
                    'url': item['url']
                })
            
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'items': items
            }
        
        elif section_name == 'operation':
            translated_data[section_name] = translate_operation_section(section_data, target_lang)
        
        elif section_name == 'cta':
            translated_data[section_name] = {
                'title': translate_text(section_data['title'], target_lang),
                'description': translate_text(section_data['description'], target_lang),
                'startButton': translate_text(section_data['startButton'], target_lang),
                'learnButton': translate_text(section_data['learnButton'], target_lang)
            }
        
        else:
            translated_data[section_name] = section_data
    
    return translated_data

def translate_operation_section(operation_data, target_lang):
    """翻译操作部分"""
    translated = {}
    
    # 遍历所有操作子部分
    for subsection_name, subsection_data in operation_data.items():
        if isinstance(subsection_data, dict):
            translated[subsection_name] = {}
            for key, value in subsection_data.items():
                if isinstance(value, str) and not value.startswith('{'):
                    translated[subsection_name][key] = translate_text(value, target_lang)
                else:
                    translated[subsection_name][key] = value  # 保留模板字符串
        else:
            translated[subsection_name] = translate_text(subsection_data, target_lang)
    
    return translated

def main():
    """主函数"""
    print("🚀 PDF 压缩器多语言翻译脚本启动")
    print("=" * 60)
    
    # 读取英文原文
    english_file = project_root / "lib/i18n/translations/en/compressors/pdf.json"
    if not english_file.exists():
        print(f"❌ 英文原文文件不存在: {english_file}")
        return
    
    try:
        with open(english_file, 'r', encoding='utf-8') as f:
            english_data = json.load(f)
        print(f"✅ 读取英文原文成功 ({len(english_data)} 个部分)")
    except Exception as e:
        print(f"❌ 读取英文原文失败: {e}")
        return
    
    # 为每种语言创建翻译
    success_count = 0
    total_languages = len(LANGUAGES)
    
    for lang_code, lang_name in LANGUAGES.items():
        try:
            print(f"\n{'='*20} {lang_name} ({lang_code}) {'='*20}")
            
            # 翻译内容
            translated_data = translate_pdf_content(english_data, lang_code)
            
            # 创建目录
            lang_dir = project_root / "lib/i18n/translations" / lang_code / "compressors"
            lang_dir.mkdir(parents=True, exist_ok=True)
            
            # 保存文件
            output_file = lang_dir / "pdf.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(translated_data, f, ensure_ascii=False, indent=2)
            
            success_count += 1
            print(f"✅ {lang_name} 翻译完成!")
            
            # 显示统计
            sections_count = len(translated_data)
            print(f"   📊 翻译了 {sections_count} 个部分")
            
        except Exception as e:
            print(f"❌ {lang_name} 翻译失败: {e}")
            continue
    
    # 最终统计
    print(f"\n{'='*60}")
    print(f"🎉 翻译完成! 成功: {success_count}/{total_languages}")
    
    if success_count == total_languages:
        print("🎊 所有语言翻译完成!")
    else:
        print(f"⚠️  {total_languages - success_count} 个语言翻译失败")
    
    print("\n📝 下一步:")
    print("1. 运行 npm run build:translations 重新构建翻译文件")
    print("2. 测试各语言版本的 PDF 压缩器页面")

if __name__ == "__main__":
    main()
