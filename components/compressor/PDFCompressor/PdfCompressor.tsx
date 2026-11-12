import {usePdfCompressor} from './hooks/usePdfCompressor';
import {
  CompressorUpload,
  CompressorConfig,
  CompressorProgress,
  CompressorResult
} from "@/components/compressor/components";
import {createTranslator} from "@/lib/i18n/ssr-optimization";

export default function PdfCompressor(props: any) {
  // const { t } = useTranslation('compressors/pdf' as any, locale);
  const format = 'pdf'
  const {onComplete, onReset} = props
  const {t} = createTranslator(props.operationTranslations)
  const compressor = usePdfCompressor({
    onComplete,
    onReset,
  });

  return (
    <div className="relative">
      {/* 上传区域 */}
      {compressor.state === 'empty' && (
        <CompressorUpload
          format={'pdf'}
          t={t}
          acceptTypes={"application/pdf"}
          onFileSelect={compressor.handleFileSelect}
        />
      )}

      {/* 配置区域 */}
      {compressor.state === 'config' && compressor.file && (
        <CompressorConfig
          file={compressor.file}
          format={format}
          settings={compressor.options}
          onSettingsChange={compressor.setOptions}
          onCompress={compressor.handleCompress}
          onReset={compressor.handleReset}
          t={t}
        />
      )}

      {/* 处理中 */}
      {compressor.state === 'processing' && (
        <CompressorProgress
          progress={compressor.progress}
          format={format}
          t={t}
        />
      )}

      {/* 结果区域 */}
      {compressor.state === 'result' && compressor.result && (
        <CompressorResult
          result={compressor.result}
          format={format}
          quality={compressor.options.imageQuality}
          onDownload={compressor.handleDownload}
          onReset={compressor.handleReset}
          t={t}
        />
      )}

      {/* 错误信息 */}
      {compressor.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="font-medium text-red-800 dark:text-red-300">Error</p>
          <p className="text-sm text-red-700 dark:text-red-400">
            {compressor.error}
          </p>
        </div>
      )}
    </div>
  );
}