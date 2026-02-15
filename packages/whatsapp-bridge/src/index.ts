/**
 * WhatsApp Bridge for AI James
 *
 * Connects WhatsApp to AI James using Baileys (WhatsApp Web protocol).
 *
 * Usage:
 * 1. cd packages/whatsapp-bridge
 * 2. pnpm install
 * 3. pnpm dev (or pnpm start after building)
 * 4. Scan QR code with WhatsApp on your second phone
 * 5. Messages to that WhatsApp will be handled by AI James
 */

export { getConfig, validateConfig, type BridgeConfig } from './config.js';
export {
  WhatsAppConnection,
  type ConnectionEvents,
  type MessageHandler as WAMessageHandler,
  type WASocket,
} from './connection.js';
export { MessageHandler } from './handler.js';
