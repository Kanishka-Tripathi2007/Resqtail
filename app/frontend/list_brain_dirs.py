import os
from datetime import datetime

brain_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain"
print(f"Listing subdirectories in {brain_dir}...")

if not os.path.exists(brain_dir):
    print("Directory does not exist!")
else:
    subdirs = []
    for item in os.listdir(brain_dir):
        path = os.path.join(brain_dir, item)
        if os.path.isdir(path):
            mtime = os.path.getmtime(path)
            subdirs.append((item, mtime))
            
    # sort by mtime desc
    subdirs.sort(key=lambda x: x[1], reverse=True)
    
    for name, mtime in subdirs:
        dt = datetime.fromtimestamp(mtime)
        print(f"Directory: {name} | ModTime: {dt.isoformat()}")
        
print("Listing complete.")
