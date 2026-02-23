// 8gent Skills System
// Skills are specialized capabilities that 8gent can invoke

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  commands: SkillCommand[];
  enabled: boolean;
}

export interface SkillCommand {
  name: string;
  description: string;
  syntax: string;
  examples: string[];
}

// Browser Automation Skill
export const browserAutomationSkill: Skill = {
  id: 'browser-automation',
  name: 'Browser Automation',
  description: 'Control headless browsers to navigate, interact, and extract data from web pages',
  icon: 'Globe',
  enabled: true,
  commands: [
    {
      name: 'open',
      description: 'Navigate to a URL',
      syntax: 'agent-browser open <url>',
      examples: [
        'agent-browser open https://example.com',
        'agent-browser open http://localhost:3000',
      ],
    },
    {
      name: 'snapshot',
      description: 'Get accessibility tree with element refs for AI interaction',
      syntax: 'agent-browser snapshot',
      examples: ['agent-browser snapshot'],
    },
    {
      name: 'click',
      description: 'Click an element by ref or selector',
      syntax: 'agent-browser click <selector>',
      examples: [
        'agent-browser click @e2',
        'agent-browser click "#submit"',
        'agent-browser click "text=Sign In"',
      ],
    },
    {
      name: 'fill',
      description: 'Clear and fill an input field',
      syntax: 'agent-browser fill <selector> <text>',
      examples: [
        'agent-browser fill @e3 "user@example.com"',
        'agent-browser fill "#email" "test@test.com"',
      ],
    },
    {
      name: 'screenshot',
      description: 'Take a screenshot of the page',
      syntax: 'agent-browser screenshot [path]',
      examples: [
        'agent-browser screenshot /tmp/page.png',
        'agent-browser screenshot --full',
      ],
    },
    {
      name: 'get',
      description: 'Get information from the page',
      syntax: 'agent-browser get <type> <selector>',
      examples: [
        'agent-browser get text ".title"',
        'agent-browser get url',
        'agent-browser get title',
      ],
    },
    {
      name: 'wait',
      description: 'Wait for elements or time',
      syntax: 'agent-browser wait <condition> [selector]',
      examples: [
        'agent-browser wait visible ".modal"',
        'agent-browser wait 2000',
      ],
    },
    {
      name: 'close',
      description: 'Close the browser session',
      syntax: 'agent-browser close',
      examples: ['agent-browser close'],
    },
  ],
};

// File System Skill
export const fileSystemSkill: Skill = {
  id: 'file-system',
  name: 'File System',
  description: 'Read, write, search, and manage files in the project',
  icon: 'FolderOpen',
  enabled: true,
  commands: [
    {
      name: 'read',
      description: 'Read file contents',
      syntax: 'cat <file_path>',
      examples: [
        'cat src/app/page.tsx',
        'cat -n src/components/Button.tsx',
        'head -n 50 README.md',
      ],
    },
    {
      name: 'write',
      description: 'Write content to a file',
      syntax: 'echo "content" > <file_path>',
      examples: [
        'echo "Hello" > test.txt',
        'cat << EOF > file.ts\ncode\nEOF',
      ],
    },
    {
      name: 'list',
      description: 'List directory contents',
      syntax: 'ls -la <path>',
      examples: [
        'ls -la src/',
        'ls -lah src/components/',
      ],
    },
    {
      name: 'find',
      description: 'Find files by name pattern',
      syntax: 'find <path> -name "<pattern>"',
      examples: [
        'find src/ -name "*.tsx"',
        'find . -name "package.json"',
      ],
    },
    {
      name: 'search',
      description: 'Search file contents',
      syntax: 'grep -r "<pattern>" <path>',
      examples: [
        'grep -rn "useState" src/',
        'grep -r --include="*.ts" "export" src/',
      ],
    },
    {
      name: 'mkdir',
      description: 'Create directory',
      syntax: 'mkdir -p <path>',
      examples: [
        'mkdir -p src/features/new-feature',
        'mkdir -p src/components/ui',
      ],
    },
    {
      name: 'copy',
      description: 'Copy files or directories',
      syntax: 'cp <source> <destination>',
      examples: [
        'cp src/Button.tsx src/Button.backup.tsx',
        'cp -r src/components src/components-backup',
      ],
    },
    {
      name: 'move',
      description: 'Move or rename files',
      syntax: 'mv <source> <destination>',
      examples: [
        'mv old-name.ts new-name.ts',
        'mv src/file.ts src/lib/file.ts',
      ],
    },
  ],
};

