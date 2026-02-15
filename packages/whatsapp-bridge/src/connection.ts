/**
 * WhatsApp Connection Manager
 *
 * Handles connection to WhatsApp Web using Baileys.
 * - QR code authentication (first time)
 * - Multi-device auth state persistence
 * - Automatic reconnection
 * - Event handling
 */

import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  proto,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  ConnectionState,
  MessageUpsertType,
  WASocket,
  downloadMediaMessage,
} from '@whiskeysockets/baileys';
import type { Boom } from '@hapi/boom';
import pino from 'pino';
import { BridgeConfig } from './config.js';
import { mkdir } from 'fs/promises';

export type { WASocket };
export type MessageHandler = (message: proto.IWebMessageInfo) => Promise<void>;

export interface ConnectionEvents {
  onQR: (qr: string) => void;
  onConnected: (phoneNumber: string) => void;
  onDisconnected: (reason: string) => void;
  onMessage: MessageHandler;
}

export class WhatsAppConnection {
  private socket: WASocket | null = null;
  private config: BridgeConfig;
  private events: ConnectionEvents;
  private logger: pino.Logger;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  constructor(config: BridgeConfig, events: ConnectionEvents) {
    this.config = config;
    this.events = events;
    this.logger = pino({
      level: config.logLevel,
    });
  }

