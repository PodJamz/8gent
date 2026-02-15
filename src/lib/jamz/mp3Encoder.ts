'use client';

// MP3 Encoder using lamejs
// This provides high-quality MP3 encoding in the browser

interface Mp3EncoderOptions {
  sampleRate?: number;
  bitRate?: number;
  channels?: number;
}

interface LamejsEncoder {
  encodeBuffer: (left: Int16Array, right?: Int16Array) => Int8Array;
  flush: () => Int8Array;
}

interface Lamejs {
  Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => LamejsEncoder;
}

// Dynamically import lamejs (it's a CommonJS module)
let lamejsPromise: Promise<Lamejs> | null = null;

async function getLamejs(): Promise<Lamejs> {
  if (!lamejsPromise) {
    lamejsPromise = import('lamejs').then((m) => m.default || m);
  }
  return lamejsPromise;
}

/**
 * Convert an AudioBuffer to MP3 format
 */
export async function audioBufferToMp3(
  audioBuffer: AudioBuffer,
  options: Mp3EncoderOptions = {}
): Promise<Blob> {
  const {
    sampleRate = audioBuffer.sampleRate,
    bitRate = 192, // kbps - good quality
    channels = audioBuffer.numberOfChannels,
  } = options;

  const lamejs = await getLamejs();

  // Create encoder
  const mp3Encoder = new lamejs.Mp3Encoder(
    Math.min(channels, 2), // Max 2 channels for MP3
    sampleRate,
    bitRate
  );

  const mp3Data: Int8Array[] = [];
  const blockSize = 1152; // MP3 frame size

  // Get channel data
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = channels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

  // Convert Float32Array to Int16Array (required by lamejs)
  const leftSamples = floatTo16BitPCM(leftChannel);
  const rightSamples = floatTo16BitPCM(rightChannel);

  // Encode in blocks
  const numBlocks = Math.ceil(leftSamples.length / blockSize);

  for (let i = 0; i < numBlocks; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, leftSamples.length);

    const leftBlock = leftSamples.subarray(start, end);
    const rightBlock = rightSamples.subarray(start, end);

    const mp3buf = mp3Encoder.encodeBuffer(leftBlock, rightBlock);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  // Flush remaining data
  const flushBuffer = mp3Encoder.flush();
  if (flushBuffer.length > 0) {
    mp3Data.push(flushBuffer);
  }

  // Combine all MP3 data into a single blob
  const totalLength = mp3Data.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of mp3Data) {
    result.set(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.length), offset);
    offset += chunk.length;
  }

  return new Blob([result], { type: 'audio/mp3' });
}

/**
 * Convert Float32Array audio data to Int16Array for MP3 encoding
 */
function floatTo16BitPCM(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);

  for (let i = 0; i < float32Array.length; i++) {
    // Clamp values between -1 and 1
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    // Convert to 16-bit signed integer
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  return int16Array;
}

/**
 * Export multiple tracks as individual MP3 stems
 */
export async function exportStemsAsMp3(
  stems: Array<{ name: string; buffer: AudioBuffer }>,
  options: Mp3EncoderOptions = {}
): Promise<Array<{ name: string; blob: Blob }>> {
  const results: Array<{ name: string; blob: Blob }> = [];

  for (const stem of stems) {
    const blob = await audioBufferToMp3(stem.buffer, options);
    results.push({
      name: `${stem.name}.mp3`,
      blob,
    });
  }

  return results;
}

/**
 * Get estimated file size for MP3 encoding
 */
export function estimateMp3FileSize(
  durationSeconds: number,
  bitRate: number = 192
): number {
  // MP3 file size ≈ (bitrate * duration) / 8
  // Add ~2% overhead for headers/frames
  return Math.ceil((bitRate * 1000 * durationSeconds) / 8 * 1.02);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
