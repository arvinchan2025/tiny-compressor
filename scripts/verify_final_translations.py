#!/usr/bin/env python3
"""验证所有语言的翻译文件是否完整"""

import os
import json
from pathlib import Path

def count_files(lang_dir):
    """统计某个语言目录下的所有翻译文件数量（递归）"""
    if not os.path.exists(lang_dir):
        return 0, []
    
    files = []
    # 递归查找所有.json文件
    from pathlib import Path
    lang_path = Path(lang_dir)
    json_files = list(lang_path.rglob('*.json'))
    
    # 获取相对路径
    for json_file in json_files:
        rel_path = json_file.relative_to(lang_path)
        files.append(str(rel_path))
    
    return len(files), sorted(files)

def main():
    base_dir = 'lib/i18n/translations'
    
    # 英语作为基准（排除optimized文件）
    en_dir = os.path.join(base_dir, 'en')
    en_count, en_files = count_files(en_dir)
    
    # 过滤掉optimized文件（这些是可选的简化版本）
    en_files_filtered = [f for f in en_files if '-optimized' not in f]
    en_count_filtered = len(en_files_filtered)
    
    print("=" * 80)
    print("Translation Files Verification")
    print("=" * 80)
    print(f"\nEnglish (baseline): {en_count} files total")
    print(f"Required files (excluding optimized): {en_count_filtered} files")
    print("\n" + "-" * 80)
    
    # 检查所有其他语言
    languages = ['zh', 'ja', 'ko', 'ar', 'de', 'es', 'fr', 'it', 'pt', 'ru']
    
    all_complete = True
    for lang in languages:
        lang_dir = os.path.join(base_dir, lang)
        lang_count, lang_files = count_files(lang_dir)
        
        status = "COMPLETE" if lang_count == en_count_filtered else "INCOMPLETE"
        if lang_count != en_count_filtered:
            all_complete = False
        
        print(f"{lang.upper()}: {lang_count}/{en_count_filtered} files - {status}")
    
    print("-" * 80)
    if all_complete:
        print("\nStatus: ALL LANGUAGES COMPLETE!")
        print("All 10 languages have complete translations based on English baseline.")
    else:
        print("\nStatus: Some languages are incomplete")
    print("=" * 80)

if __name__ == '__main__':
    main()

