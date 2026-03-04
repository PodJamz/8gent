#!/usr/bin/env node
/**
 * WhatsApp Bridge CLI
 *
 * Usage: whatsapp-bridge [options]
 *
 * Starts the WhatsApp bridge daemon that connects WhatsApp to AI James.
 * On first run, scan the QR code with WhatsApp to authenticate.
 */

import { getConfig, validateConfig } from './config.js';
import { WhatsAppConnection } from './connection.js';
import { MessageHandler } from './handler.js';

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     █████╗ ██╗    ██╗ █████╗ ███╗   ███╗███████╗███████╗     ║
║    ██╔══██╗██║    ██║██╔══██╗████╗ ████║██╔════╝██╔════╝     ║
║    ███████║██║    ██║███████║██╔████╔██║█████╗  ███████╗     ║
║    ██╔══██║██║██  ██║██╔══██║██║╚██╔╝██║██╔══╝  ╚════██║     ║
║    ██║  ██║██║╚█████╔╝██║  ██║██║ ╚═╝ ██║███████╗███████║     ║
║    ╚═╝  ╚═╝╚═╝ ╚════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝     ║
║                                                               ║
║              WhatsApp Bridge powered by Baileys               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

async function main() {
  // Load and validate config
  const config = getConfig();
  validateConfig(config);

  console.log('\n[Bridge] Starting WhatsApp bridge...\n');

  // Create connection with event handlers
  let messageHandler: MessageHandler | null = null;

  const connection = new WhatsAppConnection(config, {
    onQR: (qr) => {
      console.log('\n[Bridge] QR Code received. Scan with WhatsApp to authenticate.\n');
    },

    onConnected: (phoneNumber) => {
      console.log(`\n[Bridge] Connected successfully!`);
      console.log(`[Bridge] Phone number: ${phoneNumber}`);
      console.log(`[Bridge] AI James API: ${config.apiUrl}`);
      console.log(`[Bridge] Ready to receive messages.\n`);
    },

    onDisconnected: (reason) => {
      console.log(`\n[Bridge] Disconnected: ${reason}\n`);
    },

    onMessage: async (message) => {
      if (messageHandler) {
        await messageHandler.handleMessage(message);
      }
    },
  });

  // Create message handler
  messageHandler = new MessageHandler(config, connection);

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log('\n[Bridge] Shutting down...');
    await connection.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Connect to WhatsApp
  try {
    await connection.connect();
  } catch (error) {
    console.error('[Bridge] Failed to connect:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[Bridge] Fatal error:', error);
  process.exit(1);
});
