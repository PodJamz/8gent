/**
 * Vercel Sandbox Integration for OpenClaw-OS Prototyping
 *
 * This provides real code execution capabilities using Vercel's cloud sandbox infrastructure.
 * The sandbox runs in a secure cloud container with full Node.js environment.
 *
 * NOTE: All sandbox operations are performed via API routes since @vercel/sandbox
 * is a server-only package that cannot be bundled for the browser.
 */

// ============================================================================
// Types
// ============================================================================

// File info returned by sandbox listFiles
export interface FileInfo {
  path: string;
  type: 'file' | 'directory';
  size?: number;
}

export interface SandboxState {
  sandboxId: string | null;
  status: 'idle' | 'creating' | 'ready' | 'error' | 'terminated';
  previewUrl: string | null;
  files: FileInfo[];
  activeCommands: Map<string, CommandState>;
  error: string | null;
  createdAt: number | null;
  timeout: number;
}

export interface CommandState {
  cmdId: string;
  command: string;
  args: string[];
  status: 'running' | 'completed' | 'error';
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  startedAt: number;
}

export interface CreateSandboxOptions {
  timeout?: number; // ms, default 600000 (10 min)
  ports?: number[]; // ports to expose, e.g. [3000]
}

export interface RunCommandOptions {
  command: string;
  args?: string[];
  sudo?: boolean;
  wait?: boolean; // wait for completion
  cwd?: string;
}

export interface WriteFileOptions {
  path: string;
  content: string;
}

// ============================================================================
// Initial State
// ============================================================================

export function createInitialSandboxState(): SandboxState {
  return {
    sandboxId: null,
    status: 'idle',
    previewUrl: null,
    files: [],
    activeCommands: new Map(),
    error: null,
    createdAt: null,
    timeout: 600000,
  };
}

// ============================================================================
// API Client Helper
// ============================================================================

async function callSandboxApi(action: string, params: Record<string, unknown> = {}) {
  // Clone operations can take a while - use longer timeout
  const timeout = action === 'cloneRepo' ? 120000 : 30000; // 2 min for clone, 30s for others
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`[SandboxAPI] ${action}`, params);
    const response = await fetch('/api/sandbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    console.log(`[SandboxAPI] ${action} response:`, data);

    if (!data.success) {
      throw new Error(data.error || 'Sandbox API error');
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`${action} timed out after ${timeout / 1000}s`);
    }
    throw error;
  }
}

// ============================================================================
// Sandbox Manager Class
// ============================================================================

