/**
 * Lynkr Client - Universal LLM Proxy Integration
 *
 * Lynkr is a self-hosted proxy that routes AI requests to:
 * - Local models (Ollama, llama.cpp, LM Studio)
 * - Cloud providers (OpenRouter, Anthropic, OpenAI, AWS Bedrock, etc.)
 *
 * This client connects to a Lynkr instance (local or via tunnel) and
 * sends requests in Anthropic format, which Lynkr converts as needed.
 *
 * SECURITY:
 * - API key required (min 32 chars for production)
 * - SSRF protection blocks internal IPs
 * - Audit logging for all requests
 */

// ============================================================================
// Security Constants
// ============================================================================

/** Minimum API key length for production use */
const MIN_API_KEY_LENGTH = 32;

/** Internal IP patterns that should be blocked (SSRF protection) */
const BLOCKED_IP_PATTERNS = [
  /^127\./,                           // Loopback
  /^10\./,                            // Private Class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,   // Private Class B
  /^192\.168\./,                      // Private Class C
  /^169\.254\./,                      // Link-local
  /^0\./,                             // "This" network
  /^100\.(6[4-9]|[7-9][0-9]|1[0-2][0-7])\./,  // Carrier-grade NAT
  /^::1$/,                            // IPv6 loopback
  /^fc00:/i,                          // IPv6 unique local
  /^fe80:/i,                          // IPv6 link-local
  /^localhost$/i,                     // Hostname
  /^.*\.local$/i,                     // mDNS
  /metadata\.google\.internal/i,      // GCP metadata
  /169\.254\.169\.254/,               // AWS/GCP/Azure metadata
];

/** Allowed URL schemes */
const ALLOWED_SCHEMES = ['https:', 'http:'];

export interface LynkrConfig {
  /** Lynkr endpoint URL (e.g., http://localhost:8081 or https://tunnel.example.com) */
  baseUrl: string;
  /** API key - required for production (min 32 chars) */
  apiKey?: string;
  /** Request timeout in ms */
  timeout?: number;
  /** Default model to use (pinned to gpt-oss:20b) */
  defaultModel?: string;
  /** Skip API key validation (for local dev only) */
  skipApiKeyValidation?: boolean;
  /** Skip SSRF validation (for local dev only) */
  skipSsrfValidation?: boolean;
}

export interface LynkrMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LynkrTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface LynkrChatRequest {
  model: string;
  messages: LynkrMessage[];
  max_tokens?: number;
  temperature?: number;
  tools?: LynkrTool[];
  system?: string;
  stream?: boolean;
}

export interface LynkrToolUse {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface LynkrTextContent {
  type: 'text';
  text: string;
}

export type LynkrContentBlock = LynkrTextContent | LynkrToolUse;

export interface LynkrChatResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  model: string;
  content: LynkrContentBlock[];
  stop_reason: 'end_turn' | 'tool_use' | 'max_tokens' | 'stop_sequence';
  stop_sequence?: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
}

export interface LynkrHealthStatus {
  connected: boolean;
  latencyMs?: number;
  error?: string;
  provider?: string;
  model?: string;
  version?: string;
  features?: {
    memory?: boolean;
    tools?: boolean;
    streaming?: boolean;
    embeddings?: boolean;
  };
}

export interface LynkrMetrics {
  requestCount: number;
  totalTokens: number;
  avgLatency: number;
  routingDecisions: {
    local: number;
    cloud: number;
  };
}

// ============================================================================
// Security Validation
// ============================================================================

export interface LynkrSecurityError extends Error {
  code: 'INVALID_API_KEY' | 'SSRF_BLOCKED' | 'INVALID_URL';
}

/**
 * Validate API key meets minimum security requirements
 */
export function validateApiKey(apiKey: string | undefined, skipValidation?: boolean): void {
  if (skipValidation) return;

  if (!apiKey || apiKey.length < MIN_API_KEY_LENGTH) {
    const error = new Error(
      `Lynkr API key must be at least ${MIN_API_KEY_LENGTH} characters. ` +
      `Generate with: openssl rand -base64 48`
    ) as LynkrSecurityError;
    error.code = 'INVALID_API_KEY';
    throw error;
  }

  // Block obviously insecure default keys
  const insecureKeys = ['lynkr-local', 'dummy', 'test', 'local', 'dev'];
  if (insecureKeys.includes(apiKey.toLowerCase())) {
    const error = new Error(
      'Lynkr API key cannot be a default/test value. Generate a secure key.'
    ) as LynkrSecurityError;
    error.code = 'INVALID_API_KEY';
    throw error;
  }
}

/**
 * Validate URL is not targeting internal networks (SSRF protection)
 */
