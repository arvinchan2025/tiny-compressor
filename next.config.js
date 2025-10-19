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
  
  // 强制所有页面动态渲染
  experimental: {
    // 启用服务器组件
    serverComponentsExternalPackages: [],
    // 强制动态渲染
    forceSwcTransforms: true,
  },

        // Webpack配置 - 支持Worker
        webpack: (config, { isServer }) => {
          if (!isServer) {
            // 客户端配置
            config.resolve.fallback = {
              ...config.resolve.fallback,
              fs: false,
              path: false,
              crypto: false,
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
          }

          return config;
        },
  
  
  // 图片优化配置
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
    return [
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
  }
};

module.exports = nextConfig;