import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageProcessor from '@/components/core/ImageProcessor';

// Mock dependencies
jest.mock('@/lib/workers', () => ({
  workerManager: {
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
    isAvailable: jest.fn().mockReturnValue(true),
    processImage: jest.fn().mockResolvedValue({
      compressedFile: new File(['compressed'], 'compressed.jpg', { type: 'image/jpeg' }),
      originalSize: 1000,
      compressedSize: 500,
      compressionRatio: 50
    })
  }
}));

jest.mock('@/lib/wasm', () => ({
  wasmProcessor: {
    initialize: jest.fn().mockResolvedValue(undefined),
    isFormatSupported: jest.fn().mockReturnValue(false),
    isReady: jest.fn().mockReturnValue(true)
  },
  preloadWasmProcessor: jest.fn()
}));

const mockTranslations = {
  processing: 'Processing...',
  completed: 'Completed',
  error: 'Error occurred',
  retry: 'Retry',
  cancel: 'Cancel'
};

const mockFiles = [
  new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
  new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
];

const mockOptions = {
  quality: 0.8 as const,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'jpeg' as const
};

describe('ImageProcessor Component', () => {
  const mockOnResults = jest.fn();
  const mockOnError = jest.fn();
  const mockOnProgress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ready state initially', () => {
    render(
      <ImageProcessor
        files={mockFiles}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    expect(screen.getByText(/ready to process 2 file/i)).toBeInTheDocument();
    expect(screen.getByText(/start processing/i)).toBeInTheDocument();
  });

  it('shows processor status', async () => {
    render(
      <ImageProcessor
        files={mockFiles}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/web worker available/i)).toBeInTheDocument();
    });
  });

  it('handles processing start', async () => {
    render(
      <ImageProcessor
        files={mockFiles}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    const startButton = screen.getByText(/start processing/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(mockTranslations.processing)).toBeInTheDocument();
    });
  });

  it('shows processing progress', async () => {
    render(
      <ImageProcessor
        files={mockFiles}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    const startButton = screen.getByText(/start processing/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(mockTranslations.processing)).toBeInTheDocument();
    });

    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(mockTranslations.completed)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles processing error', async () => {
    const { workerManager } = require('@/lib/workers');
    workerManager.processImage.mockRejectedValueOnce(new Error('Processing failed'));

    render(
      <ImageProcessor
        files={mockFiles}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    const startButton = screen.getByText(/start processing/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  it('handles empty files array', () => {
    render(
      <ImageProcessor
        files={[]}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    expect(screen.getByText(/ready to process 0 file/i)).toBeInTheDocument();
  });

  it('shows results after processing', async () => {
    render(
      <ImageProcessor
        files={mockFiles}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    const startButton = screen.getByText(/start processing/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(mockTranslations.completed)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText(/successfully processed 2 file/i)).toBeInTheDocument();
  });

  it('handles retry after error', async () => {
    const { workerManager } = require('@/lib/workers');
    workerManager.processImage
      .mockRejectedValueOnce(new Error('Processing failed'))
      .mockResolvedValueOnce({
        compressedFile: new File(['compressed'], 'compressed.jpg', { type: 'image/jpeg' }),
        originalSize: 1000,
        compressedSize: 500,
        compressionRatio: 50
      });

    render(
      <ImageProcessor
        files={mockFiles}
        options={mockOptions}
        onResults={mockOnResults}
        onError={mockOnError}
        onProgress={mockOnProgress}
        translations={mockTranslations}
      />
    );

    const startButton = screen.getByText(/start processing/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(mockTranslations.error)).toBeInTheDocument();
    });

    const retryButton = screen.getByText(mockTranslations.retry);
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText(mockTranslations.completed)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
