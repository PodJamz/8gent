// Command registry for Terminal Easter Egg
import {
  JAMES_LOGO_LARGE,
  WELCOME_BANNER,
  cowsay,
  NEOFETCH_TEMPLATE,
  SKILL_BAR,
  RESUME_ASCII,
  SUDO_RESPONSE,
  RM_RF_RESPONSE,
  FORTUNES,
} from './ascii-art';
import { HACK_SEQUENCE, BOOT_SEQUENCE } from './effects';

export interface CommandResult {
  output: string | string[];
  clear?: boolean;
  navigate?: string;
  special?: 'matrix' | 'hack' | 'glitch' | 'boot';
  delay?: number;
}

export interface TerminalCommand {
  name: string;
  description: string;
  usage?: string;
  hidden?: boolean;
  action: (args: string[], context: CommandContext) => CommandResult;
}

export interface CommandContext {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  history: string[];
  theme?: string;
}

// Virtual filesystem structure
export const FILESYSTEM: Record<string, string[] | string> = {
  '/home/openclaw': ['about.txt', 'evolution.txt', 'systems/', 'blog/', '.secrets/', '.bashrc'],
  '/home/openclaw/systems': ['8gent.md', 'claw-ai.md', 'music-studio.md', 'prototyping.md'],
  '/home/openclaw/blog': ['experience-philosophy.md', 'building-ai-agents.md', 'design-systems.md'],
  '/home/openclaw/.secrets': ['themes.txt', 'konami.txt'],
};

