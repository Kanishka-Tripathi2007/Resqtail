import re
import sys

# Set standard output to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51\.artifacts\walkthrough.md.resolved"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Match standard markdown code block syntax with optional metadata after language (e.g., diff:styles.css)
code_blocks = re.findall(r"```(\w+)(?::[^\n]*)?\n(.*?)```", content, re.DOTALL)
print(f"Found {len(code_blocks)} code blocks.")

for idx, (lang, block) in enumerate(code_blocks):
    print(f"\n================ BLOCK {idx} (lang={lang}, size={len(block)}) ================")
    lines = block.strip().splitlines()
    print(f"Number of lines: {len(lines)}")
    # Print first 10 lines
    print("First 10 lines:")
    for line in lines[:10]:
        print("  ", line.encode('ascii', errors='replace').decode('ascii'))
    # Print last 10 lines
    print("Last 10 lines:")
    for line in lines[-10:]:
        print("  ", line.encode('ascii', errors='replace').decode('ascii'))
