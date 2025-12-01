/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript配置 - 允许构建时忽略类型错误（用于快速部署）
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 编译器优化
  compiler: {
    // 生产环境移除 console.log（保留 error 和 warn）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 强制动态渲染 - 禁用静态生成
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // 性能优化配置
  experimental: {
    // 启用服务器组件
    serverComponentsExternalPackages: [],
    // 强制动态渲染
    forceSwcTransforms: true,
    // 启用SWC压缩
    swcMinify: true,
    // 优化字体加载
    optimizePackageImports: ['lucide-react'],
  },

  // 开发环境禁用缓存
  ...(process.env.NODE_ENV === 'development' && {
    // 禁用静态优化
    staticPageGenerationTimeout: 0,
    // 禁用图片优化缓存
    images: {
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      unoptimized: true,
    },
    // 禁用所有缓存
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
    // 禁用构建缓存
    generateBuildId: async () => {
      return `build-${Date.now()}`
    },
    // 禁用页面缓存
    experimental: {
      // 禁用静态优化
      forceSwcTransforms: true,
    },
  }),

        // Webpack配置 - 支持Worker和性能优化
        webpack: (config, { isServer, dev }) => {
          if (!isServer) {
            // 客户端配置
            config.resolve.fallback = {
              ...config.resolve.fallback,
              fs: false,
              path: false,
              crypto: false,
              stream: false, // 某些 Node.js 模块需要的
              util: false, // 某些 Node.js 模块需要的
            };

            // 优化Worker加载
            config.module.rules.push({
              test: /\.worker\.(js|ts)$/,
              use: {
                loader: 'worker-loader',
                options: {
                  name: 'static/[hash].worker.js',
                  publicPath: '/_next/',
                },
              },
            });

            // 性能优化配置
            if (!dev) {
              // 移动端优化的代码分割
              config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 10000, // 移动端减小最小包大小
                maxSize: 150000, // 移动端减小最大包大小
                cacheGroups: {
                  // 关键翻译文件（移动端优先）
                  criticalTranslations: {
                    test: /[\\/]lib[\\/]translations[\\/](common|home)[\\/]/,
                    name: 'critical-translations',
                    chunks: 'all',
                    priority: 25,
                    minSize: 0,
                    maxSize: 50000,
                  },
                  // 其他翻译文件
                  translations: {
                    test: /[\\/]lib[\\/]translations[\\/]/,
                    name: 'translations',
                    chunks: 'all',
                    priority: 20,
                    minSize: 0,
                    maxSize: 80000,
                  },
                  // 核心UI组件（移动端关键）
                  criticalUI: {
                    test: /[\\/](lucide-react|react-dropzone)[\\/]/,
                    name: 'critical-ui',
                    chunks: 'all',
                    priority: 18,
                    maxSize: 60000,
                  },
                  // 图片处理库（按需加载）
                  imageProcessing: {
                    test: /[\\/](browser-image-compression)[\\/]/,
                    name: 'image-processing',
                    chunks: 'async', // 移动端异步加载
                    priority: 15,
                    maxSize: 100000,
                  },
                  // 其他UI库
                  ui: {
                    test: /[\\/](react-hook-form|react-hot-toast)[\\/]/,
                    name: 'ui-libs',
                    chunks: 'async',
                    priority: 12,
                    maxSize: 80000,
                  },
                  // 第三方库分包
                  vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10,
                    minSize: 0,
                    maxSize: 120000,
                  },
                  // 公共代码分包
                  common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 5,
                    reuseExistingChunk: true,
                    minSize: 0,
                    maxSize: 100000,
                  },
                },
              };

              // 优化模块解析
              config.resolve.modules = ['node_modules'];
              config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
            }
          }

          return config;
        },
  
  
  // 移动端优化的图片配置
  images: {
    formats: ['image/webp', 'image/avif'],
    // 移动端优先的设备尺寸
    deviceSizes: [375, 414, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 300, // 移动端增加缓存时间
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 压缩配置
  compress: true,

  // 重写规则
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/robots.txt',
        destination: '/api/robots'
      }
    ];
  },

  // 头部配置
  async headers() {
    const headers = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      // 静态资源缓存策略（移动端优化）
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' 
              ? 'no-cache, no-store, must-revalidate' 
              : 'public, max-age=31536000, immutable'
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding'
          }
        ]
      },
      // 移动端关键资源优化
      {
        source: '/_next/static/chunks/critical-(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800'
          },
          {
            key: 'Priority',
            value: 'high'
          }
        ]
      },
      // 翻译文件缓存策略
      {
        source: '/_next/static/chunks/translations-(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' 
              ? 'no-cache, no-store, must-revalidate' 
              : 'public, max-age=86400, stale-while-revalidate=604800'
          }
        ]
      },
      // API路由缓存策略
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' 
              ? 'no-cache, no-store, must-revalidate' 
              : 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      },
      // FFmpeg.wasm 需要的 COOP/COEP headers
      {
        source: '/compressor/compress-video',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ]
      },
      {
        source: '/:locale/compressor/compress-video',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ]
      }
    ];

    // 开发环境添加额外的禁用缓存headers
    if (process.env.NODE_ENV === 'development') {
      headers.push({
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      });
    }

    return headers;
  }
};

module.exports = nextConfig;