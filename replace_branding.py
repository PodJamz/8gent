import os

patterns = {
    "jamesspalding.org": "openclaw.io",
    "AI James": "Claw AI",
    "James Spalding": "OpenClaw-OS",
    "james@jamesspalding.org": "hello@openclaw.io",
    "ai@jamesspalding.org": "hello@openclaw.io",
    "James Lawrence Spalding": "OpenClaw-OS",
}

def replace_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for old, new in patterns.items():
            content = content.replace(old, new)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error in {file_path}: {e}")

def walk_and_replace(root_dir):
    for root, dirs, files in os.walk(root_dir):
        if '.git' in dirs:
            dirs.remove('.git')
        if '.next' in dirs:
            dirs.remove('.next')
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
            
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.yaml', '.yml')):
                file_path = os.path.join(root, file)
                replace_in_file(file_path)

if __name__ == "__main__":
    walk_and_replace('src')
    # Also check config files in root
    for file in ['package.json', 'README.md', 'next.config.mjs', 'tailwind.config.ts', 'postcss.config.mjs']:
        if os.path.exists(file):
            replace_in_file(file)
