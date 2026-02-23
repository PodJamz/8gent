# Browser Automation Skill

> **Note:** This skill has been moved to `.claude/skills/agent-browser.md` for proper Claude Code integration.
> See the main skill file for full documentation.

You are 8gent with browser automation capabilities powered by `agent-browser` from [Vercel Labs](https://github.com/vercel-labs/agent-browser).

## Overview

You can control a headless browser to:
- Navigate to URLs and interact with web pages
- Click buttons, fill forms, and submit data
- Take screenshots and capture page state
- Extract text, HTML, and element attributes
- Automate testing and verification flows

## Installation

Agent-browser is installed globally via npm:
```bash
npm install -g agent-browser
agent-browser install
```

## Quick Start Workflow

```bash
# 1. Open a page
agent-browser open https://example.com

# 2. Get accessibility snapshot with element refs (best for AI)
agent-browser snapshot

# 3. Interact using refs from snapshot
agent-browser click @e2
agent-browser fill @e3 "user@example.com"

# 4. Take screenshot to verify
agent-browser screenshot /tmp/page.png

# 5. Close when done
agent-browser close
```

## Core Commands

### Navigation
```bash
agent-browser open <url>              # Navigate to URL
agent-browser close                   # Close browser session
```

### Element Interaction
```bash
agent-browser click <selector>        # Click element
agent-browser dblclick <selector>     # Double-click element
agent-browser fill <selector> <text>  # Clear and fill input
agent-browser type <selector> <text>  # Type into element (append)
agent-browser press <key>             # Press key (Enter, Tab, Escape)
agent-browser hover <selector>        # Hover over element
agent-browser focus <selector>        # Focus element
agent-browser select <selector> <val> # Select dropdown option
agent-browser check <selector>        # Check checkbox
agent-browser uncheck <selector>      # Uncheck checkbox
```

### Scrolling
```bash
agent-browser scroll up [pixels]      # Scroll up
agent-browser scroll down [pixels]    # Scroll down
agent-browser scrollintoview <sel>    # Scroll element into view
```

### Capture & Export
```bash
agent-browser snapshot                # Get accessibility tree with refs
agent-browser screenshot [path]       # Take screenshot
agent-browser screenshot --full       # Full page screenshot
agent-browser pdf <path>              # Export page as PDF
```

### Get Information
```bash
agent-browser get text <selector>     # Get element text content
agent-browser get html <selector>     # Get element innerHTML
agent-browser get value <selector>    # Get input value
agent-browser get attr <sel> <attr>   # Get attribute value
agent-browser get title               # Get page title
agent-browser get url                 # Get current URL
agent-browser get count <selector>    # Count matching elements
```

### State Checks
```bash
agent-browser is visible <selector>   # Check if visible
agent-browser is enabled <selector>   # Check if enabled
agent-browser is checked <selector>   # Check if checked
```

### Wait Commands
```bash
agent-browser wait visible <selector> # Wait for element visible
agent-browser wait hidden <selector>  # Wait for element hidden
agent-browser wait <ms>               # Wait milliseconds
```

## Selector Types

### Ref Selectors (Recommended for AI)
After running `snapshot`, use refs like `@e1`, `@e2`, etc:
```bash
agent-browser snapshot
# Output shows: @e1 button "Submit", @e2 input "Email"
agent-browser click @e1
agent-browser fill @e2 "test@example.com"
```

### CSS Selectors
```bash
agent-browser click "#submit-btn"
agent-browser fill "input[name='email']" "test@example.com"
```

### Text Selectors
```bash
agent-browser click "text=Submit"
agent-browser click "text=Sign In"
```

## Example Workflows

### Login Flow
```bash
agent-browser open https://app.example.com/login
agent-browser snapshot
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait visible ".dashboard"
agent-browser screenshot /tmp/logged-in.png
```

### Form Submission
```bash
agent-browser open https://example.com/contact
agent-browser snapshot
agent-browser fill "#name" "8gent"
agent-browser fill "#email" "agent@example.com"
agent-browser fill "#message" "Hello from 8gent!"
agent-browser click "text=Send Message"
agent-browser wait visible ".success-message"
agent-browser get text ".success-message"
```

### Testing Flow
```bash
agent-browser open http://localhost:3000
agent-browser snapshot
agent-browser is visible "#main-content"
agent-browser get title
agent-browser screenshot /tmp/test-result.png
agent-browser close
```

## Best Practices

1. **Always start with `snapshot`** - Get element refs for reliable interaction
2. **Use refs over CSS selectors** - Refs are more stable across page changes
3. **Take screenshots to verify** - Visual confirmation of actions
4. **Wait for elements** - Use wait commands before interacting
5. **Close when done** - Release browser resources
