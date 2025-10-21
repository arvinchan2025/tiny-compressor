'use client'

import { useEffect, useState } from 'react'

export default function CriticalCSS() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // 加载非关键CSS
    const loadNonCriticalCSS = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/styles/non-critical.css'
      link.media = 'print'
      link.onload = () => {
        link.media = 'all'
        setIsLoaded(true)
      }
      document.head.appendChild(link)
    }

    // 延迟加载非关键CSS
    const timer = setTimeout(loadNonCriticalCSS, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <style jsx>{`
      /* 关键CSS - 首屏渲染必需 */
      .critical-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      
      .critical-header {
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 0;
      }
      
      .critical-main {
        flex: 1;
        padding: 2rem 0;
      }
      
      .critical-footer {
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        padding: 1rem 0;
      }
      
      /* 关键按钮样式 */
      .critical-button {
        background: #3b82f6;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .critical-button:hover {
        background: #2563eb;
      }
      
      /* 关键输入框样�?*/
      .critical-input {
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
        width: 100%;
      }
      
      .critical-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      /* 关键卡片样式 */
      .critical-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      /* 响应式设�?*/
      @media (max-width: 768px) {
        .critical-main {
          padding: 1rem 0;
        }
        
        .critical-card {
          padding: 1rem;
        }
      }
    `}</style>
  )
}