export class SandboxManager {
  private sandboxId: string | null = null;
  private state: SandboxState = createInitialSandboxState();
  private listeners: Set<(state: SandboxState) => void> = new Set();

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: SandboxState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current state
   */
  getState(): SandboxState {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  private setState(updates: Partial<SandboxState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Create a new sandbox
   */
  async create(options: CreateSandboxOptions = {}): Promise<string> {
    if (this.state.status === 'creating') {
      throw new Error('Sandbox creation already in progress');
    }

    this.setState({ status: 'creating', error: null });

    try {
      const result = await callSandboxApi('create', {
        timeout: options.timeout ?? 600000,
        ports: options.ports ?? [3000],
      });

      this.sandboxId = result.sandboxId;
      this.setState({
        sandboxId: result.sandboxId,
        status: 'ready',
        createdAt: Date.now(),
        timeout: options.timeout ?? 600000,
      });

      return result.sandboxId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.setState({ status: 'error', error: message });
      throw error;
    }
  }

  /**
   * Connect to existing sandbox
   */
  async connect(sandboxId: string): Promise<void> {
    this.setState({ status: 'creating', error: null });

    try {
      await callSandboxApi('connect', { sandboxId });
      this.sandboxId = sandboxId;
      this.setState({
        sandboxId,
        status: 'ready',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.setState({ status: 'error', error: message });
      throw error;
    }
  }

  /**
   * Run a command in the sandbox
   */
  async runCommand(options: RunCommandOptions): Promise<CommandState> {
    if (!this.sandboxId) {
      throw new Error('No sandbox connected');
    }

    const cmdState: CommandState = {
      cmdId: `cmd_${Date.now()}`,
      command: options.command,
      args: options.args || [],
      status: 'running',
      startedAt: Date.now(),
    };

    // Add to active commands
    const newCommands = new Map(this.state.activeCommands);
    newCommands.set(cmdState.cmdId, cmdState);
    this.setState({ activeCommands: newCommands });

    try {
      const result = await callSandboxApi('runCommand', {
        sandboxId: this.sandboxId,
        command: options.command,
        args: options.args,
        sudo: options.sudo,
        wait: options.wait ?? true,
      });

      cmdState.cmdId = result.cmdId;
      cmdState.status = result.status;
      cmdState.exitCode = result.exitCode;
      cmdState.stdout = result.stdout;
      cmdState.stderr = result.stderr;

      // Update command state
      const updatedCommands = new Map(this.state.activeCommands);
      updatedCommands.set(cmdState.cmdId, cmdState);
      this.setState({ activeCommands: updatedCommands });

      return cmdState;
    } catch (error) {
      cmdState.status = 'error';
      cmdState.stderr = error instanceof Error ? error.message : 'Unknown error';

      const updatedCommands = new Map(this.state.activeCommands);
      updatedCommands.set(cmdState.cmdId, cmdState);
      this.setState({ activeCommands: updatedCommands });

      throw error;
    }
  }

  /**
   * Write a file to the sandbox
   */
  async writeFile(options: WriteFileOptions): Promise<void> {
    if (!this.sandboxId) {
      throw new Error('No sandbox connected');
    }

    await callSandboxApi('writeFile', {
      sandboxId: this.sandboxId,
      path: options.path,
      content: options.content,
    });

    // Refresh file list
    await this.listFiles();
  }

  /**
   * Write multiple files to the sandbox
   */
  async writeFiles(files: WriteFileOptions[]): Promise<void> {
    if (!this.sandboxId) {
      throw new Error('No sandbox connected');
    }

    await callSandboxApi('writeFiles', {
      sandboxId: this.sandboxId,
      files,
    });

    // Refresh file list
    await this.listFiles();
  }

  /**
   * Read a file from the sandbox
   */
  async readFile(path: string): Promise<string> {
    if (!this.sandboxId) {
      throw new Error('No sandbox connected');
    }

    const result = await callSandboxApi('readFile', {
      sandboxId: this.sandboxId,
      path,
    });

    return result.content;
  }

  /**
   * List files in the sandbox
   */
  async listFiles(path: string = '.'): Promise<FileInfo[]> {
    if (!this.sandboxId) {
      throw new Error('No sandbox connected');
    }

    try {
      console.log('[listFiles] Listing files in:', path);
      const result = await callSandboxApi('listFiles', {
        sandboxId: this.sandboxId,
        path,
      });

      const files: FileInfo[] = result.files;
      console.log('[listFiles] Got files:', files.length, files.map(f => f.path).slice(0, 5));
      this.setState({ files });
      return files;
    } catch (error) {
      console.error('[listFiles] Error:', error);
      // Return empty array if listing fails
      const files: FileInfo[] = [];
      this.setState({ files });
      return files;
    }
  }

  /**
   * Get the preview URL for the sandbox
   */
  async getPreviewUrl(port: number = 3000): Promise<string> {
    if (!this.sandboxId) {
      throw new Error('No sandbox connected');
    }

    const result = await callSandboxApi('getPreviewUrl', {
      sandboxId: this.sandboxId,
      port,
    });

    this.setState({ previewUrl: result.url });
    return result.url;
  }

  /**
   * Clone a repository using GitHub authentication from Clerk
   * This allows cloning private repos the user has access to
   */
  async cloneRepo(repoUrl: string): Promise<{ success: boolean; projectDir?: string; error?: string }> {
    if (!this.sandboxId) {
      throw new Error('No sandbox connected');
    }

    const result = await callSandboxApi('cloneRepo', {
      sandboxId: this.sandboxId,
      repoUrl,
    });

    // Refresh file list to show cloned repo
    await this.listFiles('/workspace/project');

    return {
      success: result.success,
      projectDir: result.projectDir,
      error: result.error,
    };
  }

  /**
   * Terminate the sandbox
   */
  async terminate(): Promise<void> {
    if (this.sandboxId) {
      await callSandboxApi('terminate', { sandboxId: this.sandboxId });
      this.sandboxId = null;
    }

    this.setState({
      sandboxId: null,
      status: 'terminated',
      previewUrl: null,
      files: [],
      activeCommands: new Map(),
    });
  }

  /**
   * Check if sandbox is connected
   */
  isConnected(): boolean {
    return this.sandboxId !== null && this.state.status === 'ready';
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let sandboxManager: SandboxManager | null = null;

export function getSandboxManager(): SandboxManager {
  if (!sandboxManager) {
    sandboxManager = new SandboxManager();
  }
  return sandboxManager;
}

// ============================================================================
// Exports
// ============================================================================

// Export tools
export { createSandboxTools, type SandboxTools } from './tools';
