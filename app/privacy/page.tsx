import { redirect } from 'next/navigation';

export default function PrivacyPage() {
  // 英语作为默认语言，重定向到英语隐私政策页面但不显示 /en 前缀
  // 通过内部重写，用户看到的是 /privacy
  redirect('/en/privacy');
}
