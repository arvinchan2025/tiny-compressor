import {
  ALL_FORMATS,
  BlobSource,
  Conversion,
  Input,
  Output,
  Mp4OutputFormat,
  BufferTarget,
  Quality
} from 'mediabunny'

self.onmessage = async event => {
  const {type, file, plan} = event.data
  try {
    self.postMessage({
      type: "progress",
      phase: "initializing",
      progress: 0,
    });

    const input = new Input({
      source: new BlobSource(file),
      formats: ALL_FORMATS
    })

    const output = new Output({
      format: new Mp4OutputFormat({
        fastStart: "in-memory",
      }),
      target: new BufferTarget(),
    });

    const conversion = await Conversion.init({
      input,
      output,

      tracks: "primary",

      video: {
        codec: "avc",
        ...(plan.height
          ? {
              height: plan.height,
            }
          : {}),
        quality: new Quality(plan.quality),
        forceTranscode: true,
      },

      audio: {
        codec: "aac",
      },

      showWarnings: false,
    });

    if (!conversion.isValid) {
      throw new Error(
        "This video cannot be processed by the current browser.",
      );
    }

    conversion.onProgress = (progress) => {
      self.postMessage({
        type: "progress",
        phase:
          progress < 0.95
            ? "encoding"
            : "finalizing",
        progress,
      });
    };

    await conversion.execute();

    const buffer = output.target.buffer;

    if (!buffer) {
      throw new Error("Failed to create output video.");
    }

    const blob = new Blob(
      [buffer],
      {
        type: "video/mp4",
      },
    );

    self.postMessage(
      {
        type: "completed",
        buffer,
        size: blob.size,
      },
      [buffer],
    );
  }catch (error){
    self.postMessage({
      type: "error",
      error:
        error instanceof Error
          ? error.message
          : "Video compression failed.",
    });
  }
}