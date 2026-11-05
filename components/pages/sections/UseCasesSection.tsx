import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";


export function UseCasesSection({translator}: any){
  const {t, getTranslation} = translator
  const items = getTranslation('useCases.items')
  return (
    <div className="section-default py-12">
      <StandardContainer variant="content" size="lg" center>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t('useCases.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('useCases.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any, index: number) => {
              return (
                <div key={index} className="card-glass p-6 hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">{item.icon || '📁'}</div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    {item.description}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {item.content}
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