export function validateUrlSafety(urlString: string, skipValidation?: boolean): void {
  if (skipValidation) return;

  try {
    const url = new URL(urlString);

    // Check scheme
    if (!ALLOWED_SCHEMES.includes(url.protocol)) {
      const error = new Error(
        `URL scheme ${url.protocol} not allowed. Use http: or https:`
      ) as LynkrSecurityError;
      error.code = 'INVALID_URL';
      throw error;
    }

    // Check hostname against blocked patterns
    const hostname = url.hostname;
    for (const pattern of BLOCKED_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        const error = new Error(
          `SSRF protection: ${hostname} is not allowed. Internal IPs are blocked.`
        ) as LynkrSecurityError;
        error.code = 'SSRF_BLOCKED';
        throw error;
      }
    }
  } catch (e) {
    if ((e as LynkrSecurityError).code) throw e;

    const error = new Error(`Invalid URL: ${urlString}`) as LynkrSecurityError;
    error.code = 'INVALID_URL';
    throw error;
  }
}

/**
 * Check if running in local development mode
 */
function isLocalDev(): boolean {
  if (typeof window !== 'undefined') return false;
  return process.env.NODE_ENV === 'development' ||
         process.env.LYNKR_SKIP_SECURITY === 'true';
}

// ============================================================================
// Audit Logging
// ============================================================================

export interface LynkrAuditLog {
  timestamp: number;
  action: 'chat' | 'stream' | 'health' | 'metrics';
  model?: string;
  baseUrl: string;
  latencyMs?: number;
  success: boolean;
  error?: string;
  inputTokens?: number;
  outputTokens?: number;
}

/** Audit log callback - set this to capture all Lynkr requests */
export let auditLogCallback: ((log: LynkrAuditLog) => void) | null = null;

/**
 * Set the audit log callback for security monitoring
 */
export function setAuditLogCallback(callback: ((log: LynkrAuditLog) => void) | null): void {
  auditLogCallback = callback;
}

function logAudit(log: LynkrAuditLog): void {
  if (auditLogCallback) {
    try {
      auditLogCallback(log);
    } catch (error) {
      // Log audit failures to console as fallback - don't lose security events silently
      console.error('[Lynkr AUDIT FAILURE] Failed to log audit event:', error);
      console.error('[Lynkr AUDIT FAILURE] Event data:', JSON.stringify(log));
    }
  }

  // Also log to console in development
  if (isLocalDev()) {
    console.log('[Lynkr Audit]', JSON.stringify(log));
  }
}

// ============================================================================
// Lynkr Client
// ============================================================================

/**
 * Lynkr Client
 *
 * Connects to a Lynkr proxy instance and sends AI requests.
 * Lynkr handles routing to the appropriate provider (local or cloud).
 *
 * SECURITY FEATURES:
 * - API key validation (min 32 chars)
 * - SSRF protection (blocks internal IPs)
 * - Audit logging for all requests
 */
export class LynkrClient {
  private config: Required<Omit<LynkrConfig, 'skipApiKeyValidation' | 'skipSsrfValidation'>> & {
    skipApiKeyValidation: boolean;
    skipSsrfValidation: boolean;
  };

