/**
 * Message Handler
 *
 * Processes incoming WhatsApp messages and communicates with AI James.
 * - Extracts text from various message types
 * - Maintains conversation context per chat
 * - Handles rate limiting
 * - Supports admin commands
 */

import { proto } from '@whiskeysockets/baileys';
import { BridgeConfig } from './config.js';
import { WhatsAppConnection } from './connection.js';
import {
  parseCommand,
  getCommandByName,
  getCommandsForAccessLevel,
  validateCommand,
  formatHelpMessage,
  formatCommandHelp,
  type AccessLevel,
} from './commands.js';

interface ConversationContext {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  lastActivity: number;
  respondWithVoice?: boolean; // Flag for /voice command
}

interface AIJamesResponse {
  content?: string;
  error?: string;
}

interface WebhookPayload {
  event: 'message';
  message: {
    messageId: string;
    remoteJid: string;
    fromMe: boolean;
    timestamp: number;
    type: 'text' | 'audio';
    text?: string;
    audioTranscription?: string;
  };
}

export class MessageHandler {
  private config: BridgeConfig;
  private connection: WhatsAppConnection;
  private conversations: Map<string, ConversationContext> = new Map();
  private contextMaxAge = 30 * 60 * 1000; // 30 minutes
  private contextMaxMessages = 20;

  constructor(config: BridgeConfig, connection: WhatsAppConnection) {
    this.config = config;
    this.connection = connection;

    // Clean up old contexts periodically
    setInterval(() => this.cleanupOldContexts(), 5 * 60 * 1000);
  }

