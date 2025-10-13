#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
同步所有语言的文件名与英文保持一致
"""

import os
from pathlib import Path

# 需要重命名的文件映射（旧名 -> 新名）
RENAME_MAP = {
    'heic-to-jpeg.json': 'heic-to-jpg.json',
    'jpeg-to-avif.json': 'jpg-to-avif.json',
    'jpeg-to-webp.json': 'jpg-to-webp.json',
    'webp-to-jpeg.json': 'webp-to-jpg.json',
}

LANGUAGES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'ar']

print("=" * 80)
print("同步所有语言的文件名与英文保持一致")
print("=" * 80)

total_renamed = 0

for lang in LANGUAGES:
    print(f"\n处理 {lang.upper()}:")
    converters_path = Path(f'lib/i18n/translations/{lang}/converters')
    
    if not converters_path.exists():
        print(f"  ⏭️  目录不存在，跳过")
        continue
    
    for old_name, new_name in RENAME_MAP.items():
        old_file = converters_path / old_name
        new_file = converters_path / new_name
        
        if old_file.exists():
            if new_file.exists():
                print(f"  ⚠️  {new_name} 已存在，删除旧文件 {old_name}")
                old_file.unlink()
            else:
                old_file.rename(new_file)
                print(f"  ✅ {old_name} → {new_name}")
                total_renamed += 1
        else:
            if new_file.exists():
                print(f"  ✓  {new_name} 已经是正确名称")
            else:
                print(f"  ⚠️  {old_name} 不存在")

print("\n" + "=" * 80)
print(f"✅ 完成！共重命名 {total_renamed} 个文件")
print("=" * 80)

# 验证：列出所有转换器文件
print("\n📋 验证：检查英文和其他语言的文件名是否一致\n")

en_files = set(f.name for f in Path('lib/i18n/translations/en/converters').glob('*.json'))
print(f"英文文件 ({len(en_files)}个):")
for f in sorted(en_files):
    print(f"  - {f}")

print("\n检查其他语言:")
for lang in LANGUAGES:
    lang_path = Path(f'lib/i18n/translations/{lang}/converters')
    if lang_path.exists():
        lang_files = set(f.name for f in lang_path.glob('*.json'))
        
        # 检查是否有不匹配的文件
        extra = lang_files - en_files
        missing = en_files - lang_files
        
        if extra or missing:
            print(f"\n  ⚠️  {lang.upper()}:")
            if extra:
                print(f"     多余文件: {', '.join(extra)}")
            if missing:
                print(f"     缺失文件: {', '.join(missing)}")
        else:
            print(f"  ✅ {lang.upper()}: 文件名完全一致")

