'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SandboxState,
  CreateSandboxOptions,
  RunCommandOptions,
  WriteFileOptions,
  CommandState,
} from '@/lib/sandbox';

// ============================================================================
// Types
// ============================================================================

export interface UseSandboxReturn {
  state: SandboxState;
  isConnected: boolean;
  isCreating: boolean;
  error: string | null;

  // Actions
  create: (options?: CreateSandboxOptions) => Promise<string>;
  connect: (sandboxId: string) => Promise<void>;
  terminate: () => Promise<void>;

  // File operations
  writeFile: (options: WriteFileOptions) => Promise<void>;
  writeFiles: (files: WriteFileOptions[]) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  listFiles: (path?: string) => Promise<void>;

  // Command execution
  runCommand: (options: RunCommandOptions) => Promise<CommandState>;
  runAndWait: (command: string, args?: string[]) => Promise<CommandState>;

  // Preview
  getPreviewUrl: (port?: number) => Promise<string>;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: SandboxState = {
  sandboxId: null,
  status: 'idle',
  previewUrl: null,
  files: [],
  activeCommands: new Map(),
  error: null,
  createdAt: null,
  timeout: 600000,
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useSandbox(): UseSandboxReturn {
  const [state, setState] = useState<SandboxState>(initialState);
  const managerRef = useRef<import('@/lib/sandbox').SandboxManager | null>(null);

  // Initialize manager on mount
  useEffect(() => {
    let mounted = true;

    const initManager = async () => {
      const { getSandboxManager } = await import('@/lib/sandbox');
      if (!mounted) return;

      const manager = getSandboxManager();
      managerRef.current = manager;

      // Subscribe to state changes
      const unsubscribe = manager.subscribe((newState) => {
        if (mounted) {
          setState(newState);
        }
      });

      // Set initial state
      setState(manager.getState());

      return unsubscribe;
    };

    const unsubscribePromise = initManager();

    return () => {
      mounted = false;
      unsubscribePromise.then((unsub) => unsub?.());
    };
  }, []);

  // Create sandbox
  const create = useCallback(async (options?: CreateSandboxOptions) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.create(options);
  }, []);

  // Connect to existing sandbox
  const connect = useCallback(async (sandboxId: string) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.connect(sandboxId);
  }, []);

  // Terminate sandbox
  const terminate = useCallback(async () => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.terminate();
  }, []);

  // Write file
  const writeFile = useCallback(async (options: WriteFileOptions) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.writeFile(options);
  }, []);

  // Write multiple files
  const writeFiles = useCallback(async (files: WriteFileOptions[]) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.writeFiles(files);
  }, []);

  // Read file
  const readFile = useCallback(async (path: string) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.readFile(path);
  }, []);

  // List files
  const listFiles = useCallback(async (path?: string) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    await managerRef.current.listFiles(path);
  }, []);

  // Run command
  const runCommand = useCallback(async (options: RunCommandOptions) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.runCommand(options);
  }, []);

  // Run command and wait for completion
  const runAndWait = useCallback(
    async (command: string, args?: string[]) => {
      return runCommand({ command, args, wait: true });
    },
    [runCommand]
  );

  // Get preview URL
  const getPreviewUrl = useCallback(async (port?: number) => {
    if (!managerRef.current) throw new Error('Manager not initialized');
    return managerRef.current.getPreviewUrl(port);
  }, []);

  return {
    state,
    isConnected: state.status === 'ready',
    isCreating: state.status === 'creating',
    error: state.error,

    create,
    connect,
    terminate,

    writeFile,
    writeFiles,
    readFile,
    listFiles,

    runCommand,
    runAndWait,

    getPreviewUrl,
  };
}

export default useSandbox;