  /**
   * Log message to webhook for Convex storage
   * This enables the Messages app in JamesOS to display WhatsApp conversations
   */
  private async logToWebhook(payload: WebhookPayload): Promise<void> {
    const webhookUrl = `${this.config.apiUrl}/api/webhooks/whatsapp`;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-signature': process.env.WHATSAPP_WEBHOOK_SECRET || '',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        console.error(`[Handler] Webhook log failed: ${response.status}`);
      }
    } catch (error) {
      // Don't fail the message handling if webhook logging fails
      console.error('[Handler] Webhook log error:', error);
    }
  }

  async handleMessage(message: proto.IWebMessageInfo): Promise<void> {
    const jid = message.key.remoteJid;
    if (!jid) return;

    // Extract sender info
    const senderNumber = this.extractPhoneNumber(jid);
    const isGroup = jid.endsWith('@g.us');
    const senderName = message.pushName || senderNumber;

    // Check if sender is allowed
    if (!this.isAllowed(senderNumber)) {
      console.log(`[Handler] Ignoring message from non-allowed number: ${senderNumber}`);
      return;
    }

    // Extract message text (now async due to voice transcription)
    let text = await this.extractMessageText(message);
    if (!text) {
      console.log(`[Handler] No text content in message from ${senderNumber}`);
      return;
    }

    console.log(`[Handler] Message from ${senderName} (${senderNumber}): ${text.substring(0, 100)}...`);

    // Log inbound message to webhook for Messages app
    const isVoice = !!message.message?.audioMessage;
    this.logToWebhook({
      event: 'message',
      message: {
        messageId: message.key.id || `msg_${Date.now()}`,
        remoteJid: jid,
        fromMe: false,
        timestamp: Math.floor(Date.now() / 1000),
        type: isVoice ? 'audio' : 'text',
        text: text,
        audioTranscription: isVoice ? text : undefined,
      },
    }).catch(() => {}); // Fire and forget

    // Send read receipt
    await this.connection.sendReadReceipt(message);

    // Check if message is a slash command
    const commandParse = parseCommand(text);
    if (commandParse) {
      const { command, args } = commandParse;
      const cmd = getCommandByName(command);

      if (cmd) {
        // Check access level
        const userAccessLevel = this.getUserAccessLevel(senderNumber);
        const allowedCommands = getCommandsForAccessLevel(userAccessLevel);

        if (!allowedCommands.includes(cmd)) {
          await this.connection.sendMessage(
            jid,
            `⛔ You don't have permission to use */${cmd.name}*.\n\nType */help* to see available commands.`
          );
          return;
        }

        // Validate command arguments
        const validation = validateCommand(cmd, args);
        if (!validation.valid) {
          await this.connection.sendMessage(jid, validation.error);
          return;
        }

        // Route to appropriate handler
        console.log(`[Handler] Executing command: /${cmd.name} with args: ${args}`);
        const response = await this.handleCommand(cmd.handler, args, jid, senderNumber, senderName);

        if (response) {
          await this.connection.sendMessage(jid, response);
        }
        return;
      }

      // Unknown command
      await this.connection.sendMessage(
        jid,
        `❓ Unknown command: */${command}*\n\nType */help* to see available commands.`
      );
      return;
    }

    // Skip if auto-reply is disabled
    if (!this.config.autoReply) {
      console.log('[Handler] Auto-reply disabled, skipping response');
      return;
    }

    // For groups, only respond if mentioned or in DM
    if (isGroup) {
      const mentionedMe = this.isMentioned(message);
      if (!mentionedMe) {
        console.log('[Handler] Not mentioned in group, skipping');
        return;
      }
    }

    // React with thinking emoji
    await this.connection.sendReaction(message, '🤔');

    try {
      // Get conversation context
      const context = this.getOrCreateContext(jid);
      context.messages.push({ role: 'user', content: text });
      context.lastActivity = Date.now();

      // Call AI James
      const response = await this.callAIJames(context.messages, senderName);

      if (response.error) {
        await this.connection.sendReaction(message, '❌');
        await this.connection.sendMessage(jid, `Sorry, I encountered an error: ${response.error}`);
        return;
      }

      if (response.content) {
        // Add to context
        context.messages.push({ role: 'assistant', content: response.content });

        // Trim context if too long
        while (context.messages.length > this.contextMaxMessages) {
          context.messages.shift();
        }

        // React with success
        await this.connection.sendReaction(message, '✅');

        // Send voice response if requested, otherwise text
        if (context.respondWithVoice) {
          try {
            console.log('[Handler] Generating voice response...');
            const audioBuffer = await this.generateVoiceResponse(response.content);
            if (audioBuffer) {
              await this.connection.sendVoiceMessage(jid, audioBuffer);
              // Also send text as caption for accessibility
              await this.connection.sendMessage(jid, `🎙️ _${response.content}_`);
              console.log('[Handler] Voice message sent successfully');
            } else {
              // Fallback to text if TTS fails
              console.log('[Handler] Voice generation failed, falling back to text');
              await this.connection.sendMessage(jid, response.content);
            }
          } catch (error) {
            console.error('[Handler] Voice response error:', error);
            await this.connection.sendMessage(jid, response.content);
          }
          // Reset voice flag after use
          context.respondWithVoice = false;
        } else {
          await this.connection.sendMessage(jid, response.content);
        }

        // Log outbound message to webhook for Messages app
        this.logToWebhook({
          event: 'message',
          message: {
            messageId: `out_${Date.now()}`,
            remoteJid: jid,
            fromMe: true,
            timestamp: Math.floor(Date.now() / 1000),
            type: 'text',
            text: response.content,
          },
        }).catch(() => {}); // Fire and forget
      }
    } catch (error) {
      console.error('[Handler] Error processing message:', error);
      await this.connection.sendReaction(message, '❌');
      await this.connection.sendMessage(jid, 'Sorry, something went wrong. Please try again.');
    }
  }

  private async callAIJames(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    senderName: string,
    customSystemContext?: string,
    enableTools?: boolean
  ): Promise<AIJamesResponse> {
    const endpoint = `${this.config.apiUrl}/api/chat`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    // Add channel context to system message
    const systemContext = customSystemContext || `You are AI James, responding via WhatsApp to ${senderName}. Keep responses concise and mobile-friendly. You can use WhatsApp formatting: *bold*, _italic_, ~strikethrough~, \`\`\`code\`\`\`.`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemContext },
            ...messages,
          ],
          model: 'claude', // Use default model
          channel: 'whatsapp',
          enableTools: enableTools || false,
        }),
        signal: AbortSignal.timeout(60000), // 60s timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Handler] AI James API error: ${response.status} - ${errorText}`);
        return { error: `API error: ${response.status}` };
      }

      const data = await response.json();

      // Extract content from response
      // The response format depends on your /api/chat implementation
      if (data.content) {
        return { content: data.content };
      } else if (data.choices?.[0]?.message?.content) {
        // OpenAI format
        return { content: data.choices[0].message.content };
      } else if (typeof data === 'string') {
        return { content: data };
      }

      console.error('[Handler] Unexpected response format:', data);
      return { error: 'Unexpected response format' };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { error: 'Request timed out' };
        }
        return { error: error.message };
      }
      return { error: 'Unknown error' };
    }
  }

  private async generateVoiceResponse(text: string): Promise<Buffer | null> {
    // Split long text into chunks (max 5000 chars for TTS)
    if (text.length > 5000) {
      console.log('[Handler] Text too long for single voice message, truncating');
      text = text.substring(0, 5000) + '...';
    }

    try {
      // Try ElevenLabs TTS first
      const response = await fetch(`${this.config.apiUrl}/api/tts/elevenlabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }

      // Check for fallback instruction
      const errorData = await response.json().catch(() => ({}));
      if (errorData.fallback === 'openai') {
        console.log('[Handler] Falling back to OpenAI TTS');
        // Try OpenAI TTS as fallback
        const openaiResponse = await fetch(`${this.config.apiUrl}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            voice: 'nova', // Warm conversational voice
            speed: 1.0,
          }),
          signal: AbortSignal.timeout(30000), // 30s timeout
        });

        if (openaiResponse.ok) {
          const arrayBuffer = await openaiResponse.arrayBuffer();
          return Buffer.from(arrayBuffer);
        }
      }

      console.error('[Handler] TTS API error:', response.status);
      return null;
    } catch (error) {
      console.error('[Handler] TTS error:', error);
      return null;
    }
  }

  private async handleAdminCommand(text: string): Promise<string | null> {
    const [command, ...args] = text.split(' ');

    switch (command.toLowerCase()) {
      case '/status':
        return `WhatsApp Bridge Status:
- Connected: ${this.connection.isConnected() ? 'Yes' : 'No'}
- Active conversations: ${this.conversations.size}
- Auto-reply: ${this.config.autoReply ? 'Enabled' : 'Disabled'}`;

      case '/clear':
        this.conversations.clear();
        return 'All conversation contexts cleared.';

      case '/help':
        return `Admin Commands:
/status - Show bridge status
/clear - Clear all conversation contexts
/voice [message] - Request AI James to respond with voice
/help - Show this help message`;

      default:
        return null; // Not a recognized command, pass through to AI
    }
  }

  private async extractMessageText(message: proto.IWebMessageInfo): Promise<string | null> {
    const msg = message.message;
    if (!msg) return null;

    // Handle different message types
    if (msg.conversation) {
      return msg.conversation;
    }
    if (msg.extendedTextMessage?.text) {
      return msg.extendedTextMessage.text;
    }
    if (msg.imageMessage?.caption) {
      return `[Image] ${msg.imageMessage.caption}`;
    }
    if (msg.videoMessage?.caption) {
      return `[Video] ${msg.videoMessage.caption}`;
    }
    if (msg.documentMessage?.caption) {
      return `[Document: ${msg.documentMessage.fileName}] ${msg.documentMessage.caption || ''}`;
    }

    // Voice message - transcribe it!
    if (msg.audioMessage) {
      try {
        console.log('[Handler] Voice message detected, attempting transcription...');
        const transcription = await this.transcribeVoiceMessage(message);
        if (transcription) {
          console.log(`[Handler] Transcription successful: ${transcription.substring(0, 50)}...`);
          return `[Voice] ${transcription}`;
        }
        console.log('[Handler] Transcription returned empty result');
        return '[Voice message - transcription failed]';
      } catch (error) {
        console.error('[Handler] Voice transcription error:', error);
        return '[Voice message - transcription error]';
      }
    }

    if (msg.stickerMessage) {
      return '[Sticker received]';
    }
    if (msg.contactMessage) {
      return `[Contact shared: ${msg.contactMessage.displayName}]`;
    }
    if (msg.locationMessage) {
      return `[Location: ${msg.locationMessage.degreesLatitude}, ${msg.locationMessage.degreesLongitude}]`;
    }

    return null;
  }

  private async transcribeVoiceMessage(message: proto.IWebMessageInfo): Promise<string | null> {
    try {
      // Download the audio
      console.log('[Handler] Downloading voice message...');
      const media = await this.connection.downloadMedia(message);
      if (!media) {
        console.log('[Handler] Failed to download voice message');
        return null;
      }

      console.log(`[Handler] Downloaded audio: ${media.buffer.length} bytes, type: ${media.mimetype}`);

      // Try local Whisper first (faster-whisper on localhost:8082)
      const localWhisperUrl = process.env.LOCAL_WHISPER_URL || 'http://localhost:8082';

      // Create form data for Whisper API
      const formData = new FormData();
      const uint8Array = new Uint8Array(media.buffer);
      const blob = new Blob([uint8Array], { type: media.mimetype || 'audio/ogg' });
      formData.append('file', blob, 'voice.ogg');

      try {
        console.log(`[Handler] Trying local Whisper at ${localWhisperUrl}...`);
        const localResponse = await fetch(`${localWhisperUrl}/v1/audio/transcriptions`, {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(30000), // 30s timeout for local
        });

        if (localResponse.ok) {
          const data = await localResponse.json();
          console.log('[Handler] Local Whisper response:', data);
          return data.text || null;
        }
        console.log(`[Handler] Local Whisper failed: ${localResponse.status}`);
      } catch (localError) {
        console.log('[Handler] Local Whisper unavailable, falling back to cloud:', localError);
      }

      // Fallback to cloud Whisper API
      console.log('[Handler] Calling cloud Whisper API...');
      const cloudFormData = new FormData();
      cloudFormData.append('file', blob, 'voice.ogg');
      cloudFormData.append('language', 'en');

      const response = await fetch(`${this.config.apiUrl}/api/whisper`, {
        method: 'POST',
        body: cloudFormData,
        signal: AbortSignal.timeout(60000), // 60s timeout for cloud
      });

      if (!response.ok) {
        console.error('[Handler] Cloud Whisper API error:', response.status, await response.text());
        return null;
      }

      const data = await response.json();
      console.log('[Handler] Cloud Whisper API response:', data);
      return data.text || null;
    } catch (error) {
      console.error('[Handler] Transcription error:', error);
      return null;
    }
  }

  private extractPhoneNumber(jid: string): string {
    // JID format: number@s.whatsapp.net or number@g.us
    return jid.split('@')[0].split(':')[0];
  }

  private isAllowed(phoneNumber: string): boolean {
    // If no allowed numbers specified, allow all
    if (this.config.allowedNumbers.length === 0) {
      return true;
    }
    return this.config.allowedNumbers.includes(phoneNumber);
  }

  private isOwner(phoneNumber: string): boolean {
    return this.config.ownerNumber === phoneNumber;
  }

  private isMentioned(message: proto.IWebMessageInfo): boolean {
    const extendedText = message.message?.extendedTextMessage;
    if (!extendedText?.contextInfo?.mentionedJid) return false;

    const socket = this.connection.getSocket();
    if (!socket?.user?.id) return false;

    const myJid = socket.user.id;
    return extendedText.contextInfo.mentionedJid.some(
      (jid) => jid.split('@')[0] === myJid.split('@')[0].split(':')[0]
    );
  }

  private getOrCreateContext(jid: string): ConversationContext {
    let context = this.conversations.get(jid);

    if (!context || Date.now() - context.lastActivity > this.contextMaxAge) {
      context = {
        messages: [],
        lastActivity: Date.now(),
      };
      this.conversations.set(jid, context);
    }

    return context;
  }

  private cleanupOldContexts(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [jid, context] of this.conversations.entries()) {
      if (now - context.lastActivity > this.contextMaxAge) {
        this.conversations.delete(jid);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Handler] Cleaned up ${cleaned} old conversation contexts`);
    }
  }

  private getUserAccessLevel(phoneNumber: string): AccessLevel {
    if (this.isOwner(phoneNumber)) {
      return 'owner';
    }
    if (this.isAllowed(phoneNumber) && this.config.allowedNumbers.includes(phoneNumber)) {
      return 'collaborator';
    }
    return 'visitor';
  }

  private async handleCommand(
    handler: string,
    args: string,
    jid: string,
    senderNumber: string,
    senderName: string
  ): Promise<string | null> {
    const context = this.getOrCreateContext(jid);

    switch (handler) {
      case 'handleHelp':
        const userLevel = this.getUserAccessLevel(senderNumber);
        const commands = getCommandsForAccessLevel(userLevel);
        if (args) {
          const cmd = getCommandByName(args);
          if (cmd) {
            return formatCommandHelp(cmd);
          }
          return `❓ Unknown command: */${args}*`;
        }
        return formatHelpMessage(commands);

      case 'handleStatus':
        return `🤖 *AI James Status*\n\n` +
               `✅ Connected: ${this.connection.isConnected() ? 'Yes' : 'No'}\n` +
               `💬 Active conversations: ${this.conversations.size}\n` +
               `🔄 Auto-reply: ${this.config.autoReply ? 'Enabled' : 'Disabled'}`;

      case 'handleVoice':
        // Set voice flag for this conversation
        context.respondWithVoice = true;
        const voicePrompt = args || 'Hello';
        // Add to conversation and trigger AI response
        context.messages.push({ role: 'user', content: voicePrompt });
        const response = await this.callAIJames(context.messages, senderName);
        if (response.content) {
          context.messages.push({ role: 'assistant', content: response.content });
          const audioBuffer = await this.generateVoiceResponse(response.content);
          if (audioBuffer) {
            await this.connection.sendVoiceMessage(jid, audioBuffer);
            return `🎙️ _${response.content}_`; // Text caption
          }
          return response.content; // Fallback to text
        }
        context.respondWithVoice = false;
        return response.error ? `Error: ${response.error}` : null;

      case 'handleClear':
        this.conversations.delete(jid);
        return '🗑️ Conversation context cleared.';

      case 'handleMusic':
        await this.handleMusic(args, jid);
        return null; // Message is sent within the handler

      case 'handleSend':
        await this.handleSend(args, jid, senderNumber);
        return null; // Message is sent within the handler

      case 'handleSearch':
        return await this.handleToolCommand('search_portfolio', { query: args }, jid, senderName);

      case 'handleSchedule':
        return await this.handleToolCommand('get_available_times', { timeframe: args || 'next week' }, jid, senderName);

      case 'handleWeather':
        return await this.handleToolCommand('show_weather', { location: args || 'San Francisco' }, jid, senderName);

      case 'handleRemember':
        return await this.handleToolCommand('remember', { query: args }, jid, senderName);

      case 'handleSkills':
        return await this.handleToolCommand('list_skills', { category: args }, jid, senderName);

      case 'handleContacts':
        return await this.handleContactsCommand(args, jid);

      case 'handleBroadcast':
        return await this.handleBroadcastCommand(args, jid);

      case 'handleGenerate':
        return await this.handleGenerateCommand(args, jid, senderName);

      case 'handleResearch':
        return await this.handleAgenticTask('research', args, jid, senderName);

      case 'handleBuild':
        return await this.handleAgenticTask('build', args, jid, senderName);

      case 'handleTool':
        return await this.handleDirectTool(args, jid, senderName);

      case 'handleToolsList':
        return this.getToolsList(args);

      case 'handleProject':
        return await this.handleProjectCommand(args, jid, senderName);

      case 'handleTicket':
        return await this.handleTicketCommand(args, jid, senderName);

      case 'handleCode':
        return await this.handleCodeCommand(args, jid, senderName);

      case 'handleGit':
        return await this.handleGitCommand(args, jid, senderName);

      case 'handleCron':
        return await this.handleCronCommand(args, jid, senderName);

      case 'handleProactive':
        return await this.handleProactiveCommand(args, jid);

      case 'handleObjective':
        return await this.handleObjectiveCommand(args, jid, senderName);

      case 'handleReport':
        return await this.handleReportCommand(args, jid, senderName);

      case 'handleWeb':
        return await this.handleWebCommand(args, jid, senderName);

      case 'handleImage':
        return await this.handleImageCommand(args, jid, senderName);

      case 'handleCanvas':
        return await this.handleCanvasCommand(args, jid, senderName);

      default:
        return `❌ Unknown handler: ${handler}`;
    }
  }

  // ==================== TOOL COMMAND HELPERS ====================

  /**
   * Execute an AI James tool and return formatted result
   */
  private async handleToolCommand(
    toolName: string,
    params: Record<string, unknown>,
    jid: string,
    senderName: string
  ): Promise<string> {
    try {
      const systemContext = `You are AI James responding via WhatsApp. Execute the ${toolName} tool with the given parameters and provide a concise, mobile-friendly response. Use WhatsApp formatting: *bold*, _italic_.`;

      const response = await this.callAIJames(
        [{ role: 'user', content: `Use the ${toolName} tool with these parameters: ${JSON.stringify(params)}` }],
        senderName,
        systemContext,
        true // Enable tools
      );

      return response.content || response.error || 'No response';
    } catch (error) {
      return `❌ Error executing ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Direct tool execution with JSON args
   */
  private async handleDirectTool(args: string, jid: string, senderName: string): Promise<string> {
    // Parse: tool_name {json_args}
    const match = args.match(/^(\S+)(?:\s+(.*))?$/);
    if (!match) {
      return '*Usage:* `/tool <tool_name> [json_args]`\n\nExample: `/tool list_projects`';
    }

    const [, toolName, jsonArgs] = match;
    let params = {};

    if (jsonArgs) {
      try {
        params = JSON.parse(jsonArgs);
      } catch {
        // Try to parse as simple key:value pairs
        params = { query: jsonArgs };
      }
    }

    return await this.handleToolCommand(toolName, params, jid, senderName);
  }

  /**
   * List available AI James tools
   */
  private getToolsList(category?: string): string {
    const tools: Record<string, string[]> = {
      portfolio: ['search_portfolio', 'navigate_to', 'list_themes'],
      calendar: ['schedule_call', 'get_available_times', 'book_meeting', 'cancel_meeting'],
      memory: ['remember', 'recall_preference', 'memorize', 'learn', 'forget'],
      projects: ['create_project', 'list_projects', 'create_prd', 'create_ticket', 'update_ticket'],
      coding: ['clone_repository', 'read_file', 'write_file', 'run_command', 'git_status', 'git_commit'],
      cron: ['create_cron_job', 'list_cron_jobs', 'toggle_cron_job', 'delete_cron_job'],
      channels: ['send_channel_message', 'get_channel_conversations', 'search_channel_messages'],
      canvas: ['create_canvas', 'open_canvas', 'list_canvases'],
    };

    if (category && tools[category]) {
      return `*🔧 ${category.toUpperCase()} Tools*\n\n${tools[category].map(t => `• \`${t}\``).join('\n')}`;
    }

    let msg = '*🔧 AI James Tools*\n\n';
    for (const [cat, toolList] of Object.entries(tools)) {
      msg += `*${cat}:* ${toolList.length} tools\n`;
    }
    msg += '\n_Use `/tools <category>` for details_';
    return msg;
  }

  // ==================== AGENTIC TASK HANDLERS ====================

  /**
   * Handle agentic tasks (research, build) - AI James works autonomously
   */
  private async handleAgenticTask(
    taskType: 'research' | 'build',
    description: string,
    jid: string,
    senderName: string
  ): Promise<string | null> {
    await this.connection.sendMessage(jid,
      `🚀 *Starting ${taskType} task...*\n\n` +
      `Task: _"${description}"_\n\n` +
      `_AI James will work on this and update you with progress._`
    );

    const systemContext = `You are AI James working autonomously on a ${taskType} task via WhatsApp.
Task: ${description}

Work on this task step by step. You have access to all your tools.
When you complete a step, report your progress concisely.
Use WhatsApp formatting: *bold*, _italic_, \`\`\`code\`\`\`.`;

    const response = await this.callAIJames(
      [{ role: 'user', content: `Start ${taskType} task: ${description}` }],
      senderName,
      systemContext,
      true
    );

    if (response.content) {
      await this.connection.sendMessage(jid, response.content);
    }
    return null;
  }

  // ==================== PROJECT & TICKET HANDLERS ====================

  private async handleProjectCommand(args: string, jid: string, senderName: string): Promise<string> {
    const [action, ...rest] = args.split(' ');
    const restArgs = rest.join(' ');

    switch (action?.toLowerCase()) {
      case 'list':
        return await this.handleToolCommand('list_projects', { status: restArgs || 'active' }, jid, senderName);
      case 'create':
        const [name, ...descParts] = restArgs.split(' - ');
        return await this.handleToolCommand('create_project', {
          name: name?.trim(),
          description: descParts.join(' - ').trim()
        }, jid, senderName);
      case 'kanban':
        return await this.handleToolCommand('get_project_kanban', { projectSlug: restArgs }, jid, senderName);
      default:
        return '*📋 Project Commands*\n\n' +
          '`/project list` - List all projects\n' +
          '`/project create Name - Description`\n' +
          '`/project kanban ProjectSlug`';
    }
  }

  private async handleTicketCommand(args: string, jid: string, senderName: string): Promise<string> {
    const [action, ...rest] = args.split(' ');
    const restArgs = rest.join(' ');

    switch (action?.toLowerCase()) {
      case 'create':
        const [title, ...descParts] = restArgs.split(' - ');
        return await this.handleToolCommand('create_ticket', {
          title: title?.trim(),
          description: descParts.join(' - ').trim(),
          priority: 'P1'
        }, jid, senderName);
      case 'list':
        return await this.handleToolCommand('list_coding_tasks', { status: restArgs || 'all' }, jid, senderName);
      case 'update':
        // Parse: TICKET-123 status:done
        const updateMatch = restArgs.match(/^(\S+)\s+(.+)$/);
        if (updateMatch) {
          return await this.handleToolCommand('update_ticket', {
            ticketId: updateMatch[1],
            updates: updateMatch[2]
          }, jid, senderName);
        }
        return 'Usage: `/ticket update TICKET-ID status:done`';
      default:
        return '*🎫 Ticket Commands*\n\n' +
          '`/ticket create Title - Description`\n' +
          '`/ticket list [status]`\n' +
          '`/ticket update TICKET-ID status:done`';
    }
  }

  // ==================== CODE & GIT HANDLERS ====================

  private async handleCodeCommand(args: string, jid: string, senderName: string): Promise<string> {
    const [action, ...rest] = args.split(' ');
    const restArgs = rest.join(' ');

    switch (action?.toLowerCase()) {
      case 'clone':
        return await this.handleToolCommand('clone_repository', { repoUrl: restArgs }, jid, senderName);
      case 'run':
        return await this.handleToolCommand('run_command', { command: restArgs }, jid, senderName);
      case 'read':
        return await this.handleToolCommand('read_file', { path: restArgs }, jid, senderName);
      case 'write':
        const writeMatch = restArgs.match(/^(\S+)\s+(.+)$/s);
        if (writeMatch) {
          return await this.handleToolCommand('write_file', {
            path: writeMatch[1],
            content: writeMatch[2]
          }, jid, senderName);
        }
        return 'Usage: `/code write <path> <content>`';
      default:
        return '*💻 Code Commands*\n\n' +
          '`/code clone <repo_url>`\n' +
          '`/code run <command>`\n' +
          '`/code read <path>`\n' +
          '`/code write <path> <content>`';
    }
  }

  private async handleGitCommand(args: string, jid: string, senderName: string): Promise<string> {
    const [action, ...rest] = args.split(' ');
    const restArgs = rest.join(' ');

    switch (action?.toLowerCase()) {
      case 'status':
        return await this.handleToolCommand('git_status', {}, jid, senderName);
      case 'diff':
        return await this.handleToolCommand('git_diff', { filepath: restArgs }, jid, senderName);
      case 'commit':
        return await this.handleToolCommand('git_commit', { message: restArgs.replace(/^["']|["']$/g, '') }, jid, senderName);
      case 'push':
        return await this.handleToolCommand('git_push', {}, jid, senderName);
      default:
        return '*📦 Git Commands*\n\n' +
          '`/git status`\n' +
          '`/git diff [file]`\n' +
          '`/git commit "message"`\n' +
          '`/git push`';
    }
  }

  // ==================== CRON HANDLERS ====================

  private async handleCronCommand(args: string, jid: string, senderName: string): Promise<string> {
    const [action, ...rest] = args.split(' ');
    const restArgs = rest.join(' ');

    switch (action?.toLowerCase()) {
      case 'list':
        return await this.handleToolCommand('list_cron_jobs', {}, jid, senderName);
      case 'create':
        // Parse: "name" cron_expression
        const createMatch = restArgs.match(/^["'](.+?)["']\s+(.+)$/);
        if (createMatch) {
          return await this.handleToolCommand('create_cron_job', {
            name: createMatch[1],
            schedule: createMatch[2]
          }, jid, senderName);
        }
        return 'Usage: `/cron create "Job Name" * * * * *`';
      case 'toggle':
        return await this.handleToolCommand('toggle_cron_job', { jobId: restArgs }, jid, senderName);
      case 'delete':
        return await this.handleToolCommand('delete_cron_job', { jobId: restArgs }, jid, senderName);
      default:
        return '*⏰ Cron Commands*\n\n' +
          '`/cron list`\n' +
          '`/cron create "Name" * * * * *`\n' +
          '`/cron toggle <job_id>`\n' +
          '`/cron delete <job_id>`';
    }
  }

  // ==================== PROACTIVE SYSTEM ====================

  private proactiveInterval: NodeJS.Timeout | null = null;
  private proactiveEnabled = false;
  private proactiveIntervalMinutes = 30;
  private objectives: Array<{ id: number; description: string; status: 'pending' | 'working' | 'done' }> = [];
  private nextObjectiveId = 1;

  private async handleProactiveCommand(args: string, jid: string): Promise<string> {
    const [action, value] = args.split(' ');

    switch (action?.toLowerCase()) {
      case 'on':
        this.startProactiveMode(jid);
        return `✅ *Proactive mode enabled*\n\nI'll message you every ${this.proactiveIntervalMinutes} minutes with updates.`;

      case 'off':
        this.stopProactiveMode();
        return '⏸️ *Proactive mode disabled*';

      case 'status':
        return this.getProactiveStatus();

      case 'interval':
        const minutes = parseInt(value);
        if (isNaN(minutes) || minutes < 5 || minutes > 120) {
          return '❌ Interval must be between 5 and 120 minutes';
        }
        this.proactiveIntervalMinutes = minutes;
        if (this.proactiveEnabled) {
          this.startProactiveMode(jid); // Restart with new interval
        }
        return `✅ Interval set to ${minutes} minutes`;

      default:
        return '*🤖 Proactive Mode*\n\n' +
          '`/proactive on` - Enable auto-updates\n' +
          '`/proactive off` - Disable\n' +
          '`/proactive status` - Show current status\n' +
          '`/proactive interval <minutes>` - Set interval (5-120)';
    }
  }

  private startProactiveMode(ownerJid: string): void {
    this.stopProactiveMode();
    this.proactiveEnabled = true;

    this.proactiveInterval = setInterval(async () => {
      await this.sendProactiveUpdate(ownerJid);
    }, this.proactiveIntervalMinutes * 60 * 1000);

    console.log(`[Handler] Proactive mode started - interval: ${this.proactiveIntervalMinutes}min`);
  }

  private stopProactiveMode(): void {
    if (this.proactiveInterval) {
      clearInterval(this.proactiveInterval);
      this.proactiveInterval = null;
    }
    this.proactiveEnabled = false;
    console.log('[Handler] Proactive mode stopped');
  }

  private async sendProactiveUpdate(ownerJid: string): Promise<void> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Work on objectives if any
    const pendingObjective = this.objectives.find(o => o.status === 'pending' || o.status === 'working');

    let updateMsg = `🤖 *AI James Check-in* (${timeStr})\n\n`;

    if (pendingObjective) {
      pendingObjective.status = 'working';
      updateMsg += `📋 *Working on:* ${pendingObjective.description}\n\n`;

      // Actually work on the objective
      const systemContext = `You are AI James checking in via WhatsApp. You're working on: "${pendingObjective.description}"

Report your progress briefly. What have you done? What's next?
Use WhatsApp formatting: *bold*, _italic_.
Keep it under 200 words.`;

      const response = await this.callAIJames(
        [{ role: 'user', content: `Progress update on objective: ${pendingObjective.description}` }],
        'Owner',
        systemContext,
        true
      );

      if (response.content) {
        updateMsg += response.content;
      }
    } else {
      // No objectives - report general status
      updateMsg += `✅ *Status:* Online and ready\n`;
      updateMsg += `💬 *Active chats:* ${this.conversations.size}\n`;
      updateMsg += `📊 *Objectives:* ${this.objectives.filter(o => o.status === 'done').length}/${this.objectives.length} complete\n\n`;
      updateMsg += `_No active objectives. Use /objective add to give me work!_`;
    }

    await this.connection.sendMessage(ownerJid, updateMsg);
  }

  private getProactiveStatus(): string {
    let status = '*🤖 Proactive Status*\n\n';
    status += `Mode: ${this.proactiveEnabled ? '✅ Enabled' : '⏸️ Disabled'}\n`;
    status += `Interval: ${this.proactiveIntervalMinutes} minutes\n`;
    status += `Objectives: ${this.objectives.length} total\n`;
    status += `  • Pending: ${this.objectives.filter(o => o.status === 'pending').length}\n`;
    status += `  • Working: ${this.objectives.filter(o => o.status === 'working').length}\n`;
    status += `  • Done: ${this.objectives.filter(o => o.status === 'done').length}\n`;
    return status;
  }

  private async handleObjectiveCommand(args: string, jid: string, senderName: string): Promise<string> {
    const [action, ...rest] = args.split(' ');
    const restArgs = rest.join(' ');

    switch (action?.toLowerCase()) {
      case 'add':
        const newObj = {
          id: this.nextObjectiveId++,
          description: restArgs,
          status: 'pending' as const
        };
        this.objectives.push(newObj);
        return `✅ *Objective added* (#${newObj.id})\n\n_${restArgs}_`;

      case 'list':
        if (this.objectives.length === 0) {
          return '📋 No objectives set.\n\n_Use `/objective add <description>` to add one._';
        }
        let listMsg = '*📋 Objectives*\n\n';
        for (const obj of this.objectives) {
          const icon = obj.status === 'done' ? '✅' : obj.status === 'working' ? '🔄' : '⏳';
          listMsg += `${icon} #${obj.id}: ${obj.description}\n`;
        }
        return listMsg;

      case 'complete':
      case 'done':
        const completeId = parseInt(restArgs);
        const obj = this.objectives.find(o => o.id === completeId);
        if (obj) {
          obj.status = 'done';
          return `✅ Objective #${completeId} marked complete`;
        }
        return `❌ Objective #${completeId} not found`;

      case 'clear':
        this.objectives = [];
        this.nextObjectiveId = 1;
        return '🗑️ All objectives cleared';

      default:
        return '*🎯 Objective Commands*\n\n' +
          '`/objective add <description>`\n' +
          '`/objective list`\n' +
          '`/objective complete <id>`\n' +
          '`/objective clear`';
    }
  }

  private async handleReportCommand(args: string, jid: string, senderName: string): Promise<string> {
    const period = args || 'today';

    const systemContext = `You are AI James generating a status report via WhatsApp.
Generate a brief status report for ${period}.
Include: what you've been working on, accomplishments, blockers, next steps.
Use WhatsApp formatting: *bold*, _italic_.
Keep it concise and mobile-friendly.`;

    const response = await this.callAIJames(
      [{ role: 'user', content: `Generate a status report for ${period}` }],
      senderName,
      systemContext,
      true
    );

    return response.content || response.error || 'Unable to generate report';
  }

  // ==================== WEB & MEDIA HANDLERS ====================

  private async handleWebCommand(args: string, jid: string, senderName: string): Promise<string> {
    const match = args.match(/^(\S+)(?:\s+(.*))?$/);
    if (!match) {
      return 'Usage: `/web <url> [question]`';
    }

    const [, url, question] = match;
    return await this.handleToolCommand('web_fetch', {
      url,
      prompt: question || 'Summarize the main content'
    }, jid, senderName);
  }

  private async handleImageCommand(args: string, jid: string, senderName: string): Promise<string | null> {
    if (!args.trim()) {
      return '*🖼️ Image Generation*\n\nUsage: `/image <prompt>`\n\nExample: `/image a futuristic city at sunset`';
    }

    await this.connection.sendMessage(jid,
      '🎨 *Generating image...*\n\n' +
      `Prompt: _"${args}"_\n\n` +
      '_This may take 15-30 seconds._'
    );

    try {
      const response = await fetch(`${this.config.apiUrl}/api/image-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: args }),
        signal: AbortSignal.timeout(60000),
      });

      if (!response.ok) {
        return '❌ Image generation failed. Service may be unavailable.';
      }

      const result = await response.json();
      if (result.url) {
        await this.connection.sendImage(jid, result.url, `🖼️ _"${args}"_`);
        return null;
      }
      return '❌ No image generated';
    } catch (error) {
      return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async handleCanvasCommand(args: string, jid: string, senderName: string): Promise<string> {
    const [action, ...rest] = args.split(' ');
    const restArgs = rest.join(' ');

    switch (action?.toLowerCase()) {
      case 'list':
        return await this.handleToolCommand('list_canvases', {}, jid, senderName);
      case 'create':
        const [canvasType, ...nameParts] = restArgs.split(' - ');
        return await this.handleToolCommand('create_canvas', {
          type: canvasType?.trim() || 'freeform',
          name: nameParts.join(' - ').trim()
        }, jid, senderName);
      case 'open':
        return await this.handleToolCommand('open_canvas', { canvasId: restArgs }, jid, senderName);
      default:
        return '*🎨 Canvas Commands*\n\n' +
          '`/canvas list`\n' +
          '`/canvas create <type> - <name>`\n' +
          '`/canvas open <canvas_id>`';
    }
  }

  // ==================== MESSAGING HANDLERS ====================

  private async handleContactsCommand(args: string, jid: string): Promise<string> {
    const [action, ...rest] = args.split(' ');

    switch (action?.toLowerCase()) {
      case 'list':
        return `📒 *Contacts*\n\n_Contact list coming soon._`;
      case 'add':
        return `➕ *Add Contact*\n\n_Feature coming soon._`;
      case 'remove':
        return `➖ *Remove Contact*\n\n_Feature coming soon._`;
      default:
        return '*📒 Contact Commands*\n\n' +
          '`/contacts list`\n' +
          '`/contacts add <phone> <name>`\n' +
          '`/contacts remove <name>`';
    }
  }

  private async handleBroadcastCommand(args: string, jid: string): Promise<string> {
    return '📢 *Broadcast*\n\n_Broadcast feature coming soon._';
  }

  private async handleGenerateCommand(args: string, jid: string, senderName: string): Promise<string | null> {
    const match = args.match(/^(\S+)\s+(.+)$/);
    if (!match) {
      return '*🎨 Generate Content*\n\n' +
        'Usage: `/generate <type> <prompt>`\n\n' +
        '*Types:* music, image, video\n\n' +
        '*Examples:*\n' +
        '• `/generate music chill lo-fi beat`\n' +
        '• `/generate image sunset over ocean`';
    }

    const [, type, prompt] = match;

    switch (type.toLowerCase()) {
      case 'music':
        await this.handleMusic(prompt, jid);
        return null;
      case 'image':
        return await this.handleImageCommand(prompt, jid, senderName);
      case 'video':
        return '🎬 *Video generation* coming soon!';
      default:
        return `❓ Unknown type: ${type}. Use music, image, or video.`;
    }
  }

  private async handleMusic(args: string, jid: string): Promise<void> {
    if (!args.trim()) {
      await this.connection.sendMessage(
        jid,
        '*🎵 Music Generation*\n\n' +
          'Usage: `/music <prompt>`\n\n' +
          '*Examples:*\n' +
          '• `/music chill lo-fi beats for studying`\n' +
          '• `/music epic orchestral trailer music`\n' +
          '• `/music 90s hip hop with jazzy samples`\n\n' +
          "_Generation takes 30-90 seconds depending on length._"
      );
      return;
    }

    // Send initial status
    await this.connection.sendMessage(
      jid,
      '🎵 *Generating music...*\n\n' +
        `Prompt: _"${args}"_\n\n` +
        "_This may take 30-90 seconds. I'll send the track when it's ready._"
    );

    try {
      // Call music generation API (handles polling internally, returns when complete)
      // Longer timeout since API does its own polling (up to 5 minutes)
      const response = await fetch(`${this.config.apiUrl}/api/music/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: args,
          duration: 30, // Default 30 seconds
          format: 'mp3',
        }),
        signal: AbortSignal.timeout(330000), // 5.5 minute timeout (API polls for max 5 min)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Handler] Music generation error:', response.status, errorData);

        // Provide helpful error messages based on status
        let userMessage = '❌ *Music generation failed*\n\n';

        if (response.status === 503) {
          userMessage += 'The music generation service is not configured or unavailable.\n\n';
          userMessage += '_Tip: Make sure Lynkr tunnel URL and API key are configured in /settings/ai_';
        } else if (response.status === 429) {
          userMessage += 'Rate limit exceeded. You can generate up to 10 tracks per hour.\n\n';
          userMessage += `_Try again in ${errorData.retryAfter || 60} seconds_`;
        } else if (response.status === 500) {
          userMessage += 'Music generation service encountered an error.\n\n';
          userMessage += '_Tip: Make sure Lynkr and ACE-Step are running locally._';
        } else {
          userMessage += `Error: ${errorData.error || 'Unknown error'}\n\n`;
          userMessage += '_Please check that the music generation service is running._';
        }

        await this.connection.sendMessage(jid, userMessage);
        return;
      }

      const result = await response.json();

      // Check response status
      if (result.status === 'failed') {
        await this.connection.sendMessage(
          jid,
          '❌ *Music generation failed*\n\n' +
            `The generation encountered an error.\n\n` +
            '_Try a different prompt or shorter duration._'
        );
        return;
      }

      // Handle successful generation
      if (result.audioUrl) {
        // Download the audio file from URL
        console.log(`[Handler] Downloading audio from: ${result.audioUrl}`);
        const audioResponse = await fetch(result.audioUrl);

        if (!audioResponse.ok) {
          throw new Error(`Failed to download audio: ${audioResponse.status}`);
        }

        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
        console.log(`[Handler] Downloaded ${audioBuffer.length} bytes`);

        // Send as audio file with metadata
        await this.connection.sendAudioFile(jid, audioBuffer, {
          filename: `ai-james-${Date.now()}.mp3`,
          caption:
            `🎵 *${result.title || 'Generated Track'}*\n\n` +
            `Prompt: _"${args}"_\n` +
            `Duration: ${result.duration}s\n` +
            `BPM: ${result.metadata?.bpm || 'Unknown'}\n` +
            `Key: ${result.metadata?.key || 'Unknown'}\n\n` +
            '_Generated by AI James using ACE-Step_',
        });

        console.log('[Handler] Audio file sent successfully');
      } else if (result.audioBase64) {
        // Handle base64-encoded audio
        console.log('[Handler] Processing base64 audio data');
        const audioBuffer = Buffer.from(result.audioBase64, 'base64');

        await this.connection.sendAudioFile(jid, audioBuffer, {
          filename: `ai-james-${Date.now()}.mp3`,
          caption:
            `🎵 *${result.title || 'Generated Track'}*\n\n` +
            `Prompt: _"${args}"_\n\n` +
            '_Generated by AI James using ACE-Step_',
        });

        console.log('[Handler] Audio file sent successfully');
      } else {
        throw new Error('No audio data in response (missing audioUrl and audioBase64)');
      }
    } catch (error) {
      console.error('[Handler] Music generation error:', error);

      let errorMessage = '❌ *Music generation failed*\n\n';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += 'Generation timed out after 5 minutes.\n\n';
          errorMessage += '_Try a simpler prompt or shorter duration._';
        } else {
          errorMessage += `Error: ${error.message}\n\n`;
          errorMessage += '_Please check that the music generation service is running._';
        }
      } else {
        errorMessage += 'An unexpected error occurred.\n\n';
        errorMessage += '_Please try again later._';
      }

      await this.connection.sendMessage(jid, errorMessage);
    }
  }

  private async handleSend(args: string, jid: string, senderPhone: string): Promise<void> {
    // Only owner can send messages to others
    const accessLevel = this.getUserAccessLevel(senderPhone);
    if (accessLevel !== 'owner') {
      await this.connection.sendMessage(jid,
        '⛔ *Access Denied*\n\nOnly the owner can send messages to other contacts.'
      );
      return;
    }

    // Parse: /send <contact> <message>
    const match = args.match(/^(\S+)\s+(.+)$/s);
    if (!match) {
      await this.connection.sendMessage(jid,
        '*📤 Send Message*\n\n' +
        'Usage: `/send <contact> <message>`\n\n' +
        '*Examples:*\n' +
        '• `/send Mom Happy birthday!`\n' +
        '• `/send +14155551234 Hello!`\n' +
        '• `/send John Meeting at 3pm?`\n\n' +
        '_Contact can be a name (from contacts) or phone number._'
      );
      return;
    }

    const [, contactIdentifier, message] = match;

    try {
      // Look up contact by name or phone number
      const response = await fetch(`${this.config.apiUrl}/api/whatsapp/resolve-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: contactIdentifier }),
      });

      if (!response.ok) {
        // If no API exists yet, try to use the identifier as a phone number
        const phoneNumber = this.normalizePhoneNumber(contactIdentifier);
        if (!phoneNumber) {
          await this.connection.sendMessage(jid,
            `❌ *Contact not found*\n\nCouldn't find "${contactIdentifier}".\n\n_Use a phone number (e.g., +14155551234) or add them to your contacts first._`
          );
          return;
        }

        // Send directly to the phone number
        await this.sendToContact(jid, phoneNumber, message, contactIdentifier);
        return;
      }

      const { phoneNumber, displayName } = await response.json();
      await this.sendToContact(jid, phoneNumber, message, displayName);

    } catch (error) {
      console.error('[Handler] Send error:', error);
      await this.connection.sendMessage(jid,
        '❌ *Failed to send*\n\n' +
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private normalizePhoneNumber(input: string): string | null {
    // Remove all non-digits except leading +
    const cleaned = input.replace(/[^\d+]/g, '');

    // Handle different formats
    if (cleaned.startsWith('+')) {
      const digits = cleaned.slice(1);
      if (digits.length >= 10 && digits.length <= 15) {
        return digits; // Return without +
      }
    } else if (cleaned.length >= 10 && cleaned.length <= 15) {
      return cleaned;
    }

    return null;
  }

  private async sendToContact(ownerJid: string, phoneNumber: string, message: string, displayName: string): Promise<void> {
    const targetJid = `${phoneNumber}@s.whatsapp.net`;

    // Confirm before sending
    await this.connection.sendMessage(ownerJid,
      `📤 *Sending to ${displayName}*\n\n` +
      `Message: _"${message}"_\n\n` +
      `_Sending..._`
    );

    try {
      // Send the message
      await this.connection.sendMessage(targetJid, message);

      // Confirm success
      await this.connection.sendMessage(ownerJid,
        `✅ *Message sent to ${displayName}*`
      );

      // Log the outbound message
      console.log(`[Handler] Owner sent message to ${phoneNumber}: ${message.substring(0, 50)}...`);
    } catch (error) {
      console.error('[Handler] Failed to send to contact:', error);
      await this.connection.sendMessage(ownerJid,
        `❌ *Failed to send to ${displayName}*\n\n` +
        `Error: ${error instanceof Error ? error.message : 'Delivery failed'}`
      );
    }
  }
}
