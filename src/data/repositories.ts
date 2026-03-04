/**
 * Repository Data
 *
 * Curated collection of open source repositories for building intelligent applications.
 */

export type RepositoryCategory =
  | 'ai-ml'
  | 'voice'
  | 'memory'
  | 'agents'
  | 'ui-ux'
  | 'backend'
  | 'devtools';

export interface Repository {
  id: string;
  name: string;
  description: string;
  author: string;
  url: string;
  category: RepositoryCategory;
  stars?: number;
  language?: string;
  tags?: string[];
}

export const CATEGORY_INFO: Record<RepositoryCategory, { label: string; icon: string; color: string }> = {
  'ai-ml': { label: 'AI/ML', icon: 'brain', color: 'hsl(280 70% 50%)' },
  'voice': { label: 'Voice', icon: 'mic', color: 'hsl(200 70% 50%)' },
  'memory': { label: 'Memory', icon: 'database', color: 'hsl(150 70% 40%)' },
  'agents': { label: 'Agents', icon: 'bot', color: 'hsl(35 90% 50%)' },
  'ui-ux': { label: 'UI/UX', icon: 'palette', color: 'hsl(320 70% 50%)' },
  'backend': { label: 'Backend', icon: 'server', color: 'hsl(220 70% 50%)' },
  'devtools': { label: 'DevTools', icon: 'wrench', color: 'hsl(0 0% 50%)' },
};

