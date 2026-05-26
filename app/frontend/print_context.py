import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51\.artifacts\walkthrough.md.resolved"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find occurrences of code fences and print the text before/after them (up to 300 chars)
pos = 0
for match in re.finditer(r"```", content):
    start = match.start()
    print(f"\n--- Code fence found at index {start} ---")
    # Print 200 chars before
    before = content[max(0, start-200):start]
    print("BEFORE:")
    print(before.encode('ascii', errors='replace').decode('ascii'))
    # Print 100 chars after
    after = content[start:min(len(content), start+100)]
    print("AFTER:")
    print(after.encode('ascii', errors='replace').decode('ascii'))
