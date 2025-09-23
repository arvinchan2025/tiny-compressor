/**
 * 格式注意事项组件
 * 显示转换相关的注意事项和提示
 */

'use client';

import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';

interface FormatNotesProps {
  locale: SupportedLanguage;
  sourceFormat: string;
  targetFormat: string;
  customNotes?: Array<{
    icon: string;
    title: string;
    content: string;
    type: 'warning' | 'tip' | 'info';
  }> | undefined;
  translations: any;
}

export default function FormatNotes({
  locale,
  sourceFormat,
  targetFormat,
  customNotes,
  translations
}: FormatNotesProps) {
  const isRTL = locale === 'ar';
  
  // 默认注意事项
  const defaultNotes = [
    {
      icon: '⚠️',
      title: translations?.notes?.transparency?.title || 'Transparency Handling',
      content: translations?.notes?.transparency?.content || `Converting from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} may affect transparency support. Please check the target format capabilities.`,
      type: 'warning' as const
    },
    {
      icon: '💡',
      title: translations?.notes?.quality?.title || 'Quality Optimization',
      content: translations?.notes?.quality?.content || 'Use appropriate quality settings to balance file size and visual quality for your specific use case.',
      type: 'tip' as const
    },
    {
      icon: '📱',
      title: translations?.notes?.compatibility?.title || 'Browser Compatibility',
      content: translations?.notes?.compatibility?.content || 'Ensure the target format is supported by your target browsers and applications.',
      type: 'info' as const
    },
    {
      icon: '🔄',
      title: translations?.notes?.reconversion?.title || 'Re-conversion Warning',
      content: translations?.notes?.reconversion?.content || 'Re-converting already converted images may result in quality loss. Always work with original source files when possible.',
      type: 'warning' as const
    }
  ];

  const notes = customNotes || defaultNotes;

  const getNoteStyles = (type: 'warning' | 'tip' | 'info') => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-red-50/50 border-red-200/50',
          icon: 'text-red-600',
          title: 'text-red-800',
          content: 'text-red-700'
        };
      case 'tip':
        return {
          container: 'bg-blue-50/50 border-blue-200/50',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          content: 'text-blue-700'
        };
      case 'info':
        return {
          container: 'bg-green-50/50 border-green-200/50',
          icon: 'text-green-600',
          title: 'text-green-800',
          content: 'text-green-700'
        };
      default:
        return {
          container: 'bg-gray-50/50 border-gray-200/50',
          icon: 'text-gray-600',
          title: 'text-gray-800',
          content: 'text-gray-700'
        };
    }
  };

  return (
    <section className="py-16 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="heading-3 text-slate-800 mb-4">
            {translations?.notes?.title || 'Important Notes'}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {translations?.notes?.subtitle || `Key information to help you get the best conversion results from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note, index) => {
            const styles = getNoteStyles(note.type);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${styles.container} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <span className={`text-2xl ${styles.icon}`}>
                      {note.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${styles.title}`}>
                      {note.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${styles.content}`}>
                      {note.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 格式特定说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl p-8 border border-slate-200/50"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            {translations?.notes?.formatSpecific?.title || 'Format-Specific Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 源格式信息 */}
            <div className="bg-white/60 rounded-xl p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">
                    {translations?.formats?.[sourceFormat.toLowerCase()]?.icon || '📷'}
                  </span>
                </span>
                {sourceFormat.toUpperCase()} {translations?.notes?.formatSpecific?.source || 'Source Format'}
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{translations?.formats?.[sourceFormat.toLowerCase()]?.description || 'Source format characteristics'}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{translations?.notes?.formatSpecific?.sourceFeatures || 'Key features and capabilities'}</span>
                </li>
              </ul>
            </div>

            {/* 目标格式信息 */}
            <div className="bg-white/60 rounded-xl p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">
                    {translations?.formats?.[targetFormat.toLowerCase()]?.icon || '🎨'}
                  </span>
                </span>
                {targetFormat.toUpperCase()} {translations?.notes?.formatSpecific?.target || 'Target Format'}
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{translations?.formats?.[targetFormat.toLowerCase()]?.description || 'Target format characteristics'}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{translations?.notes?.formatSpecific?.targetFeatures || 'Key features and capabilities'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 转换建议 */}
          <div className="mt-8 p-6 bg-blue-50/50 rounded-xl border border-blue-200/50">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  {translations?.notes?.formatSpecific?.recommendation?.title || 'Conversion Recommendation'}
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {translations?.notes?.formatSpecific?.recommendation?.content || `For optimal results when converting from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}, consider the specific characteristics and limitations of each format to ensure the best quality and compatibility.`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
