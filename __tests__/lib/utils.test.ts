import { formatFileSize, getCompressionRatio } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('handles large numbers', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 2)).toBe('2 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1024 GB');
    });

    it('rounds to 2 decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1537)).toBe('1.5 KB');
      expect(formatFileSize(1538)).toBe('1.5 KB');
    });
  });

  describe('getCompressionRatio', () => {
    it('calculates compression ratio correctly', () => {
      expect(getCompressionRatio(1000, 500)).toBe(50);
      expect(getCompressionRatio(1000, 800)).toBe(20);
      expect(getCompressionRatio(1000, 1000)).toBe(0);
      expect(getCompressionRatio(1000, 1200)).toBe(-20);
    });

    it('handles zero original size', () => {
      expect(getCompressionRatio(0, 500)).toBe(0);
    });

    it('handles negative compression', () => {
      expect(getCompressionRatio(1000, 1500)).toBe(-50);
    });

    it('rounds to nearest integer', () => {
      expect(getCompressionRatio(1000, 333)).toBe(67);
      expect(getCompressionRatio(1000, 334)).toBe(67);
      expect(getCompressionRatio(1000, 335)).toBe(67);
    });
  });
});


