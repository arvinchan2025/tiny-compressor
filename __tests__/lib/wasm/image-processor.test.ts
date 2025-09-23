import { WasmImageProcessor, wasmProcessor } from '@/lib/wasm/image-processor';

// Mock Squoosh library
const mockSquooshLib = {
  Image: jest.fn().mockImplementation((data) => ({
    encode: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))
  })),
  codecs: {
    avif: {
      name: 'avif',
      encode: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))
    },
    heic: {
      name: 'heic',
      encode: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))
    },
    bmp: {
      name: 'bmp',
      encode: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))
    },
    tiff: {
      name: 'tiff',
      encode: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))
    },
    ico: {
      name: 'ico',
      encode: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]))
    }
  }
};

// Mock dynamic import
jest.mock('@squoosh/lib', () => mockSquooshLib);

// Mock LazyLoader
jest.mock('@/lib/dynamic-loading', () => ({
  LazyLoader: {
    load: jest.fn().mockResolvedValue(mockSquooshLib),
    preload: jest.fn()
  }
}));

describe('WasmImageProcessor', () => {
  let processor: WasmImageProcessor;

  beforeEach(() => {
    processor = new WasmImageProcessor();
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('initializes successfully', async () => {
      await processor.initialize();
      expect(processor.isReady()).toBe(true);
    });

    it('handles initialization failure', async () => {
      const { LazyLoader } = require('@/lib/dynamic-loading');
      LazyLoader.load.mockRejectedValueOnce(new Error('Load failed'));

      await expect(processor.initialize()).rejects.toThrow('WASM processor initialization failed');
      expect(processor.isReady()).toBe(false);
    });
  });

  describe('isFormatSupported', () => {
    it('returns true for supported formats', () => {
      expect(processor.isFormatSupported('avif')).toBe(true);
      expect(processor.isFormatSupported('heic')).toBe(true);
      expect(processor.isFormatSupported('bmp')).toBe(true);
      expect(processor.isFormatSupported('tiff')).toBe(true);
      expect(processor.isFormatSupported('ico')).toBe(true);
    });

    it('returns false for unsupported formats', () => {
      expect(processor.isFormatSupported('jpeg')).toBe(false);
      expect(processor.isFormatSupported('png')).toBe(false);
      expect(processor.isFormatSupported('webp')).toBe(false);
      expect(processor.isFormatSupported('gif')).toBe(false);
    });
  });

  describe('processImage', () => {
    beforeEach(async () => {
      await processor.initialize();
    });

    it('processes image successfully', async () => {
      const mockFile = new File(['test'], 'test.avif', { type: 'image/avif' });
      
      const result = await processor.processImage(mockFile, {
        format: 'avif',
        quality: 80,
        width: 1920,
        height: 1080
      });

      expect(result).toEqual({
        data: new Uint8Array([1, 2, 3, 4]),
        format: 'avif',
        mimeType: 'image/avif'
      });

      expect(mockSquooshLib.codecs.avif.encode).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          quality: 80,
          speed: 4,
          subsample: 1
        })
      );
    });

    it('handles different formats', async () => {
      const mockFile = new File(['test'], 'test.heic', { type: 'image/heic' });
      
      await processor.processImage(mockFile, {
        format: 'heic',
        quality: 90
      });

      expect(mockSquooshLib.codecs.heic.encode).toHaveBeenCalled();
    });

    it('throws error for unsupported format', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      await expect(processor.processImage(mockFile, {
        format: 'jpeg' as any,
        quality: 80
      })).rejects.toThrow('Unsupported format: jpeg');
    });

    it('throws error when not initialized', async () => {
      const uninitializedProcessor = new WasmImageProcessor();
      const mockFile = new File(['test'], 'test.avif', { type: 'image/avif' });
      
      await expect(uninitializedProcessor.processImage(mockFile, {
        format: 'avif',
        quality: 80
      })).rejects.toThrow('WASM processor not initialized');
    });

    it('handles encoding failure', async () => {
      mockSquooshLib.codecs.avif.encode.mockRejectedValueOnce(new Error('Encoding failed'));
      
      const mockFile = new File(['test'], 'test.avif', { type: 'image/avif' });
      
      await expect(processor.processImage(mockFile, {
        format: 'avif',
        quality: 80
      })).rejects.toThrow('WASM processing failed: Encoding failed');
    });
  });

  describe('getSupportedExtensions', () => {
    it('returns supported file extensions', () => {
      const extensions = processor.getSupportedExtensions();
      expect(extensions).toEqual(['.avif', '.heic', '.bmp', '.tiff', '.ico']);
    });
  });

  describe('getSupportedMimeTypes', () => {
    it('returns supported MIME types', () => {
      const mimeTypes = processor.getSupportedMimeTypes();
      expect(mimeTypes).toEqual([
        'image/avif',
        'image/heic',
        'image/bmp',
        'image/tiff',
        'image/x-icon'
      ]);
    });
  });

  describe('singleton instance', () => {
    it('returns the same instance', () => {
      const instance1 = wasmProcessor;
      const instance2 = wasmProcessor;
      expect(instance1).toBe(instance2);
    });
  });
});


