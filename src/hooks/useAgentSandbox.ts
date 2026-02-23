'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useSandboxContext, type LogEntry } from '@/contexts/SandboxContext';
import type { ToolAction } from '@/lib/8gent/tools';
import type { FileInfo, CommandState } from '@/lib/sandbox';

// =============================================================================
// Types
// =============================================================================

export interface SandboxFile {
  path: string;
  content?: string;
  language?: string;
}

export interface AgentSandboxState {
  // Sandbox status
  isConnected: boolean;
  isCreating: boolean;
  sandboxId: string | null;
  previewUrl: string | null;
  error: string | null;

  // Files
  files: FileInfo[];
  currentFile: SandboxFile | null;

  // Terminal
  terminalOutput: TerminalLine[];
  isRunning: boolean;

  // Git
  gitStatus: GitStatus | null;
}

export interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
  timestamp: number;
}

export interface GitStatus {
  branch: string;
  modified: string[];
  staged: string[];
  untracked: string[];
}

export interface UseAgentSandboxReturn extends AgentSandboxState {
  // Sandbox lifecycle
  startSandbox: () => Promise<void>;
  stopSandbox: () => Promise<void>;

  // Execute tool actions from AI
  executeToolAction: (action: ToolAction) => Promise<void>;

  // Manual operations
  cloneRepository: (url: string, branch?: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  runCommand: (command: string) => Promise<CommandState>;
  startDevServer: (command?: string, port?: number) => Promise<string>;
  refreshFiles: () => Promise<void>;

  // Logs
  logs: LogEntry[];
  clearLogs: () => void;
}

// =============================================================================
// Helper: Detect language from file path
// =============================================================================

function detectLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    mdx: 'markdown',
    css: 'css',
    scss: 'scss',
    html: 'html',
    py: 'python',
    rs: 'rust',
    go: 'go',
    sh: 'shell',
    bash: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    toml: 'toml',
    sql: 'sql',
  };
  return langMap[ext || ''] || 'plaintext';
}

// =============================================================================
// Hook
// =============================================================================

