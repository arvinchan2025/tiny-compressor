import type { CompressionResult } from './types';

/**
 * 下载压缩结果
 */
export function downloadResult(result: CompressionResult): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(result.compressedFile.data);
  link.download = result.compressedFile.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * 下载多个结果为ZIP
 */
export async function downloadResultsAsZip(results: CompressionResult[]): Promise<void> {
  // 这里需要集成 JSZip 库
  // 暂时使用逐个下载的方式
  for (const result of results) {
    downloadResult(result);
    // 添加小延迟避免浏览器阻止多个下载
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
