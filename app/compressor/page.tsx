import { redirect } from 'next/navigation';

export default function CompressorPage() {
  // 英语作为默认语言，重定向到英语压缩器页面但不显示 /en 前缀
  // 通过内部重写，用户看到的是 /compressor
  redirect('/en/compressor');
}
