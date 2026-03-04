/**
 * WhatsApp Slash Command System
 *
 * Defines all available commands for AI James via WhatsApp.
 * Access levels: owner > collaborator > visitor
 */

export type AccessLevel = 'owner' | 'collaborator' | 'visitor';

export interface WhatsAppCommand {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  examples: string[];
  minAccessLevel: AccessLevel;
  handler: string; // Name of handler function
  category: 'general' | 'voice' | 'tools' | 'admin' | 'memory' | 'messaging';
  requiresArgs?: boolean;
}

export const WHATSAPP_COMMANDS: WhatsAppCommand[] = [
  // === GENERAL (All users) ===
  {
    name: 'help',
    aliases: ['h', '?'],
    description: 'Show available commands',
    usage: '/help [command]',
    examples: ['/help', '/help voice'],
    minAccessLevel: 'visitor',
    handler: 'handleHelp',
    category: 'general',
  },
  {
    name: 'status',
    aliases: ['s'],
    description: 'Show AI James status',
    usage: '/status',
    examples: ['/status'],
    minAccessLevel: 'visitor',
    handler: 'handleStatus',
    category: 'general',
  },

  // === VOICE (Collaborator+) ===
  {
    name: 'voice',
    aliases: ['v', 'speak'],
    description: 'Get response as voice message',
    usage: '/voice [message]',
    examples: ['/voice Tell me a joke', '/voice'],
    minAccessLevel: 'collaborator',
    handler: 'handleVoice',
    category: 'voice',
  },

  // === TOOLS (Collaborator+) ===
  {
    name: 'search',
    aliases: ['find'],
    description: 'Search James\'s portfolio',
    usage: '/search <query>',
    examples: ['/search React projects', '/search AI experience'],
    minAccessLevel: 'collaborator',
    handler: 'handleSearch',
    category: 'tools',
    requiresArgs: true,
  },
  {
    name: 'schedule',
    aliases: ['cal', 'book'],
    description: 'Check availability or book a meeting',
    usage: '/schedule [date/time]',
    examples: ['/schedule tomorrow', '/schedule next week'],
    minAccessLevel: 'collaborator',
    handler: 'handleSchedule',
    category: 'tools',
  },
  {
    name: 'weather',
    aliases: ['w'],
    description: 'Get weather information',
    usage: '/weather [location]',
    examples: ['/weather San Francisco', '/weather'],
    minAccessLevel: 'visitor',
    handler: 'handleWeather',
    category: 'tools',
  },

  // === MEMORY (Collaborator+) ===
  {
    name: 'remember',
    aliases: ['recall', 'mem'],
    description: 'Query AI James\'s memory',
    usage: '/remember <query>',
    examples: ['/remember our last conversation', '/remember preferences'],
    minAccessLevel: 'collaborator',
    handler: 'handleRemember',
    category: 'memory',
    requiresArgs: true,
  },

  // === ADMIN (Owner only) ===
  {
    name: 'skills',
    aliases: ['sk'],
    description: 'List available AI skills',
    usage: '/skills [category]',
    examples: ['/skills', '/skills creative'],
    minAccessLevel: 'owner',
    handler: 'handleSkills',
    category: 'admin',
  },
  {
    name: 'contacts',
    aliases: ['c'],
    description: 'Manage WhatsApp contacts',
    usage: '/contacts [add|remove|list]',
    examples: ['/contacts list', '/contacts add +1234567890 John'],
    minAccessLevel: 'owner',
    handler: 'handleContacts',
    category: 'admin',
  },
  {
    name: 'clear',
    aliases: [],
    description: 'Clear conversation context',
    usage: '/clear',
    examples: ['/clear'],
    minAccessLevel: 'owner',
    handler: 'handleClear',
    category: 'admin',
  },

  // === MESSAGING (Owner only) ===
  {
    name: 'send',
    aliases: ['msg', 'text'],
    description: 'Send message to a contact',
    usage: '/send <contact> <message>',
    examples: ['/send Mom Happy birthday!', '/send +1234567890 Hello'],
    minAccessLevel: 'owner',
    handler: 'handleSend',
    category: 'messaging',
    requiresArgs: true,
  },
  {
    name: 'broadcast',
    aliases: ['bc'],
    description: 'Send message to multiple contacts',
    usage: '/broadcast <group> <message>',
    examples: ['/broadcast family Happy holidays!'],
    minAccessLevel: 'owner',
    handler: 'handleBroadcast',
    category: 'messaging',
    requiresArgs: true,
  },

  // === BACKGROUND JOBS (Owner only) ===
  {
    name: 'generate',
    aliases: ['gen'],
    description: 'Generate content (music, video, image)',
    usage: '/generate <type> <prompt>',
    examples: ['/generate music chill lo-fi beat', '/generate image sunset over ocean'],
    minAccessLevel: 'owner',
    handler: 'handleGenerate',
    category: 'tools',
    requiresArgs: true,
  },
  {
    name: 'music',
    aliases: ['m', 'song', 'beat'],
    description: 'Generate music from a prompt',
    usage: '/music <prompt>',
    examples: [
      '/music chill lo-fi beats for studying',
      '/music epic orchestral trailer music',
      '/music 90s hip hop beat with jazzy samples',
    ],
    minAccessLevel: 'owner',
    handler: 'handleMusic',
    category: 'tools',
    requiresArgs: true,
  },
  {
    name: 'research',
    aliases: ['r'],
    description: 'Start a research task',
    usage: '/research <topic>',
    examples: ['/research latest AI developments', '/research competitor analysis'],
    minAccessLevel: 'owner',
    handler: 'handleResearch',
    category: 'tools',
    requiresArgs: true,
  },
  {
    name: 'build',
    aliases: ['create'],
    description: 'Build a feature or component',
    usage: '/build <description>',
    examples: ['/build new landing page', '/build API endpoint for users'],
    minAccessLevel: 'owner',
    handler: 'handleBuild',
    category: 'tools',
    requiresArgs: true,
  },

  // === DIRECT TOOL ACCESS (Owner only) ===
  {
    name: 'tool',
    aliases: ['t', 'run'],
    description: 'Execute any AI James tool directly',
    usage: '/tool <tool_name> [args as JSON]',
    examples: [
      '/tool list_projects',
      '/tool create_ticket {"title":"Fix bug"}',
      '/tool remember {"query":"last meeting"}',
    ],
    minAccessLevel: 'owner',
    handler: 'handleTool',
    category: 'tools',
    requiresArgs: true,
  },
  {
    name: 'tools',
    aliases: ['toollist'],
    description: 'List all available AI James tools',
    usage: '/tools [category]',
    examples: ['/tools', '/tools memory', '/tools coding'],
    minAccessLevel: 'collaborator',
    handler: 'handleToolsList',
    category: 'tools',
  },

  // === PROJECT MANAGEMENT (Owner only) ===
  {
    name: 'project',
    aliases: ['proj', 'p'],
    description: 'Create or manage projects',
    usage: '/project <create|list|kanban> [args]',
    examples: [
      '/project list',
      '/project create MyApp - A cool app idea',
      '/project kanban MyApp',
    ],
    minAccessLevel: 'owner',
    handler: 'handleProject',
    category: 'tools',
  },
  {
    name: 'ticket',
    aliases: ['task', 'issue'],
    description: 'Create or update tickets/tasks',
    usage: '/ticket <create|update|list> [args]',
    examples: [
      '/ticket create Fix login bug - users cant log in',
      '/ticket list todo',
      '/ticket update PROJ-001 status:done',
    ],
    minAccessLevel: 'owner',
    handler: 'handleTicket',
    category: 'tools',
    requiresArgs: true,
  },

  // === CODE & DEV (Owner only) ===
  {
    name: 'code',
    aliases: ['dev'],
    description: 'Execute coding tasks in sandbox',
    usage: '/code <action> [args]',
    examples: [
      '/code clone https://github.com/user/repo',
      '/code run npm test',
      '/code read src/index.ts',
    ],
    minAccessLevel: 'owner',
    handler: 'handleCode',
    category: 'tools',
    requiresArgs: true,
  },
  {
    name: 'git',
    aliases: [],
    description: 'Git operations',
    usage: '/git <status|diff|commit|push>',
    examples: ['/git status', '/git commit "feat: add login"', '/git push'],
    minAccessLevel: 'owner',
    handler: 'handleGit',
    category: 'tools',
    requiresArgs: true,
  },

  // === CRON & AUTOMATION (Owner only) ===
  {
    name: 'cron',
    aliases: ['schedule-job', 'job'],
    description: 'Manage scheduled jobs',
    usage: '/cron <list|create|toggle|delete> [args]',
    examples: [
      '/cron list',
      '/cron create "daily report" 0 9 * * *',
      '/cron toggle job_123',
    ],
    minAccessLevel: 'owner',
    handler: 'handleCron',
    category: 'admin',
  },

  // === PROACTIVE MODE (Owner only) ===
  {
    name: 'proactive',
    aliases: ['auto', 'autonomous'],
    description: 'Toggle AI James proactive mode',
    usage: '/proactive <on|off|status|interval>',
    examples: [
      '/proactive on',
      '/proactive off',
      '/proactive status',
      '/proactive interval 30',
    ],
    minAccessLevel: 'owner',
    handler: 'handleProactive',
    category: 'admin',
  },
  {
    name: 'objective',
    aliases: ['goal', 'mission'],
    description: 'Set objectives for AI James to work on',
    usage: '/objective <add|list|complete|clear> [description]',
    examples: [
      '/objective add Research competitors',
      '/objective list',
      '/objective complete 1',
    ],
    minAccessLevel: 'owner',
    handler: 'handleObjective',
    category: 'admin',
    requiresArgs: true,
  },
  {
    name: 'report',
    aliases: ['summary', 'sitrep'],
    description: 'Get AI James status report',
    usage: '/report [period]',
    examples: ['/report', '/report today', '/report week'],
    minAccessLevel: 'owner',
    handler: 'handleReport',
    category: 'admin',
  },

  // === WEB & RESEARCH (Collaborator+) ===
  {
    name: 'web',
    aliases: ['browse', 'fetch'],
    description: 'Fetch and analyze web content',
    usage: '/web <url> [question]',
    examples: [
      '/web https://example.com summarize this',
      '/web https://news.ycombinator.com top stories',
    ],
    minAccessLevel: 'collaborator',
    handler: 'handleWeb',
    category: 'tools',
    requiresArgs: true,
  },

  // === IMAGE GENERATION (Owner only) ===
  {
    name: 'image',
    aliases: ['img', 'picture'],
    description: 'Generate images from text',
    usage: '/image <prompt>',
    examples: [
      '/image a futuristic city at sunset',
      '/image minimalist logo for tech startup',
    ],
    minAccessLevel: 'owner',
    handler: 'handleImage',
    category: 'tools',
    requiresArgs: true,
  },

  // === CANVAS (Owner only) ===
  {
    name: 'canvas',
    aliases: ['design'],
    description: 'Create or manage design canvases',
    usage: '/canvas <create|list|open> [args]',
    examples: [
      '/canvas list',
      '/canvas create wireframe - homepage',
      '/canvas open canvas_123',
    ],
    minAccessLevel: 'owner',
    handler: 'handleCanvas',
    category: 'tools',
  },
];

