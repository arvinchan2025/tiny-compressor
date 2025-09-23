import { WorkerManager } from '@/lib/workers/worker-manager';

// Mock Worker
const mockWorker = {
  postMessage: jest.fn(),
  terminate: jest.fn(),
  onmessage: null,
  onerror: null,
};

// Mock Worker constructor
global.Worker = jest.fn(() => mockWorker) as any;

describe('WorkerManager', () => {
  let workerManager: WorkerManager;

  beforeEach(() => {
    workerManager = new WorkerManager();
    jest.clearAllMocks();
  });

  afterEach(() => {
    workerManager.destroy();
  });

  describe('initialize', () => {
    it('initializes worker successfully', async () => {
      await workerManager.initialize();
      expect(Worker).toHaveBeenCalled();
      expect(workerManager.isAvailable()).toBe(true);
    });

    it('handles initialization failure', async () => {
      // Mock Worker constructor to throw error
      (global.Worker as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Worker creation failed');
      });

      await expect(workerManager.initialize()).rejects.toThrow('Failed to initialize image processing worker');
      expect(workerManager.isAvailable()).toBe(false);
    });
  });

  describe('processImage', () => {
    beforeEach(async () => {
      await workerManager.initialize();
    });

    it('processes image successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResult = {
        compressedFile: new File(['compressed'], 'compressed.jpg', { type: 'image/jpeg' }),
        originalSize: 1000,
        compressedSize: 500,
        compressionRatio: 50
      };

      // Mock successful response
      const mockResponse = {
        type: 'success',
        id: 'test-id',
        data: { result: mockResult }
      };

      // Simulate worker response
      setTimeout(() => {
        if (mockWorker.onmessage) {
          mockWorker.onmessage({ data: mockResponse });
        }
      }, 0);

      const result = await workerManager.processImage(mockFile, {
        quality: 80,
        maxWidth: 1920,
        maxHeight: 1080,
        format: 'jpeg'
      });

      expect(result).toEqual(mockResult);
      expect(mockWorker.postMessage).toHaveBeenCalledWith({
        type: 'process',
        id: expect.any(String),
        data: {
          file: mockFile,
          options: {
            quality: 80,
            maxWidth: 1920,
            maxHeight: 1080,
            format: 'jpeg'
          }
        }
      });
    });

    it('handles processing error', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      // Mock error response
      const mockErrorResponse = {
        type: 'error',
        id: 'test-id',
        data: { error: 'Processing failed' }
      };

      // Simulate worker error response
      setTimeout(() => {
        if (mockWorker.onmessage) {
          mockWorker.onmessage({ data: mockErrorResponse });
        }
      }, 0);

      await expect(workerManager.processImage(mockFile, {
        quality: 80,
        maxWidth: 1920,
        maxHeight: 1080,
        format: 'jpeg'
      })).rejects.toThrow('Processing failed');
    });

    it('handles timeout', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      // Don't simulate any response to trigger timeout
      await expect(workerManager.processImage(mockFile, {
        quality: 80,
        maxWidth: 1920,
        maxHeight: 1080,
        format: 'jpeg'
      })).rejects.toThrow('Processing timeout');
    });
  });

  describe('cancelProcessing', () => {
    beforeEach(async () => {
      await workerManager.initialize();
    });

    it('sends cancel message to worker', () => {
      const taskId = 'test-task-id';
      workerManager.cancelProcessing(taskId);

      expect(mockWorker.postMessage).toHaveBeenCalledWith({
        type: 'cancel',
        id: taskId
      });
    });
  });

  describe('destroy', () => {
    it('terminates worker and cleans up', () => {
      workerManager.destroy();
      expect(mockWorker.terminate).toHaveBeenCalled();
      expect(workerManager.isAvailable()).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('returns false when not initialized', () => {
      expect(workerManager.isAvailable()).toBe(false);
    });

    it('returns true when initialized', async () => {
      await workerManager.initialize();
      expect(workerManager.isAvailable()).toBe(true);
    });
  });
});


