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
 */

export {
  // Client
  LynkrClient,
  getLynkrClient,
  checkLynkrHealth,

  // Security
  validateApiKey,
  validateUrlSafety,
  setAuditLogCallback,

  // Types
  type LynkrConfig,
  type LynkrMessage,
  type LynkrTool,
  type LynkrChatRequest,
  type LynkrChatResponse,
  type LynkrHealthStatus,
  type LynkrMetrics,
  type LynkrToolUse,
  type LynkrTextContent,
  type LynkrContentBlock,
  type LynkrSecurityError,
  type LynkrAuditLog,
} from './client';
