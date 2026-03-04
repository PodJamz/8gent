import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceRecorder } from '../useVoiceRecorder';

// Mock MediaRecorder
class MockMediaRecorder {
  static isTypeSupported = vi.fn(() => true);

  state = 'inactive';
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;

  start = vi.fn(() => {
    this.state = 'recording';
  });

  stop = vi.fn(() => {
    this.state = 'inactive';
    // Simulate data available
    if (this.ondataavailable) {
      this.ondataavailable({ data: new Blob(['test'], { type: 'audio/webm' }) });
    }
    // Simulate stop callback
    setTimeout(() => {
      if (this.onstop) this.onstop();
    }, 0);
  });

  mimeType = 'audio/webm';
}

// Mock getUserMedia
const mockGetUserMedia = vi.fn();

// Mock AudioContext
class MockAudioContext {
  createAnalyser = vi.fn(() => ({
    fftSize: 256,
    frequencyBinCount: 128,
    smoothingTimeConstant: 0.5,
    getByteFrequencyData: vi.fn((arr: Uint8Array) => {
      // Fill with some test data
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
    }),
  }));

  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn(),
  }));

  close = vi.fn();
  state = 'running';
}

describe('useVoiceRecorder', () => {
  beforeEach(() => {
    // Setup mocks
    global.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder;
    global.AudioContext = MockAudioContext as unknown as typeof AudioContext;

    // Mock navigator.mediaDevices
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia.mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }],
        }),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useVoiceRecorder());

    expect(result.current.status).toBe('idle');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.duration).toBe(0);
    expect(result.current.error).toBe(null);
    expect(result.current.isSupported).toBe(true);
  });

  it('should have correct number of audio levels based on levelsCount option', () => {
    const { result } = renderHook(() =>
      useVoiceRecorder({ levelsCount: 10 })
    );

    expect(result.current.audioLevels).toHaveLength(10);
  });

  it('should update status to recording when startRecording is called', async () => {
    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.status).toBe('recording');
    expect(result.current.isRecording).toBe(true);
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  });

  it('should return audio blob when stopRecording is called', async () => {
    const { result } = renderHook(() => useVoiceRecorder());

    // Start recording
    await act(async () => {
      await result.current.startRecording();
    });

    // Stop recording
    let blob: Blob | null = null;
    await act(async () => {
      blob = await result.current.stopRecording();
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(result.current.status).toBe('idle');
    expect(result.current.isRecording).toBe(false);
  });

  it('should reset state when cancelRecording is called', async () => {
    const { result } = renderHook(() => useVoiceRecorder());

    // Start recording
    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);

    // Cancel recording
    act(() => {
      result.current.cancelRecording();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.duration).toBe(0);
  });

  it('should handle permission denied error', async () => {
    // Create a proper DOMException-like error
    const permissionError = new DOMException('Permission denied', 'NotAllowedError');
    mockGetUserMedia.mockRejectedValueOnce(permissionError);

    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error?.type).toBe('permission-denied');
  });

  it('should report unsupported when MediaRecorder is not available', () => {
    // Remove MediaRecorder
    const originalMediaRecorder = global.MediaRecorder;
    // @ts-expect-error - intentionally setting to undefined for test
    global.MediaRecorder = undefined;

    const { result } = renderHook(() => useVoiceRecorder());

    expect(result.current.isSupported).toBe(false);

    // Restore
    global.MediaRecorder = originalMediaRecorder;
  });
});
