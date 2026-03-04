/**
 * Ollama Client - Phase 3 Local LLM Integration
 *
 * Client library for interacting with local Ollama server.
 * Supports chat, generate, model listing, and health checks.
 */

// ============================================================================
// Types
// ============================================================================

export interface OllamaConfig {
  baseUrl: string;
  timeout?: number; // ms
  defaultModel?: string;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  system?: string;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaHealthStatus {
  connected: boolean;
  version?: string;
  models: OllamaModel[];
  error?: string;
  latencyMs?: number;
}

// ============================================================================
// Client Class
// ============================================================================

export class OllamaClient {
  private baseUrl: string;
  private timeout: number;
  private defaultModel: string;

  constructor(config: OllamaConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout ?? 30000;
    this.defaultModel = config.defaultModel ?? 'gpt-oss:20b';
  }

  /**
   * Check if Ollama server is reachable and get available models
   */
  async health(): Promise<OllamaHealthStatus> {
    const start = Date.now();

    try {
      // Try to list models (this also verifies server is running)
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });

      if (!response.ok) {
        return {
          connected: false,
          models: [],
          error: `Server returned ${response.status}`,
          latencyMs: Date.now() - start,
        };
      }

      const data = await response.json();
      const models: OllamaModel[] = data.models || [];

      // Also try to get version
      let version: string | undefined;
      try {
        const versionResponse = await this.fetchWithTimeout(`${this.baseUrl}/api/version`, {
          method: 'GET',
        });
        if (versionResponse.ok) {
          const versionData = await versionResponse.json();
          version = versionData.version;
        }
      } catch (error) {
        // Version endpoint might not exist in older versions - log at debug level
        console.debug('[Ollama] Version endpoint not available:', error);
      }

      return {
        connected: true,
        version,
        models,
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        connected: false,
        models: [],
        error: error instanceof Error ? error.message : 'Connection failed',
        latencyMs: Date.now() - start,
      };
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<OllamaModel[]> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status}`);
    }

    const data = await response.json();
    return data.models || [];
  }

  /**
   * Chat with a model (non-streaming)
   */
  async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...request,
        model: request.model || this.defaultModel,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chat failed: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Chat with a model (streaming)
   * Returns an async generator that yields partial responses
   */
  async *chatStream(request: OllamaChatRequest): AsyncGenerator<OllamaChatResponse> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...request,
        model: request.model || this.defaultModel,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chat stream failed: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line) as OllamaChatResponse;
              yield data;
            } catch (error) {
              // Log malformed JSON for debugging but continue processing
              console.error('[Ollama] Malformed JSON in chat stream:', line.substring(0, 100), error);
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer) as OllamaChatResponse;
          yield data;
        } catch (error) {
          // Log malformed JSON for debugging
          console.error('[Ollama] Malformed JSON in chat buffer:', buffer.substring(0, 100), error);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Generate text (non-streaming)
   */
  async generate(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...request,
        model: request.model || this.defaultModel,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Generate failed: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Generate text (streaming)
   */
  async *generateStream(request: OllamaGenerateRequest): AsyncGenerator<OllamaGenerateResponse> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...request,
        model: request.model || this.defaultModel,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Generate stream failed: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line) as OllamaGenerateResponse;
              yield data;
            } catch (error) {
              // Log malformed JSON for debugging but continue processing
              console.error('[Ollama] Malformed JSON in generate stream:', line.substring(0, 100), error);
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer) as OllamaGenerateResponse;
          yield data;
        } catch (error) {
          // Log malformed JSON for debugging
          console.error('[Ollama] Malformed JSON in generate buffer:', buffer.substring(0, 100), error);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Pull a model from Ollama registry
   */
  async pullModel(modelName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to pull model: ${response.status} - ${error}`);
    }

    // Wait for the model to be pulled (this can take a while)
    const reader = response.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }
      reader.releaseLock();
    }
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let defaultClient: OllamaClient | null = null;

/**
 * Get the default Ollama client
 * Uses OLLAMA_BASE_URL env var or defaults to localhost:11434
 */
export function getOllamaClient(config?: Partial<OllamaConfig>): OllamaClient {
  if (!defaultClient || config) {
    defaultClient = new OllamaClient({
      baseUrl: config?.baseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
      timeout: config?.timeout ?? 30000,
      defaultModel: config?.defaultModel ?? process.env.OLLAMA_DEFAULT_MODEL ?? 'gpt-oss:20b',
    });
  }
  return defaultClient;
}

/**
 * Quick health check for Ollama
 */
export async function checkOllamaHealth(baseUrl?: string): Promise<OllamaHealthStatus> {
  const client = new OllamaClient({
    baseUrl: baseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
    timeout: 5000, // Quick health check
  });
  return client.health();
}