  constructor(config: LynkrConfig) {
    const skipSecurity = isLocalDev();
    const skipApiKeyValidation = config.skipApiKeyValidation ?? skipSecurity;
    const skipSsrfValidation = config.skipSsrfValidation ?? skipSecurity;

    // Validate security requirements
    if (!skipApiKeyValidation) {
      validateApiKey(config.apiKey, false);
    }

    if (!skipSsrfValidation) {
      validateUrlSafety(config.baseUrl, false);
    }

    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      apiKey: config.apiKey ?? '',
      timeout: config.timeout ?? 120000, // 2 minutes default
      defaultModel: config.defaultModel ?? 'gpt-oss:20b', // Pinned to local model
      skipApiKeyValidation,
      skipSsrfValidation,
    };
  }

  /**
   * Check if Lynkr is healthy and reachable
   */
  async checkHealth(): Promise<LynkrHealthStatus> {
    const start = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          connected: false,
          latencyMs: Date.now() - start,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        connected: true,
        latencyMs: Date.now() - start,
        provider: data.provider,
        model: data.model,
        version: data.version,
        features: {
          memory: data.memory?.enabled ?? false,
          tools: data.tools?.enabled ?? true,
          streaming: data.streaming?.enabled ?? true,
          embeddings: data.embeddings?.enabled ?? false,
        },
      };
    } catch (error) {
      return {
        connected: false,
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Get Lynkr metrics
   */
  async getMetrics(): Promise<LynkrMetrics | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/metrics`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) return null;

      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Send a chat request through Lynkr
   * Uses Anthropic message format (Lynkr converts as needed)
   */
  async chat(request: Omit<LynkrChatRequest, 'model'> & { model?: string }): Promise<LynkrChatResponse> {
    const start = Date.now();
    const model = request.model ?? this.config.defaultModel;

    const body: LynkrChatRequest = {
      model,
      messages: request.messages,
      max_tokens: request.max_tokens ?? 4096,
      temperature: request.temperature ?? 0.7,
      tools: request.tools,
      system: request.system,
      stream: false,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`Lynkr request failed: ${response.status} - ${errorText}`);

        logAudit({
          timestamp: Date.now(),
          action: 'chat',
          model,
          baseUrl: this.config.baseUrl,
          latencyMs: Date.now() - start,
          success: false,
          error: error.message,
        });

        throw error;
      }

      const result: LynkrChatResponse = await response.json();

      logAudit({
        timestamp: Date.now(),
        action: 'chat',
        model,
        baseUrl: this.config.baseUrl,
        latencyMs: Date.now() - start,
        success: true,
        inputTokens: result.usage?.input_tokens,
        outputTokens: result.usage?.output_tokens,
      });

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      // Log if not already logged
      if (!(error instanceof Error && error.message.includes('Lynkr request failed'))) {
        logAudit({
          timestamp: Date.now(),
          action: 'chat',
          model,
          baseUrl: this.config.baseUrl,
          latencyMs: Date.now() - start,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      throw error;
    }
  }

  /**
   * Send a streaming chat request through Lynkr
   * Returns an async generator of content deltas
   */
  async *chatStream(
    request: Omit<LynkrChatRequest, 'model' | 'stream'> & { model?: string }
  ): AsyncGenerator<{
    type: 'content_block_delta' | 'message_start' | 'message_stop' | 'content_block_start' | 'content_block_stop';
    delta?: { type: 'text_delta'; text: string } | { type: 'tool_use'; id: string; name: string; input: string };
    index?: number;
    content_block?: LynkrContentBlock;
    message?: Partial<LynkrChatResponse>;
  }> {
    const body: LynkrChatRequest = {
      model: request.model ?? this.config.defaultModel,
      messages: request.messages,
      max_tokens: request.max_tokens ?? 4096,
      temperature: request.temperature ?? 0.7,
      tools: request.tools,
      system: request.system,
      stream: true,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lynkr stream failed: ${response.status} - ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response body for streaming');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') return;

            try {
              const event = JSON.parse(data);
              yield event;
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Extract text content from a Lynkr response
   */
  static extractText(response: LynkrChatResponse): string {
    return response.content
      .filter((block): block is LynkrTextContent => block.type === 'text')
      .map((block) => block.text)
      .join('');
  }

  /**
   * Extract tool calls from a Lynkr response
   */
  static extractToolCalls(response: LynkrChatResponse): LynkrToolUse[] {
    return response.content.filter((block): block is LynkrToolUse => block.type === 'tool_use');
  }

  /**
   * Check if response contains tool calls
   */
  static hasToolCalls(response: LynkrChatResponse): boolean {
    return response.stop_reason === 'tool_use' || response.content.some((block) => block.type === 'tool_use');
  }
}

/**
 * Get a configured Lynkr client
 *
 * SECURITY: In production, requires:
 * - LYNKR_API_KEY env var with min 32 chars
 * - Non-internal baseUrl (SSRF protection)
 *
 * In development (NODE_ENV=development), security checks are relaxed.
 */
export function getLynkrClient(config?: Partial<LynkrConfig>): LynkrClient {
  // Environment variables are only available on the server
  const env = typeof window === 'undefined' ? {
    baseUrl: process.env.LYNKR_BASE_URL,
    apiKey: process.env.LYNKR_API_KEY,
    timeout: process.env.LYNKR_TIMEOUT,
    defaultModel: process.env.LYNKR_DEFAULT_MODEL,
    skipSecurity: process.env.LYNKR_SKIP_SECURITY === 'true' ||
                  process.env.NODE_ENV === 'development',
  } : { skipSecurity: false };

  const skipSecurity = config?.skipApiKeyValidation ?? config?.skipSsrfValidation ?? env.skipSecurity;

  return new LynkrClient({
    baseUrl: config?.baseUrl ?? env.baseUrl ?? 'http://localhost:8081',
    apiKey: config?.apiKey ?? env.apiKey,
    timeout: config?.timeout ?? parseInt(env.timeout ?? '120000', 10),
    defaultModel: config?.defaultModel ?? env.defaultModel ?? 'gpt-oss:20b', // Pinned to local model
    skipApiKeyValidation: skipSecurity,
    skipSsrfValidation: skipSecurity,
  });
}

/**
 * Check Lynkr health with a simple function
 *
 * Health checks skip security validation because:
 * 1. They don't require authentication (just checking connectivity)
 * 2. They may use tunnel URLs that would fail SSRF checks
 */
export async function checkLynkrHealth(baseUrl?: string): Promise<LynkrHealthStatus> {
  // Health checks skip security validation - no auth needed for connectivity test
  const client = getLynkrClient({
    baseUrl,
    skipApiKeyValidation: true,
    skipSsrfValidation: true,
  });
  return client.checkHealth();
}
