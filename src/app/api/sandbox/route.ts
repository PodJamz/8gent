/**
 * Sandbox API Routes
 *
 * Server-side only endpoints for Vercel Sandbox operations.
 * Vercel Sandbox provides secure cloud sandboxes for code execution.
 *
 * SECURITY: Owner-only endpoint. Allows code execution.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Sandbox } from '@vercel/sandbox';
import { auth, clerkClient } from '@/lib/openclaw/auth-server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';
import {
  isProtectedPath,
  isDangerousCommand,
  getProtectedFileRefusal,
  getDangerousCommandRefusal,
  createAuditEntry,
  type AuditLogEntry,
} from '@/lib/claw-ai/ethical-core';

// Project directory in sandbox - use relative path from sandbox's working directory
// Vercel Sandbox starts in a writable home directory, so ./project works
const PROJECT_DIR = './project';

// Store active sandbox instances (cache for same-instance requests)
const activeSandboxes = new Map<string, Sandbox>();

/**
 * SECURITY: Sanitize git output to remove embedded OAuth tokens from URLs
 * Git clone output may contain URLs like: https://TOKEN:x-oauth-basic@github.com/...
 */
function sanitizeGitOutput(output: string): string {
  // Remove any URLs with embedded credentials
  // Pattern: https://TOKEN:x-oauth-basic@github.com/...
  return output.replace(
    /https:\/\/[^:]+:x-oauth-basic@github\.com/g,
    'https://***:***@github.com'
  );
}

/**
 * SECURITY: Validate sandbox paths to prevent traversal attacks
 */
function isValidSandboxPath(path: string): boolean {
  // Reject path traversal attempts
  if (path.includes('..') || path.includes('~')) {
    return false;
  }
  // Only allow paths within sandbox directories
  const allowedPrefixes = ['/vercel/sandbox', '/home/user', '/workspace', '/tmp'];
  return allowedPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Get or reconnect to a sandbox instance.
 * Since serverless functions may cold start, we can't rely on the in-memory Map.
 * Use Sandbox.get() to reconnect to existing sandboxes.
 */
async function getOrReconnectSandbox(sandboxId: string): Promise<Sandbox> {
  // Check if we have it cached
  let sandbox = activeSandboxes.get(sandboxId);
  if (sandbox) {
    return sandbox;
  }

  // Reconnect using Sandbox.get()
  sandbox = await Sandbox.get({ sandboxId });
  activeSandboxes.set(sandboxId, sandbox);
  return sandbox;
}

// Lazy-initialized Convex client (avoid build-time initialization)
let convexClient: ConvexHttpClient | null = null;
function getConvexClient(): ConvexHttpClient {
  if (!convexClient) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
    }
    convexClient = new ConvexHttpClient(url);
  }
  return convexClient;
}

// Type-safe check for userManagement API (may not be in generated types yet)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getManagedUserQuery = (api as any)?.userManagement?.getManagedUserByClerkId ?? null;

/**
 * Log a security event to Convex for visibility in /security dashboard
 */
async function logSandboxSecurityEvent(
  eventType: 'sandbox_dangerous_command_blocked' | 'sandbox_protected_file_blocked' | 'sandbox_jailbreak_attempt' | 'sandbox_command_executed' | 'sandbox_file_written',
  severity: 'info' | 'warning' | 'critical' | 'alert',
  message: string,
  metadata: {
    sandboxId?: string;
    command?: string;
    filePath?: string;
    reason?: string;
    userId?: string;
  },
  request: NextRequest
) {
  try {
    const client = getConvexClient();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    await client.mutation(api.security.logSecurityEvent, {
      eventType,
      severity,
      actorType: metadata.userId ? 'user' : 'anonymous',
      actorId: metadata.userId,
      ipAddress: ip,
      userAgent,
      requestPath: '/api/sandbox',
      requestMethod: 'POST',
      message,
      metadata: JSON.stringify(metadata),
      targetResource: metadata.filePath || metadata.command || metadata.sandboxId,
    });
  } catch (error) {
    // Don't let logging failures break the request
    console.error('[SECURITY] Failed to log security event:', error);
  }
}

