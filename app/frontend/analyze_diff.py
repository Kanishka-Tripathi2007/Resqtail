import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51\.artifacts\walkthrough.md.resolved"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

code_blocks = re.findall(r"```(\w+)(?::[^\n]*)?\n(.*?)```", content, re.DOTALL)
diff_block = code_blocks[0][1]

lines = diff_block.splitlines()
print(f"Total lines in diff block: {len(lines)}")

# Print lines that look like file headers or start of file diffs
for idx, line in enumerate(lines):
    if line.startswith("---") or line.startswith("+++") or "styles.css" in line or "index.html" in line or "app.js" in line:
        if any(line.startswith(p) for p in ["---", "+++", "@@", "diff"]):
            print(f"Line {idx}: {line}")
        elif len(line.strip()) < 100 and ("styles.css" in line or "index.html" in line or "app.js" in line):
            print(f"Line {idx} (keyword): {line}")
            
# Let's print some lines around the first occurrences to understand the format
print("\nFirst 30 lines of the block:")
for l in lines[:30]:
    print(l)
