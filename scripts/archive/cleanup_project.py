#!/usr/bin/env python3
"""
项目清理脚本 - 自动整理和归档临时文件
"""

import os
import shutil
from pathlib import Path

# 项目根目录
ROOT_DIR = Path(__file__).parent.parent

# 需要移动到归档的报告文件
REPORTS_TO_ARCHIVE = [
    'CLEANUP_COMPLETE.md',
    'COMPLETION_REPORT.md',
    'DEPLOYMENT_READY.md',
    'DEPLOYMENT_STATUS.md',
    'DOCS_CLEANUP_PLAN.md',
    'FINAL_PROJECT_STATUS.md',
    'PROJECT_SUMMARY.md',
    'QUICK_DEPLOY_GUIDE.md',
    'SITEMAP_UPDATE.md',
    'TRANSLATION_STATUS.md',
    'VERCEL_CHECKLIST_FINAL.md',
    'VERCEL_DEPLOYMENT_CHECKLIST.md',
    'VERCEL_DEPLOYMENT_REPORT.md',
]

# 需要删除的临时文件
FILES_TO_DELETE = [
    'DEPLOY_NOW.txt',
    'test-core-build.js',
]

# 需要归档的旧脚本
SCRIPTS_TO_ARCHIVE = [
    'check_all_languages_v3.py',
    'check_translation_v3_enhanced.py',
    'compare_structure_with_english.py',
    'sync_filenames_with_english.py',
    'CLEANUP_PLAN.md',
    'TRANSLATION_CHECK_GUIDE.md',
    'cleanup_scripts.py',  # 这个也是旧的清理脚本
]

# 需要清理的目录（本地，不提交到git）
DIRS_TO_CLEAN = [
    'playwright-report',
    'test-results',
]


def create_archive_dirs():
    """创建归档目录"""
    archive_dirs = [
        ROOT_DIR / 'docs' / 'archive' / 'deployment-reports',
        ROOT_DIR / 'scripts' / 'archive',
    ]
    
    for dir_path in archive_dirs:
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"[OK] Created: {dir_path.relative_to(ROOT_DIR)}")


def move_reports_to_archive():
    """移动报告文件到归档目录"""
    archive_dir = ROOT_DIR / 'docs' / 'archive' / 'deployment-reports'
    moved_count = 0
    
    print("\n📁 Moving reports to archive...")
    for filename in REPORTS_TO_ARCHIVE:
        src = ROOT_DIR / filename
        if src.exists():
            dst = archive_dir / filename
            shutil.move(str(src), str(dst))
            print(f"  ✓ Moved: {filename}")
            moved_count += 1
        else:
            print(f"  ⊘ Not found: {filename}")
    
    print(f"\n✅ Moved {moved_count}/{len(REPORTS_TO_ARCHIVE)} reports")


def delete_temp_files():
    """删除临时文件"""
    deleted_count = 0
    
    print("\n🗑️  Deleting temporary files...")
    for filename in FILES_TO_DELETE:
        file_path = ROOT_DIR / filename
        if file_path.exists():
            file_path.unlink()
            print(f"  ✓ Deleted: {filename}")
            deleted_count += 1
        else:
            print(f"  ⊘ Not found: {filename}")
    
    print(f"\n✅ Deleted {deleted_count}/{len(FILES_TO_DELETE)} files")


def archive_old_scripts():
    """归档旧脚本"""
    archive_dir = ROOT_DIR / 'scripts' / 'archive'
    archived_count = 0
    
    print("\n📦 Archiving old scripts...")
    for filename in SCRIPTS_TO_ARCHIVE:
        src = ROOT_DIR / 'scripts' / filename
        if src.exists():
            dst = archive_dir / filename
            shutil.move(str(src), str(dst))
            print(f"  ✓ Archived: {filename}")
            archived_count += 1
        else:
            print(f"  ⊘ Not found: {filename}")
    
    print(f"\n✅ Archived {archived_count}/{len(SCRIPTS_TO_ARCHIVE)} scripts")


