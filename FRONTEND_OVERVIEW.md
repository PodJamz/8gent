# 🦞 OpenClaw-OS Frontend Overview

## 📋 Executive Summary

**8gent** is an AI-native operating system interface that combines a professional **8gent Frontend** (abstracted from `jamesspalding.org`) with the **OpenClaw agentic backend**. This creates a powerful, standalone workspace designed for seamless human-AI collaboration.

### Key Achievements
- ✅ **Successfully integrated** OpenClaw WebSocket backend
- ✅ **Removed all Convex dependencies** and replaced with OpenClaw shim
- ✅ **59+ default apps** out of the box
- ✅ **Multi-provider AI** support (Ollama, OpenAI, Lynkr)
- ✅ **Recursive Memory Layer** (RLM) for context retention
- ✅ **BMAD Method** integration for product development
- ✅ **Beautiful iOS-style interface** with window management

---

## 🎨 Frontend Architecture

### Technology Stack
- **Framework**: Next.js 16 with Turbopack
- **UI Library**: React 19 with Server Components
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React hooks + OpenClaw reactive queries

### Core Components

#### 1. Desktop & Window Manager
- iOS-style home screen with app grid
- Draggable, resizable windows
- Minimize, maximize, close controls
- Multi-window support
- Dock with app shortcuts

#### 2. OpenClaw Integration (`/src/lib/openclaw`)
- **WebSocket Client** (`client-impl.ts`) - Connects to OpenClaw Gateway
- **React Hooks** (`hooks.ts`) - `useQuery` and `useMutation` for reactive data
- **Convex Shim** (`/src/lib/convex-shim.ts`) - Compatibility layer for legacy code
- **Protocol v3** - Latest OpenClaw protocol support

#### 3. AI Provider System
- **Local Providers**: Ollama, Lynkr (tunnel)
- **Cloud Providers**: OpenAI
- **Fallback Logic**: Automatic provider switching
- **Health Monitoring**: Real-time provider status
- **Settings UI**: `/settings/ai` for configuration

#### 4. Authentication
- **Single-User Mode**: Owner-only access
- **Passcode Protection**: For protected areas (Vault)
- **Session Management**: JWT-based sessions
- **Security Events**: Comprehensive audit logging

---

## 🚀 Default Apps (59+)

See [APPS.md](./APPS.md) for the complete list. Highlights include:

### Core System (5 apps)
- Agent, Chat, Terminal, Settings, Browser

### Productivity (10 apps)
- Notes, Calendar, Reminders, Contacts, Journal, Product, Projects, Research, Wiki, Resume

### Creative (8 apps)
- Canvas, Design, Mockit, Prototyping, 3D Gallery, Avatar, CoWrite, Photos

### Media (5 apps)
- Music (Jamz), Video, Reels, Watch, Photos

### Developer (5 apps)
- Studio, System, Operations, Security, Terminal

### Communication (5 apps)
- Messages, Threads, Meet, ClubSpaces, Humans

### AI & Memory (3 apps)
- Memory (RLM), Neuro, Discovery

### Specialized (18+ apps)
- Booking, Food, Weather, Regulate, Vault, ERV, Blog, Games, and more

---

## 🔧 Recent Integration Work

### What Was Done
1. **Replaced Convex Backend** with OpenClaw
   - Created comprehensive shim layer (`convex-shim.ts`)
   - Updated all API routes to use shim
   - Migrated hooks to OpenClaw WebSocket client

2. **Fixed Build Issues**
   - Resolved all module import errors
   - Updated 13+ API route files
   - Fixed operations components (Security Scanner, Activity Timeline, etc.)
   - Build now completes successfully

3. **Updated Documentation**
   - Created APPS.md with all 59+ default apps
   - Updated README.md to reflect OpenClaw-OS branding
   - Added proper credits in inspirations page

4. **Inspirations Page**
   - Refined the system hierarchy
   - Credited the OpenClaw-OS Team and Backend Team
   - Preserved all 20+ original system inspirations

---

## 📁 Project Structure

```
OpenClaw-OS/
├── src/
│   ├── app/                    # Next.js App Router pages (59+ apps)
│   │   ├── agent/             # AI Agent app
│   │   ├── chat/              # Chat interface
│   │   ├── settings/          # System settings
│   │   ├── operations/        # Operations Center
│   │   ├── inspirations/      # Credits page
│   │   └── ...                # 50+ more apps
│   ├── components/            # React components
│   │   ├── onboarding/        # Onboarding flow
│   │   ├── operations/        # Ops dashboard components
│   │   ├── ui/                # UI primitives
│   │   └── ...
│   ├── lib/                   # Core logic
│   │   ├── openclaw/          # OpenClaw client & hooks
│   │   ├── convex-shim.ts     # Convex compatibility layer
│   │   ├── ai-james/          # AI agent logic
│   │   ├── memory/            # RLM system
│   │   └── observability/     # Logging & monitoring
│   └── hooks/                 # React hooks
├── public/                    # Static assets
├── APPS.md                    # This file - app documentation
├── README.md                  # Main readme
└── package.json               # Dependencies
```

