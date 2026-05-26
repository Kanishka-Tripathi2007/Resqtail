import os

brain_dir = r"C:\Users\DELL\.gemini\antigravity-ide\brain"
print("Scanning brain subdirectories and counting files...")

if not os.path.exists(brain_dir):
    print("Directory does not exist!")
else:
    for item in os.listdir(brain_dir):
        path = os.path.join(brain_dir, item)
        if os.path.isdir(path):
            file_count = 0
            for root, dirs, files in os.walk(path):
                file_count += len(files)
            print(f"Directory: {item} | Total Files (recursive): {file_count}")
            
print("Scanning complete.")