export function useAgentSandbox(): UseAgentSandboxReturn {
  const sandbox = useSandboxContext();

  // Local state
  const [currentFile, setCurrentFile] = useState<SandboxFile | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);

  // Terminal output helper
  const addTerminalLine = useCallback(
    (type: TerminalLine['type'], content: string) => {
      setTerminalOutput((prev) => [
        ...prev,
        {
          id: `term_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          type,
          content,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  // Start sandbox
  const startSandbox = useCallback(async () => {
    try {
      addTerminalLine('system', 'Starting sandbox environment...');
      await sandbox.create({ timeout: 600000, ports: [3000, 5173, 8080] });
      await sandbox.listFiles('.');
      addTerminalLine('system', 'Sandbox ready!');
    } catch (error) {
      // Don't re-throw - let the error be handled by the auth modal detection
      // The error is already in sandbox.error and terminal output
      addTerminalLine('error', `Failed to start sandbox: ${error}`);
    }
  }, [sandbox, addTerminalLine]);

  // Stop sandbox
  const stopSandbox = useCallback(async () => {
    try {
      addTerminalLine('system', 'Terminating sandbox...');
      await sandbox.terminate();
      setCurrentFile(null);
      setGitStatus(null);
      addTerminalLine('system', 'Sandbox terminated');
    } catch (error) {
      addTerminalLine('error', `Failed to stop sandbox: ${error}`);
    }
  }, [sandbox, addTerminalLine]);

  // Clone repository (uses GitHub auth from Clerk for private repos)
  const cloneRepository = useCallback(
    async (url: string, _branch?: string) => {
      if (!sandbox.isConnected) {
        await startSandbox();
      }

      addTerminalLine('command', `git clone ${url} (authenticated via GitHub)`);
      setIsRunning(true);

      try {
        // Use the server-side cloneRepo which handles GitHub auth
        const result = await sandbox.cloneRepo(url);

        if (result.success) {
          addTerminalLine('system', `Repository cloned to ${result.projectDir}`);
          // Refresh file list
          await sandbox.listFiles(result.projectDir || './project');
        } else {
          addTerminalLine('error', result.error || 'Failed to clone repository');
        }
      } catch (error) {
        addTerminalLine('error', `Clone failed: ${error}`);
      } finally {
        setIsRunning(false);
      }
    },
    [sandbox, startSandbox, addTerminalLine]
  );

  // Read file
  const readFile = useCallback(
    async (path: string): Promise<string> => {
      const content = await sandbox.readFile(path);
      setCurrentFile({
        path,
        content,
        language: detectLanguage(path),
      });
      return content;
    },
    [sandbox]
  );

  // Write file
  const writeFile = useCallback(
    async (path: string, content: string) => {
      await sandbox.writeFile(path, content);
      addTerminalLine('system', `Wrote file: ${path}`);

      // Update current file if it's the same
      if (currentFile?.path === path) {
        setCurrentFile({ ...currentFile, content });
      }
    },
    [sandbox, currentFile, addTerminalLine]
  );

  // Run command
  const runCommand = useCallback(
    async (command: string) => {
      addTerminalLine('command', `$ ${command}`);
      setIsRunning(true);

      try {
        // Intercept git clone commands to use authenticated cloning
        const gitCloneMatch = command.match(/^git\s+clone\s+(\S+)(?:\s+(\S+))?$/i);
        if (gitCloneMatch) {
          const repoUrl = gitCloneMatch[1];
          addTerminalLine('system', 'Using authenticated clone...');
          addTerminalLine('system', `Fetching GitHub token and cloning ${repoUrl}...`);

          try {
            const cloneResult = await sandbox.cloneRepo(repoUrl);
            console.log('[Clone] Result:', cloneResult);

            if (cloneResult.success) {
              addTerminalLine('output', `✓ Cloned successfully to ${cloneResult.projectDir}`);
              addTerminalLine('system', 'Refreshing file list...');
              // Refresh file list after clone
              await sandbox.listFiles(cloneResult.projectDir);
              addTerminalLine('output', 'Ready! Use "ls" to see files.');
            } else {
              addTerminalLine('error', `✗ Clone failed: ${cloneResult.error || 'Unknown error'}`);
            }
            // Return a CommandState-compatible object
            return {
              cmdId: `cmd_clone_${Date.now()}`,
              command: 'git',
              args: ['clone', repoUrl],
              status: (cloneResult.success ? 'completed' : 'error') as 'completed' | 'error',
              startedAt: Date.now(),
              exitCode: cloneResult.success ? 0 : 1,
              stdout: cloneResult.success ? `Cloned to ${cloneResult.projectDir}` : '',
              stderr: cloneResult.error || '',
            };
          } catch (cloneError) {
            console.error('[Clone] Error:', cloneError);
            const errorMsg = cloneError instanceof Error ? cloneError.message : 'Clone failed';
            addTerminalLine('error', `✗ ${errorMsg}`);
            return {
              cmdId: `cmd_clone_${Date.now()}`,
              command: 'git',
              args: ['clone', repoUrl],
              status: 'error' as const,
              startedAt: Date.now(),
              exitCode: 1,
              stdout: '',
              stderr: errorMsg,
            };
          }
        }

        // Parse command and args
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        const result = await sandbox.runCommand(cmd, args);

        if (result.stdout) addTerminalLine('output', result.stdout);
        if (result.stderr) addTerminalLine('error', result.stderr);

        return result;
      } finally {
        setIsRunning(false);
      }
    },
    [sandbox, addTerminalLine]
  );

  // Start dev server
  const startDevServer = useCallback(
    async (command: string = 'npm run dev', port: number = 3000): Promise<string> => {
      addTerminalLine('command', `$ ${command}`);
      setIsRunning(true);

      try {
        // Run dev command (don't wait for completion as it's a long-running process)
        const parts = command.split(' ');
        await sandbox.runCommand(parts[0], parts.slice(1), { wait: false });

        // Wait a moment for server to start
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Get preview URL
        const url = await sandbox.getPreviewUrl(port);
        addTerminalLine('system', `Dev server started at ${url}`);
        return url;
      } finally {
        setIsRunning(false);
      }
    },
    [sandbox, addTerminalLine]
  );

  // Refresh files
  const refreshFiles = useCallback(async () => {
    if (sandbox.isConnected) {
      await sandbox.listFiles();
    }
  }, [sandbox]);

  // Execute tool action from AI
  const executeToolAction = useCallback(
    async (action: ToolAction) => {
      const { type, payload } = action;

      switch (type) {
        case 'repo_cloned': {
          const { url, branch } = payload as { url: string; branch?: string };
          await cloneRepository(url, branch);
          break;
        }

        case 'file_read': {
          const { path } = payload as { path: string };
          await readFile(path);
          break;
        }

        case 'file_written': {
          const { path, content } = payload as { path: string; content: string };
          await writeFile(path, content);
          break;
        }

        case 'command_executed': {
          const { command } = payload as { command: string };
          await runCommand(command);
          break;
        }

        case 'server_started': {
          const { command, port } = payload as { command?: string; port?: number };
          await startDevServer(command, port);
          break;
        }

        case 'preview_ready': {
          const { port } = payload as { port?: number };
          await sandbox.getPreviewUrl(port || 3000);
          break;
        }

        case 'git_status': {
          const result = await runCommand('git status --porcelain');
          // Parse git status output
          const lines = (result as { stdout?: string }).stdout?.split('\n').filter(Boolean) || [];
          const status: GitStatus = {
            branch: 'main', // Would need to parse from git branch
            modified: [],
            staged: [],
            untracked: [],
          };
          lines.forEach((line) => {
            const code = line.substring(0, 2);
            const file = line.substring(3);
            if (code.includes('M')) status.modified.push(file);
            if (code.includes('A')) status.staged.push(file);
            if (code === '??') status.untracked.push(file);
          });
          setGitStatus(status);
          break;
        }

        case 'git_diff': {
          const { path } = payload as { path?: string };
          await runCommand(path ? `git diff ${path}` : 'git diff');
          break;
        }

        case 'git_committed': {
          const { message } = payload as { message: string };
          await runCommand(`git add -A && git commit -m "${message}"`);
          break;
        }

        case 'git_pushed': {
          const { branch } = payload as { branch?: string };
          await runCommand(branch ? `git push origin ${branch}` : 'git push');
          break;
        }

        case 'branch_created': {
          const { name } = payload as { name: string };
          await runCommand(`git checkout -b ${name}`);
          break;
        }

        case 'directory_listed': {
          const { path } = payload as { path?: string };
          await sandbox.listFiles(path || '.');
          break;
        }

        case 'files_searched': {
          const { pattern, path: searchPath } = payload as { pattern: string; path?: string };
          await runCommand(`grep -r "${pattern}" ${searchPath || '.'}`);
          break;
        }

        default:
          // Other actions handled elsewhere (Convex mutations, etc.)
          console.log('Unhandled sandbox action:', type, payload);
      }
    },
    [cloneRepository, readFile, writeFile, runCommand, startDevServer, sandbox]
  );

  return {
    // Status
    isConnected: sandbox.isConnected,
    isCreating: sandbox.isCreating,
    sandboxId: sandbox.state.sandboxId,
    previewUrl: sandbox.state.previewUrl,
    error: sandbox.error,

    // Files
    files: sandbox.state.files,
    currentFile,

    // Terminal
    terminalOutput,
    isRunning,

    // Git
    gitStatus,

    // Actions
    startSandbox,
    stopSandbox,
    executeToolAction,
    cloneRepository,
    readFile,
    writeFile,
    runCommand,
    startDevServer,
    refreshFiles,

    // Logs
    logs: sandbox.logs,
    clearLogs: sandbox.clearLogs,
  };
}

export default useAgentSandbox;
