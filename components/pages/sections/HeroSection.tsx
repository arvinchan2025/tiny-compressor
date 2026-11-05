import StandardContainer from "@/components/ui/StandardContainer";
import React from "react";


export function HeroSection(props: any) {
  const {translator: {t}} = props
  return (
    <section className="relative">
      {/* 极简背景 - 减少渲染复杂度 */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950"/>

      <StandardContainer variant="content" size="xl" center className="relative z-10">
        <div className="text-center pt-20 pb-16">
          {/* Main Headline - 关键内容优先渲染 */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    <span
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {t('hero.title')}
                    </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              {t('hero.subtitle')
              }
            </p>
          </div>

          {/* Stats Badge */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="group">
              <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                  90%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Size Reduction
                </div>
              </div>
            </div>
            <div className="group">
              <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                <div className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
                  6+
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Formats
                </div>
              </div>
            </div>
            <div className="group">
              <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                <div className="text-3xl font-bold mb-2 text-purple-600 dark:text-purple-400">
                  100%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Free
                </div>
              </div>
            </div>
            <div className="group">
              <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-slate-700/50">
                <div className="text-3xl font-bold mb-2 text-orange-600 dark:text-orange-400">
                  &lt;3s
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Processing
                </div>
              </div>
            </div>
          </div>
        </div>
      </StandardContainer>
    </section>
  )
}