import CTAQuickLinks from "@/components/shared/CTAQuickLinks";
import React from "react";

export function CTASection({translator}: any) {
  const {t, getTranslation} = translator
  const items = getTranslation('quickLinks.items')
  return (
    <div className="relative z-10">
      <CTAQuickLinks
        title={t('quickLinks.title')}
        description={t('quickLinks.description')}
        items={items}
        maxItems={6}
      />
    </div>
  )
}