/**
 * AI SDK Tools for Vercel Sandbox
 *
 * These tools enable AI models to interact with the sandbox
 * for code execution, file operations, and preview management.
 *
 * NOTE: These tools should only be used in server-side contexts
 * (e.g., API routes, server components) where the AI SDK is available.
 */

import { tool } from 'ai';
import { z } from 'zod';
import type { SandboxManager } from './index';

/**
 * Create sandbox tools bound to a specific manager instance
 */
export function createSandboxTools(manager: SandboxManager) {
  return {
    /**
     * Create a new sandbox environment
     */
    createSandbox: tool({
      description:
        'Create a new sandbox environment for code execution. Call this first before running any commands or writing files.',
      inputSchema: z.object({
        timeout: z
          .number()
          .optional()
          .describe('Timeout in milliseconds (default: 600000)'),
        ports: z
          .array(z.number())
          .optional()
          .describe('Ports to expose (default: [3000])'),
      }),
      execute: async ({ timeout, ports }) => {
        try {
          const sandboxId = await manager.create({ timeout, ports });
          return {
            success: true,
            sandboxId,
            message: `Sandbox created with ID: ${sandboxId}`,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create sandbox',
          };
        }
      },
    }),

    /**
     * Run a command in the sandbox
     */
    runCommand: tool({
      description:
        'Run a shell command in the sandbox. Use this for npm install, build commands, running scripts, etc.',
      inputSchema: z.object({
        command: z.string().describe('The command to run (e.g., "npm", "node", "ls")'),
        args: z
          .array(z.string())
          .optional()
          .describe('Arguments for the command'),
        wait: z
          .boolean()
          .optional()
          .describe('Wait for the command to complete (default: true)'),
      }),
      execute: async ({ command, args, wait = true }) => {
        try {
          const result = await manager.runCommand({ command, args, wait });
          return {
            success: true,
            status: result.status,
            exitCode: result.exitCode,
            stdout: result.stdout,
            stderr: result.stderr,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to run command',
          };
        }
      },
    }),

    /**
     * Write a file to the sandbox
     */
    writeFile: tool({
      description:
        'Write content to a file in the sandbox. Creates the file if it does not exist.',
      inputSchema: z.object({
        path: z.string().describe('The file path (e.g., "src/app/page.tsx")'),
        content: z.string().describe('The content to write to the file'),
      }),
      execute: async ({ path, content }) => {
        try {
          await manager.writeFile({ path, content });
          return {
            success: true,
            message: `File written: ${path}`,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to write file',
          };
        }
      },
    }),

    /**
     * Write multiple files to the sandbox
     */
    writeFiles: tool({
      description:
        'Write multiple files to the sandbox at once. More efficient than writing files one by one.',
      inputSchema: z.object({
        files: z
          .array(
            z.object({
              path: z.string().describe('The file path'),
              content: z.string().describe('The file content'),
            })
          )
          .describe('Array of files to write'),
      }),
      execute: async ({ files }) => {
        try {
          await manager.writeFiles(files);
          return {
            success: true,
            message: `${files.length} files written successfully`,
            paths: files.map((f) => f.path),
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to write files',
          };
        }
      },
    }),

    /**
     * Read a file from the sandbox
     */
    readFile: tool({
      description: 'Read the contents of a file from the sandbox.',
      inputSchema: z.object({
        path: z.string().describe('The file path to read'),
      }),
      execute: async ({ path }) => {
        try {
          const content = await manager.readFile(path);
          return {
            success: true,
            path,
            content,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to read file',
          };
        }
      },
    }),

    /**
     * List files in a directory
     */
    listFiles: tool({
      description: 'List files and directories in the sandbox.',
      inputSchema: z.object({
        path: z
          .string()
          .optional()
          .describe('Directory path to list (default: /vercel/sandbox)'),
      }),
      execute: async ({ path }) => {
        try {
          await manager.listFiles(path);
          const state = manager.getState();
          return {
            success: true,
            path: path || '/vercel/sandbox',
            files: state.files,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list files',
          };
        }
      },
    }),

    /**
     * Get the preview URL for the sandbox
     */
    getPreviewUrl: tool({
      description:
        'Get the preview URL for viewing the running application in the sandbox.',
      inputSchema: z.object({
        port: z
          .number()
          .optional()
          .describe('The port to get the preview URL for (default: 3000)'),
      }),
      execute: async ({ port }) => {
        try {
          const url = await manager.getPreviewUrl(port);
          return {
            success: true,
            url,
            port: port || 3000,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get preview URL',
          };
        }
      },
    }),

    /**
     * Terminate the sandbox
     */
    terminateSandbox: tool({
      description: 'Terminate the sandbox and clean up resources.',
      inputSchema: z.object({}),
      execute: async () => {
        try {
          await manager.terminate();
          return {
            success: true,
            message: 'Sandbox terminated',
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to terminate sandbox',
          };
        }
      },
    }),
  };
}

/**
 * Type for all sandbox tools
 */
export type SandboxTools = ReturnType<typeof createSandboxTools>;
