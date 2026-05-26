import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51\.artifacts\walkthrough.md.resolved"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

code_blocks = re.findall(r"```(\w+)(?::[^\n]*)?\n(.*?)```", content, re.DOTALL)
diff_block = code_blocks[0][1]
lines = diff_block.splitlines()

plus_lines = 0
minus_lines = 0
space_lines = 0
other_lines = 0

for line in lines:
    if line.startswith("+"):
        plus_lines += 1
    elif line.startswith("-"):
        minus_lines += 1
    elif line.startswith(" "):
        space_lines += 1
    else:
        other_lines += 1

print(f"Plus lines (+): {plus_lines}")
print(f"Minus lines (-): {minus_lines}")
print(f"Space lines ( ): {space_lines}")
print(f"Other lines: {other_lines}")

# Print first 20 lines that start with + or -
print("\nFirst 20 lines starting with + or -:")
count = 0
for line in lines:
    if line.startswith("+") or line.startswith("-"):
        print(line[:100])
        count += 1
        if count >= 20:
            break
