#!/usr/bin/env python3
"""项目清理脚本 - 简化版（ASCII only）"""

import os
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent

# 需要移动的报告
REPORTS = [
    'CLEANUP_COMPLETE.md', 'COMPLETION_REPORT.md', 'DEPLOYMENT_READY.md',
    'DEPLOYMENT_STATUS.md', 'DOCS_CLEANUP_PLAN.md', 'FINAL_PROJECT_STATUS.md',
    'PROJECT_SUMMARY.md', 'QUICK_DEPLOY_GUIDE.md', 'SITEMAP_UPDATE.md',
    'TRANSLATION_STATUS.md', 'VERCEL_CHECKLIST_FINAL.md',
    'VERCEL_DEPLOYMENT_CHECKLIST.md', 'VERCEL_DEPLOYMENT_REPORT.md',
]

# 需要删除的文件
TO_DELETE = ['DEPLOY_NOW.txt', 'test-core-build.js']

# 需要归档的脚本
OLD_SCRIPTS = [
    'check_all_languages_v3.py', 'check_translation_v3_enhanced.py',
    'compare_structure_with_english.py', 'sync_filenames_with_english.py',
    'CLEANUP_PLAN.md', 'TRANSLATION_CHECK_GUIDE.md', 'cleanup_scripts.py',
]

def main():
    print("=" * 60)
    print("PROJECT CLEANUP")
    print("=" * 60)
    
    # 创建归档目录
    print("\n[1/6] Creating archive directories...")
    archive_reports = ROOT_DIR / 'docs' / 'archive' / 'deployment-reports'
    archive_scripts = ROOT_DIR / 'scripts' / 'archive'
    archive_reports.mkdir(parents=True, exist_ok=True)
    archive_scripts.mkdir(parents=True, exist_ok=True)
    print("  OK - Created archive directories")
    
    # 移动报告
    print("\n[2/6] Moving reports to archive...")
    moved = 0
    for f in REPORTS:
        src = ROOT_DIR / f
        if src.exists():
            dst = archive_reports / f
            shutil.move(str(src), str(dst))
            moved += 1
    print(f"  OK - Moved {moved}/{len(REPORTS)} reports")
    
    # 删除临时文件
    print("\n[3/6] Deleting temporary files...")
    deleted = 0
    for f in TO_DELETE:
        path = ROOT_DIR / f
        if path.exists():
            path.unlink()
            deleted += 1
    print(f"  OK - Deleted {deleted}/{len(TO_DELETE)} files")
    
    # 归档旧脚本
    print("\n[4/6] Archiving old scripts...")
    archived = 0
    for f in OLD_SCRIPTS:
        src = ROOT_DIR / 'scripts' / f
        if src.exists():
            dst = archive_scripts / f
            shutil.move(str(src), str(dst))
            archived += 1
    print(f"  OK - Archived {archived}/{len(OLD_SCRIPTS)} scripts")
    
    # 清理构建产物
    print("\n[5/6] Cleaning build artifacts...")
    cleaned = 0
    for dirname in ['playwright-report', 'test-results']:
        path = ROOT_DIR / dirname
        if path.exists():
            shutil.rmtree(path)
            cleaned += 1
    
    tsbuild = ROOT_DIR / 'tsconfig.tsbuildinfo'
    if tsbuild.exists():
        tsbuild.unlink()
        cleaned += 1
    print(f"  OK - Cleaned {cleaned} build artifacts")
    
    # 创建归档README
    print("\n[6/6] Creating archive README...")
    readme = archive_reports.parent / 'README.md'
    readme.write_text("""# Archive Directory

## deployment-reports/
Temporary deployment reports from Vercel setup.

## ../scripts/archive/
Old validation scripts from translation phase.

These files are kept for reference but no longer actively used.
""", encoding='utf-8')
    print("  OK - Created archive README")
    
    # 总结
    print("\n" + "=" * 60)
    print("CLEANUP COMPLETED")
    print("=" * 60)
    print(f"\nMoved: {moved} reports")
    print(f"Deleted: {deleted} temporary files")
    print(f"Archived: {archived} old scripts")
    print(f"Cleaned: {cleaned} build artifacts")
    print("\nProject is now cleaner!")
    print("=" * 60)

if __name__ == '__main__':
    main()

