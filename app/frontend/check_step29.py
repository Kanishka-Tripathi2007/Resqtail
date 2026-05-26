import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\238296c1-2cab-4154-ac7a-e3ba557d80b8\.system_generated\steps\29\output.txt"

if not os.path.exists(file_path):
    print("File does not exist!")
else:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    print("Length of file:", len(content))
    print("\n--- FIRST 500 CHARACTERS ---")
    print(content[:500].encode('ascii', errors='replace').decode('ascii'))
    
    print("\n--- LAST 500 CHARACTERS ---")
    print(content[-500:].encode('ascii', errors='replace').decode('ascii'))
