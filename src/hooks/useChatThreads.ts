'use client';

import { useState, useCallback, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ChatThread {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  createdAt: number;
  lastModified: number;
}

// ============================================================================
// Storage
// ============================================================================

const STORAGE_KEY = 'openclaw_chat_threads';
const ACTIVE_THREAD_KEY = 'openclaw_active_thread';

function generateId(): string {
  return `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateTitle(messages: ChatThread['messages']): string {
  // Get first user message for title
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const words = firstUserMessage.content.split(' ').slice(0, 6).join(' ');
    return words.length < firstUserMessage.content.length ? `${words}...` : words;
  }
  return 'New conversation';
}

// ============================================================================
// Hook
// ============================================================================

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedThreads = localStorage.getItem(STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_THREAD_KEY);

      if (savedThreads) {
        const parsed = JSON.parse(savedThreads) as ChatThread[];
        setThreads(parsed);

        // Set active thread
        if (savedActiveId && parsed.some(t => t.id === savedActiveId)) {
          setActiveThreadId(savedActiveId);
        } else if (parsed.length > 0) {
          setActiveThreadId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load chat threads:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
      if (activeThreadId) {
        localStorage.setItem(ACTIVE_THREAD_KEY, activeThreadId);
      }
    } catch (e) {
      console.error('Failed to save chat threads:', e);
    }
  }, [threads, activeThreadId, isLoaded]);

  // Get active thread
  const activeThread = threads.find(t => t.id === activeThreadId) || null;

  // Create new thread
  const createThread = useCallback((): ChatThread => {
    const newThread: ChatThread = {
      id: generateId(),
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);

    return newThread;
  }, []);

  // Switch to thread
  const switchThread = useCallback((threadId: string) => {
    if (threads.some(t => t.id === threadId)) {
      setActiveThreadId(threadId);
    }
  }, [threads]);

  // Delete thread
  const deleteThread = useCallback((threadId: string) => {
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== threadId);

      // If we deleted the active thread, switch to another
      if (activeThreadId === threadId) {
        if (filtered.length > 0) {
          setActiveThreadId(filtered[0].id);
        } else {
          setActiveThreadId(null);
        }
      }

      return filtered;
    });
  }, [activeThreadId]);

  // Add message to active thread
  const addMessage = useCallback((
    role: 'user' | 'assistant',
    content: string
  ) => {
    if (!activeThreadId) return null;

    const message = {
      id: generateMessageId(),
      role,
      content,
      timestamp: Date.now(),
    };

    setThreads(prev => prev.map(thread => {
      if (thread.id !== activeThreadId) return thread;

      const updatedMessages = [...thread.messages, message];
      return {
        ...thread,
        messages: updatedMessages,
        title: thread.messages.length === 0 && role === 'user'
          ? generateTitle([message])
          : thread.title,
        lastModified: Date.now(),
      };
    }));

    return message;
  }, [activeThreadId]);

  // Clear active thread messages
  const clearActiveThread = useCallback(() => {
    if (!activeThreadId) return;

    setThreads(prev => prev.map(thread => {
      if (thread.id !== activeThreadId) return thread;
      return {
        ...thread,
        messages: [],
        title: 'New conversation',
        lastModified: Date.now(),
      };
    }));
  }, [activeThreadId]);

  // Get messages for active thread
  const getMessages = useCallback(() => {
    return activeThread?.messages || [];
  }, [activeThread]);

  // Ensure a thread exists (create one if none)
  const ensureThread = useCallback(() => {
    if (threads.length === 0 || !activeThreadId) {
      return createThread();
    }
    return activeThread;
  }, [threads.length, activeThreadId, createThread, activeThread]);

  return {
    threads,
    activeThread,
    activeThreadId,
    isLoaded,
    createThread,
    switchThread,
    deleteThread,
    addMessage,
    clearActiveThread,
    getMessages,
    ensureThread,
  };
}
