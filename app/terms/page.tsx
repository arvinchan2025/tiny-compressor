import { redirect } from 'next/navigation';

export default function TermsPage() {
  // 英语作为默认语言，重定向到英语服务条款页面但不显示 /en 前缀
  // 通过内部重写，用户看到的是 /terms
  redirect('/en/terms');
}
