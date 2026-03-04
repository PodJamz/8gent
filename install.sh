#!/bin/bash

# OpenClaw OS Installer

echo "🦞 Welcome to OpenClaw OS Installer"
echo "==================================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v22+."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "⚠️  Node.js v22+ is recommended. You are running $(node -v)."
    echo "   Continuing, but you may encounter issues."
else
    echo "✅ Node.js version $(node -v) detected."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    echo "⚠️  pnpm not found, using npm. (pnpm is recommended)"
    npm install
fi

# Setup Environment
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from example..."
    cp .env.example .env.local 2>/dev/null || echo "   (No .env.example found, skipping)"
    
    # Set default gateway URL if not present
    if ! grep -q "NEXT_PUBLIC_OPENCLAW_GATEWAY_URL" .env.local 2>/dev/null; then
        echo "NEXT_PUBLIC_OPENCLAW_GATEWAY_URL=ws://localhost:3000" >> .env.local
        echo "NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN=openclaw-admin-token" >> .env.local
    fi
fi

echo ""
echo "✅ Installation complete!"
echo "==================================="
echo "🚀 To start OpenClaw OS:"
echo "   pnpm dev"
echo ""
echo "   (Make sure the OpenClaw Gateway is running on port 3000)"
echo ""
