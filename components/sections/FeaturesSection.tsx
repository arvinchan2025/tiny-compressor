import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";


export function FeaturesSection({translator}: any) {
  const {t, getTranslation} = translator
  const features = getTranslation('features.items')
  return (
    <div className="section-default py-12">
      <StandardContainer variant="content" size="lg" center>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t('features.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features?.map((feature: any, index: number) => {
              return (
                <div key={index} className="card-glass p-6">
                  <div className="text-3xl mb-4">{feature.icon || '✓'}</div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </StandardContainer>
    </div>
  )
}