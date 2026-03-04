module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/ollama/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Ollama Client - Phase 3 Local LLM Integration
 *
 * Client library for interacting with local Ollama server.
 * Supports chat, generate, model listing, and health checks.
 */ // ============================================================================
// Types
// ============================================================================
__turbopack_context__.s([
    "OllamaClient",
    ()=>OllamaClient,
    "checkOllamaHealth",
    ()=>checkOllamaHealth,
    "getOllamaClient",
    ()=>getOllamaClient
]);
class OllamaClient {
    baseUrl;
    timeout;
    defaultModel;
    constructor(config){
        this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.timeout = config.timeout ?? 30000;
        this.defaultModel = config.defaultModel ?? 'gpt-oss:20b';
    }
    /**
   * Check if Ollama server is reachable and get available models
   */ async health() {
        const start = Date.now();
        try {
            // Try to list models (this also verifies server is running)
            const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`, {
                method: 'GET'
            });
            if (!response.ok) {
                return {
                    connected: false,
                    models: [],
                    error: `Server returned ${response.status}`,
                    latencyMs: Date.now() - start
                };
            }
            const data = await response.json();
            const models = data.models || [];
            // Also try to get version
            let version;
            try {
                const versionResponse = await this.fetchWithTimeout(`${this.baseUrl}/api/version`, {
                    method: 'GET'
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
                latencyMs: Date.now() - start
            };
        } catch (error) {
            return {
                connected: false,
                models: [],
                error: error instanceof Error ? error.message : 'Connection failed',
                latencyMs: Date.now() - start
            };
        }
    }
    /**
   * List available models
   */ async listModels() {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Failed to list models: ${response.status}`);
        }
        const data = await response.json();
        return data.models || [];
    }
    /**
   * Chat with a model (non-streaming)
   */ async chat(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: false
            })
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
   */ async *chatStream(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: true
            })
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
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines){
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
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
                    const data = JSON.parse(buffer);
                    yield data;
                } catch (error) {
                    // Log malformed JSON for debugging
                    console.error('[Ollama] Malformed JSON in chat buffer:', buffer.substring(0, 100), error);
                }
            }
        } finally{
            reader.releaseLock();
        }
    }
    /**
   * Generate text (non-streaming)
   */ async generate(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: false
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Generate failed: ${response.status} - ${error}`);
        }
        return response.json();
    }
    /**
   * Generate text (streaming)
   */ async *generateStream(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: true
            })
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
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines){
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
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
                    const data = JSON.parse(buffer);
                    yield data;
                } catch (error) {
                    // Log malformed JSON for debugging
                    console.error('[Ollama] Malformed JSON in generate buffer:', buffer.substring(0, 100), error);
                }
            }
        } finally{
            reader.releaseLock();
        }
    }
    /**
   * Pull a model from Ollama registry
   */ async pullModel(modelName) {
        const response = await fetch(`${this.baseUrl}/api/pull`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: modelName
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to pull model: ${response.status} - ${error}`);
        }
        // Wait for the model to be pulled (this can take a while)
        const reader = response.body?.getReader();
        if (reader) {
            const decoder = new TextDecoder();
            while(true){
                const { done } = await reader.read();
                if (done) break;
            }
            reader.releaseLock();
        }
    }
    /**
   * Fetch with timeout
   */ async fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            return response;
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error(`Request timed out after ${this.timeout}ms`);
            }
            throw error;
        } finally{
            clearTimeout(timeoutId);
        }
    }
}
// ============================================================================
// Singleton Instance
// ============================================================================
let defaultClient = null;
function getOllamaClient(config) {
    if (!defaultClient || config) {
        defaultClient = new OllamaClient({
            baseUrl: config?.baseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
            timeout: config?.timeout ?? 30000,
            defaultModel: config?.defaultModel ?? process.env.OLLAMA_DEFAULT_MODEL ?? 'gpt-oss:20b'
        });
    }
    return defaultClient;
}
async function checkOllamaHealth(baseUrl) {
    const client = new OllamaClient({
        baseUrl: baseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
        timeout: 5000
    });
    return client.health();
}
}),
"[project]/src/lib/ollama/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Ollama Module - Local LLM Integration
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ollama/client.ts [app-route] (ecmascript)");
;
}),
"[project]/src/lib/lynkr/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LynkrClient",
    ()=>LynkrClient,
    "auditLogCallback",
    ()=>auditLogCallback,
    "checkLynkrHealth",
    ()=>checkLynkrHealth,
    "getLynkrClient",
    ()=>getLynkrClient,
    "setAuditLogCallback",
    ()=>setAuditLogCallback,
    "validateApiKey",
    ()=>validateApiKey,
    "validateUrlSafety",
    ()=>validateUrlSafety
]);
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
 */ // ============================================================================
