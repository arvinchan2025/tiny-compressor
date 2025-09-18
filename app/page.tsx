import { redirect } from 'next/navigation';

export default function RootPage() {
  // 重定向到英文版本
  redirect('/en');
}

