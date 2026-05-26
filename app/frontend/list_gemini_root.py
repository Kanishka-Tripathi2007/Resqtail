import os
from datetime import datetime

gemini_dir = r"C:\Users\DELL\.gemini"
print(f"Listing subdirectories in {gemini_dir}...")

if not os.path.exists(gemini_dir):
    print("Directory does not exist!")
else:
    for item in os.listdir(gemini_dir):
        path = os.path.join(gemini_dir, item)
        mtime = os.path.getmtime(path)
        dt = datetime.fromtimestamp(mtime)
        is_dir = "DIR" if os.path.isdir(path) else "FILE"
        print(f"{is_dir}: {item} | ModTime: {dt.isoformat()} | Size: {os.path.getsize(path) if not os.path.isdir(path) else 'N/A'}")
        
print("Listing complete.")
