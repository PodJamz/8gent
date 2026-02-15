# 📱 OpenClaw-OS Default Apps

This document lists all the default applications included in OpenClaw-OS out of the box.

## 🎯 Core System Apps

### 1. **Agent** (`/agent`)
Your AI assistant powered by OpenClaw backend. Supports:
- Multi-provider AI (Ollama, OpenAI, Lynkr)
- Tool execution (file management, terminal commands)
- Recursive Memory Layer (RLM) for context retention
- Agentic workflows with BMAD Method integration

### 2. **Chat** (`/chat`)
Real-time AI chat interface with:
- Streaming responses
- Memory integration
- Tool calling capabilities
- Provider selection (local/cloud)

### 3. **Terminal** (`/terminal`)
Full-featured terminal emulator:
- Command execution
- Multi-tab support
- Command history
- Integration with AI agent for automated tasks

### 4. **Settings** (`/settings`)
Comprehensive system configuration:
- **AI Settings** (`/settings/ai`) - Configure AI providers (Ollama, OpenAI, Lynkr)
- **Integrations** (`/settings/integrations`) - Connect GitHub, Discord, Slack, etc.
- **Appearance** - Theme customization
- **System** - General OS settings

### 5. **Browser** (`/browser`)
Built-in web browser with:
- AI-powered browsing assistance
- Bookmark management
- Tab support

## 📊 Productivity Apps

### 6. **Notes** (`/notes`)
Note-taking application with:
- Markdown support
- Organization and tagging
- Search functionality

### 7. **Calendar** (`/calendar`)
Calendar and scheduling:
- Event management
- Meeting scheduling
- Integration with booking system

### 8. **Reminders** (`/reminders`)
Task and reminder management:
- Quick task creation
- Due date tracking
- Notifications

### 9. **Contacts** (`/contacts`)
Contact management system

### 10. **Journal** (`/journal`)
Personal journaling app

## 🎨 Creative Apps

### 11. **Canvas** (`/canvas`)
Visual design and prototyping:
- AI-powered design generation
- Multi-provider support (Gemini, Replicate, fal.ai)
- Interactive canvas
- Export capabilities

### 12. **Design** (`/design`)
Comprehensive design system with 55+ components:
- UI component library
- Design tokens
- Pattern library
- Style guide

### 13. **Mockit** (`/mockit`)
Mockup and prototype creation:
- Quick mockup generation
- Device frames
- Export options

### 14. **Prototyping** (`/prototyping`)
Interactive prototype builder

### 15. **3D Gallery** (`/gallery-3d`)
Immersive 3D photo gallery:
- Depth-based navigation
- Cursor-tracking rotation
- Infinite scroll

### 16. **Avatar** (`/avatar`)
3D avatar generator:
- AI-powered photo-to-avatar
- Interactive 3D rotation
- Customization options

## 🎵 Media Apps

### 17. **Music** (`/music`)
Music player and studio (Jamz):
- iPod-style interface
- Music library management
- Playlist creation
- Studio landing page

### 18. **CoWrite** (`/cowrite`)
Collaborative lyrics writing app:
- Real-time collaboration
- Lyric organization
- Inspiration from Kevin McCove

### 19. **Photos** (`/photos`)
Photo management and gallery

### 20. **Video** (`/video`)
Video player and management

### 21. **Reels** (`/reels`)
Short-form video viewer

### 22. **Watch** (`/watch`)
Video streaming interface

## 🎮 Entertainment Apps

### 23. **Games** (`/games`)
Gaming hub with multiple games:
- Bubble Timer
- Hyperfocus
- Other casual games

### 24. **Bubble Timer** (`/bubble-timer`)
Gamified Pomodoro timer

### 25. **Hyperfocus** (`/hyperfocus`)
Focus and productivity game

## 💼 Professional Apps

### 26. **Product** (`/product`)
Product management:
- BMAD Method integration
- PRD creation and management
- Epic and story tracking

### 27. **Projects** (`/projects`)
Project management dashboard:
- Kanban boards
- Git workflow integration
- CCPM methodology

### 28. **Research** (`/research`)
Research and knowledge management

### 29. **Wiki** (`/wiki`)
Personal wiki and knowledge base