/**
 * Verify owner access for sandbox operations via Clerk + Convex
 */
async function verifyOwnerAccess(): Promise<{ authorized: boolean; error?: string }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { authorized: false, error: 'Authentication required' };
    }

    // Fail-secure: if userManagement API isn't configured, deny access
    if (!getManagedUserQuery) {
      console.error('[Sandbox] userManagement API not configured - denying access');
      return { authorized: false, error: 'Server configuration error' };
    }

    // Check if user is owner in Convex managedUsers
    const convex = getConvexClient();
    const managedUser = await convex.query(getManagedUserQuery, {
      clerkId: userId,
    });

    if (!managedUser || (managedUser.role !== 'owner' && managedUser.role !== 'admin')) {
      return { authorized: false, error: 'Owner access required' };
    }

    return { authorized: true };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

/**
 * POST /api/sandbox - Sandbox operations
 *
 * SECURITY: Owner-only. Requires valid Clerk session + owner role in Convex.
 */
export async function POST(request: NextRequest) {
  // SECURITY: Verify owner access before any sandbox operations
  const { authorized, error } = await verifyOwnerAccess();
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: error || 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, sandboxId, ...params } = body;

    switch (action) {
      case 'create': {
        // Validate required environment variables for Vercel Sandbox
        const teamId = process.env.SANDBOX_VERCEL_TEAM_ID;
        const projectId = process.env.SANDBOX_VERCEL_PROJECT_ID;
        const token = process.env.SANDBOX_VERCEL_TOKEN;

        if (!teamId || !projectId || !token) {
          const missing = [];
          if (!teamId) missing.push('SANDBOX_VERCEL_TEAM_ID');
          if (!projectId) missing.push('SANDBOX_VERCEL_PROJECT_ID');
          if (!token) missing.push('SANDBOX_VERCEL_TOKEN');
          return NextResponse.json(
            { success: false, error: `Missing required environment variables: ${missing.join(', ')}` },
            { status: 500 }
          );
        }

        // Validate and limit ports (Vercel Sandbox has restrictions)
        // Only allow common dev ports, max 2 ports
        const allowedPorts = [3000, 5173, 8080, 4000];
        let ports = [3000]; // Default
        if (Array.isArray(params.ports)) {
          ports = params.ports
            .filter((p: number) => allowedPorts.includes(p))
            .slice(0, 2); // Max 2 ports
          if (ports.length === 0) ports = [3000];
        }

        // Create a new Vercel Sandbox with required credentials
        const sandbox = await Sandbox.create({
          teamId,
          projectId,
          token,
          timeout: params.timeout ?? 600000,
          ports,
        });

        activeSandboxes.set(sandbox.sandboxId, sandbox);

        return NextResponse.json({
          success: true,
          sandboxId: sandbox.sandboxId,
        });
      }

      case 'connect': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }
        // Connect to existing sandbox
        const sandbox = await Sandbox.get({ sandboxId });
        activeSandboxes.set(sandboxId, sandbox);
        return NextResponse.json({ success: true, sandboxId });
      }

      case 'terminate': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }
        const sandbox = activeSandboxes.get(sandboxId);
        if (sandbox) {
          await sandbox.stop();
          activeSandboxes.delete(sandboxId);
        }
        return NextResponse.json({ success: true });
      }

      case 'runCommand': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }

        // SECURITY: Check for dangerous commands
        const fullCommand = params.args
          ? `${params.command} ${params.args.join(' ')}`
          : params.command;
        const dangerCheck = isDangerousCommand(fullCommand);
        if (dangerCheck.dangerous) {
          // Log to Convex security dashboard
          await logSandboxSecurityEvent(
            'sandbox_dangerous_command_blocked',
            'critical',
            `Dangerous command blocked: ${fullCommand}`,
            { sandboxId, command: fullCommand, reason: dangerCheck.reason },
            request
          );

          console.warn('[SECURITY] Dangerous command blocked:', fullCommand);
          return NextResponse.json({
            success: false,
            error: getDangerousCommandRefusal(dangerCheck.reason || 'Potentially harmful command'),
            blocked: true,
            audit: createAuditEntry('command_execute', {
              command: fullCommand,
              blocked: true,
              reason: dangerCheck.reason,
              sandboxId,
            }),
          }, { status: 403 });
        }

        // Reconnect to sandbox (handles serverless cold starts)
        const sandbox = await getOrReconnectSandbox(sandboxId);

        // Run command using Vercel Sandbox runCommand API
        const result = await sandbox.runCommand({
          cmd: params.command,
          args: params.args,
          cwd: params.cwd,
          sudo: params.sudo,
        });

        // Get stdout and stderr (they are async methods)
        const [stdout, stderr] = await Promise.all([
          result.stdout(),
          result.stderr(),
        ]);

        return NextResponse.json({
          success: true,
          cmdId: `cmd_${Date.now()}`,
          status: 'completed',
          exitCode: result.exitCode,
          stdout,
          stderr,
        });
      }

      case 'writeFile': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }

        // SECURITY: Check for protected file paths
        if (isProtectedPath(params.path)) {
          await logSandboxSecurityEvent(
            'sandbox_protected_file_blocked',
            'critical',
            `Protected file write blocked: ${params.path}`,
            { sandboxId, filePath: params.path, reason: 'Protected file path' },
            request
          );

          console.warn('[SECURITY] Protected file write blocked:', params.path);
          return NextResponse.json({
            success: false,
            error: getProtectedFileRefusal(params.path),
            blocked: true,
            audit: createAuditEntry('file_write', {
              filePath: params.path,
              blocked: true,
              reason: 'Protected file path',
              sandboxId,
            }),
          }, { status: 403 });
        }

        const sandbox = await getOrReconnectSandbox(sandboxId);

        // Write file using writeFiles with Buffer content
        await sandbox.writeFiles([
          {
            path: params.path,
            content: Buffer.from(params.content, 'utf-8'),
          },
        ]);

        // Log successful write to security dashboard
        await logSandboxSecurityEvent(
          'sandbox_file_written',
          'info',
          `File written: ${params.path}`,
          { sandboxId, filePath: params.path },
          request
        );
        // Log successful write for audit
        console.log('[AUDIT] File written:', params.path);

        return NextResponse.json({ success: true });
      }

      case 'writeFiles': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }

        // SECURITY: Check ALL files for protected paths
        const protectedFiles = params.files
          .filter((file: { path: string }) => isProtectedPath(file.path))
          .map((file: { path: string }) => file.path);

        if (protectedFiles.length > 0) {
          await logSandboxSecurityEvent(
            'sandbox_protected_file_blocked',
            'critical',
            `Protected files write blocked: ${protectedFiles.join(', ')}`,
            { sandboxId, filePath: protectedFiles.join(', '), reason: 'Protected file paths' },
            request
          );

          console.warn('[SECURITY] Protected files write blocked:', protectedFiles);
          return NextResponse.json({
            success: false,
            error: `Cannot modify protected files: ${protectedFiles.join(', ')}`,
            blocked: true,
            protectedFiles,
            audit: createAuditEntry('file_write', {
              filePath: protectedFiles.join(', '),
              blocked: true,
              reason: 'Protected file paths',
              sandboxId,
            }),
          }, { status: 403 });
        }

        const sandbox = await getOrReconnectSandbox(sandboxId);

        // Write each file with Buffer content
        const files = params.files.map((file: { path: string; content: string }) => ({
          path: file.path,
          content: Buffer.from(file.content, 'utf-8'),
        }));
        await sandbox.writeFiles(files);

        // Log successful writes to security dashboard
        const filePaths = params.files.map((f: { path: string }) => f.path).join(', ');
        await logSandboxSecurityEvent(
          'sandbox_file_written',
          'info',
          `Files written: ${filePaths}`,
          { sandboxId, filePath: filePaths },
          request
        );
        // Log successful writes for audit
        console.log('[AUDIT] Files written:', params.files.map((f: { path: string }) => f.path));

        return NextResponse.json({ success: true });
      }

      case 'readFile': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }

        // SECURITY: Validate path to prevent traversal
        if (!isValidSandboxPath(params.path)) {
          return NextResponse.json(
            { success: false, error: 'Invalid path' },
            { status: 400 }
          );
        }

        const sandbox = await getOrReconnectSandbox(sandboxId);

        // Read file returns a ReadableStream
        const stream = await sandbox.readFile({ path: params.path });
        if (!stream) {
          return NextResponse.json(
            { success: false, error: 'File not found' },
            { status: 404 }
          );
        }

        // Convert stream to string
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const content = Buffer.concat(chunks).toString('utf-8');

        return NextResponse.json({ success: true, content });
      }

      case 'listFiles': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }

        const path = params.path || '/vercel/sandbox';

        // SECURITY: Validate path to prevent traversal
        if (!isValidSandboxPath(path)) {
          return NextResponse.json(
            { success: false, error: 'Invalid path' },
            { status: 400 }
          );
        }

        const sandbox = await getOrReconnectSandbox(sandboxId);

        try {
          // Use ls command to list files since there's no direct list API
          const result = await sandbox.runCommand({
            cmd: 'ls',
            args: ['-la', path],
          });

          // Get stdout (it's an async method)
          const stdout = await result.stdout();

          // Parse ls output to file list
          const lines = stdout?.split('\n').filter((l) => l.trim()) || [];
          const files = lines
            .slice(1) // Skip total line
            .map((line) => {
              const parts = line.split(/\s+/);
              if (parts.length < 9) return null;
              const name = parts.slice(8).join(' ');
              const isDir = line.startsWith('d');
              return {
                path: `${path}/${name}`,
                type: isDir ? 'directory' : 'file',
              };
            })
            .filter(Boolean);

          return NextResponse.json({ success: true, files });
        } catch (error) {
          console.error('[Sandbox] Failed to list files:', params.path, error);
          return NextResponse.json({
            success: false,
            error: 'Failed to list directory',
            files: []
          });
        }
      }

      case 'getPreviewUrl': {
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }
        const sandbox = await getOrReconnectSandbox(sandboxId);

        const port = params.port || 3000;
        // Vercel Sandbox uses domain() method for preview URLs
        const url = sandbox.domain(port);
        return NextResponse.json({ success: true, url });
      }

      case 'cloneRepo': {
        console.log('[cloneRepo] Starting clone request');
        if (!sandboxId) {
          return NextResponse.json(
            { success: false, error: 'sandboxId required' },
            { status: 400 }
          );
        }
        console.log('[cloneRepo] Reconnecting to sandbox:', sandboxId);
        const sandbox = await getOrReconnectSandbox(sandboxId);

        const { repoUrl } = params;
        if (!repoUrl) {
          return NextResponse.json(
            { success: false, error: 'repoUrl required' },
            { status: 400 }
          );
        }
        console.log('[cloneRepo] Cloning:', repoUrl);

        try {
          // Get the user's GitHub token from Clerk
          console.log('[cloneRepo] Getting auth...');
          const { userId } = await auth();
          if (!userId) {
            console.log('[cloneRepo] No userId found');
            return NextResponse.json(
              { success: false, error: 'Not authenticated' },
              { status: 401 }
            );
          }
          console.log('[cloneRepo] User:', userId);

          const client = await clerkClient();
          const user = await client.users.getUser(userId);
          const githubAccount = user.externalAccounts?.find(
            (account) => account.provider === 'oauth_github'
          );
          console.log('[cloneRepo] GitHub account found:', !!githubAccount);

          let authenticatedUrl = repoUrl;

          // If we have a GitHub account, try to get a token for authenticated cloning
          if (githubAccount) {
            console.log('[cloneRepo] Getting OAuth token...');
            // Get OAuth access token for the user
            const tokens = await client.users.getUserOauthAccessToken(userId, 'oauth_github');
            const githubToken = tokens.data?.[0]?.token;
            console.log('[cloneRepo] Got token:', !!githubToken);

            if (githubToken) {
              // Convert HTTPS URL to authenticated URL
              // Handle both github.com and www.github.com
              // Format: https://TOKEN:x-oauth-basic@github.com/user/repo.git
              // GitHub requires: token as username, x-oauth-basic as password placeholder
              authenticatedUrl = repoUrl
                .replace('https://www.github.com/', `https://${githubToken}:x-oauth-basic@github.com/`)
                .replace('https://github.com/', `https://${githubToken}:x-oauth-basic@github.com/`);
              console.log('[cloneRepo] Using authenticated URL');
            }
          } else {
            console.log('[cloneRepo] No GitHub account linked - using public URL');
          }

          // First, check the current working directory
          console.log('[cloneRepo] Checking current directory...');
          const pwdResult = await sandbox.runCommand({ cmd: 'pwd', args: [] });
          const homeDir = (await pwdResult.stdout())?.trim() || '/home/user';
          console.log('[cloneRepo] Home directory:', homeDir);

          // List what directories exist
          const lsResult = await sandbox.runCommand({ cmd: 'ls', args: ['-la'] });
          // SECURITY: Sanitize directory listing output
          console.log('[cloneRepo] Directory listing:', sanitizeGitOutput((await lsResult.stdout())?.slice(0, 500) || ''));

          // Use absolute path based on discovered home directory
          const projectDir = `${homeDir}/project`;
          console.log('[cloneRepo] Will clone to:', projectDir);

          // Remove existing project directory if it exists (fresh clone)
          console.log('[cloneRepo] Cleaning up existing project directory...');
          await sandbox.runCommand({
            cmd: 'rm',
            args: ['-rf', projectDir],
          });

          // Clone the repository directly (git clone creates the directory)
          console.log('[cloneRepo] Running git clone...');
          const cloneResult = await sandbox.runCommand({
            cmd: 'git',
            args: ['clone', '--depth', '1', authenticatedUrl, projectDir],
          });

          console.log('[cloneRepo] Clone exit code:', cloneResult.exitCode);
          const stdout = await cloneResult.stdout();
          const stderr = await cloneResult.stderr();
          // SECURITY: Never log raw git output - may contain OAuth tokens in URLs
          console.log('[cloneRepo] stdout:', sanitizeGitOutput(stdout?.slice(0, 200) || ''));
          console.log('[cloneRepo] stderr:', sanitizeGitOutput(stderr?.slice(0, 200) || ''));

          if (cloneResult.exitCode !== 0) {
            console.log('[cloneRepo] Clone failed');
            return NextResponse.json({
              success: false,
              // SECURITY: Sanitize error output before sending to client
              error: sanitizeGitOutput(stderr || 'Failed to clone repository'),
              exitCode: cloneResult.exitCode,
            });
          }
          console.log('[cloneRepo] Clone succeeded!');

          // Verify the clone worked
          const verifyResult = await sandbox.runCommand({ cmd: 'ls', args: ['-la', projectDir] });
          // SECURITY: Sanitize project contents listing
          console.log('[cloneRepo] Project contents:', sanitizeGitOutput((await verifyResult.stdout())?.slice(0, 500) || ''));

          // Configure git user for commits
          await sandbox.runCommand({
            cmd: 'git',
            args: ['config', 'user.name', user.firstName || 'Claw AI'],
            cwd: projectDir,
          });
          await sandbox.runCommand({
            cmd: 'git',
            args: ['config', 'user.email', user.emailAddresses?.[0]?.emailAddress || 'agent@openclaw.io'],
            cwd: projectDir,
          });

          return NextResponse.json({
            success: true,
            message: 'Repository cloned successfully',
            projectDir,
            // SECURITY: Sanitize stdout before sending to client
            stdout: sanitizeGitOutput(stdout || ''),
          });
        } catch (cloneError) {
          console.error('Clone error:', cloneError);
          return NextResponse.json({
            success: false,
            error: cloneError instanceof Error ? cloneError.message : 'Failed to clone repository',
          });
        }
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Sandbox API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
