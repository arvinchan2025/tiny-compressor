import React from 'react';
import {Locale} from '@/lib/i18n';
import StandardHeader from '@/components/ui/StandardHeader';
import {Header, Footer} from "@/components";

interface StandardPageLayoutProps {
  locale: Locale;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function StandardPageLayout({
  locale,
  children,
  className = '',
  showHeader = true,
  showFooter = true,
}: StandardPageLayoutProps) {

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${className}`}>
      {showHeader && (
        <Header
          currentLocale={locale}
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter &&
          <Footer
              currentLocale={locale}
          />}
    </div>
  );
}