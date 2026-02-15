'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { SandboxState, CommandState } from '@/lib/sandbox';
import { createInitialSandboxState } from '@/lib/sandbox';

// ============================================================================
// Types
// ============================================================================

interface SandboxContextValue {
  // State
  state: SandboxState;
  isConnected: boolean;
  isCreating: boolean;
  error: string | null;

  // Actions
  create: (options?: { timeout?: number; ports?: number[] }) => Promise<string | null>;
  connect: (sandboxId: string) => Promise<void>;
  terminate: () => Promise<void>;

  // File operations
  writeFile: (path: string, content: string) => Promise<void>;
  writeFiles: (files: { path: string; content: string }[]) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  listFiles: (path?: string) => Promise<void>;

  // Command execution
  runCommand: (
    command: string,
    args?: string[],
    options?: { wait?: boolean; sudo?: boolean }
  ) => Promise<CommandState>;
  runAndWait: (command: string, args?: string[]) => Promise<CommandState>;

  // Preview
  getPreviewUrl: (port?: number) => Promise<string>;

  // Repository operations (with GitHub auth from Clerk)
  cloneRepo: (repoUrl: string) => Promise<{ success: boolean; projectDir?: string; error?: string }>;

  // Logs
  logs: LogEntry[];
  clearLogs: () => void;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'command' | 'output' | 'error' | 'system';
  message: string;
  details?: string;
}

// ============================================================================
// Context
// ============================================================================

