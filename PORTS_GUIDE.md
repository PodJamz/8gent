# 🚨 IMPORTANT: Two Separate Applications

## What You're Seeing

You're currently looking at **http://localhost:3000** which shows the **OpenClaw Gateway** (ClawdBot) - this is the BACKEND dashboard.

## What You Need

The **OpenClaw-OS Frontend** (JamesOS with all 59+ apps) is a SEPARATE application that needs to connect TO the gateway.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   OpenClaw-OS Frontend (JamesOS)   │
│   - 59+ Apps                        │
│   - iOS-style Desktop               │
│   - Beautiful UI                    │
│   - Port: 3001 (or custom)          │
└──────────────┬──────────────────────┘
               │
               │ WebSocket Connection
               │
               ▼
┌─────────────────────────────────────┐
│   OpenClaw Gateway (ClawdBot)       │
│   - Backend API                     │
│   - Agent Orchestration             │
│   - Port: 3000                      │
└─────────────────────────────────────┘
```

---

## 🔧 How to Run Both

### Option 1: Run on Different Ports (Recommended)

#### Terminal 1 - OpenClaw Gateway
```bash
# This is already running on port 3000
# You can see it at http://localhost:3000
```

#### Terminal 2 - OpenClaw-OS Frontend
```bash
cd /Users/jamesspalding/OpenClaw-OS
PORT=3001 pnpm dev
```

Then open: **http://localhost:3001**

### Option 2: Configure in package.json

Update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  }
}
```

---

## 🎯 What Each Port Shows

### Port 3000 - OpenClaw Gateway (Backend)
- ClawdBot dashboard
- Chat interface for direct gateway access
- Control panel for agents, channels, sessions
- **This is what you're seeing now**

### Port 3001 - OpenClaw-OS Frontend (Your OS)
- iOS-style desktop
- 59+ apps (Agent, Chat, Terminal, Settings, etc.)
- Draggable windows
- Beautiful JamesOS interface
- **This is what you want to see**

---

## ⚙️ Environment Variables

The frontend needs to know where the gateway is:

Create `.env.local` in the OpenClaw-OS directory:
```bash
# Tell the frontend where the gateway is
NEXT_PUBLIC_OPENCLAW_GATEWAY_URL=ws://localhost:3000

# Optional: AI Provider keys
OPENAI_API_KEY=your_key_here
OLLAMA_BASE_URL=http://localhost:11434
```

---

## 🚀 Quick Start (Right Now)

1. **Keep the gateway running** on port 3000 (it's already running)

2. **Start the frontend** on port 3001:
```bash
cd /Users/jamesspalding/OpenClaw-OS
PORT=3001 pnpm dev
```

3. **Open your browser** to:
   - Frontend (your OS): http://localhost:3001
   - Gateway (backend): http://localhost:3000

---

## 🎨 What You'll See

### At http://localhost:3001 (OpenClaw-OS Frontend)
- Beautiful iOS-style home screen
- App grid with all 59+ apps
- Dock at the bottom
- Draggable windows
- Settings, Chat, Agent, Terminal, etc.

### At http://localhost:3000 (OpenClaw Gateway)
- ClawdBot dashboard (what you're seeing now)
- Direct gateway chat
- Control panel
- Agent management

---

## 📝 Current Status

✅ **OpenClaw Gateway**: Running on port 3000  
⏳ **OpenClaw-OS Frontend**: Needs to be started on port 3001

---

## 🔍 Troubleshooting

### If port 3001 doesn't work:
```bash
# Check what's on port 3001
lsof -i :3001

# Kill it if needed
kill -9 <PID>

# Start fresh
PORT=3001 pnpm dev
```

### If you see connection errors:
- Make sure `NEXT_PUBLIC_OPENCLAW_GATEWAY_URL=ws://localhost:3000` is set
- Check that the gateway is running on port 3000
- Look for WebSocket connection errors in browser console

---

**TL;DR**: You're looking at the backend (port 3000). Start the frontend with `PORT=3001 pnpm dev` and go to http://localhost:3001 to see your OpenClaw-OS interface!