### 30. **Resume** (`/resume`)
Resume builder and manager

### 31. **Skills** (`/skills`)
Skills tracking and development

## 🔧 Developer Apps

### 32. **Studio** (`/studio`)
Development environment

### 33. **System** (`/system`)
System monitoring and management

### 34. **Operations** (`/operations`)
Operations Center with:
- **Activity Timeline** - Real-time operation logs
- **Metrics Dashboard** - Performance metrics (24h overview)
- **Provider Status** - AI provider health monitoring
- **Security Scanner** - ZeroLeaks-inspired security testing

### 35. **Security** (`/security`)
Security management and monitoring

## 📱 Communication Apps

### 36. **Messages** (`/messages`)
Messaging interface:
- iMessage-style UI
- Scheduled messages (`/messages/scheduled`)
- Contact integration

### 37. **Threads** (`/threads`)
Threaded conversations

### 38. **Meet** (`/meet`)
Video conferencing

### 39. **ClubSpaces** (`/clubspaces`)
Virtual collaboration spaces:
- Room creation (`/clubspaces/room/[roomId]`)
- Invite system (`/clubspaces/invite/[token]`)

## 🧠 AI & Memory Apps

### 40. **Memory** (`/memory`)
Recursive Memory Layer (RLM) interface:
- Episodic memory
- Semantic memory
- Working memory
- Memory upload and management

### 41. **Neuro** (`/neuro`)
Neural network and AI experimentation

### 42. **Discovery** (`/d`)
Discovery call pipeline:
- Transcript processing
- Insight extraction
- Artifact generation

## 🎯 Specialized Apps

### 43. **Book** (`/book/[username]/[eventSlug]`)
Public booking system:
- Calendar integration
- Time slot selection
- Guest information collection

### 44. **Booking** (Integrated)
Meeting and appointment scheduling

### 45. **Food** (`/food`)
Food and recipe management

### 46. **Weather** (`/weather`)
Weather information with Meteocons animated icons

### 47. **Regulate** (`/regulate`)
Emotional regulation and wellness

### 48. **Vault** (`/vault`)
Secure storage:
- Protected areas with passcode
- Encrypted content
- Access control

### 49. **ERV** (`/erv`)
Email Receipt Vault:
- Email import
- Receipt organization
- Financial tracking

### 50. **Humans** (`/humans`)
People and relationship management

### 51. **Story** (`/story`)
Storytelling and narrative tools

### 52. **Blog** (`/blog`)
Personal blog and publishing

### 53. **Updates** (`/updates`)
System updates and changelog

### 54. **Search** (`/search`)
Global search interface

### 55. **Sidequests** (`/sidequests`)
Side project and hobby tracker

## 🎨 Special Pages

### 56. **Inspirations** (`/inspirations`)
Credits and acknowledgments:
- **James Spalding** - The Visionary Creator
- **The OpenClaw Team** - Agentic Backend Foundation
- Plus 20+ other inspirations from the original JamesOS

### 57. **Onboarding** (`/onboarding`)
New user onboarding flow:
- Welcome screen
- System setup
- AI provider configuration
- Integration setup

### 58. **Activity** (`/activity`)
Background job monitoring

### 59. **Invite** (`/invite/[token]`)
System invite management

---

## 🏗️ Architecture Notes

### Frontend Framework
- **Next.js 16** with Turbopack
- **React 19** with Server Components
- **TypeScript** for type safety

### Styling
- **Vanilla CSS** with CSS variables
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend Integration
- **OpenClaw Gateway** via WebSocket
- **Custom hooks** (`useQuery`, `useMutation`)
- **Single-user (Owner) authentication**

### AI Providers
- **Ollama** (local)
- **Lynkr** (local tunnel)
- **OpenAI** (cloud)
- Fallback mechanisms for reliability

### Key Features
- **iOS-style desktop** with draggable windows
- **Dock** with app shortcuts
- **Window manager** with minimize/maximize/close
- **Theme system** with multiple themes
- **Responsive design** for all screen sizes

---

**Total Apps: 59+** (including special pages and system utilities)

*Built with ❤️ by James Spalding & powered by OpenClaw*