// Product Lifecycle Skill (BMAD-METHOD + CCPM)
// Enables 8gent to orchestrate the full product development workflow
export const productLifecycleSkill: Skill = {
  id: 'product-lifecycle',
  name: 'Product Lifecycle',
  description: 'Orchestrate the full product development workflow from discovery through implementation. Based on BMAD-METHOD for PRDs and CCPM for parallel execution.',
  icon: 'Sparkles',
  enabled: true,
  commands: [
    {
      name: 'create_project',
      description: 'Create a new product project to contain PRDs, epics, and tickets',
      syntax: 'create_project <name> [description]',
      examples: [
        'create_project "Weather App" "A beautiful weather application"',
        'create_project "User Authentication"',
      ],
    },
    {
      name: 'create_prd',
      description: 'Create a Product Requirements Document following BMAD structure',
      syntax: 'create_prd <project_id> <title> [executive_summary]',
      examples: [
        'create_prd proj_123 "Authentication PRD" "User auth system with OAuth"',
      ],
    },
    {
      name: 'create_ticket',
      description: 'Create a Kanban ticket/story with optional user story format',
      syntax: 'create_ticket <project_id> <title> [--type story|bug|task] [--priority P0|P1|P2|P3]',
      examples: [
        'create_ticket proj_123 "Implement login form" --type story --priority P1',
        'create_ticket proj_123 "Fix auth redirect bug" --type bug --priority P0',
      ],
    },
    {
      name: 'update_ticket',
      description: 'Update a ticket status, priority, or content',
      syntax: 'update_ticket <ticket_id> [--status backlog|todo|in_progress|review|done] [--priority P0|P1|P2|P3]',
      examples: [
        'update_ticket ARC-001 --status in_progress',
        'update_ticket ARC-001 --status done',
      ],
    },
    {
      name: 'shard_prd',
      description: 'Convert PRD functional requirements into epics and tickets',
      syntax: 'shard_prd <prd_id> <project_id>',
      examples: [
        'shard_prd prd_123 proj_456',
      ],
    },
    {
      name: 'get_project_kanban',
      description: 'Display the Kanban board for a project',
      syntax: 'get_project_kanban <project_id>',
      examples: [
        'get_project_kanban proj_123',
      ],
    },
    {
      name: 'list_projects',
      description: 'List all product projects',
      syntax: 'list_projects [--status discovery|design|planning|building|launched]',
      examples: [
        'list_projects',
        'list_projects --status building',
      ],
    },
  ],
};

// Code Execution Skill
export const codeExecutionSkill: Skill = {
  id: 'code-execution',
  name: 'Code Execution',
  description: 'Run commands, scripts, builds, and tests',
  icon: 'Terminal',
  enabled: true,
  commands: [
    {
      name: 'npm-install',
      description: 'Install dependencies',
      syntax: 'npm install [package]',
      examples: [
        'npm install',
        'npm install react-query',
        'npm install -D typescript',
      ],
    },
    {
      name: 'npm-run',
      description: 'Run npm scripts',
      syntax: 'npm run <script>',
      examples: [
        'npm run dev',
        'npm run build',
        'npm run test',
      ],
    },
    {
      name: 'git',
      description: 'Git version control',
      syntax: 'git <command>',
      examples: [
        'git status',
        'git diff',
        'git add . && git commit -m "feat: add feature"',
        'git push origin main',
      ],
    },
    {
      name: 'exec',
      description: 'Execute shell command',
      syntax: '<command>',
      examples: [
        'node script.js',
        'npx tsc --noEmit',
        'curl https://api.example.com',
      ],
    },
  ],
};

// Registry of all available skills
export const skillRegistry: Skill[] = [
  browserAutomationSkill,
  fileSystemSkill,
  codeExecutionSkill,
  productLifecycleSkill,
];

// Get skill by ID
export function getSkill(id: string): Skill | undefined {
  return skillRegistry.find(skill => skill.id === id);
}

// Get all enabled skills
export function getEnabledSkills(): Skill[] {
  return skillRegistry.filter(skill => skill.enabled);
}

