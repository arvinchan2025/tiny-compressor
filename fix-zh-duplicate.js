const fs = require('fs');

// 读取中文翻译文件
const content = fs.readFileSync('lib/translations/zh.json', 'utf8');
const lines = content.split('\n');

console.log(`原始文件行数: ${lines.length}`);

// 找到第一个converter部分的结束位置（大约在第375行）
// 找到第二个converter部分的开始位置（第891行）
let firstConverterEnd = -1;
let secondConverterStart = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '  },' && i > 350 && i < 400) {
    // 这可能是第一个converter部分的结束
    firstConverterEnd = i;
  }
  if (lines[i].trim() === '  "converter": {' && i > 890) {
    secondConverterStart = i;
    break;
  }
}

console.log(`第一个converter结束位置: ${firstConverterEnd}`);
console.log(`第二个converter开始位置: ${secondConverterStart}`);

if (secondConverterStart > 0) {
  // 删除重复的converter部分
  const newLines = lines.slice(0, secondConverterStart);
  
  // 找到第二个converter部分的结束位置
  let braceCount = 0;
  let secondConverterEnd = secondConverterStart;
  
  for (let i = secondConverterStart; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) braceCount++;
    if (line.includes('}')) braceCount--;
    
    if (braceCount === 0 && line.trim() === '},') {
      secondConverterEnd = i;
      break;
    }
  }
  
  console.log(`第二个converter结束位置: ${secondConverterEnd}`);
  
  // 合并剩余的行
  const remainingLines = lines.slice(secondConverterEnd + 1);
  const finalLines = [...newLines, ...remainingLines];
  
  console.log(`修复后文件行数: ${finalLines.length}`);
  
  // 写回文件
  fs.writeFileSync('lib/translations/zh.json', finalLines.join('\n'));
  console.log('重复的converter部分已删除');
} else {
  console.log('未找到重复的converter部分');
}