---

## 🔐 Security Features

### Implemented
- **Passcode Protection**: 6-digit codes for protected areas
- **Session Management**: Secure JWT tokens
- **Security Event Logging**: All auth attempts tracked
- **Brute Force Protection**: Rate limiting on failed attempts
- **Input Validation**: Path, message, command validation
- **Network Validation**: SSRF protection
- **Threat Detection**: ZeroLeaks-inspired patterns

### Security Scanner (Operations Center)
- Prompt injection detection
- Jailbreak attempt detection
- Data extraction monitoring
- SSRF vulnerability scanning
- Real-time threat level assessment

---

## 🧠 AI Features

### Recursive Memory Layer (RLM)
- **Episodic Memory**: Conversation history
- **Semantic Memory**: Extracted knowledge
- **Working Memory**: Active context
- **Memory Upload**: File-based memory injection

### Tool Execution
- File operations (read, write, delete)
- Terminal commands
- Browser automation
- API integrations
- Git operations

### Agentic Workflows
- **BMAD Method**: PRD → Epics → Stories
- **CCPM Integration**: Git-centric project management
- **Discovery Pipeline**: Call → Insights → Artifacts
- **Artifact Generation**: Auto-create project docs

---

## 🎯 Key Differentiators

### 1. AI-Native Design
Every app is designed with AI collaboration in mind. The OS doesn't just have AI features—it's built around AI as a first-class citizen.

### 2. Single-User Optimization
No multi-tenancy complexity. Everything is optimized for one owner with full system access.

### 3. Local-First AI
Prioritizes local models (Ollama, Lynkr) with cloud fallback. Your data stays on your machine.

### 4. Beautiful UX
iOS-inspired design with smooth animations, glassmorphism, and attention to detail.

### 5. Extensible Architecture
Skills system, plugin architecture, and modular design make it easy to extend.

---

## 📊 Current Status

### ✅ Working
- OpenClaw WebSocket connection
- AI provider routing (Ollama, OpenAI, Lynkr)
- Chat interface with streaming
- Memory system (RLM)
- Tool execution
- Settings UI
- Operations Center
- All 59+ apps load correctly
- Build completes successfully

### ⚠️ In Progress
- Full OpenClaw backend method implementation
- Some shimmed API calls need real backend
- Onboarding flow integration
- Provider health checks

### 🔮 Future Enhancements
- More AI providers (Anthropic, Gemini)
- Enhanced memory capabilities
- Advanced tool execution
- Mobile responsive improvements
- PWA support

---

## 🚀 Getting Started

### Prerequisites
- Node.js v22+
- pnpm
- OpenClaw Gateway running on port 3000

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application runs on **http://localhost:3000**

### Environment Variables
```bash
# OpenClaw Gateway
NEXT_PUBLIC_OPENCLAW_GATEWAY_URL=ws://localhost:3000

# AI Providers
OPENAI_API_KEY=your_key_here
OLLAMA_BASE_URL=http://localhost:11434
LYNKR_TUNNEL_URL=your_tunnel_url
LYNKR_API_KEY=your_key_here

# Optional
AGENT_EXECUTION_SECRET=your_secret
```

---

## 📚 Documentation

- **[APPS.md](./APPS.md)** - Complete list of all 59+ default apps
- **[README.md](./README.md)** - Quick start guide
- **[git-workflow-discipline.md](./git-workflow-discipline.md)** - Git workflow
- **[agents.md](./agents.md)** - Agent documentation
- **[claude.md](./claude.md)** - Claude integration guide

---

## 🙏 Credits

### Creator
**8gent Team**
- The ecosystem architect, abstracted from `jamesspalding.org`.

### Backend
**The OpenClaw Team**
- GitHub: [github.com/openclaw](https://github.com/openclaw)
- Website: [openclaw.dev](https://openclaw.dev)

### Inspirations
- Plus 20+ other inspirations from the original OpenClaw-OS design

---

## 📈 Stats

- **Total Apps**: 59+
- **Total Components**: 200+
- **Lines of Code**: ~50,000+
- **API Routes**: 60+
- **Build Time**: ~3-5 minutes
- **Bundle Size**: Optimized with Turbopack

---

## 🎨 Design Philosophy

### Utilitarian Elegance
Clean, functional design that doesn't sacrifice beauty for utility.

### AI-First
Every feature considers how AI can enhance the experience.

### Local-First
Privacy and performance through local-first architecture.

### Extensible
Built to grow and adapt with your needs.

---

**Built with ❤️ by the 8gent Team**  
**An OpenClaw Integrated Workspace**  
**Inspired by the amazing developer community**

---

*Last Updated: February 14, 2026*