// Get skill commands as flat list
export function getAllCommands(): { skill: string; command: SkillCommand }[] {
  return skillRegistry.flatMap(skill =>
    skill.commands.map(command => ({
      skill: skill.id,
      command,
    }))
  );
}

// Skill execution types (for simulation in the UI)
export interface BrowserCommand {
  action: 'open' | 'snapshot' | 'click' | 'fill' | 'screenshot' | 'get' | 'wait' | 'close' | 'scroll' | 'press';
  target?: string;
  value?: string;
}

export interface FileCommand {
  action: 'read' | 'write' | 'list' | 'find' | 'search' | 'mkdir' | 'copy' | 'move' | 'delete';
  path: string;
  content?: string;
  destination?: string;
}

export interface ExecCommand {
  command: string;
  args?: string[];
  cwd?: string;
}

export function parseBrowserCommand(command: string): BrowserCommand | null {
  const parts = command.trim().split(/\s+/);

  if (parts[0] !== 'agent-browser' || parts.length < 2) {
    return null;
  }

  const action = parts[1] as BrowserCommand['action'];

  switch (action) {
    case 'open':
      return { action, target: parts[2] };
    case 'snapshot':
      return { action };
    case 'click':
      return { action, target: parts[2] };
    case 'fill':
      return { action, target: parts[2], value: parts.slice(3).join(' ').replace(/^"|"$/g, '') };
    case 'screenshot':
      return { action, target: parts[2] };
    case 'get':
      return { action, target: parts[2], value: parts[3] };
    case 'wait':
      return { action, target: parts[2], value: parts[3] };
    case 'close':
      return { action };
    case 'scroll':
      return { action, target: parts[2], value: parts[3] };
    case 'press':
      return { action, target: parts[2] };
    default:
      return null;
  }
}

export function parseFileCommand(command: string): FileCommand | null {
  const trimmed = command.trim();

  // cat command
  if (trimmed.startsWith('cat ')) {
    const path = trimmed.slice(4).trim().split(' ')[0];
    return { action: 'read', path };
  }

  // ls command
  if (trimmed.startsWith('ls ')) {
    const parts = trimmed.split(/\s+/);
    const path = parts[parts.length - 1];
    return { action: 'list', path };
  }

  // find command
  if (trimmed.startsWith('find ')) {
    const match = trimmed.match(/find\s+(\S+)/);
    if (match) {
      return { action: 'find', path: match[1] };
    }
  }

  // grep command
  if (trimmed.startsWith('grep ')) {
    const parts = trimmed.split(/\s+/);
    const path = parts[parts.length - 1];
    return { action: 'search', path };
  }

  // mkdir command
  if (trimmed.startsWith('mkdir ')) {
    const path = trimmed.replace(/mkdir\s+(-p\s+)?/, '').trim();
    return { action: 'mkdir', path };
  }

  // cp command
  if (trimmed.startsWith('cp ')) {
    const parts = trimmed.replace(/cp\s+(-r\s+)?/, '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return { action: 'copy', path: parts[0], destination: parts[1] };
    }
  }

  // mv command
  if (trimmed.startsWith('mv ')) {
    const parts = trimmed.slice(3).trim().split(/\s+/);
    if (parts.length >= 2) {
      return { action: 'move', path: parts[0], destination: parts[1] };
    }
  }

  return null;
}

// Simulated browser state for UI
export interface SimulatedBrowserState {
  isOpen: boolean;
  currentUrl: string;
  title: string;
  elements: SimulatedElement[];
  screenshot?: string;
}

export interface SimulatedElement {
  ref: string;
  type: string;
  text: string;
  selector: string;
}

export function createInitialBrowserState(): SimulatedBrowserState {
  return {
    isOpen: false,
    currentUrl: '',
    title: '',
    elements: [],
  };
}

// Simulated file system state
export interface SimulatedFileSystemState {
  currentDir: string;
  files: Map<string, string>;
  openFiles: string[];
}

export function createInitialFileSystemState(): SimulatedFileSystemState {
  return {
    currentDir: '/home/user/project',
    files: new Map([
      ['src/app/page.tsx', 'export default function Home() { return <div>Hello</div>; }'],
      ['src/components/Button.tsx', 'export function Button({ children }) { return <button>{children}</button>; }'],
      ['package.json', '{ "name": "project", "version": "1.0.0" }'],
    ]),
    openFiles: [],
  };
}