export const FILE_CONTENTS: Record<string, string> = {
  '/home/openclaw/about.txt': `
┌─────────────────────────────────────────────────────┐
│                   ABOUT OPENCLAW                    │
│                 SYSTEMS ARCHITECTURE                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Welcome to 8gent, an AI-native workspace     │
│  designed for high-performance productivity and     │
│  agentic orchestration.                            │
│                                                     │
│  We believe AI should augment human creativity,      │
│  not replace it. This system is a vision of what   │
│  personal computing could become.                   │
│                                                     │
│  CORE CAPABILITIES:                                 │
│  → Multi-agent orchestration                        │
│  → Context-aware workspace management               │
│  → High-craft minimal design system                 │
│                                                     │
│  Let's build something amazing together!            │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  '/home/openclaw/evolution.txt': RESUME_ASCII,

  '/home/openclaw/.bashrc': `
# 8gent Terminal Configuration
# ─────────────────────────────

export PS1="guest@openclaw ~ $ "
export EDITOR="vim"
export THEME="claude"

# Aliases
alias ll='ls -la'
alias ..='cd ..'
alias cls='clear'
alias hack='echo "Nice try 😏"'

# Fun stuff
fortune | cowsay

# Welcome message
echo "Welcome back! Type 'neofetch' for system info."`,

  '/home/openclaw/.secrets/themes.txt': `
╔═══════════════════════════════════════════════════════╗
║              🎨 SECRET THEMES UNLOCKED 🎨             ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  You found the secret themes file!                    ║
║                                                       ║
║  Available secret themes:                             ║
║  → matrix    (unlock with: theme matrix)              ║
║  → hacker    (unlock with: theme hacker)              ║
║  → retro     (unlock with: theme retro)               ║
║                                                       ║
║  Visit /design to see all available themes.           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝`,

  '/home/openclaw/.secrets/konami.txt': `
↑ ↑ ↓ ↓ ← → ← → B A

You know the code. But can you enter it?`,

  '/home/openclaw/systems/openclaw.md': `
# 8gent

A personal operating system experience for the web.

Features:
- iOS-style home screen with drag-and-drop
- 25+ beautiful themes
- AI-powered assistant (8gent)
- Full-featured prototyping environment
- Music studio with stem separation

Status: In active development
Tech: Next.js 14, TypeScript, Tailwind, Convex`,

  '/home/openclaw/systems/claw-ai.md': `
# 8gent

Your personal AI assistant that lives in 8gent.

Features:
- Natural conversation interface
- Theme recommendations
- Navigation assistance
- Voice input/output
- Persistent chat history

Powered by: Claude (Anthropic)`,
};

// Helper to resolve path
const resolvePath = (currentPath: string, targetPath: string): string => {
  if (targetPath.startsWith('/')) return targetPath;
  if (targetPath === '..') {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/') || '/home/openclaw';
  }
  if (targetPath === '~') return '/home/openclaw';
  return currentPath + '/' + targetPath;
};

// Standard commands
export const commands: Record<string, TerminalCommand> = {
  help: {
    name: 'help',
    description: 'Show available commands',
    action: () => ({
      output: `
╔════════════════════════════════════════════════════════════════════╗
║                      AVAILABLE COMMANDS                            ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  NAVIGATION                                                        ║
║  ──────────                                                        ║
║  ls [path]          List directory contents                        ║
║  cd <path>          Change directory                               ║
║  pwd                Print working directory                        ║
║  cat <file>         Display file contents                          ║
║                                                                    ║
║  SYSTEM & WORKSPACE                                                ║
║  ──────────────────                                               ║
║  skills             Show technical capabilities                    ║
║  open <app>         Open an app (design, projects, music, etc.)    ║
║  whoami             Display current context                        ║
║                                                                    ║
║  SYSTEM                                                            ║
║  ──────                                                            ║
║  clear              Clear terminal screen                          ║
║  history            Show command history                           ║
║  echo <text>        Print text to terminal                         ║
║  date               Show current date/time                         ║
║  neofetch           Display system info with ASCII art             ║
║                                                                    ║
║  Type a command to get started!                                    ║
║  Hint: There might be some hidden commands... 🤫                   ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝`,
    }),
  },

  ls: {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [path]',
    action: (args, context) => {
      const targetPath = args[0]
        ? resolvePath(context.currentPath, args[0])
        : context.currentPath;

      const contents = FILESYSTEM[targetPath];
      if (!contents) {
        return { output: `ls: cannot access '${args[0] || targetPath}': No such file or directory` };
      }

      if (typeof contents === 'string') {
        return { output: contents };
      }

      const formatted = contents.map(item => {
        if (item.endsWith('/')) {
          return `\x1b[34m${item}\x1b[0m`; // Blue for directories
        }
        if (item.startsWith('.')) {
          return `\x1b[90m${item}\x1b[0m`; // Gray for hidden files
        }
        return item;
      });

      return { output: formatted.join('  ') };
    },
  },

  cd: {
    name: 'cd',
    description: 'Change directory',
    usage: 'cd <path>',
    action: (args, context) => {
      if (!args[0]) {
        context.setCurrentPath('/home/openclaw');
        return { output: '' };
      }

      const targetPath = resolvePath(context.currentPath, args[0]);

      if (FILESYSTEM[targetPath] || targetPath === '/home/openclaw') {
        context.setCurrentPath(targetPath);
        return { output: '' };
      }

      return { output: `cd: ${args[0]}: No such file or directory` };
    },
  },

  pwd: {
    name: 'pwd',
    description: 'Print working directory',
    action: (_, context) => ({
      output: context.currentPath,
    }),
  },

  cat: {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat <file>',
    action: (args, context) => {
      if (!args[0]) {
        return { output: 'cat: missing operand' };
      }

      const filePath = resolvePath(context.currentPath, args[0]);
      const content = FILE_CONTENTS[filePath];

      if (content) {
        return { output: content };
      }

      // Check if it's a directory
      if (FILESYSTEM[filePath]) {
        return { output: `cat: ${args[0]}: Is a directory` };
      }

      return { output: `cat: ${args[0]}: No such file or directory` };
    },
  },

  clear: {
    name: 'clear',
    description: 'Clear terminal screen',
    action: () => ({
      output: '',
      clear: true,
    }),
  },

  whoami: {
    name: 'whoami',
    description: 'Display current user',
    action: () => ({
      output: 'guest',
    }),
  },

  history: {
    name: 'history',
    description: 'Show command history',
    action: (_, context) => {
      const historyOutput = context.history
        .slice(-20)
        .map((cmd, i) => `  ${(i + 1).toString().padStart(3)}  ${cmd}`)
        .join('\n');
      return { output: historyOutput || '  (no history)' };
    },
  },

  echo: {
    name: 'echo',
    description: 'Print text to terminal',
    usage: 'echo <text>',
    action: (args) => ({
      output: args.join(' '),
    }),
  },

  date: {
    name: 'date',
    description: 'Show current date/time',
    action: () => ({
      output: new Date().toString(),
    }),
  },

  skills: {
    name: 'skills',
    description: 'Show skill bars',
    action: () => ({
      output: `
╔══════════════════════════════════════════════════════════╗
║                    TECHNICAL SKILLS                      ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ${SKILL_BAR('TypeScript', 95)}     ║
║  ${SKILL_BAR('React/Next.js', 95)}     ║
║  ${SKILL_BAR('Node.js', 90)}     ║
║  ${SKILL_BAR('Python', 85)}     ║
║  ${SKILL_BAR('AI/ML', 80)}     ║
║  ${SKILL_BAR('System Design', 85)}     ║
║  ${SKILL_BAR('UI/UX Design', 80)}     ║
║  ${SKILL_BAR('DevOps', 75)}     ║
║  ${SKILL_BAR('PostgreSQL', 80)}     ║
║  ${SKILL_BAR('GraphQL', 85)}     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝`,
    }),
  },

  open: {
    name: 'open',
    description: 'Open an app',
    usage: 'open <app>',
    action: (args) => {
      const apps: Record<string, string> = {
        design: '/design',
        projects: '/projects',
        music: '/music',
        studio: '/studio',
        blog: '/blog',
        evolution: '/story',
        photos: '/photos',
        humans: '/humans',
        story: '/story',
        prototyping: '/prototyping',
        settings: '/settings',
        home: '/',
      };

      if (!args[0]) {
        return {
          output: `Usage: open <app>\n\nAvailable apps:\n${Object.keys(apps).map(a => `  → ${a}`).join('\n')}`
        };
      }

      const app = args[0].toLowerCase();
      if (apps[app]) {
        return {
          output: `Opening ${app}...`,
          navigate: apps[app],
        };
      }

      return { output: `open: ${args[0]}: Application not found` };
    },
  },

  neofetch: {
    name: 'neofetch',
    description: 'Display system info',
    action: (_, context) => ({
      output: NEOFETCH_TEMPLATE({
        os: '8gent v1.0.0',
        host: 'openclaw.io',
        kernel: 'React 18.2.0',
        uptime: '∞ days',
        shell: '/bin/zsh',
        theme: context.theme || 'claude',
        terminal: 'OpenClaw Terminal',
        cpu: 'Apple Silicon (simulated)',
        memory: '∞ GB available',
      }),
    }),
  },

  // Hidden/Easter egg commands
  hack: {
    name: 'hack',
    description: 'Hack the mainframe',
    hidden: true,
    action: () => ({
      output: HACK_SEQUENCE,
      special: 'hack',
      delay: 100,
    }),
  },

  matrix: {
    name: 'matrix',
    description: 'Enter the Matrix',
    hidden: true,
    action: () => ({
      output: 'Initiating Matrix mode...',
      special: 'matrix',
    }),
  },

  cowsay: {
    name: 'cowsay',
    description: 'Cow says moo',
    hidden: true,
    action: (args) => ({
      output: cowsay(args.join(' ') || 'Moo! 🐮'),
    }),
  },

  fortune: {
    name: 'fortune',
    description: 'Get a random fortune',
    hidden: true,
    action: () => ({
      output: `\n  "${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}"\n`,
    }),
  },

  sudo: {
    name: 'sudo',
    description: 'Execute as superuser',
    hidden: true,
    action: (args) => {
      if (args.join(' ').includes('rm -rf')) {
        return {
          output: RM_RF_RESPONSE,
          special: 'glitch',
        };
      }
      return { output: SUDO_RESPONSE };
    },
  },

  rm: {
    name: 'rm',
    description: 'Remove files',
    hidden: true,
    action: (args) => {
      if (args.join(' ').includes('-rf /')) {
        return {
          output: RM_RF_RESPONSE,
          special: 'glitch',
        };
      }
      return { output: 'rm: operation not permitted in demo mode' };
    },
  },

  welcome: {
    name: 'welcome',
    description: 'Show welcome banner',
    hidden: true,
    action: () => ({
      output: WELCOME_BANNER,
    }),
  },

  boot: {
    name: 'boot',
    description: 'Show boot sequence',
    hidden: true,
    action: () => ({
      output: BOOT_SEQUENCE,
      special: 'boot',
      delay: 50,
    }),
  },

  banner: {
    name: 'banner',
    description: 'Show ASCII banner',
    hidden: true,
    action: () => ({
      output: JAMES_LOGO_LARGE,
    }),
  },

  exit: {
    name: 'exit',
    description: 'Exit terminal',
    action: () => ({
      output: 'Goodbye! 👋\n\nRedirecting to home...',
      navigate: '/',
    }),
  },

  theme: {
    name: 'theme',
    description: 'Set terminal theme',
    hidden: true,
    action: (args) => {
      if (!args[0]) {
        return { output: 'Usage: theme <name>\n\nTry: theme matrix, theme hacker, theme retro' };
      }
      return {
        output: `Theme '${args[0]}' activated!\n\nVisit /design to explore all 25+ themes.`,
        navigate: '/design',
      };
    },
  },
};

// Parse and execute command
export const executeCommand = (
  input: string,
  context: CommandContext
): CommandResult => {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  const parts = trimmed.split(/\s+/);
  const cmdName = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Special case for sudo commands
  if (cmdName === 'sudo' && args[0]) {
    const fullCmd = args.join(' ');
    if (fullCmd.includes('rm -rf') || fullCmd.includes('su')) {
      return commands.sudo.action(args, context);
    }
    // Try to run the command after sudo
    const sudoCmd = commands[args[0]];
    if (sudoCmd) {
      return { output: SUDO_RESPONSE };
    }
  }

  const command = commands[cmdName];
  if (!command) {
    return {
      output: `Command not found: ${cmdName}\nType 'help' for available commands.`
    };
  }

  return command.action(args, context);
};

// Get command suggestions for autocomplete
export const getCommandSuggestions = (partial: string): string[] => {
  const visible = Object.values(commands).filter(cmd => !cmd.hidden);
  return visible
    .filter(cmd => cmd.name.startsWith(partial.toLowerCase()))
    .map(cmd => cmd.name);
};
