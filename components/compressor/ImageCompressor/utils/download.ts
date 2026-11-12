import { CompressionResult } from '@/types/image';

type DownloadableCompressedFile =
  | File
  | {
      data: Blob;
      name?: string;
      type?: string;
    };

function getCompressedFile(
  value: CompressionResult['compressedFile'],
  originalFileName: string
): { blob: Blob; fileName: string } {
  const compressed = value as unknown as DownloadableCompressedFile;

  if (compressed instanceof Blob) {
    return {
      blob: compressed,
      fileName:
        compressed instanceof File && compressed.name
          ? compressed.name
          : 'compressed-image',
    };
  }

  if (
    compressed &&
    typeof compressed === 'object' &&
    'data' in compressed &&
    compressed.data instanceof Blob
  ) {
    return {
      blob: compressed.data,
      fileName: compressed.name || `compressed_${originalFileName}`,
    };
  }

  throw new Error('Invalid compressed file format.');
}

export function downloadCompressedResult(result: CompressionResult): void {
  const { blob, fileName } = getCompressedFile(
    result.compressedFile,
    result.originalFile.name
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  try {
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();

    // Delay revocation slightly so the browser can begin the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
