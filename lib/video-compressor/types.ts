
export class VideoCompressor {
  private worker: Worker | null = null;

  private createWorker() {
    this.worker = new Worker(
      new URL(
        "@/lib/workers/video-compressor.worker.ts",
        import.meta.url,
      ),
      {
        type: "module",
      },
    );

    return this.worker;
  }

  async compress(){
    const worker = this.createWorker();
    return new Promise((resolve, reject) => {
      worker.onmessage = (event) => {

      }
    })
  }

  cancel () {
    this.worker?.terminate();
    this.worker = null
  }
}