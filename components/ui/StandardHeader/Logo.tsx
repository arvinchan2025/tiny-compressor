import {getNavigationPath} from "@/lib/i18n/path-utils";
import Image from "next/image";


export default function Logo() {
  const handleLogoClick = ({currentLocale}: any) => {
    const homePath = getNavigationPath('/', currentLocale);
    window.location.href = homePath;
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={handleLogoClick}
    >
      <div className="relative w-8 h-8">
        <Image
          src="/logo.svg"
          alt={'TinyCompressor'}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
        TinyCompressor
      </span>
    </div>
  )
}