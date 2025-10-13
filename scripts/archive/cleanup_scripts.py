#!/usr/bin/env python3
"""清理临时翻译脚本，只保留核心检测和工具脚本"""

import os
import shutil
from pathlib import Path

# 需要保留的脚本列表
KEEP_SCRIPTS = {
    # 核心检测脚本
    'check_translation_v3_enhanced.py',
    'check_all_languages_v3.py',
    'verify_final_translations.py',
    
    # 实用工具
    'sync_filenames_with_english.py',
    'compare_structure_with_english.py',
    
    # 文档
    'TRANSLATION_CHECK_GUIDE.md',
    'CLEANUP_PLAN.md',
    
    # 部署和测试
    'deploy.sh',
    'run-tests.ps1',
    'run-tests.sh',
    
    # 这个清理脚本本身
    'cleanup_scripts.py'
}

def main():
    scripts_dir = Path('scripts')
    
    if not scripts_dir.exists():
        print("scripts directory not found!")
        return
    
    # 获取所有文件
    all_files = [f for f in scripts_dir.iterdir() if f.is_file()]
    
    # 分类文件
    to_delete = []
    to_keep = []
    
    for file in all_files:
        if file.name in KEEP_SCRIPTS:
            to_keep.append(file)
        else:
            to_delete.append(file)
    
    print("=" * 80)
    print("Scripts Cleanup Plan")
    print("=" * 80)
    print(f"\nTotal scripts: {len(all_files)}")
    print(f"To keep: {len(to_keep)}")
    print(f"To delete: {len(to_delete)}")
    print("\n" + "-" * 80)
    
    print("\nScripts to KEEP:")
    for script in sorted(to_keep, key=lambda x: x.name):
        print(f"  - {script.name}")
    
    print("\n" + "-" * 80)
    print(f"\nScripts to DELETE ({len(to_delete)} files):")
    
    # 按类型分组显示
    lang_specific = []
    batch_scripts = []
    fix_scripts = []
    check_scripts = []
    js_scripts = []
    other_scripts = []
    
    for script in to_delete:
        name = script.name
        if any(name.startswith(prefix) for prefix in ['ar_', 'ja_', 'ko_', 'zh_', 'pt_', 'es_', 'de_', 'ru_', 'it_', 'fr_']):
            lang_specific.append(name)
        elif name.startswith('batch_') or name.startswith('mega_') or name.startswith('ultra_'):
            batch_scripts.append(name)
        elif name.startswith('fix_') or name.startswith('fix-'):
            fix_scripts.append(name)
        elif name.startswith('check_') or name.startswith('check-') or name.startswith('verify_'):
            check_scripts.append(name)
        elif name.endswith('.js'):
            js_scripts.append(name)
        else:
            other_scripts.append(name)
    
    print(f"  Language-specific scripts: {len(lang_specific)}")
    print(f"  Batch/mega scripts: {len(batch_scripts)}")
    print(f"  Fix scripts: {len(fix_scripts)}")
    print(f"  Old check/verify scripts: {len(check_scripts)}")
    print(f"  JavaScript scripts: {len(js_scripts)}")
    print(f"  Other temporary scripts: {len(other_scripts)}")
    
    print("\n" + "=" * 80)
    print("\nReady to delete? Run this script with 'execute' argument to perform cleanup.")
    print("Example: python scripts/cleanup_scripts.py execute")
    print("=" * 80)

def execute_cleanup():
    """执行实际的清理操作"""
    scripts_dir = Path('scripts')
    all_files = [f for f in scripts_dir.iterdir() if f.is_file()]
    
    to_delete = [f for f in all_files if f.name not in KEEP_SCRIPTS]
    
    print("=" * 80)
    print("Executing Cleanup...")
    print("=" * 80)
    
    deleted_count = 0
    for file in to_delete:
        try:
            file.unlink()
            deleted_count += 1
            if deleted_count % 50 == 0:
                print(f"Deleted {deleted_count}/{len(to_delete)} files...")
        except Exception as e:
            print(f"Error deleting {file.name}: {e}")
    
    print(f"\nCleanup complete!")
    print(f"Deleted: {deleted_count} files")
    print(f"Kept: {len(KEEP_SCRIPTS)} files")
    print("=" * 80)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'execute':
        execute_cleanup()
    else:
        main()

