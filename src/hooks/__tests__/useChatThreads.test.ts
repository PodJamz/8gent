import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useChatThreads } from '../useChatThreads';

// Mock localStorage with fresh store per test
let store: Record<string, string> = {};

beforeEach(() => {
  store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    },
    writable: true,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('useChatThreads', () => {
  describe('thread management', () => {
    it('should create threads and add messages', async () => {
      const { result } = renderHook(() => useChatThreads());

      // Create a thread
      let thread;
      act(() => {
        thread = result.current.createThread();
      });

      expect(thread).toBeDefined();
      expect(result.current.threads.length).toBeGreaterThan(0);
      expect(result.current.activeThread).not.toBeNull();

      // Add a message
      act(() => {
        result.current.addMessage('user', 'Hello, world!');
      });

      expect(result.current.activeThread?.messages.length).toBe(1);
      expect(result.current.activeThread?.messages[0].content).toBe('Hello, world!');
    });

    it('should update thread title from first user message', () => {
      const { result } = renderHook(() => useChatThreads());

      act(() => {
        result.current.createThread();
      });

      act(() => {
        result.current.addMessage('user', 'What is the weather today?');
      });

      expect(result.current.activeThread?.title).toBe('What is the weather today?');
    });

    it('should truncate long titles', () => {
      const { result } = renderHook(() => useChatThreads());

      act(() => {
        result.current.createThread();
      });

      act(() => {
        result.current.addMessage('user', 'This is a very long message that should be truncated for the title');
      });

      expect(result.current.activeThread?.title).toBe('This is a very long message...');
    });

    it('should switch between threads', () => {
      const { result } = renderHook(() => useChatThreads());

      let firstThreadId: string;
      let secondThreadId: string;

      act(() => {
        const first = result.current.createThread();
        firstThreadId = first.id;
      });

      act(() => {
        const second = result.current.createThread();
        secondThreadId = second.id;
      });

      expect(result.current.activeThreadId).toBe(secondThreadId!);

      act(() => {
        result.current.switchThread(firstThreadId!);
      });

      expect(result.current.activeThreadId).toBe(firstThreadId!);
    });

    it('should not switch to non-existent thread', () => {
      const { result } = renderHook(() => useChatThreads());

      act(() => {
        result.current.createThread();
      });

      const currentId = result.current.activeThreadId;

      act(() => {
        result.current.switchThread('non_existent_id');
      });

      expect(result.current.activeThreadId).toBe(currentId);
    });

    it('should switch to another thread when deleting active thread', () => {
      const { result } = renderHook(() => useChatThreads());

      let firstThreadId: string;

      act(() => {
        const first = result.current.createThread();
        firstThreadId = first.id;
      });

      act(() => {
        result.current.createThread();
      });

      const secondThreadId = result.current.activeThreadId;

      act(() => {
        result.current.deleteThread(secondThreadId!);
      });

      expect(result.current.activeThreadId).toBe(firstThreadId!);
    });

    it('should clear messages in active thread', () => {
      const { result } = renderHook(() => useChatThreads());

      act(() => {
        result.current.createThread();
      });

      act(() => {
        result.current.addMessage('user', 'Hello');
        result.current.addMessage('assistant', 'Hi there!');
      });

      expect(result.current.activeThread?.messages.length).toBe(2);

      act(() => {
        result.current.clearActiveThread();
      });

      expect(result.current.activeThread?.messages.length).toBe(0);
      expect(result.current.activeThread?.title).toBe('New conversation');
    });

    it('should return messages for active thread', () => {
      const { result } = renderHook(() => useChatThreads());

      act(() => {
        result.current.createThread();
      });

      act(() => {
        result.current.addMessage('user', 'Hello');
      });

      const messages = result.current.getMessages();
      expect(messages.length).toBe(1);
      expect(messages[0].content).toBe('Hello');
    });
  });

  describe('message structure', () => {
    it('should create messages with correct structure', () => {
      const { result } = renderHook(() => useChatThreads());

      act(() => {
        result.current.createThread();
      });

      let message;
      act(() => {
        message = result.current.addMessage('user', 'Test message');
      });

      expect(message).toMatchObject({
        role: 'user',
        content: 'Test message',
      });
      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('timestamp');
    });

    it('should add both user and assistant messages', () => {
      const { result } = renderHook(() => useChatThreads());

      act(() => {
        result.current.createThread();
      });

      act(() => {
        result.current.addMessage('user', 'Hello');
        result.current.addMessage('assistant', 'Hi! How can I help?');
      });

      const messages = result.current.getMessages();
      expect(messages[0].role).toBe('user');
      expect(messages[1].role).toBe('assistant');
    });
  });
});
