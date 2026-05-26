import os
from datetime import datetime

conv_dir = r"C:\Users\DELL\.gemini\antigravity-ide\conversations"
print(f"Listing .pb files in {conv_dir}...")

if not os.path.exists(conv_dir):
    print("Directory does not exist!")
else:
    files_with_time = []
    for file in os.listdir(conv_dir):
        if file.endswith(".pb"):
            path = os.path.join(conv_dir, file)
            mtime = os.path.getmtime(path)
            files_with_time.append((file, mtime, os.path.getsize(path)))
            
    # sort by mtime desc
    files_with_time.sort(key=lambda x: x[1], reverse=True)
    
    for file, mtime, size in files_with_time:
        dt = datetime.fromtimestamp(mtime)
        print(f"File: {file} | Size: {size} | ModTime: {dt.isoformat()}")
        
print("Listing complete.")
