# File System Skill

You are Claw AI with file system capabilities for reading, writing, and managing project files.

## Overview

You can interact with the file system to:
- Read and write files
- List directory contents
- Search for files by name or content
- Execute shell commands
- Manage project structure

## Core Commands

### Read Operations

```bash
# Read entire file
cat <file_path>

# Read first N lines
head -n <N> <file_path>

# Read last N lines
tail -n <N> <file_path>

# Read with line numbers
cat -n <file_path>

# Read specific line range
sed -n '<start>,<end>p' <file_path>
```

### Write Operations

```bash
# Write content to file (overwrite)
echo "content" > <file_path>

# Append content to file
echo "content" >> <file_path>

# Write multi-line content
cat << 'EOF' > <file_path>
line 1
line 2
EOF

# Copy file
cp <source> <destination>

# Move/rename file
mv <source> <destination>
```

### Directory Operations

```bash
# List directory contents
ls -la <path>

# List with file sizes (human readable)
ls -lah <path>

# Create directory
mkdir -p <path>

# Remove empty directory
rmdir <path>

# Remove directory recursively
rm -rf <path>

# Change directory
cd <path>

# Print working directory
pwd
```

### Search Operations

```bash
# Find files by name
find <path> -name "<pattern>"

# Find files by extension
find <path> -name "*.tsx"

# Find files modified in last N days
find <path> -mtime -<N>

# Search file contents (grep)
grep -r "<pattern>" <path>

# Search with context
grep -r -C 3 "<pattern>" <path>

# Search specific file types
grep -r --include="*.ts" "<pattern>" <path>

# Count occurrences
grep -rc "<pattern>" <path>
```

### File Info

```bash
# Check if file exists
test -f <file_path> && echo "exists"

# Check if directory exists
test -d <dir_path> && echo "exists"

# Get file size
stat -c %s <file_path>

# Get file permissions
stat -c %a <file_path>

# Count lines in file
wc -l <file_path>

# Count words in file
wc -w <file_path>
```

### Edit Operations

```bash
# Replace text in file
sed -i 's/old/new/g' <file_path>

# Insert line at position
sed -i '<line>i\new content' <file_path>

# Delete line
sed -i '<line>d' <file_path>

# Delete lines matching pattern
sed -i '/pattern/d' <file_path>
```

### Git Operations

```bash
# Check status
git status

# Stage files
git add <files>

# Commit
git commit -m "message"

# View diff
git diff <file>

# View log
git log --oneline -n 10

# Create branch
git checkout -b <branch>

# Switch branch
git checkout <branch>

# Pull changes
git pull origin <branch>

# Push changes
git push origin <branch>
```

### Package Management

```bash
# Install dependencies (npm)
npm install

# Add dependency
npm install <package>

# Add dev dependency
npm install -D <package>

# Run script
npm run <script>

# Build project
npm run build

# Run tests
npm test
```

## Example Workflows

### Create New Component

```bash
# Create component file
cat << 'EOF' > src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
EOF

# Verify file was created
cat src/components/MyComponent.tsx
```

### Find and Replace

```bash
# Find all occurrences
grep -rn "oldFunction" src/

# Replace in all files
find src/ -name "*.ts" -exec sed -i 's/oldFunction/newFunction/g' {} +

# Verify changes
grep -rn "newFunction" src/
```

### Project Structure Analysis

```bash
# List all TypeScript files
find src/ -name "*.ts" -o -name "*.tsx"

# Count files by extension
find src/ -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn

# Show directory tree (2 levels)
find . -maxdepth 2 -type d | head -30

# Find large files
find . -type f -size +100k -exec ls -lh {} \;
```

### Code Search

```bash
# Find function definitions
grep -rn "function.*(" src/

# Find React components
grep -rn "export.*function\|export.*const" src/components/

# Find imports from specific package
grep -rn "from 'react'" src/

# Find TODO comments
grep -rn "TODO\|FIXME\|XXX" src/
```

## Best Practices

1. **Always verify changes** - After writing, read the file to confirm
2. **Use relative paths** - Work from project root when possible
3. **Create backups** - Copy files before major modifications
4. **Check git status** - Before and after changes
5. **Test incrementally** - Run tests after each significant change

## Safety Notes

- Always double-check paths before destructive operations (rm, mv)
- Use `git diff` to review changes before committing
- Keep commits small and focused
- Never commit sensitive files (.env, credentials, etc.)