// Helper functions
export function getCommandByName(name: string): WhatsAppCommand | undefined {
  const normalized = name.toLowerCase().replace(/^\//, '');
  return WHATSAPP_COMMANDS.find(
    cmd => cmd.name === normalized || cmd.aliases.includes(normalized)
  );
}

export function getCommandsForAccessLevel(level: AccessLevel): WhatsAppCommand[] {
  const accessOrder: AccessLevel[] = ['visitor', 'collaborator', 'owner'];
  const userLevelIndex = accessOrder.indexOf(level);

  return WHATSAPP_COMMANDS.filter(cmd => {
    const cmdLevelIndex = accessOrder.indexOf(cmd.minAccessLevel);
    return cmdLevelIndex <= userLevelIndex;
  });
}

export function formatHelpMessage(commands: WhatsAppCommand[], category?: string): string {
  let filtered = commands;
  if (category) {
    filtered = commands.filter(c => c.category === category);
  }

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, WhatsAppCommand[]>);

  let msg = '*🤖 AI James Commands*\n\n';

  for (const [cat, cmds] of Object.entries(grouped)) {
    msg += `*${cat.toUpperCase()}*\n`;
    for (const cmd of cmds) {
      const aliases = cmd.aliases.length ? ` (${cmd.aliases.join(', ')})` : '';
      msg += `/${cmd.name}${aliases} - ${cmd.description}\n`;
    }
    msg += '\n';
  }

  msg += '_Type /help <command> for details_';
  return msg;
}