  async connect(): Promise<void> {
    // Ensure auth directory exists
    await mkdir(this.config.authDir, { recursive: true });

    // Load auth state from file system (persists across restarts)
    const { state, saveCreds } = await useMultiFileAuthState(this.config.authDir);

    // Get latest Baileys version info
    const { version, isLatest } = await fetchLatestBaileysVersion();
    this.logger.info(`Using Baileys v${version.join('.')}, isLatest: ${isLatest}`);

    // Create socket connection
    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, this.logger),
      },
      printQRInTerminal: true, // Let Baileys handle QR display
      logger: this.logger,
      browser: ['AI James', 'Chrome', '120.0.0'],
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      markOnlineOnConnect: true,
    });

    this.socket = sock;

    // Handle connection updates
    sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n[WhatsApp] Scan the QR code above with WhatsApp\n');
        this.events.onQR(qr);
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const error = lastDisconnect?.error as Boom;
        
        // Check for conflict (status 440) - another session is active
        const isConflict = statusCode === 440;
        
        // Check error message/payload for conflict indicators
        const errorMessage = error?.output?.payload?.error || error?.message || '';
        const isConflictInMessage = errorMessage.toLowerCase().includes('conflict') || 
                                    errorMessage.toLowerCase().includes('replaced');
        
        // Check for stream error data structure (from logs: node.content[0].tag === 'conflict')
        const errorData = error?.data as any;
        const hasConflictNode = errorData?.node?.content?.some?.((n: any) => n?.tag === 'conflict') ||
                               errorData?.content?.some?.((n: any) => n?.tag === 'conflict');

        const shouldReconnect = statusCode !== DisconnectReason.loggedOut && 
                                !isConflict && 
                                !isConflictInMessage &&
                                !hasConflictNode;

        this.logger.info(`Connection closed. Status: ${statusCode}. Reconnect: ${shouldReconnect}`);

        // Handle conflict - another WhatsApp Web session is active
        if (isConflict || isConflictInMessage || hasConflictNode) {
          this.logger.warn('Conflict detected: Another WhatsApp session is active. Close WhatsApp Web in your browser or other devices.');
          this.events.onDisconnected('Conflict: Another WhatsApp session is active. Close WhatsApp Web or other devices.');
          
          // Wait longer before retrying (30 seconds) to give user time to close other session
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = 30000; // 30 seconds for conflicts
            this.logger.info(`Will retry in ${delay / 1000}s after conflict resolution (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
            return; // Don't continue with normal reconnect logic
          } else {
            this.logger.error('Max reconnection attempts reached after conflicts');
            this.events.onDisconnected('Max reconnection attempts reached - resolve conflict first');
            return;
          }
        }
        
        if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 60000);
          this.logger.info(`Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts})`);

          setTimeout(() => this.connect(), delay);
          this.events.onDisconnected(`Reconnecting (attempt ${this.reconnectAttempts})`);
        } else if (statusCode === DisconnectReason.loggedOut) {
          this.logger.warn('Logged out. Delete auth_state folder and restart to re-authenticate.');
          this.events.onDisconnected('Logged out - re-authentication required');
        } else {
          this.logger.error('Max reconnection attempts reached');
          this.events.onDisconnected('Max reconnection attempts reached');
        }
      } else if (connection === 'open') {
        this.reconnectAttempts = 0;
        const phoneNumber = sock.user?.id?.split(':')[0] || 'unknown';
        this.logger.info(`Connected as ${phoneNumber}`);
        this.events.onConnected(phoneNumber);
      }
    });

    // Handle credential updates (save auth state)
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (upsert: { messages: proto.IWebMessageInfo[]; type: MessageUpsertType }) => {
      if (upsert.type !== 'notify') return;

      for (const message of upsert.messages) {
        // Skip messages from self
        if (message.key.fromMe) continue;

        // Skip status broadcasts
        if (message.key.remoteJid === 'status@broadcast') continue;

        // Process the message
        try {
          await this.events.onMessage(message);
        } catch (error) {
          this.logger.error({ error, messageId: message.key.id }, 'Error handling message');
        }
      }
    });
  }

  async sendMessage(jid: string, text: string): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    // Split long messages
    const chunks = this.splitMessage(text, this.config.maxMessageLength);

    for (const chunk of chunks) {
      // Show typing indicator
      if (this.config.typingIndicator) {
        await this.socket.presenceSubscribe(jid);
        await this.socket.sendPresenceUpdate('composing', jid);
        // Simulate typing delay based on message length (50ms per char, max 3s)
        await this.delay(Math.min(chunk.length * 50, 3000));
      }

      // Send the message
      await this.socket.sendMessage(jid, { text: chunk });

      // Clear typing indicator
      if (this.config.typingIndicator) {
        await this.socket.sendPresenceUpdate('paused', jid);
      }
    }
  }

  async sendVoiceMessage(jid: string, audioBuffer: Buffer): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    try {
      // Show recording indicator (optional)
      if (this.config.typingIndicator) {
        await this.socket.presenceSubscribe(jid);
        await this.socket.sendPresenceUpdate('recording', jid);
        await this.delay(500); // Brief delay to simulate recording
      }

      // Send as voice note (ptt = push to talk)
      await this.socket.sendMessage(jid, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: true, // This makes it a voice note with waveform
      });

      // Clear recording indicator
      if (this.config.typingIndicator) {
        await this.socket.sendPresenceUpdate('paused', jid);
      }

      this.logger.info({ jid }, 'Voice message sent successfully');
    } catch (error) {
      this.logger.error({ error, jid }, 'Failed to send voice message');
      throw error;
    }
  }

  async sendAudioFile(
    jid: string,
    audioBuffer: Buffer,
    options?: { filename?: string; caption?: string }
  ): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    try {
      await this.socket.sendMessage(jid, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: options?.filename || 'audio.mp3',
        ptt: false, // false = audio file, not voice note
      });

      // Send caption as separate message if provided
      if (options?.caption) {
        await this.socket.sendMessage(jid, { text: options.caption });
      }

      this.logger.info({ jid, filename: options?.filename }, 'Sent audio file');
    } catch (error) {
      this.logger.error({ error }, 'Failed to send audio file');
      throw error;
    }
  }

  async sendReadReceipt(message: proto.IWebMessageInfo): Promise<void> {
    if (!this.socket || !this.config.readReceipts) return;

    const jid = message.key.remoteJid;
    if (!jid || !message.key.id) return;

    try {
      await this.socket.readMessages([message.key]);
    } catch (error) {
      this.logger.debug({ error }, 'Failed to send read receipt');
    }
  }

  /**
   * Send an image to a chat
   */
  async sendImage(jid: string, imageUrl: string, caption?: string): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    try {
      // Show typing indicator
      if (this.config.typingIndicator) {
        await this.socket.presenceSubscribe(jid);
        await this.socket.sendPresenceUpdate('composing', jid);
        await this.delay(500);
      }

      // If it's a URL, download first then send
      if (imageUrl.startsWith('http')) {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
        const buffer = Buffer.from(await response.arrayBuffer());

        await this.socket.sendMessage(jid, {
          image: buffer,
          caption: caption,
        });
      } else {
        // Assume it's a local path or base64
        await this.socket.sendMessage(jid, {
          image: { url: imageUrl },
          caption: caption,
        });
      }

      // Clear typing indicator
      if (this.config.typingIndicator) {
        await this.socket.sendPresenceUpdate('paused', jid);
      }

      this.logger.info({ jid }, 'Image sent successfully');
    } catch (error) {
      this.logger.error({ error, jid }, 'Failed to send image');
      throw error;
    }
  }

  /**
   * Send a document/file to a chat
   */
  async sendDocument(jid: string, buffer: Buffer, filename: string, mimetype: string, caption?: string): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    try {
      await this.socket.sendMessage(jid, {
        document: buffer,
        fileName: filename,
        mimetype: mimetype,
        caption: caption,
      });

      this.logger.info({ jid, filename }, 'Document sent successfully');
    } catch (error) {
      this.logger.error({ error, jid }, 'Failed to send document');
      throw error;
    }
  }

  async sendReaction(message: proto.IWebMessageInfo, emoji: string): Promise<void> {
    if (!this.socket) return;

    const jid = message.key.remoteJid;
    if (!jid) return;

    try {
      await this.socket.sendMessage(jid, {
        react: {
          text: emoji,
          key: message.key,
        },
      });
    } catch (error) {
      this.logger.debug({ error }, 'Failed to send reaction');
    }
  }

  getSocket(): WASocket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.user !== undefined;
  }

  private splitMessage(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining);
        break;
      }

      // Try to split at a newline or space
      let splitIndex = remaining.lastIndexOf('\n', maxLength);
      if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
        splitIndex = remaining.lastIndexOf(' ', maxLength);
      }
      if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
        splitIndex = maxLength;
      }

      chunks.push(remaining.substring(0, splitIndex));
      remaining = remaining.substring(splitIndex).trimStart();
    }

    return chunks;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.end(undefined);
      this.socket = null;
    }
  }

  async downloadMedia(message: proto.IWebMessageInfo): Promise<{ buffer: Buffer; mimetype: string } | null> {
    if (!this.socket) return null;

    try {
      const msg = message.message;
      if (!msg) return null;

      // Determine which type of media message
      const mediaMessage = msg.audioMessage || msg.imageMessage || msg.videoMessage || msg.documentMessage;
      if (!mediaMessage) return null;

      // Download the media
      const buffer = await downloadMediaMessage(
        message,
        'buffer',
        {},
        {
          logger: this.logger,
          reuploadRequest: this.socket.updateMediaMessage,
        }
      );

      return {
        buffer: buffer as Buffer,
        mimetype: mediaMessage.mimetype || 'application/octet-stream',
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to download media');
      return null;
    }
  }
}
