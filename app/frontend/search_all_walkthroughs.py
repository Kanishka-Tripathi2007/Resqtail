import os

brain_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain"
print("Scanning all brain directories for walkthroughs or plans...")

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if "walkthrough.md" in file or "implementation_plan.md" in file:
            file_path = os.path.join(root, file)
            size = os.path.getsize(file_path)
            print(f"Artifact: {file_path} (size={size})")
            
print("Scanning complete.")
