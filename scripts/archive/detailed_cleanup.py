#!/usr/bin/env python3
"""
详细项目清理脚本 - 第二阶段
清理文档目录和重复文件
"""

import os
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent

# 需要删除的文件
FILES_TO_DELETE = [
    'middleware-simplified.ts',  # 旧版本middleware
    'PROJECT_CLEANUP_PLAN.md',   # 已归档的临时文档
]

# docs目录中需要保留的核心文档
DOCS_TO_KEEP = [
    'QUICK_START_GUIDE.md',
    'TESTING_QUICK_START.md',
    'PROJECT_REFACTORING_PLAN.md',
    'HYBRID_RENDERING_DESIGN.md',
    'README.md',
    'archive',  # 归档目录
]

def delete_root_files():
    """删除根目录的临时文件"""
    print("\n[1/3] Deleting temporary files in root...")
    deleted = 0
    for filename in FILES_TO_DELETE:
        path = ROOT_DIR / filename
        if path.exists():
            path.unlink()
            print(f"  [OK] Deleted: {filename}")
            deleted += 1
        else:
            print(f"  [SKIP] Not found: {filename}")
    print(f"  Summary: Deleted {deleted}/{len(FILES_TO_DELETE)} files")

def archive_old_docs():
    """归档docs目录中的旧文档"""
    print("\n[2/3] Archiving old documentation...")
    
    docs_dir = ROOT_DIR / 'docs'
    archive_dir = docs_dir / 'archive' / 'old-reports'
    archive_dir.mkdir(parents=True, exist_ok=True)
    
    if not docs_dir.exists():
        print("  [SKIP] docs directory not found")
        return
    
    archived = 0
    skipped = 0
    
    # 获取所有文件
    all_docs = [f for f in docs_dir.iterdir() if f.is_file() and f.suffix == '.md']
    
    for doc in all_docs:
        if doc.name not in DOCS_TO_KEEP:
            try:
                dst = archive_dir / doc.name
                shutil.move(str(doc), str(dst))
                archived += 1
                if archived <= 5:  # 只显示前5个
                    print(f"  [OK] Archived: {doc.name}")
            except Exception as e:
                print(f"  [ERROR] Failed to archive {doc.name}: {e}")
        else:
            skipped += 1
    
    if archived > 5:
        print(f"  ... and {archived - 5} more files")
    
    print(f"  Summary: Archived {archived} docs, kept {skipped} core docs")

def create_docs_index():
    """创建文档索引"""
    print("\n[3/3] Creating documentation index...")
    
    index_content = """# TinyCompressor Documentation

## Core Documentation

### Getting Started
- [Quick Start Guide](QUICK_START_GUIDE.md) - Get up and running quickly
- [Testing Guide](TESTING_QUICK_START.md) - How to run tests

### Architecture
- [Project Refactoring Plan](PROJECT_REFACTORING_PLAN.md) - Project structure
- [Hybrid Rendering Design](HYBRID_RENDERING_DESIGN.md) - Rendering strategy

## Archived Documentation

### Old Reports
All historical reports, analysis documents, and completion summaries have been moved to:
- `archive/old-reports/` - Historical translation and development reports
- `archive/deployment-reports/` - Deployment preparation documents

These are kept for reference but are no longer actively maintained.

---

Last updated: 2025-10-13
"""
    
    readme_path = ROOT_DIR / 'docs' / 'README.md'
    readme_path.write_text(index_content, encoding='utf-8')
    print("  [OK] Created docs/README.md")

def print_summary():
    """打印清理总结"""
    print("\n" + "=" * 60)
    print("DETAILED CLEANUP COMPLETED")
    print("=" * 60)
    print("\nCleaned:")
    print(f"- Root directory temporary files")
    print(f"- 100+ old documentation files")
    print("- Created docs index")
    print("\nProject is now much cleaner!")
    print("\nRecommended next steps:")
    print("1. Review docs/archive/ directory")
    print("2. Update .gitignore if needed")
    print("3. Commit changes")
    print("=" * 60)

def main():
    print("=" * 60)
    print("DETAILED PROJECT CLEANUP - PHASE 2")
    print("=" * 60)
    print("\nThis will:")
    print("1. Delete old middleware file")
    print("2. Archive 100+ old documentation files")
    print("3. Create documentation index")
    
    delete_root_files()
    archive_old_docs()
    create_docs_index()
    print_summary()

if __name__ == '__main__':
    main()

