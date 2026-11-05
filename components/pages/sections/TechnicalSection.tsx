import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";


export function TechnicalSection({translator}: any){
  const {t, getTranslation} = translator
  const items = getTranslation('technicalPrinciples.items')
  return (
    <div className="section-subtle py-12">
      <StandardContainer variant="content" size="lg" center>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t('technicalPrinciples.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('technicalPrinciples.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item: any, index: number) => {
              return (
                <div key={index} className="card-glass p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">
                    {item.description}
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