export const repositories: Repository[] = [
  // AI/ML
  {
    id: 'fastrender',
    name: 'FastRender',
    description: 'AI-built browser from scratch. 3M+ lines of Rust with HTML parsing, CSS cascade, layout, and custom JS VM. Built by GPT-5.2 agents in one week.',
    author: 'Wilson Lin / Cursor',
    url: 'https://github.com/wilsonzlin/fastrender',
    category: 'ai-ml',
    language: 'Rust',
    tags: ['browser', 'rendering', 'agents', 'experiment'],
  },
  {
    id: 'openai-whisper',
    name: 'Whisper',
    description: 'Robust speech recognition via large-scale weak supervision. General-purpose speech recognition model.',
    author: 'OpenAI',
    url: 'https://github.com/openai/whisper',
    category: 'ai-ml',
    language: 'Python',
    tags: ['speech', 'transcription', 'asr'],
  },
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Building applications with LLMs through composability. Framework for developing language model applications.',
    author: 'LangChain',
    url: 'https://github.com/langchain-ai/langchain',
    category: 'ai-ml',
    language: 'Python',
    tags: ['llm', 'framework', 'chains'],
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    description: 'Port of Facebook\'s LLaMA model in C/C++. Run LLMs locally with minimal dependencies.',
    author: 'Georgi Gerganov',
    url: 'https://github.com/ggerganov/llama.cpp',
    category: 'ai-ml',
    language: 'C++',
    tags: ['llm', 'inference', 'local'],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Get up and running with large language models locally. Simple way to run LLMs on your machine.',
    author: 'Ollama',
    url: 'https://github.com/ollama/ollama',
    category: 'ai-ml',
    language: 'Go',
    tags: ['llm', 'local', 'inference'],
  },
  {
    id: 'transformers',
    name: 'Transformers',
    description: 'State-of-the-art machine learning for PyTorch, TensorFlow, and JAX. Thousands of pretrained models.',
    author: 'Hugging Face',
    url: 'https://github.com/huggingface/transformers',
    category: 'ai-ml',
    language: 'Python',
    tags: ['models', 'nlp', 'pretrained'],
  },

  // Voice
  {
    id: 'livekit-agents',
    name: 'LiveKit Agents',
    description: 'Powerful framework for building realtime voice AI agents. Powers ChatGPT Advanced Voice Mode.',
    author: 'LiveKit',
    url: 'https://github.com/livekit/agents',
    category: 'voice',
    language: 'Python',
    tags: ['voice-ai', 'realtime', 'webrtc', 'agents'],
  },
  {
    id: 'piper',
    name: 'Piper',
    description: 'Fast, local neural text to speech system. High-quality TTS that runs entirely offline.',
    author: 'Rhasspy',
    url: 'https://github.com/rhasspy/piper',
    category: 'voice',
    language: 'C++',
    tags: ['tts', 'speech-synthesis', 'local'],
  },
  {
    id: 'coqui-tts',
    name: 'Coqui TTS',
    description: 'Deep learning toolkit for text-to-speech. Battle-tested in research and production.',
    author: 'Coqui',
    url: 'https://github.com/coqui-ai/TTS',
    category: 'voice',
    language: 'Python',
    tags: ['tts', 'deep-learning', 'voice-cloning'],
  },
  {
    id: 'faster-whisper',
    name: 'Faster Whisper',
    description: 'Faster Whisper transcription with CTranslate2. Up to 4x faster than openai/whisper.',
    author: 'SYSTRAN',
    url: 'https://github.com/SYSTRAN/faster-whisper',
    category: 'voice',
    language: 'Python',
    tags: ['asr', 'transcription', 'fast'],
  },
  {
    id: 'silero-vad',
    name: 'Silero VAD',
    description: 'Enterprise-grade voice activity detection. Pre-trained models for real-time VAD.',
    author: 'Silero',
    url: 'https://github.com/snakers4/silero-vad',
    category: 'voice',
    language: 'Python',
    tags: ['vad', 'speech-detection', 'real-time'],
  },

  // Memory
  {
    id: 'chroma',
    name: 'Chroma',
    description: 'The AI-native open-source embedding database. Simple, fast, and feature-rich vector store.',
    author: 'Chroma',
    url: 'https://github.com/chroma-core/chroma',
    category: 'memory',
    language: 'Python',
    tags: ['vector-db', 'embeddings', 'rag'],
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    description: 'High-performance vector similarity search engine. Built with Rust for speed and reliability.',
    author: 'Qdrant',
    url: 'https://github.com/qdrant/qdrant',
    category: 'memory',
    language: 'Rust',
    tags: ['vector-db', 'search', 'rust'],
  },
  {
    id: 'milvus',
    name: 'Milvus',
    description: 'Cloud-native vector database for scalable similarity search. Handles billion-scale vectors.',
    author: 'Zilliz',
    url: 'https://github.com/milvus-io/milvus',
    category: 'memory',
    language: 'Go',
    tags: ['vector-db', 'distributed', 'scale'],
  },
  {
    id: 'pgvector',
    name: 'pgvector',
    description: 'Open-source vector similarity search for Postgres. Add vector capabilities to your existing database.',
    author: 'pgvector',
    url: 'https://github.com/pgvector/pgvector',
    category: 'memory',
    language: 'C',
    tags: ['postgres', 'vector-db', 'extension'],
  },

  // Agents
  {
    id: 'bmad-method',
    name: 'BMAD-METHOD',
    description: 'Breakthrough Method for Agile AI-Driven Development. 21 specialized agents, 50+ workflows, scale-adaptive intelligence.',
    author: 'BMAD',
    url: 'https://github.com/bmad-code-org/BMAD-METHOD',
    category: 'agents',
    language: 'TypeScript',
    tags: ['agile', 'development', 'workflow', 'methodology'],
  },
  {
    id: 'autogen',
    name: 'AutoGen',
    description: 'Enable next-gen large language model applications. Multi-agent conversation framework.',
    author: 'Microsoft',
    url: 'https://github.com/microsoft/autogen',
    category: 'agents',
    language: 'Python',
    tags: ['multi-agent', 'conversation', 'llm'],
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    description: 'Framework for orchestrating role-playing autonomous AI agents. Build collaborative AI crews.',
    author: 'CrewAI',
    url: 'https://github.com/crewAIInc/crewAI',
    category: 'agents',
    language: 'Python',
    tags: ['multi-agent', 'orchestration', 'roles'],
  },
  {
    id: 'letta',
    name: 'Letta (MemGPT)',
    description: 'Create LLM agents with long-term memory and custom tools. Build stateful AI assistants.',
    author: 'Letta',
    url: 'https://github.com/letta-ai/letta',
    category: 'agents',
    language: 'Python',
    tags: ['memory', 'stateful', 'tools'],
  },
  {
    id: 'agentops',
    name: 'AgentOps',
    description: 'Python SDK for agent monitoring, debugging, and optimization. Observability for AI agents.',
    author: 'AgentOps',
    url: 'https://github.com/AgentOps-AI/agentops',
    category: 'agents',
    language: 'Python',
    tags: ['monitoring', 'debugging', 'observability'],
  },

  // UI/UX
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS. Copy and paste into your apps.',
    author: 'shadcn',
    url: 'https://github.com/shadcn-ui/ui',
    category: 'ui-ux',
    language: 'TypeScript',
    tags: ['components', 'tailwind', 'radix'],
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    description: 'Production-ready animation library for React. Simple declarative syntax for complex animations.',
    author: 'Framer',
    url: 'https://github.com/framer/motion',
    category: 'ui-ux',
    language: 'TypeScript',
    tags: ['animation', 'react', 'gestures'],
  },
  {
    id: 'radix-ui',
    name: 'Radix UI',
    description: 'Unstyled, accessible UI components for React. Build high-quality design systems.',
    author: 'Radix',
    url: 'https://github.com/radix-ui/primitives',
    category: 'ui-ux',
    language: 'TypeScript',
    tags: ['components', 'accessible', 'headless'],
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapid UI development. Build modern websites fast.',
    author: 'Tailwind Labs',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    category: 'ui-ux',
    language: 'TypeScript',
    tags: ['css', 'utility', 'framework'],
  },

  // Backend
  {
    id: 'convex',
    name: 'Convex',
    description: 'The fullstack TypeScript development platform. Reactive database with real-time sync.',
    author: 'Convex',
    url: 'https://github.com/get-convex/convex-backend',
    category: 'backend',
    language: 'Rust',
    tags: ['database', 'realtime', 'typescript'],
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'The open source Firebase alternative. Postgres database with auth, storage, and more.',
    author: 'Supabase',
    url: 'https://github.com/supabase/supabase',
    category: 'backend',
    language: 'TypeScript',
    tags: ['baas', 'postgres', 'auth'],
  },
  {
    id: 'drizzle-orm',
    name: 'Drizzle ORM',
    description: 'TypeScript ORM that lets you forget you are using an ORM. Type-safe and lightweight.',
    author: 'Drizzle Team',
    url: 'https://github.com/drizzle-team/drizzle-orm',
    category: 'backend',
    language: 'TypeScript',
    tags: ['orm', 'typescript', 'sql'],
  },
  {
    id: 'hono',
    name: 'Hono',
    description: 'Small, simple, and ultrafast web framework for the Edges. Works everywhere.',
    author: 'Hono',
    url: 'https://github.com/honojs/hono',
    category: 'backend',
    language: 'TypeScript',
    tags: ['web-framework', 'edge', 'fast'],
  },

  // DevTools
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Anthropic\'s official CLI for Claude. Agentic coding assistant for the terminal.',
    author: 'Anthropic',
    url: 'https://github.com/anthropics/claude-code',
    category: 'devtools',
    language: 'TypeScript',
    tags: ['cli', 'ai', 'coding'],
  },
  {
    id: 'anthropic-skills',
    name: 'Agent Skills',
    description: 'Official Anthropic skills repository. Teach Claude to complete specialized tasks in a repeatable way.',
    author: 'Anthropic',
    url: 'https://github.com/anthropics/skills',
    category: 'devtools',
    language: 'Markdown',
    tags: ['skills', 'claude', 'automation', 'workflows'],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'The open source AI coding agent. Provider-agnostic, TUI-focused, with MCP and LSP support.',
    author: 'SST',
    url: 'https://github.com/sst/opencode',
    category: 'devtools',
    language: 'Go',
    tags: ['cli', 'ai', 'coding', 'terminal'],
  },
  {
    id: 'mcp-servers',
    name: 'MCP Servers',
    description: 'Official Model Context Protocol servers. Give LLMs secure access to tools and data sources.',
    author: 'MCP',
    url: 'https://github.com/modelcontextprotocol/servers',
    category: 'devtools',
    language: 'TypeScript',
    tags: ['mcp', 'protocol', 'tools', 'integration'],
  },
  {
    id: 'awesome-mcp-servers',
    name: 'Awesome MCP Servers',
    description: 'Curated list of MCP servers. Production-ready and experimental servers for AI integrations.',
    author: 'punkpeye',
    url: 'https://github.com/punkpeye/awesome-mcp-servers',
    category: 'devtools',
    language: 'Markdown',
    tags: ['mcp', 'awesome-list', 'tools'],
  },
  {
    id: 'awesome-claude-skills',
    name: 'Awesome Claude Skills',
    description: 'Curated list of Claude Skills and resources. 50+ skills across 9 categories.',
    author: 'travisvn',
    url: 'https://github.com/travisvn/awesome-claude-skills',
    category: 'devtools',
    language: 'Markdown',
    tags: ['skills', 'claude', 'awesome-list'],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'The AI-first code editor. Built for pair-programming with AI.',
    author: 'Cursor',
    url: 'https://github.com/getcursor/cursor',
    category: 'devtools',
    language: 'TypeScript',
    tags: ['editor', 'ai', 'ide'],
  },
  {
    id: 'vercel-ai',
    name: 'Vercel AI SDK',
    description: 'Build AI-powered applications with React, Svelte, Vue, and Node.js. Streaming and edge-ready.',
    author: 'Vercel',
    url: 'https://github.com/vercel/ai',
    category: 'devtools',
    language: 'TypeScript',
    tags: ['sdk', 'streaming', 'react'],
  },
  {
    id: 'litellm',
    name: 'LiteLLM',
    description: 'Call 100+ LLM APIs in OpenAI format. Unified interface for all language models.',
    author: 'BerriAI',
    url: 'https://github.com/BerriAI/litellm',
    category: 'devtools',
    language: 'Python',
    tags: ['llm', 'api', 'unified'],
  },
];

export function getRepositoriesByCategory(category: RepositoryCategory): Repository[] {
  return repositories.filter(repo => repo.category === category);
}

export function searchRepositories(query: string): Repository[] {
  const lowerQuery = query.toLowerCase();
  return repositories.filter(repo =>
    repo.name.toLowerCase().includes(lowerQuery) ||
    repo.description.toLowerCase().includes(lowerQuery) ||
    repo.author.toLowerCase().includes(lowerQuery) ||
    repo.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAllCategories(): RepositoryCategory[] {
  return Object.keys(CATEGORY_INFO) as RepositoryCategory[];
}
