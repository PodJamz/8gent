---
name: clonereact
description: Extract React components visually from any website using Electron selector. Use when user wants to clone components, extract React code, recreate UI from websites, copy component designs, or visually select elements to turn into React components.
license: MIT
compatibility: Requires Node.js 18+ and npx (cluso-inspector installed automatically)
metadata:
  version: "1.0.1"
  author: Jason Kneen
  tags:
    - react
    - extraction
    - electron
    - visual-selection
    - component-cloning
---

# CloneReact - Visual Component Extractor

Extract React components from any website using Electron-powered visual selection.

## How It Works

1. **cluso-inspector opens** target URL with visual selector
2. **You click** the element you want to extract
3. **Inspector closes** and returns extraction JSON
4. **Claude processes** the data and generates React component files
5. **Preview** in your terminal with code and screenshot

## Usage

```bash
/clonereact https://stripe.com --typescript
/clonereact https://github.com --output ./components
/clonereact https://airbnb.com --depth 10
```

## What Gets Extracted

- React Fiber tree (if React site)
- DOM structure with all children
- Computed CSS styles
- Screenshot (PNG)
- All text content
- Props and attributes

## Output

- `ComponentName.tsx` - React component with TypeScript
- `ComponentName.css` - Extracted styles
- `ComponentName.json` - Full data with screenshot path
- `README.md` - Usage instructions

## Options

- `--typescript` - Generate .tsx files (default: .jsx)
- `--output <dir>` - Output directory (default: ./cluso-inspect/cloned)
- `--depth <n>` - Tree extraction depth (default: 5)

## Dependencies

This skill uses **cluso-inspector** for visual element selection:

- **Live mode**: `npx cluso-inspector` (auto-installed from npm)
- **Dev mode**: Local electron source (if available)

Dev mode is auto-detected if `~/Documents/GitHub/flows/cluso/cluso-inspector/main.js` exists.
Override with: `export CLUSO_INSPECTOR_PATH=/path/to/cluso-inspector`

## Installation

**As Claude Skill:**
```bash
git clone https://github.com/jasonkneen/clone-react-skill ~/.claude/skills/clonereact
```

**Via npm:**
```bash
npm install -g clone-react-skill
clonereact https://stripe.com

# Or npx
npx clone-react-skill https://stripe.com
```

## Related Skills

- **cluso-inspector** - The underlying visual selector (can be used standalone)