// Security Constants
// ============================================================================
/** Minimum API key length for production use */ const MIN_API_KEY_LENGTH = 32;
/** Internal IP patterns that should be blocked (SSRF protection) */ const BLOCKED_IP_PATTERNS = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./,
    /^0\./,
    /^100\.(6[4-9]|[7-9][0-9]|1[0-2][0-7])\./,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
    /^localhost$/i,
    /^.*\.local$/i,
    /metadata\.google\.internal/i,
    /169\.254\.169\.254/
];
/** Allowed URL schemes */ const ALLOWED_SCHEMES = [
    'https:',
    'http:'
];
function validateApiKey(apiKey, skipValidation) {
    if (skipValidation) return;
    if (!apiKey || apiKey.length < MIN_API_KEY_LENGTH) {
        const error = new Error(`Lynkr API key must be at least ${MIN_API_KEY_LENGTH} characters. ` + `Generate with: openssl rand -base64 48`);
        error.code = 'INVALID_API_KEY';
        throw error;
    }
    // Block obviously insecure default keys
    const insecureKeys = [
        'lynkr-local',
        'dummy',
        'test',
        'local',
        'dev'
    ];
    if (insecureKeys.includes(apiKey.toLowerCase())) {
        const error = new Error('Lynkr API key cannot be a default/test value. Generate a secure key.');
        error.code = 'INVALID_API_KEY';
        throw error;
    }
}
function validateUrlSafety(urlString, skipValidation) {
    if (skipValidation) return;
    try {
        const url = new URL(urlString);
        // Check scheme
        if (!ALLOWED_SCHEMES.includes(url.protocol)) {
            const error = new Error(`URL scheme ${url.protocol} not allowed. Use http: or https:`);
            error.code = 'INVALID_URL';
            throw error;
        }
        // Check hostname against blocked patterns
        const hostname = url.hostname;
        for (const pattern of BLOCKED_IP_PATTERNS){
            if (pattern.test(hostname)) {
                const error = new Error(`SSRF protection: ${hostname} is not allowed. Internal IPs are blocked.`);
                error.code = 'SSRF_BLOCKED';
                throw error;
            }
        }
    } catch (e) {
        if (e.code) throw e;
        const error = new Error(`Invalid URL: ${urlString}`);
        error.code = 'INVALID_URL';
        throw error;
    }
}
/**
 * Check if running in local development mode
 */ function isLocalDev() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return ("TURBOPACK compile-time value", "development") === 'development' || process.env.LYNKR_SKIP_SECURITY === 'true';
}
let auditLogCallback = null;
function setAuditLogCallback(callback) {
    auditLogCallback = callback;
}
function logAudit(log) {
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
class LynkrClient {
    config;
    constructor(config){
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
            baseUrl: config.baseUrl.replace(/\/$/, ''),
            apiKey: config.apiKey ?? '',
            timeout: config.timeout ?? 120000,
            defaultModel: config.defaultModel ?? 'gpt-oss:20b',
            skipApiKeyValidation,
            skipSsrfValidation
        };
    }
    /**
   * Check if Lynkr is healthy and reachable
   */ async checkHealth() {
        const start = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), 5000);
            const response = await fetch(`${this.config.baseUrl}/health`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                return {
                    connected: false,
                    latencyMs: Date.now() - start,
                    error: `HTTP ${response.status}: ${response.statusText}`
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
                    embeddings: data.embeddings?.enabled ?? false
                }
            };
        } catch (error) {
            return {
                connected: false,
                latencyMs: Date.now() - start,
                error: error instanceof Error ? error.message : 'Connection failed'
            };
        }
    }
    /**
   * Get Lynkr metrics
   */ async getMetrics() {
        try {
            const response = await fetch(`${this.config.baseUrl}/metrics`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) return null;
            return await response.json();
        } catch  {
            return null;
        }
    }
    /**
   * Send a chat request through Lynkr
   * Uses Anthropic message format (Lynkr converts as needed)
   */ async chat(request) {
        const start = Date.now();
        const model = request.model ?? this.config.defaultModel;
        const body = {
            model,
            messages: request.messages,
            max_tokens: request.max_tokens ?? 4096,
            temperature: request.temperature ?? 0.7,
            tools: request.tools,
            system: request.system,
            stream: false
        };
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.config.timeout);
        try {
            const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(body),
                signal: controller.signal
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
                    error: error.message
                });
                throw error;
            }
            const result = await response.json();
            logAudit({
                timestamp: Date.now(),
                action: 'chat',
                model,
                baseUrl: this.config.baseUrl,
                latencyMs: Date.now() - start,
                success: true,
                inputTokens: result.usage?.input_tokens,
                outputTokens: result.usage?.output_tokens
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
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            throw error;
        }
    }
    /**
   * Send a streaming chat request through Lynkr
   * Returns an async generator of content deltas
   */ async *chatStream(request) {
        const body = {
            model: request.model ?? this.config.defaultModel,
            messages: request.messages,
            max_tokens: request.max_tokens ?? 4096,
            temperature: request.temperature ?? 0.7,
            tools: request.tools,
            system: request.system,
            stream: true
        };
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.config.timeout);
        try {
            const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(body),
                signal: controller.signal
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
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';
                for (const line of lines){
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') return;
                        try {
                            const event = JSON.parse(data);
                            yield event;
                        } catch  {
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
   */ static extractText(response) {
        return response.content.filter((block)=>block.type === 'text').map((block)=>block.text).join('');
    }
    /**
   * Extract tool calls from a Lynkr response
   */ static extractToolCalls(response) {
        return response.content.filter((block)=>block.type === 'tool_use');
    }
    /**
   * Check if response contains tool calls
   */ static hasToolCalls(response) {
        return response.stop_reason === 'tool_use' || response.content.some((block)=>block.type === 'tool_use');
    }
}
function getLynkrClient(config) {
    // Environment variables are only available on the server
    const env = ("TURBOPACK compile-time truthy", 1) ? {
        baseUrl: process.env.LYNKR_BASE_URL,
        apiKey: process.env.LYNKR_API_KEY,
        timeout: process.env.LYNKR_TIMEOUT,
        defaultModel: process.env.LYNKR_DEFAULT_MODEL,
        skipSecurity: process.env.LYNKR_SKIP_SECURITY === 'true' || ("TURBOPACK compile-time value", "development") === 'development'
    } : "TURBOPACK unreachable";
    const skipSecurity = config?.skipApiKeyValidation ?? config?.skipSsrfValidation ?? env.skipSecurity;
    return new LynkrClient({
        baseUrl: config?.baseUrl ?? env.baseUrl ?? 'http://localhost:8081',
        apiKey: config?.apiKey ?? env.apiKey,
        timeout: config?.timeout ?? parseInt(env.timeout ?? '120000', 10),
        defaultModel: config?.defaultModel ?? env.defaultModel ?? 'gpt-oss:20b',
        skipApiKeyValidation: skipSecurity,
        skipSsrfValidation: skipSecurity
    });
}
async function checkLynkrHealth(baseUrl) {
    // Health checks skip security validation - no auth needed for connectivity test
    const client = getLynkrClient({
        baseUrl,
        skipApiKeyValidation: true,
        skipSsrfValidation: true
    });
    return client.checkHealth();
}
}),
"[project]/src/lib/lynkr/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Lynkr Module - Universal LLM Proxy Integration
 *
 * Lynkr enables OpenClaw-OS to use local models from anywhere:
 * 1. Run Ollama + Lynkr on your Mac
 * 2. Expose Lynkr via Cloudflare Tunnel
 * 3. OpenClaw-OS (production) connects to your tunnel
 * 4. Claw AI uses your local models, from anywhere
 *
 * SECURITY:
 * - API key required (min 32 chars for production)
 * - SSRF protection blocks internal IPs
 * - Audit logging for all requests
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/lynkr/client.ts [app-route] (ecmascript)");
;
}),
"[project]/src/app/api/health/providers/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
/**
 * AI Provider Health Check Endpoint - Phase 3 Local LLM Integration
 *
 * GET /api/health/providers
 *
 * Returns connection status for all AI providers:
 * - Ollama (local LLM)
 * - Lynkr (universal LLM proxy - local models from anywhere)
 * - Whisper (local STT)
 * - Cloud (OpenAI/Anthropic)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/ollama/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ollama/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/lynkr/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/lynkr/client.ts [app-route] (ecmascript)");
;
;
;
// ============================================================================
// Health Check Functions
// ============================================================================
/**
 * Check Ollama health
 */ async function checkOllama(baseUrl) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkOllamaHealth"])(baseUrl);
}
/**
 * Check Whisper local availability
 * TODO: Implement actual whisper check when local whisper is set up
 */ async function checkWhisper() {
    const whisperEnabled = process.env.WHISPER_LOCAL_ENABLED === 'true';
    if (!whisperEnabled) {
        return {
            connected: false,
            enabled: false,
            error: 'Local Whisper not enabled'
        };
    }
    // TODO: Implement actual whisper health check
    // For now, return enabled status
    return {
        connected: whisperEnabled,
        enabled: whisperEnabled,
        latencyMs: 0
    };
}
/**
 * Check OpenAI API health
 */ async function checkOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return {
            connected: false,
            error: 'OPENAI_API_KEY not configured'
        };
    }
    const start = Date.now();
    try {
        // Quick models list to verify API key works
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`
            },
            signal: AbortSignal.timeout(5000)
        });
        if (!response.ok) {
            return {
                connected: false,
                error: `API returned ${response.status}`,
                latencyMs: Date.now() - start
            };
        }
        const data = await response.json();
        const models = data.data?.filter((m)=>m.id.startsWith('gpt-'))?.map((m)=>m.id)?.slice(0, 10) || [];
        return {
            connected: true,
            latencyMs: Date.now() - start,
            models
        };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Connection failed',
            latencyMs: Date.now() - start
        };
    }
}
/**
 * Check Anthropic API health
 */ async function checkAnthropic() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return {
            connected: false,
            error: 'ANTHROPIC_API_KEY not configured'
        };
    }
    const start = Date.now();
    try {
        // Simple request to verify API key
        // Anthropic doesn't have a /models endpoint, so we do a minimal completion
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1,
                messages: [
                    {
                        role: 'user',
                        content: 'hi'
                    }
                ]
            }),
            signal: AbortSignal.timeout(5000)
        });
        // Even if we get rate limited (429), the key is valid
        if (response.ok || response.status === 429) {
            return {
                connected: true,
                latencyMs: Date.now() - start,
                models: [
                    'claude-3-opus',
                    'claude-3-sonnet',
                    'claude-3-haiku'
                ]
            };
        }
        return {
            connected: false,
            error: `API returned ${response.status}`,
            latencyMs: Date.now() - start
        };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Connection failed',
            latencyMs: Date.now() - start
        };
    }
}
/**
 * Check Lynkr proxy health
 * Tries tunnel URL first (for production/remote access), then local URL
 */ async function checkLynkr(baseUrl, tunnelUrl) {
    // Try tunnel URL first if available (for remote access)
    const urlsToTry = tunnelUrl ? [
        tunnelUrl,
        baseUrl
    ] : [
        baseUrl
    ];
    for (const url of urlsToTry){
        const status = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkLynkrHealth"])(url);
        if (status.connected) {
            return {
                baseUrl,
                tunnelUrl: tunnelUrl,
                connected: true,
                latencyMs: status.latencyMs,
                provider: status.provider,
                version: status.version,
                features: status.features
            };
        }
    }
    // All URLs failed
    const lastStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkLynkrHealth"])(urlsToTry[urlsToTry.length - 1]);
    return {
        baseUrl,
        tunnelUrl,
        connected: false,
        latencyMs: lastStatus.latencyMs,
        error: lastStatus.error ?? 'Lynkr not reachable'
    };
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ollamaUrl = searchParams.get('ollamaUrl') ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
    const lynkrUrl = searchParams.get('lynkrUrl') ?? process.env.LYNKR_BASE_URL ?? 'http://localhost:8081';
    const lynkrTunnelUrl = searchParams.get('lynkrTunnelUrl') ?? process.env.LYNKR_TUNNEL_URL;
    const checkCloud = searchParams.get('checkCloud') !== 'false';
    const checkLynkrFlag = searchParams.get('checkLynkr') !== 'false';
    // Run health checks in parallel
    const [ollamaStatus, lynkrStatus, whisperStatus, openaiStatus, anthropicStatus] = await Promise.all([
        checkOllama(ollamaUrl),
        checkLynkrFlag ? checkLynkr(lynkrUrl, lynkrTunnelUrl) : Promise.resolve({
            baseUrl: lynkrUrl,
            connected: false,
            error: 'Skipped'
        }),
        checkWhisper(),
        checkCloud ? checkOpenAI() : Promise.resolve({
            connected: false,
            error: 'Skipped'
        }),
        checkCloud ? checkAnthropic() : Promise.resolve({
            connected: false,
            error: 'Skipped'
        })
    ]);
    // Determine availability
    const localAvailable = ollamaStatus.connected;
    const lynkrAvailable = lynkrStatus.connected;
    const cloudAvailable = openaiStatus.connected || anthropicStatus.connected;
    // Recommend provider based on availability and latency
    // Priority: Lynkr (if available) > Local Ollama > Cloud
    let recommendedProvider = 'cloud';
    if (lynkrAvailable) {
        // Lynkr is available - use it for "anywhere" access
        recommendedProvider = 'lynkr';
    } else if (localAvailable && (!cloudAvailable || (ollamaStatus.latencyMs ?? 0) < 1000)) {
        // Local Ollama is available and fast
        recommendedProvider = 'local';
    }
    const response = {
        timestamp: Date.now(),
        providers: {
            ollama: {
                baseUrl: ollamaUrl,
                connected: ollamaStatus.connected,
                latencyMs: ollamaStatus.latencyMs,
                error: ollamaStatus.error,
                models: ollamaStatus.models.map((m)=>m.name),
                version: ollamaStatus.version
            },
            lynkr: lynkrStatus,
            whisper: whisperStatus,
            openai: openaiStatus,
            anthropic: anthropicStatus
        },
        summary: {
            localAvailable,
            lynkrAvailable,
            cloudAvailable,
            recommendedProvider
        }
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__12c25f8c._.js.map