/**
 * 水合问题示例
 * 展示为什么会出现服务器端和客户端内容不匹配
 */

// 服务器端渲染时：
function ServerSideRender() {
  const { t } = useTranslation('home') // translations = {} (空对象)
  
  return (
    <div>
      <h1>{t('hero.title')}</h1> {/* 返回 "hero.title" (翻译键) */}
    </div>
  )
  // 生成的 HTML: <h1>hero.title</h1>
}

// 客户端水合时：
function ClientSideHydration() {
  const { t } = useTranslation('home') // translations = { hero: { title: "TinyCompressor" } }
  
  return (
    <div>
      <h1>{t('hero.title')}</h1> {/* 返回 "TinyCompressor" (真实翻译) */}
    </div>
  )
  // 期望的 HTML: <h1>TinyCompressor</h1>
}

// 结果：服务器端生成 <h1>hero.title</h1>
//       客户端期望   <h1>TinyCompressor</h1>
//       不匹配！→ 水合错误