export function formatCommandHelp(cmd: WhatsAppCommand): string {
  let msg = `*/${cmd.name}*\n`;
  msg += `${cmd.description}\n\n`;
  msg += `*Usage:* \`${cmd.usage}\`\n`;
  msg += `*Examples:*\n`;
  for (const ex of cmd.examples) {
    msg += `  • ${ex}\n`;
  }
  if (cmd.aliases.length) {
    msg += `\n*Aliases:* ${cmd.aliases.map(a => `/${a}`).join(', ')}`;
  }
  return msg;
}

export function parseCommand(text: string): { command: string; args: string } | null {
  if (!text.startsWith('/')) return null;

  const match = text.match(/^\/(\S+)(?:\s+(.*))?$/);
  if (!match) return null;

  return {
    command: match[1].toLowerCase(),
    args: (match[2] || '').trim(),
  };
}

export function validateCommand(
  cmd: WhatsAppCommand,
  args: string
): { valid: true } | { valid: false; error: string } {
  if (cmd.requiresArgs && !args) {
    return {
      valid: false,
      error: `*/${cmd.name}* requires arguments.\n\n*Usage:* ${cmd.usage}\n\n*Examples:*\n${cmd.examples.map(ex => `  • ${ex}`).join('\n')}`,
    };
  }

  return { valid: true };
}

export function getCommandsByCategory(category: string): WhatsAppCommand[] {
  return WHATSAPP_COMMANDS.filter(cmd => cmd.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(WHATSAPP_COMMANDS.map(cmd => cmd.category)));
}
