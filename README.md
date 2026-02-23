# ♾️ 8gent (Infinity Agent)

**8gent** (Infinity Agent) is a next-generation, AI-native operating system interface. It is a highly modular frontend fork of the **OpenClaw** ecosystem, featuring a specialized workspace abstracted from [jamesspalding.org](https://jamesspalding.org).

> [!IMPORTANT]
> **Agent-Ready Modularity**: This repository is designed to be easily "latched" onto any existing OpenClaw agentic backend. Whether you are a human developer or a coding agent, you can integrate this frontend by simply pointing your backend to this source.

## ✨ What You Get

- **59+ Default Apps** - Everything from AI Agent to Music Studio to 3D Gallery
- **Multi-Provider AI** - Ollama (local), Lynkr (tunnel), OpenAI (cloud)
- **Recursive Memory Layer** - Context-aware AI that remembers
- **Beautiful iOS-Style UI** - Draggable windows, smooth animations, premium design
- **Local-First Architecture** - Your data stays on your machine
- **Agentic Workflows** - BMAD Method + CCPM integration

## 🔗 Modular Integration (For Agents & Humans)

**8gent** is built to be backend-agnostic within the OpenClaw ecosystem. To "latch" this frontend onto your own instance:

1.  **Clone the Repo**: `git clone https://github.com/PodJamz/8gent`
2.  **Attach to Backend**: Point your `NEXT_PUBLIC_OPENCLAW_GATEWAY_URL` to your existing OpenClaw Gateway.
3.  **Prompt-Based Setup**: If you are using a coding agent (like Claude, GPT-4, or an OpenClaw Agent), simply feed it this prompt:
    > "I want to use the 8gent frontend for my OpenClaw instance. Clone [this repo](https://github.com/PodJamz/8gent), connect it to my local gateway at `ws://localhost:3000`, and initialize the workspace."

### Customization
During installation, you can rename the workspace. While the default is **8gent**, you are free to customize the identity in `package.json` and `system-prompt.ts` to suit your specific agentic needs.

## 🚀 Quick Start

### Prerequisites
*   Node.js v22+
*   pnpm
*   OpenClaw Gateway running

### Installation

To get started immediately, run the installer:

```bash
./install.sh
```

Or manually:

```bash
pnpm install
pnpm dev
```

The application runs on **http://localhost:3000**

## 📚 Documentation

- **[APPS.md](./APPS.md)** - Complete list of all 59+ default apps
- **[FRONTEND_OVERVIEW.md](./FRONTEND_OVERVIEW.md)** - Comprehensive frontend documentation
- **[git-workflow-discipline.md](./git-workflow-discipline.md)** - Git workflow guide
- **[agents.md](./agents.md)** - Agent documentation

## 🏗 Architecture

### Frontend (`/src`)
Review the `src` folder for the Next.js-based UI.
*   **Desktop & Window Manager**: iOS-style home screen with draggable windows
*   **Onboarding**: Slick, detailed onboarding flow (`/src/components/onboarding`)
*   **Apps**: 59+ built-in apps for productivity, creativity, and AI collaboration

### Backend Integration (`/src/lib/openclaw`)
*   **Client**: Custom WebSocket client connecting to OpenClaw Gateway
*   **Hooks**: React hooks (`useQuery`, `useMutation`) for reactive data fetching
*   **Auth**: Single-user owner authentication
*   **Shim Layer**: Convex compatibility for legacy code

## 🔐 Access Control
OpenClaw-OS operates in **Single User Mode**.
*   **Owner**: You. Full access to all system capabilities.
*   **Visitor**: Restricted access (if public).
*   **Integrations**: Connect external accounts (GitHub, Discord, Slack) in `/settings` to empower your AI agent.

## 🛠 Development

### Key Commands
*   `pnpm dev`: Start the development server
*   `pnpm build`: Build for production
*   `pnpm lint`: Run linter

### Project Structure
*   `src/app`: Next.js App Router pages (59+ apps)
*   `src/components`: UI components (Dock, Windows, Terminal, etc.)
*   `src/lib`: Core logic and backend clients
*   `src/hooks`: React hooks for OS state

## 🤖 AI Agent
The system is integrated with **OpenClaw Agent**, capable of:
*   Running terminal commands
*   Managing files
*   Interacting with connected integrations
*   Chatting via the `Agent` app or integrated chat interfaces
*   Tool execution with security validation
*   Memory retention via Recursive Memory Layer (RLM)

## 🎨 Key Features

### AI-Native Design
Every app is designed with AI collaboration in mind. The OS doesn't just have AI features—it's built around AI as a first-class citizen.

### Beautiful UX
iOS-inspired design with:
- Glassmorphism effects
- Smooth Framer Motion animations
- Premium color palettes
- Responsive layouts

### Local-First
Prioritizes local models (Ollama, Lynkr) with cloud fallback. Your data stays on your machine.

## 🙏 Credits

### Creator
**8gent Team**
- The primary architect and maintainer of the 8gent ecosystem.
- Abstracted from the [jamesspalding.org](https://jamesspalding.org) personal workspace.

### Backend
**The OpenClaw Team** - Agentic Backend Foundation
- GitHub: [github.com/openclaw](https://github.com/openclaw)
- Website: [openclaw.dev](https://openclaw.dev)

### Inspirations
See [/inspirations](http://localhost:3000/inspirations) for 20+ amazing creators who inspired this project.

---

*Built with ❤️ by the 8gent Team — A fork of OpenClaw*
