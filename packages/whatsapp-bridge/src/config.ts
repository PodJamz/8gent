/**
 * WhatsApp Bridge Configuration
 *
 * Environment variables:
 * - JAMESOS_API_URL: AI James API endpoint (default: http://localhost:3000)
 * - JAMESOS_API_KEY: Optional API key for authentication
 * - WHATSAPP_AUTH_DIR: Directory for auth state (default: ./auth_state)
 * - WHATSAPP_ALLOWED_NUMBERS: Comma-separated list of allowed phone numbers (optional, allows all if not set)
 * - WHATSAPP_OWNER_NUMBER: Owner's phone number for admin commands
 * - LOG_LEVEL: Logging level (default: info)
 */

import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(__dirname, '..', '.env') });

export interface BridgeConfig {
  // AI James API - routes to Lynkr/Ollama or cloud based on JamesOS settings
  apiUrl: string;
  apiKey?: string;

  // WhatsApp
  authDir: string;
  allowedNumbers: string[];
  ownerNumber?: string;

  // Behavior
  autoReply: boolean;
  typingIndicator: boolean;
  readReceipts: boolean;
  maxMessageLength: number;

  // Logging
  logLevel: 'silent' | 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
}

export function getConfig(): BridgeConfig {
  const allowedNumbersEnv = process.env.WHATSAPP_ALLOWED_NUMBERS;

  return {
    // AI James API
    apiUrl: process.env.JAMESOS_API_URL || 'http://localhost:3000',
    apiKey: process.env.JAMESOS_API_KEY,

    // WhatsApp
    authDir: process.env.WHATSAPP_AUTH_DIR || resolve(__dirname, '..', 'auth_state'),
    allowedNumbers: allowedNumbersEnv ? allowedNumbersEnv.split(',').map(n => n.trim()) : [],
    ownerNumber: process.env.WHATSAPP_OWNER_NUMBER,

    // Behavior
    autoReply: process.env.WHATSAPP_AUTO_REPLY !== 'false',
    typingIndicator: process.env.WHATSAPP_TYPING_INDICATOR !== 'false',
    readReceipts: process.env.WHATSAPP_READ_RECEIPTS !== 'false',
    maxMessageLength: parseInt(process.env.WHATSAPP_MAX_MESSAGE_LENGTH || '4000', 10),

    // Logging
    logLevel: (process.env.LOG_LEVEL as BridgeConfig['logLevel']) || 'info',
  };
}

export function validateConfig(config: BridgeConfig): void {
  if (!config.apiUrl) {
    throw new Error('JAMESOS_API_URL is required');
  }

  // Validate URL format
  try {
    new URL(config.apiUrl);
  } catch {
    throw new Error(`Invalid JAMESOS_API_URL: ${config.apiUrl}`);
  }

  console.log('[Config] Loaded configuration:');
  console.log(`  API URL: ${config.apiUrl}`);
  console.log(`  Auth Dir: ${config.authDir}`);
  console.log(`  Allowed Numbers: ${config.allowedNumbers.length > 0 ? config.allowedNumbers.join(', ') : 'all'}`);
  console.log(`  Owner Number: ${config.ownerNumber || 'not set'}`);
  console.log(`  Auto Reply: ${config.autoReply}`);
  console.log(`  Typing Indicator: ${config.typingIndicator}`);
  console.log(`  Read Receipts: ${config.readReceipts}`);
}