def clean_build_artifacts():
    """清理构建产物（仅本地，不影响git）"""
    print("\n🧹 Cleaning build artifacts...")
    
    # 清理测试结果目录
    for dirname in DIRS_TO_CLEAN:
        dir_path = ROOT_DIR / dirname
        if dir_path.exists():
            try:
                shutil.rmtree(dir_path)
                print(f"  ✓ Cleaned: {dirname}/")
            except Exception as e:
                print(f"  ✗ Error cleaning {dirname}: {e}")
        else:
            print(f"  ⊘ Not found: {dirname}/")
    
    # 清理TypeScript构建信息
    tsbuildinfo = ROOT_DIR / 'tsconfig.tsbuildinfo'
    if tsbuildinfo.exists():
        tsbuildinfo.unlink()
        print(f"  ✓ Deleted: tsconfig.tsbuildinfo")


def create_archive_readme():
    """创建归档目录的README"""
    readme_content = """# Archive Directory

This directory contains archived files from the project cleanup.

## Contents

### deployment-reports/
Temporary deployment reports and checklists created during the initial Vercel deployment preparation.

### ../scripts/archive/
Old validation and checking scripts that were used during the translation completion phase.

## Note
These files are kept for reference but are no longer actively used in the project.
"""
    
    readme_path = ROOT_DIR / 'docs' / 'archive' / 'README.md'
    readme_path.write_text(readme_content, encoding='utf-8')
    print(f"\n✓ Created: docs/archive/README.md")


def update_gitignore():
    """更新.gitignore文件"""
    gitignore_path = ROOT_DIR / '.gitignore'
    
    # 要添加的忽略规则
    new_rules = """
# Test results and reports
playwright-report/
test-results/

# TypeScript build info
tsconfig.tsbuildinfo

# Next.js cache old files
.next/cache/**/*.old
"""
    
    if gitignore_path.exists():
        current_content = gitignore_path.read_text(encoding='utf-8')
        
        # 检查是否已经包含这些规则
        if 'playwright-report/' not in current_content:
            with open(gitignore_path, 'a', encoding='utf-8') as f:
                f.write(new_rules)
            print("\n✓ Updated: .gitignore")
        else:
            print("\n⊘ .gitignore already contains test result rules")
    else:
        print("\n✗ .gitignore not found")


def print_summary():
    """打印清理总结"""
    print("\n" + "=" * 60)
    print("  PROJECT CLEANUP COMPLETED")
    print("=" * 60)
    print("\nWhat was done:")
    print(f"✓ Archived {len(REPORTS_TO_ARCHIVE)} deployment reports")
    print(f"✓ Deleted {len(FILES_TO_DELETE)} temporary files")
    print(f"✓ Archived {len(SCRIPTS_TO_ARCHIVE)} old scripts")
    print(f"✓ Cleaned {len(DIRS_TO_CLEAN)} build artifact directories")
    print("✓ Updated .gitignore")
    print("\nProject structure is now cleaner and more organized!")
    print("\nNext steps:")
    print("1. Review the changes")
    print("2. Commit to git")
    print("3. Push to repository")
    print("=" * 60)


def main():
    import sys
    
    print("=" * 60)
    print("  PROJECT CLEANUP SCRIPT")
    print("=" * 60)
    print(f"\nWorking directory: {ROOT_DIR}")
    print("\nThis script will:")
    print("1. Create archive directories")
    print("2. Move deployment reports to archive")
    print("3. Delete temporary files")
    print("4. Archive old scripts")
    print("5. Clean build artifacts")
    print("6. Update .gitignore")
    print("\n" + "=" * 60)
    
    # 检查是否有--yes参数
    if '--yes' not in sys.argv and '-y' not in sys.argv:
        try:
            input("\nPress Enter to continue or Ctrl+C to cancel...")
        except (EOFError, KeyboardInterrupt):
            print("\n\nCancelled by user.")
            return
    else:
        print("\nAuto-confirmed with --yes flag")
    
    # 执行清理步骤
    create_archive_dirs()
    move_reports_to_archive()
    delete_temp_files()
    archive_old_scripts()
    clean_build_artifacts()
    create_archive_readme()
    update_gitignore()
    print_summary()


if __name__ == '__main__':
    main()

