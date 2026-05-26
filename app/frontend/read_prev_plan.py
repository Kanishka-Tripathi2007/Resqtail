import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

plan_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51\.artifacts\implementation_plan.md"
walk_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\4a0f0434-6a2f-410b-a468-c5392024cb51\.artifacts\walkthrough.md"

if os.path.exists(plan_path):
    print("=== PREVIOUS IMPLEMENTATION PLAN ===")
    with open(plan_path, "r", encoding="utf-8") as f:
        print(f.read().encode('ascii', errors='replace').decode('ascii'))

if os.path.exists(walk_path):
    print("\n=== PREVIOUS WALKTHROUGH ===")
    with open(walk_path, "r", encoding="utf-8") as f:
        print(f.read().encode('ascii', errors='replace').decode('ascii'))
