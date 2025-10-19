/**
 * 批量添加动态渲染配置到所有压缩机页面
 */

const fs = require('fs');
const path = require('path');

// 需要添加动态渲染的页面
const pagesToUpdate = [
  'app/[locale]/compressor/compress-avif/page.tsx',
  'app/[locale]/compressor/compress-webp/page.tsx',
  'app/[locale]/compressor/compress-jpeg/page.tsx',
  'app/[locale]/compressor/compress-png/page.tsx',
  'app/[locale]/compressor/compress-gif/page.tsx',
  'app/[locale]/compressor/compress-bmp/page.tsx',
  'app/[locale]/compressor/compress-pdf/page.tsx',
  'app/[locale]/compressor/compress-video/page.tsx',
];

const dynamicConfig = `// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

`;

function addDynamicRendering(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ 文件不存在: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 检查是否已经有动态渲染配置
    if (content.includes('export const dynamic')) {
      console.log(`✅ ${filePath} 已经有动态渲染配置`);
      return true;
    }

    // 在第一个import之后添加动态渲染配置
    const importRegex = /^import.*?from.*?;$/gm;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length + 1;
      
      content = content.slice(0, insertIndex) + '\n' + dynamicConfig + content.slice(insertIndex);
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ 已添加动态渲染配置到: ${filePath}`);
      return true;
    } else {
      console.log(`❌ 未找到import语句: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 开始添加动态渲染配置...\n');
  
  let successCount = 0;
  let totalCount = pagesToUpdate.length;
  
  pagesToUpdate.forEach(filePath => {
    if (addDynamicRendering(filePath)) {
      successCount++;
    }
  });
  
  console.log(`\n📊 完成! 成功: ${successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('✅ 所有页面都已配置动态渲染');
  } else {
    console.log('⚠️ 部分页面配置失败');
  }
}

main();




