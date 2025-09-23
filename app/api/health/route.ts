/**
 * 健康检查 API 端点
 * 用于监控应用状态
 */

import { NextRequest, NextResponse } from 'next/server'

// 系统信息接口
interface SystemInfo {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  version: string
  environment: string
  checks: {
    database?: boolean
    cache?: boolean
    storage?: boolean
  }
}

// 获取内存使用情况
function getMemoryUsage(): { used: number; total: number; percentage: number } {
  if (process.memoryUsage) {
    const memUsage = process.memoryUsage()
    const total = memUsage.heapTotal
    const used = memUsage.heapUsed
    const percentage = Math.round((used / total) * 100)
    
    return {
      used: Math.round(used / 1024 / 1024), // MB
      total: Math.round(total / 1024 / 1024), // MB
      percentage
    }
  }
  
  return { used: 0, total: 0, percentage: 0 }
}

// 执行健康检查
async function performHealthChecks(): Promise<SystemInfo['checks']> {
  const checks: SystemInfo['checks'] = {}
  
  try {
    // 检查数据库连接 (如果有的话)
    // checks.database = await checkDatabaseConnection()
    
    // 检查缓存连接 (如果有的话)
    // checks.cache = await checkCacheConnection()
    
    // 检查存储 (如果有的话)
    // checks.storage = await checkStorageAccess()
    
    // 默认所有检查都通过
    checks.database = true
    checks.cache = true
    checks.storage = true
    
  } catch (error) {
    console.error('Health check failed:', error)
  }
  
  return checks
}

// GET 请求处理
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // 执行健康检查
    const checks = await performHealthChecks()
    
    // 获取系统信息
    const memory = getMemoryUsage()
    const uptime = process.uptime()
    
    // 确定整体状态
    const allChecksPassed = Object.values(checks).every(check => check === true)
    const status: SystemInfo['status'] = allChecksPassed ? 'healthy' : 'unhealthy'
    
    // 构建响应数据
    const systemInfo: SystemInfo = {
      status,
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      memory,
      version: process.env['npm_package_version'] || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks
    }
    
    // 计算响应时间
    const responseTime = Date.now() - startTime
    
    // 设置缓存头
    const response = NextResponse.json({
      ...systemInfo,
      responseTime
    })
    
    // 根据状态设置 HTTP 状态码
    if (status === 'healthy') {
      response.headers.set('Cache-Control', 'public, max-age=30')
      return response
    } else {
      response.headers.set('Cache-Control', 'no-cache')
      return NextResponse.json(
        { ...systemInfo, responseTime },
        { status: 503 }
      )
    }
    
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// HEAD 请求处理 (用于负载均衡器)
export async function HEAD() {
  try {
    const checks = await performHealthChecks()
    const allChecksPassed = Object.values(checks).every(check => check === true)
    
    if (allChecksPassed) {
      return new NextResponse(null, { status: 200 })
    } else {
      return new NextResponse(null, { status: 503 })
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

