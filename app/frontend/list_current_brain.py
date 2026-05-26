import os

brain_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain\238296c1-2cab-4154-ac7a-e3ba557d80b8"
print(f"Listing files in {brain_dir}...")

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        file_path = os.path.join(root, file)
        size = os.path.getsize(file_path)
        print(f"File: {file_path} (size={size})")
        
print("Done listing.")