const SandboxContext = createContext<SandboxContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function SandboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SandboxState>(createInitialSandboxState());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [manager, setManager] = useState<import('@/lib/sandbox').SandboxManager | null>(
    null
  );

  // Initialize manager on mount
  useEffect(() => {
    let mounted = true;

    const initManager = async () => {
      const { getSandboxManager } = await import('@/lib/sandbox');
      if (!mounted) return;

      const mgr = getSandboxManager();
      setManager(mgr);

      // Subscribe to state changes
      const unsubscribe = mgr.subscribe((newState) => {
        if (mounted) {
          setState(newState);
        }
      });

      // Set initial state
      setState(mgr.getState());

      return unsubscribe;
    };

    const unsubscribePromise = initManager();

    return () => {
      mounted = false;
      unsubscribePromise.then((unsub) => unsub?.());
    };
  }, []);

  // Helper to add log entry
  const addLog = useCallback(
    (type: LogEntry['type'], message: string, details?: string) => {
      setLogs((prev) => [
        ...prev,
        {
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
          type,
          message,
          details,
        },
      ]);
    },
    []
  );

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Create sandbox
  const create = useCallback(
    async (options?: { timeout?: number; ports?: number[] }) => {
      if (!manager) throw new Error('Manager not initialized');

      addLog('system', 'Creating sandbox...');
      try {
        const sandboxId = await manager.create(options);
        addLog('system', `Sandbox created: ${sandboxId}`);
        return sandboxId;
      } catch (error) {
        // Don't re-throw - error is captured in manager.error state
        // This allows the UI to show auth modal instead of crashing
        addLog('error', 'Failed to create sandbox', String(error));
        return null;
      }
    },
    [manager, addLog]
  );

  // Connect to existing sandbox
  const connect = useCallback(
    async (sandboxId: string) => {
      if (!manager) throw new Error('Manager not initialized');

      addLog('system', `Connecting to sandbox: ${sandboxId}`);
      try {
        await manager.connect(sandboxId);
        addLog('system', 'Connected to sandbox');
      } catch (error) {
        addLog('error', 'Failed to connect', String(error));
        throw error;
      }
    },
    [manager, addLog]
  );

  // Terminate sandbox
  const terminate = useCallback(async () => {
    if (!manager) throw new Error('Manager not initialized');

    addLog('system', 'Terminating sandbox...');
    try {
      await manager.terminate();
      addLog('system', 'Sandbox terminated');
    } catch (error) {
      addLog('error', 'Failed to terminate', String(error));
      throw error;
    }
  }, [manager, addLog]);

  // Write file
  const writeFile = useCallback(
    async (path: string, content: string) => {
      if (!manager) throw new Error('Manager not initialized');

      addLog('command', `Writing file: ${path}`);
      try {
        await manager.writeFile({ path, content });
        addLog('output', `File written: ${path}`);
      } catch (error) {
        addLog('error', `Failed to write file: ${path}`, String(error));
        throw error;
      }
    },
    [manager, addLog]
  );

  // Write multiple files
  const writeFiles = useCallback(
    async (files: { path: string; content: string }[]) => {
      if (!manager) throw new Error('Manager not initialized');

      addLog('command', `Writing ${files.length} files...`);
      try {
        await manager.writeFiles(files);
        addLog('output', `${files.length} files written`);
      } catch (error) {
        addLog('error', 'Failed to write files', String(error));
        throw error;
      }
    },
    [manager, addLog]
  );

  // Read file
  const readFile = useCallback(
    async (path: string) => {
      if (!manager) throw new Error('Manager not initialized');
      return manager.readFile(path);
    },
    [manager]
  );

  // List files
  const listFiles = useCallback(
    async (path?: string) => {
      if (!manager) throw new Error('Manager not initialized');
      await manager.listFiles(path);
    },
    [manager]
  );

  // Run command
  const runCommand = useCallback(
    async (
      command: string,
      args?: string[],
      options?: { wait?: boolean; sudo?: boolean }
    ) => {
      if (!manager) throw new Error('Manager not initialized');

      const cmdStr = args ? `${command} ${args.join(' ')}` : command;
      addLog('command', `$ ${cmdStr}`);

      try {
        const result = await manager.runCommand({
          command,
          args,
          wait: options?.wait ?? true,
          sudo: options?.sudo,
        });

        if (result.stdout) {
          addLog('output', result.stdout);
        }
        if (result.stderr) {
          addLog('error', result.stderr);
        }
        if (result.exitCode !== undefined && result.exitCode !== 0) {
          addLog('error', `Exit code: ${result.exitCode}`);
        }

        return result;
      } catch (error) {
        addLog('error', `Command failed: ${cmdStr}`, String(error));
        throw error;
      }
    },
    [manager, addLog]
  );

  // Run command and wait
  const runAndWait = useCallback(
    async (command: string, args?: string[]) => {
      return runCommand(command, args, { wait: true });
    },
    [runCommand]
  );

  // Get preview URL
  const getPreviewUrl = useCallback(
    async (port?: number) => {
      if (!manager) throw new Error('Manager not initialized');

      try {
        const url = await manager.getPreviewUrl(port);
        addLog('system', `Preview URL: ${url}`);
        return url;
      } catch (error) {
        addLog('error', 'Failed to get preview URL', String(error));
        throw error;
      }
    },
    [manager, addLog]
  );

  // Clone repository with GitHub auth from Clerk
  const cloneRepo = useCallback(
    async (repoUrl: string) => {
      if (!manager) throw new Error('Manager not initialized');

      addLog('command', `git clone ${repoUrl}`);
      try {
        const result = await manager.cloneRepo(repoUrl);
        if (result.success) {
          addLog('system', `Repository cloned to ${result.projectDir}`);
        } else {
          addLog('error', result.error || 'Failed to clone repository');
        }
        return result;
      } catch (error) {
        addLog('error', 'Failed to clone repository', String(error));
        throw error;
      }
    },
    [manager, addLog]
  );

  const value: SandboxContextValue = {
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
    cloneRepo,

    logs,
    clearLogs,
  };

  return <SandboxContext.Provider value={value}>{children}</SandboxContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useSandboxContext(): SandboxContextValue {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error('useSandboxContext must be used within a SandboxProvider');
  }
  return context;
}

export default SandboxContext;
