/**
 * useFormatTranslations Hook 测试
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useFormatTranslations } from '@/hooks/useFormatTranslations'
import { SupportedLanguage } from '@/types/i18n'

// Mock translations
const mockTranslations = {
  compressor: {
    formats: {
      jpeg: {
        title: 'JPEG Compressor',
        subtitle: 'Optimize JPEG images',
        description: 'Advanced JPEG compression',
        settings: {
          title: 'JPEG Settings',
          quality: 'Quality',
          compress: 'Compress',
          compressing: 'Compressing...'
        },
        steps: [
          {
            step: '1',
            title: 'Upload',
            description: 'Upload images',
            icon: '📤'
          }
        ],
        notes: [
          {
            icon: '💡',
            title: 'Tip',
            content: 'Use high quality for photos',
            type: 'tip' as const
          }
        ],
        faq: [
          {
            question: 'What is JPEG?',
            answer: 'A popular image format'
          }
        ]
      }
    }
  }
}

// Mock translation loader
jest.mock('@/lib/translations', () => ({
  getTranslations: jest.fn((locale: SupportedLanguage) => 
    Promise.resolve(mockTranslations)
  )
}))

describe('useFormatTranslations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should load translations successfully', async () => {
    const { result } = renderHook(() => 
      useFormatTranslations('en', 'jpeg')
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.title).toBe('JPEG Compressor')
    expect(result.current.subtitle).toBe('Optimize JPEG images')
    expect(result.current.description).toBe('Advanced JPEG compression')
  })

  it('should handle translation errors', async () => {
    const { getTranslations } = require('@/lib/translations')
    getTranslations.mockRejectedValueOnce(new Error('Translation failed'))

    const { result } = renderHook(() => 
      useFormatTranslations('en', 'jpeg')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Translation failed')
    expect(result.current.title).toBe('')
  })

  it('should provide correct translations for different formats', async () => {
    // Add PNG translations to mock
    const extendedMockTranslations = {
      ...mockTranslations,
      compressor: {
        ...mockTranslations.compressor,
        formats: {
          ...mockTranslations.compressor.formats,
          png: {
            title: 'PNG Compressor',
            subtitle: 'Optimize PNG images',
            description: 'Advanced PNG compression',
            settings: {
              title: 'PNG Settings',
              quality: 'Quality',
              compress: 'Compress',
              compressing: 'Compressing...'
            },
            steps: [],
            notes: [],
            faq: []
          }
        }
      }
    }

    const { getTranslations } = require('@/lib/translations')
    getTranslations.mockResolvedValueOnce(extendedMockTranslations)

    const { result } = renderHook(() => 
      useFormatTranslations('en', 'png')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.title).toBe('PNG Compressor')
    expect(result.current.subtitle).toBe('Optimize PNG images')
  })

  it('should provide fallback values when translations are missing', async () => {
    const { result } = renderHook(() => 
      useFormatTranslations('en', 'jpeg')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Test getSettingsTranslation with fallback
    expect(result.current.getSettingsTranslation('nonexistent', 'Fallback')).toBe('Fallback')
    expect(result.current.getSettingsTranslation('quality', 'Fallback')).toBe('Quality')
  })

  it('should provide correct settings translations', async () => {
    const { result } = renderHook(() => 
      useFormatTranslations('en', 'jpeg')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.getSettingsTranslation('title', 'Default Title')).toBe('JPEG Settings')
    expect(result.current.getSettingsTranslation('quality', 'Default Quality')).toBe('Quality')
    expect(result.current.getSettingsTranslation('compress', 'Default Compress')).toBe('Compress')
  })

  it('should provide steps, notes, and faq arrays', async () => {
    const { result } = renderHook(() => 
      useFormatTranslations('en', 'jpeg')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.steps).toHaveLength(1)
    expect(result.current.steps[0]).toEqual({
      step: '1',
      title: 'Upload',
      description: 'Upload images',
      icon: '📤'
    })

    expect(result.current.notes).toHaveLength(1)
    expect(result.current.notes[0]).toEqual({
      icon: '💡',
      title: 'Tip',
      content: 'Use high quality for photos',
      type: 'tip'
    })

    expect(result.current.faq).toHaveLength(1)
    expect(result.current.faq[0]).toEqual({
      question: 'What is JPEG?',
      answer: 'A popular image format'
    })
  })

  it('should handle missing format translations gracefully', async () => {
    const { getTranslations } = require('@/lib/translations')
    getTranslations.mockResolvedValueOnce({
      compressor: {
        formats: {
          // Missing jpeg format
        }
      }
    })

    const { result } = renderHook(() => 
      useFormatTranslations('en', 'jpeg')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.title).toBe('')
    expect(result.current.subtitle).toBe('')
    expect(result.current.description).toBe('')
    expect(result.current.steps).toEqual([])
    expect(result.current.notes).toEqual([])
    expect(result.current.faq).toEqual([])
  })

  it('should reload translations when locale changes', async () => {
    const { getTranslations } = require('@/lib/translations')
    
    const { result, rerender } = renderHook(
      ({ locale, format }) => useFormatTranslations(locale, format),
      { initialProps: { locale: 'en' as SupportedLanguage, format: 'jpeg' as const } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(getTranslations).toHaveBeenCalledWith('en')

    // Change locale
    rerender({ locale: 'zh' as SupportedLanguage, format: 'jpeg' as const })

    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(getTranslations).toHaveBeenCalledWith('zh')
  })

  it('should reload translations when format changes', async () => {
    const { getTranslations } = require('@/lib/translations')
    
    const { result, rerender } = renderHook(
      ({ locale, format }) => useFormatTranslations(locale, format),
      { initialProps: { locale: 'en' as SupportedLanguage, format: 'jpeg' as const } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Change format
    rerender({ locale: 'en' as SupportedLanguage, format: 'png' as const })

    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(getTranslations).toHaveBeenCalledTimes(2)
  })
})

